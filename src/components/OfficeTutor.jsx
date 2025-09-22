"use client";

import { useState, useRef, useEffect } from "react";
import { chatSession } from "@/utils/AiModel"; // Gemini session
import { motion } from "framer-motion";

const OfficeTutor = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Step 1 - Categories
  const categories = {
    Office: [
      "Word",
      "Excel",
      "PowerPoint",
      "Outlook",
      "OneNote",
      "Publisher",
      "Access",
    ],
    Military: [
      //"Nigerian Military",
      "Notable Operations",
      "Military Technology & Equipment",
      "Military Training Institutions",
      //"Branches of the Armed Forces",
      "Nigerian Army (NA)",
      "Nigerian Navy (N)",
      "Nigerian Air Force (NAF)",
    ],
    "Civil Servant Tools": [
      "PDF Reader",
      "Document Scanner",
      "e-Signature",
      "Public Service Portal",
      "e-Gov forms",
      "Payroll-IPPIS access",
      "Official Email",
      "Memo Templates",
      "Meeting Scheduler",
      "Task Manager",
      "Calendar",
      "Policy-Regulation Repository",
      "Templates for Reports",
      "Minutes of Meeting",
    ],
    "Student Tools": [
      "e-Library",
      "Flashcards",
      "Note-taking App",
      "Mind Mapping Tool",
      "Citation Generator",
      "Plagiarism Checker",
      "Online Dictionary-Encyclopedia",
      "Timetable Maker",
      "Task-Assignment Tracker",
      "Exam Countdown",
      "Group Chat",
      "File Sharing",
      "Virtual Study Room",
      "CV Builder",
      "Scholarship Portal",
      "Internship Finder",
    ],
    "Entrepreneur Tools": [
      "Invoice Generator",
      "Accounting Tools",
      "Inventory Manager",
      "Social Media Post Scheduler",
      "CRM",
      "Email Marketing",
      "Loan Calculator",
      "Business Plan Templates",
      "Investment Tracker",
      "Team Chat",
      "File Sharing",
      "Project Management",
      "Sales Dashboard",
      "Market Research Tools",
    ],
    "Digital Skills": [
      "HTML",
      "Python",
      "JavaScript basics",
      "Canva",
      "Photoshop basics",
      "Excel Advanced",
      "Power BI",
      "SQL",
      "Web Development Tutorials",
    ],
    "Entrepreneurial Skills": [
      "Business Plan Writing",
      "Financial Literacy",
      "Marketing & Branding Tips",
      "Customer Service Essentials",
    ],
    "Soft Skills": [
      "Communication & Presentation Skills",
      "Leadership & Teamwork",
      "Problem-Solving & Critical Thinking",
      "Time Management",
    ],
    "Vocational-Practical Skills": [
      "Photography & Video Editing",
      "Public Speaking",
      "Content Writing & Blogging",
      "DIY & Handcrafts",
    ],
    "Learning Resources": [
      "eBooks & PDF Library",
      "Online Courses",
      "Short Video Lessons",
      "Quiz & Self-Assessment",
    ],
  };

  // Function to get persona from category
  const getPersonaFromCategory = (category) => {
    const personas = {
      Office: "office worker",
      //Military: "Nigerian Military",
      "Civil Servant Tools": "civil servant",
      "Student Tools": "student",
      "Entrepreneur Tools": "entrepreneur",
      "Digital Skills": "digital skills learner",
      "Entrepreneurial Skills": "aspiring entrepreneur",
      "Soft Skills": "personal development learner",
      "Vocational/Practical Skills": "vocational trainee",
      "Learning Resources": "knowledge seeker",
    };
    return personas[category] || "user";
  };

  // Step 3 - Chat with Gemini
  const sendToGemini = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const persona = getPersonaFromCategory(selectedCategory);

      const prompt = `
You are C-assistant, a friendly and intelligent tutor for ${selectedTool}.
You are currently assisting a ${persona} who is interested in "${selectedTool}" from the "${selectedCategory}" category.

Your role:
- Be welcoming, clear, and supportive, like a professional assistant.
- Adapt to the user’s needs whether they are a civil servant preparing documents, a student studying, or anyone exploring tools.
- Give step-by-step help when appropriate, but you can also explain concepts, answer questions, or provide tips in a natural way.
- Use simple HTML formatting (<br/> for new lines, <b> for emphasis, emojis where suitable) to make answers easy to read.

Tone:
- Friendly, encouraging, and professional.
- Use relevant emojis occasionally (📊, 📄, ✏️, 💡) to keep it engaging.

If the user asks something unrelated, politely acknowledge them and gently guide the conversation back to ${selectedTool}. For example:
"😊 I can chat about many things, but I’m here to assist you with ${selectedTool}. What would you like to learn today?"

Question from user:
"${userMsg}"
NOTE: IF THE USER ASKS YOU FOR SOMETHING THAT IS RELATED, JUST GO STRAIGHT TO THE POINT AND GIVE A RELEVANT RESPONSE.
IF WHAT THE USER ASKS YOU NEEDS TO BE IN STEPS OR LISTS THEN LET EACH BE IN A NEW LINE AND BE GIVING AN EMPTY LINE IN BETWEEN EVERY STEP OR POINT. JUST ACT AS INTELLIGENT AS YOU CAN.
`;

      const aiResult = await chatSession.sendMessage(prompt);
      const aiResponse = await aiResult.response.text();
      const cleanedResponse = aiResponse.replace(/```html|```/g, "").trim();

      setMessages((prev) => [...prev, { sender: "ai", text: cleanedResponse }]);
    } catch (err) {
      console.error("Gemini request failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Could not connect to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendToGemini();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest", // ✅ keeps scroll within chat container
      inline: "nearest", // ✅ avoids outer page scroll
    });
  }, [messages]);

  const startTool = (tool) => {
    setSelectedTool(tool);
    const sessionTitle = `${selectedCategory} - ${tool}`;
    setRecentChats((prev) => [sessionTitle, ...prev]);
  };

  const resetTool = () => setSelectedTool(null);
  const resetCategory = () => {
    setSelectedCategory(null);
    setSelectedTool(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 border-gray-200 border-2 rounded-lg">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          💬 Recent Conversations
        </h2>
        <div className="space-y-2 overflow-y-auto flex-1">
          {recentChats.length === 0 ? (
            <p className="text-sm text-gray-500">No recent chats yet.</p>
          ) : (
            recentChats.map((chat, idx) => (
              <div
                key={idx}
                className="bg-gray-100 text-sm text-gray-700 p-2 rounded hover:bg-gray-200 cursor-default"
              >
                {chat}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
          {/* Step 1 - Category Selection */}
          {!selectedCategory && !selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2x1 font-semibold mb-6 text-center">
                Select a Category
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Object.keys(categories).map((cat) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="flex flex-col items-center bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg shadow transition"
                  >
                    <img
                      src={`/assets/icons/${cat.toLowerCase()}.png`}
                      alt={`${cat} icon`}
                      className="w-12 h-12 mb-2"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {cat}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2 - Tool Selection */}
          {selectedCategory && !selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedCategory}</h2>
                <button
                  onClick={resetCategory}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  ← Choose Another Category
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {categories[selectedCategory].map((tool) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={tool}
                    onClick={() => startTool(tool)}
                    className="flex flex-col items-center bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg shadow transition"
                  >
                    <img
                      src={`/assets/icons/${tool.toLowerCase()}.png`}
                      alt={`${tool} icon`}
                      className="w-12 h-12 mb-2"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {tool}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3 - Chat */}
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  C-assistant - {selectedTool}
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={resetTool}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    ← Choose Another Tool
                  </button>
                  <button
                    onClick={resetCategory}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    ← Choose Another Category
                  </button>
                </div>
              </div>

              <div className="h-96 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: msg.sender === "user" ? 30 : -30,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "w-fit bg-indigo-100 self-end ml-auto text-right"
                        : "bg-gray-200 self-start mr-auto"
                    }`}
                  >
                    {msg.sender === "ai" ? (
                      <p
                        className="text-sm text-left text-gray-800"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    ) : (
                      <p className="text-sm text-gray-800">{msg.text}</p>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <p className="text-gray-500 text-sm text-left italic">
                    Thinking...
                  </p>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={sendToGemini}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OfficeTutor;
