// app/api/test-convert/route.js
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { PdfReader } from "pdfreader";
import "colors";

export const config = { api: { bodyParser: false } };

// Convert Next.js Request -> Node Readable (for formidable)
async function toNodeStream(req) {
  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// ---------- helper utilities ----------
function median(nums) {
  if (!nums.length) return 0;
  const a = nums.slice().sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

/**
 * Build adaptive column centers from all x coordinates across the doc.
 * Returns sorted array of column centers (numbers).
 */
function buildColumnCenters(allXs) {
  if (!allXs.length) return [];

  allXs.sort((a, b) => a - b);

  // Estimate typical distance between adjacent x's to set clustering tolerance.
  const gaps = [];
  for (let i = 1; i < allXs.length; i++) {
    const d = allXs[i] - allXs[i - 1];
    if (d > 0) gaps.push(d);
  }
  const medGap = median(gaps);

  // Adaptive tolerance: small floor to prevent over-splitting, cap to avoid merging distinct columns.
  const tol = Math.min(Math.max(medGap * 0.4 || 1.0, 0.75), 12);

  const centers = [];
  for (const x of allXs) {
    // find existing cluster center within tol
    let idx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const d = Math.abs(centers[i] - x);
      if (d <= tol && d < bestDist) {
        bestDist = d;
        idx = i;
      }
    }
    if (idx === -1) {
      centers.push(x);
    } else {
      // update center as running average
      centers[idx] = (centers[idx] + x) / 2;
    }
  }

  centers.sort((a, b) => a - b);
  return centers;
}

/**
 * Cluster y values into row bands for a single page, with adaptive tolerance.
 * Returns array of row objects: { y: centerY, items: [{x, text}, ...] }
 */
function clusterRowsByY(items) {
  if (!items.length) return [];

  // Sort by y
  items.sort((a, b) => a.y - b.y);

  // Estimate line spacing to set y tolerance
  const diffs = [];
  for (let i = 1; i < items.length; i++) {
    const d = items[i].y - items[i - 1].y;
    if (d > 0) diffs.push(d);
  }
  const medDy = median(diffs);

  // Adaptive Y tolerance:
  // We want to keep everything that belongs to the same visual row together,
  // and also allow mild wrap/kerning. Increase a bit vs medDy * 0.6; clamp to sane range.
  const yTol = Math.min(Math.max(medDy * 0.75 || 1.0, 0.9), 18);

  const rows = [];
  let current = { y: items[0].y, items: [] };

  for (const it of items) {
    if (Math.abs(it.y - current.y) <= yTol) {
      current.items.push({ x: it.x, text: it.text });
      // keep a stable row center by gentle averaging
      current.y = current.y * 0.8 + it.y * 0.2;
    } else {
      // push completed row
      rows.push(current);
      current = { y: it.y, items: [{ x: it.x, text: it.text }] };
    }
  }
  rows.push(current);

  // Within each row, sort items left->right
  for (const r of rows) {
    r.items.sort((a, b) => a.x - b.x);
  }
  return rows;
}

/**
 * Given row bands and global column centers, build the final grid.
 * Returns string[][] where each inner array is a row with fixed number of columns.
 */
function rowsToGrid(rowBands, colCenters) {
  const grid = [];
  for (const r of rowBands) {
    const cells = new Array(colCenters.length).fill("");
    for (const frag of r.items) {
      // nearest column center
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < colCenters.length; i++) {
        const d = Math.abs(colCenters[i] - frag.x);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      // append with space if cell already has text
      cells[bestIdx] = cells[bestIdx]
        ? `${cells[bestIdx]} ${frag.text}`
        : frag.text;
    }
    // Trim each cell; preserve empty as ""
    grid.push(cells.map((c) => (c || "").trim()));
  }
  return grid;
}

// ---------- main parser ----------
const parsePDF = (filePath) =>
  new Promise((resolve, reject) => {
    const pages = new Map(); // pageNumber -> [{x,y,text}]
    let currentPage = 1;

    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) return reject(err);

      if (!item) {
        // end of document
        // 1) gather all Xs across pages to define global column centers
        const allXs = [];
        for (const arr of pages.values()) {
          for (const it of arr) allXs.push(it.x);
        }
        const colCenters = buildColumnCenters(allXs);

        // If we couldn't detect any column, just return lines (one column)
        if (!colCenters.length) {
          const single = [];
          for (const [p, arr] of Array.from(pages.entries()).sort(
            (a, b) => a[0] - b[0]
          )) {
            const bands = clusterRowsByY(arr);
            for (const b of bands) {
              const text = b.items
                .map((i) => i.text)
                .join(" ")
                .trim();
              single.push([text]);
            }
          }
          const columns = ["Col 1"];
          const rows = single.map((cells) => ({ "Col 1": cells[0] || "" }));
          return resolve({ columns, rows });
        }

        // 2) build per-page row bands, then to grid using global columns
        const wholeGrid = [];
        for (const [p, arr] of Array.from(pages.entries()).sort(
          (a, b) => a[0] - b[0]
        )) {
          const bands = clusterRowsByY(arr);
          const pageGrid = rowsToGrid(bands, colCenters);
          wholeGrid.push(...pageGrid);
        }

        // Produce generic column headers (to keep frontend simple & preserve structure)
        const columns = colCenters.map((_, i) => `Col ${i + 1}`);
        const rows = wholeGrid.map((cells) => {
          const obj = {};
          columns.forEach((name, i) => {
            obj[name] = cells[i] || ""; // preserve empty cells as ""
          });
          return obj;
        });

        return resolve({ columns, rows });
      }

      // page marker
      if (item.page) {
        currentPage = item.page;
        if (!pages.has(currentPage)) pages.set(currentPage, []);
        return;
      }

      // text item
      if (
        item.text != null &&
        typeof item.x === "number" &&
        typeof item.y === "number"
      ) {
        if (!pages.has(currentPage)) pages.set(currentPage, []);
        pages
          .get(currentPage)
          .push({ x: item.x, y: item.y, text: String(item.text) });
      }
    });
  });

