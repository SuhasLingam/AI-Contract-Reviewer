import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResponseText(null); // Reset previous response
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setResponseText(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponseText(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseText("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8 mt-10">
        {/* Project Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Contract Reviewer Agent</h1>
          <p className="text-gray-600">
            Upload your PDF or DOCX contracts and let our AI agent highlight risks, missing clauses, and compliance issues.
          </p>
        </div>

        {/* How it works */}
        <div className="mb-6 bg-blue-50 p-4 rounded-md text-blue-800">
          <h2 className="font-semibold mb-2 text-gray-800">How it works:</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
            <li>Select a PDF or DOCX contract using the file input below.</li>
            <li>Click "Upload File" to send it to our AI-powered backend.</li>
            <li>AI analyzes the contract and generates a risk summary, clause insights, and compliance check.</li>
            <li>View results in the "AI Review Results" section below.</li>
          </ol>
          <p className="mt-2 text-gray-600 text-xs">
            ⚠ Ensure the file is not password-protected. Maximum file size: 10MB.
          </p>
        </div>

        {/* File Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 mb-2 block font-medium">Select a PDF or DOCX file</span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </label>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-md flex justify-between items-center">
              <span className="truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-blue-600 hover:text-blue-900 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className={`w-full py-2 rounded-md text-white font-semibold transition-colors
              ${!selectedFile || uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {uploading ? "Analyzing..." : "Upload & Review"}
          </button>
        </form>

        {/* AI Review Results */}
        {responseText && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2 text-gray-800">AI Review Results:</h3>
            <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {responseText}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          © 2025 AI Contract Reviewer Agent. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default App;
