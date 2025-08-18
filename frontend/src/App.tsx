import { useState } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import FileUpload from "./components/Upload/FileUpload";
import ErrorMessage from "./components/Error/ErrorMessage";
import TabNavigation from "./components/Layout/TabNavigation";
import AnalysisPage from "./pages/AnalysisPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    supportingClauses?: string[];
    limitations?: string;
  }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResults(null);
      setError(null);
      setChatMessages([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setResults(null);
    setError(null);
    setChatMessages([]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Step 1 — Upload
      const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      const uploadData = await uploadRes.json();
      console.log("Upload response:", uploadData);

      // Step 2 — Fetch results
      const resultsRes = await fetch("http://127.0.0.1:8000/results");
      if (!resultsRes.ok) throw new Error("Failed to fetch results");

      const data = await resultsRes.json();
      console.log("Results response:", data);

      // Parse the summary from the results
      const rawResult = data.results?.summary || "";
      const cleaned = rawResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedResults = JSON.parse(cleaned);
      setResults(parsedResults);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const handleChatSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatQuery.trim() || !results) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatQuery,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatQuery("");
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: chatQuery,
        }),
      });

      if (!response.ok) throw new Error("Failed to get chat response");

      const data = await response.json();
      console.log("Chat response:", data);

      // Parse the response from the chat endpoint
      const rawResponse = data.response || "";
      const cleaned = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsedResponse = JSON.parse(cleaned);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: parsedResponse.detailed_answer || parsedResponse.overall_summary || "I couldn't find a specific answer to that question.",
        timestamp: new Date(),
        supportingClauses: parsedResponse.supporting_clauses,
        limitations: parsedResponse.limitations
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setError(err.message || "Failed to get chat response");
    } finally {
      setChatLoading(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleQuickQuestionClick = (question: string) => {
    setChatQuery(question);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <FileUpload
          selectedFile={selectedFile}
          uploading={uploading}
          onFileChange={handleFileChange}
          onFileRemove={handleFileRemove}
          onSubmit={handleSubmit}
        />

        <ErrorMessage error={error} />

        {results && (
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {activeTab === "analysis" && results && (
          <AnalysisPage results={results} />
        )}

        {activeTab === "chat" && results && (
          <ChatPage
            chatMessages={chatMessages}
            chatQuery={chatQuery}
            chatLoading={chatLoading}
            onQueryChange={(e) => setChatQuery(e.target.value)}
            onQuerySubmit={handleChatSubmit}
            onQuickQuestionClick={handleQuickQuestionClick}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