// ---------- POST handler ----------
export async function POST(req) {
  try {
    const nodeReq = await toNodeStream(req);
    nodeReq.headers = Object.fromEntries(req.headers);

    // const uploadDir = path.join(process.cwd(), "uploads");
    // fs.mkdirSync(uploadDir, { recursive: true });

    const uploadDir =
      process.env.NODE_ENV === "production"
        ? path.join("/tmp", "uploads")
        : path.join(process.cwd(), "uploads");

    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    const { files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const filePath = uploadedFile.filepath || uploadedFile.path;
    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "File path not found" },
        { status: 400 }
      );
    }

    const result = await parsePDF(filePath);

    // cleanup
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("❌ Conversion Error:".bgRed, e); // Full error details in Vercel logs

    return NextResponse.json(
      { ok: false, error: e?.message || "Parse failed" },
      { status: 500 }
    );
  }
}
//
//
//
//
//
//
//
// // app/api/test-convert/route.js
// import { NextResponse } from "next/server";
// import formidable from "formidable";
// import fs from "fs";
// import path from "path";
// import { Readable } from "stream";
// import { PdfReader } from "pdfreader";

// export const config = { api: { bodyParser: false } };

// // Convert Next.js Request -> Node Readable (for formidable)
// async function toNodeStream(req) {
//   const buffer = Buffer.from(await req.arrayBuffer());
//   const stream = new Readable();
//   stream.push(buffer);
//   stream.push(null);
//   return stream;
// }

// // ---------- helper utilities ----------
// function median(nums) {
//   if (!nums || !nums.length) return 0;
//   const a = nums.slice().sort((x, y) => x - y);
//   const mid = Math.floor(a.length / 2);
//   return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
// }

// /**
//  * Build adaptive column centers from an array of x coords.
//  */
// function buildColumnCenters(allXs) {
//   if (!allXs || !allXs.length) return [];

//   allXs.sort((a, b) => a - b);
//   const gaps = [];
//   for (let i = 1; i < allXs.length; i++) {
//     const d = allXs[i] - allXs[i - 1];
//     if (d > 0) gaps.push(d);
//   }
//   const medGap = median(gaps) || 0;
//   const tol = Math.min(Math.max(medGap * 0.45 || 1.0, 0.7), 16);

