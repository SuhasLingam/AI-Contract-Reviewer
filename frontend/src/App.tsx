import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any | null>(null); // store structured data
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResults(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Step 1 — Upload
      const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // Step 2 — Fetch results
      const resultsRes = await fetch("http://127.0.0.1:8000/results");
      if (!resultsRes.ok) throw new Error("Failed to fetch results");

      const data = await resultsRes.json();
      const rawResult = data.results?.result || "";
      const cleaned = rawResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      setResults(JSON.parse(cleaned));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8 mt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            AI Contract Reviewer Agent
          </h1>
          <p className="text-gray-600">
            Upload your contract and let AI highlight risks, missing clauses, and compliance issues.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className={`w-full py-2 rounded-md text-white font-semibold transition-colors
              ${!selectedFile || uploading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {uploading ? "Analyzing..." : "Upload & Review"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-8 space-y-6">
            {/* Overall Risk */}
            <div className="p-4 rounded-md border-l-4"
              style={{
                borderColor:
                  results.overall_risk === "High" ? "#dc2626" :
                    results.overall_risk === "Medium" ? "#f59e0b" :
                      "#16a34a",
                backgroundColor:
                  results.overall_risk === "High" ? "#fee2e2" :
                    results.overall_risk === "Medium" ? "#fef3c7" :
                      "#dcfce7"
              }}
            >
              <h2 className="text-lg font-bold">Overall Risk: {results.overall_risk}</h2>
              <p className="text-sm">{results.summary}</p>
            </div>

            {/* Clauses */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Clause Summaries</h3>
              <div className="space-y-2">
                {results.clauses?.map((clause: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-md border">
                    <h4 className="font-semibold">{clause.title}</h4>
                    <p className="text-sm">{clause.summary}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded
                      ${clause.risk === "High" ? "bg-red-200 text-red-800" :
                        clause.risk === "Medium" ? "bg-yellow-200 text-yellow-800" :
                          "bg-green-200 text-green-800"}`}>
                      {clause.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Clauses */}
            {results.missing_clauses?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Missing Clauses</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {results.missing_clauses.map((mc: any, idx: number) => (
                    <li key={idx}>
                      <strong>{mc.name}:</strong> {mc.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ambiguous Terms */}
            {results.ambiguous_terms?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Ambiguous Terms</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {results.ambiguous_terms.map((at: any, idx: number) => (
                    <li key={idx}>
                      <strong>{at.text}</strong> → {at.suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compliance Flags */}
            {results.compliance_flags?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Compliance Flags</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {results.compliance_flags.map((cf: any, idx: number) => (
                    <li key={idx}>
                      ⚠ <strong>{cf.issue}</strong> ({cf.reference})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          © 2025 AI Contract Reviewer Agent
        </div>
      </div>
    </div>
  );
}

export default App;
