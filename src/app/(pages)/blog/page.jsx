import { Rocket } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1", 10);
  const postsPerPage = 10;

  let blogPosts = [];

  try {
    const res = await fetch(`${process.env.URL}/api/blogpost/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const text = await res.text();

    if (text) {
      blogPosts = JSON.parse(text);

      // ✅ Sort by newest first
      blogPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
  }

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const paginatedPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <main className="pt-24 px-4 min-h-screen bg-white text-gray-800">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog & Insights</h1>
        <p className="text-gray-600 text-center mb-14">
          Get tips, updates, and insights on financial document conversion and
          analysis.
        </p>

        <div className="flex flex-col gap-8">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={post._id}
                  className="border rounded-lg shadow-sm p-6 hover:shadow-md transition"
                >
                  <h2 className="text-lg font-semibold text-indigo-700 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {post.description}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">{formattedDate}</p>
                  <Link
                    href={`/`}
                    className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    Give it a try <Rocket className="w-4 h-4" />
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No blog posts found.</p>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Previous
              </Link>
            )}
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