//   const centers = [];
//   for (const x of allXs) {
//     let idx = -1;
//     let best = Infinity;
//     for (let i = 0; i < centers.length; i++) {
//       const d = Math.abs(centers[i] - x);
//       if (d <= tol && d < best) {
//         best = d;
//         idx = i;
//       }
//     }
//     if (idx === -1) centers.push(x);
//     else centers[idx] = (centers[idx] + x) / 2;
//   }
//   centers.sort((a, b) => a - b);
//   return centers;
// }

// /**
//  * Cluster y values into row bands for a single page using anchor Y (no creeping).
//  */
// function clusterRowsByY(items) {
//   if (!items || !items.length) return [];

//   items.sort((a, b) => a.y - b.y);

//   const diffs = [];
//   for (let i = 1; i < items.length; i++) {
//     const d = items[i].y - items[i - 1].y;
//     if (d > 0) diffs.push(d);
//   }
//   const medDy = median(diffs) || 0;
//   const yTol = Math.min(Math.max(medDy * 0.6 || 1.0, 0.9), 18);

//   const rows = [];
//   let anchorY = items[0].y;
//   let current = { y: anchorY, items: [] };

//   for (const it of items) {
//     if (Math.abs(it.y - anchorY) <= yTol) {
//       current.items.push({ x: it.x, text: it.text });
//     } else {
//       rows.push(current);
//       anchorY = it.y;
//       current = { y: anchorY, items: [{ x: it.x, text: it.text }] };
//     }
//   }
//   rows.push(current);

//   // sort left->right for each row
//   for (const r of rows) r.items.sort((a, b) => a.x - b.x);
//   return rows;
// }

// /**
//  * Merge tiny fragments within a row that are likely part of same word/field.
//  * Uses median horizontal gap to determine micro-joins.
//  */
// function mergeCloseFragments(sortedItemsInRow) {
//   if (!sortedItemsInRow || sortedItemsInRow.length <= 1)
//     return sortedItemsInRow.slice();

//   const xs = sortedItemsInRow.map((i) => i.x);
//   const gaps = [];
//   for (let i = 1; i < xs.length; i++) {
//     const d = xs[i] - xs[i - 1];
//     if (d > 0) gaps.push(d);
//   }
//   const medGap = median(gaps) || 0;
//   // tolerance for micro-join (within same word)
//   const tol = Math.min(Math.max((medGap || 1) * 0.45, 0.5), 6);

//   const merged = [];
//   let cur = { x: sortedItemsInRow[0].x, text: sortedItemsInRow[0].text };
//   for (let i = 1; i < sortedItemsInRow.length; i++) {
//     const it = sortedItemsInRow[i];
//     const gap = it.x - (cur.x + cur.text.length * 0); // approximate left distance; don't rely on width
//     if (it.x - cur.x <= tol) {
//       // micro-join: concatenate without extra space
//       cur.text = `${cur.text}${it.text}`;
//     } else {
//       merged.push(cur);
//       cur = { x: it.x, text: it.text };
//     }
//   }
//   merged.push(cur);
//   return merged;
// }

// /**
//  * Given row bands and column centers, build grid and preserve empty cells.
//  * Uses guarded snapping: only snap to column if fragment is reasonably close,
//  * otherwise append to previous cell (prevents fragments from jumping to next column).
//  */
// function rowsToGrid(rowBands, colCenters) {
//   const grid = [];
//   // compute typical column gap for snapping tolerance
//   const colGaps = [];
//   for (let i = 1; i < colCenters.length; i++) {
//     const d = colCenters[i] - colCenters[i - 1];
//     if (d > 0) colGaps.push(d);
//   }
//   const medColGap = median(colGaps) || 0;
//   const assignTol = Math.max(medColGap * 0.45, 1.2);

//   for (const r of rowBands) {
//     // pre-merge tiny fragments within row
//     const squashed = mergeCloseFragments(r.items);
//     const cells = new Array(colCenters.length).fill("");
//     let lastIdx = -1;

//     for (const frag of squashed) {
//       // find nearest column center
//       let bestIdx = 0;
//       let bestDist = Infinity;
//       for (let i = 0; i < colCenters.length; i++) {
//         const d = Math.abs(colCenters[i] - frag.x);
//         if (d < bestDist) {
//           bestDist = d;
//           bestIdx = i;
//         }
//       }

//       if (bestDist > assignTol && lastIdx !== -1) {
//         // not close enough to any column -> assume continuation of previous cell
//         cells[lastIdx] = cells[lastIdx]
//           ? `${cells[lastIdx]} ${frag.text}`
//           : frag.text;
//       } else {
//         // snap to bestIdx
//         cells[bestIdx] = cells[bestIdx]
//           ? `${cells[bestIdx]} ${frag.text}`
//           : frag.text;
//         lastIdx = bestIdx;
//       }
//     }

//     // trim whitespace, keep empty as ""
//     grid.push(cells.map((c) => (c ? String(c).trim() : "")));
//   }
//   return grid;
// }

// // ---------- main parser ----------
// const parsePDF = (filePath) =>
//   new Promise((resolve, reject) => {
//     const pages = new Map(); // pageNumber -> [{x,y,text}]
//     let currentPage = 1;

//     new PdfReader().parseFileItems(filePath, (err, item) => {
//       if (err) return reject(err);

//       // end of file
//       if (!item) {
//         if (pages.size === 0) {
//           return resolve({ columns: ["Col 1"], rows: [] });
//         }

//         // Build per-page grids using per-page column detection
//         const wholeGrid = [];
//         let maxCols = 0;

//         for (const [p, arr] of Array.from(pages.entries()).sort(
//           (a, b) => a[0] - b[0]
//         )) {
//           if (!arr.length) continue;
//           const pageXs = arr.map((it) => it.x);
//           const pageCols = buildColumnCenters(pageXs);

//           // if unable to detect columns, fallback: cluster rows and join text into 1 column lines
//           if (!pageCols.length) {
//             const bands = clusterRowsByY(arr);
//             for (const b of bands) {
//               const joined = b.items
//                 .map((i) => i.text)
//                 .join(" ")
//                 .trim();
//               wholeGrid.push([joined]);
//             }
//             maxCols = Math.max(maxCols, 1);
//             continue;
//           }

//           const bands = clusterRowsByY(arr);
//           const pageGrid = rowsToGrid(bands, pageCols);
//           wholeGrid.push(...pageGrid);
//           maxCols = Math.max(maxCols, pageCols.length);
//         }

//         // Build column names Col 1..N and map wholeGrid rows to objects preserving empties
//         const columns = Array.from(
//           { length: maxCols },
//           (_, i) => `Col ${i + 1}`
//         );
//         const rows = wholeGrid.map((cells) => {
//           const obj = {};
//           for (let i = 0; i < maxCols; i++) obj[columns[i]] = cells[i] || "";
//           return obj;
//         });

//         return resolve({ columns, rows });
//       }

//       // page marker
//       if (item.page) {
//         currentPage = item.page;
//         if (!pages.has(currentPage)) pages.set(currentPage, []);
//         return;
//       }

//       // text item
//       if (
//         item.text != null &&
//         typeof item.x === "number" &&
//         typeof item.y === "number"
//       ) {
//         if (!pages.has(currentPage)) pages.set(currentPage, []);
//         pages
//           .get(currentPage)
//           .push({ x: item.x, y: item.y, text: String(item.text) });
//       }
//     });
//   });

// // ---------- POST handler ----------
// export async function POST(req) {
//   try {
//     const nodeReq = await toNodeStream(req);
//     nodeReq.headers = Object.fromEntries(req.headers || []);

//     const uploadDir = path.join(process.cwd(), "uploads");
//     fs.mkdirSync(uploadDir, { recursive: true });

//     const form = formidable({
//       multiples: false,
//       uploadDir,
//       keepExtensions: true,
//     });

//     const { files } = await new Promise((resolve, reject) => {
//       form.parse(nodeReq, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
//     if (!uploadedFile) {
//       return NextResponse.json(
//         { ok: false, error: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     const filePath = uploadedFile.filepath || uploadedFile.path;
//     if (!filePath) {
//       return NextResponse.json(
//         { ok: false, error: "File path not found" },
//         { status: 400 }
//       );
//     }

//     const result = await parsePDF(filePath);

//     // cleanup
//     try {
//       fs.unlinkSync(filePath);
//     } catch (_) {}

//     return NextResponse.json({ ok: true, ...result });
//   } catch (e) {
//     return NextResponse.json(
//       { ok: false, error: e?.message || "Parse failed" },
//       { status: 500 }
//     );
//   }
// }
