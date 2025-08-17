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

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return { border: '#dc2626', bg: '#fee2e2', text: '#dc2626' };
      case 'medium': return { border: '#f59e0b', bg: '#fef3c7', text: '#f59e0b' };
      case 'low': return { border: '#16a34a', bg: '#dcfce7', text: '#16a34a' };
      default: return { border: '#6b7280', bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            AI Contract Reviewer Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your contract and get comprehensive AI analysis including risks, missing clauses, compliance issues, and professional recommendations.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Contract Document
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4"
              />
            </div>

            {selectedFile && (
              <div className="p-4 bg-blue-50 text-blue-800 rounded-xl flex justify-between items-center">
                <span className="truncate font-medium">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-blue-600 hover:text-blue-900 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200
                ${!selectedFile || uploading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Contract...</span>
                </div>
              ) : (
                "Upload & Analyze Contract"
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Document Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{results.metadata?.document_type || 'N/A'}</div>
                  <div className="text-sm text-blue-600">Document Type</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{results.risk_overview?.overall_risk || 'N/A'}</div>
                  <div className="text-sm text-green-600">Overall Risk</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{results.clauses?.length || 0}</div>
                  <div className="text-sm text-purple-600">Total Clauses</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{results.missing_clauses?.length || 0}</div>
                  <div className="text-sm text-orange-600">Missing Clauses</div>
                </div>
              </div>

              {/* Risk Heatmap */}
              {results.risk_overview?.risk_heatmap && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Risk Distribution</h3>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-red-100 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-red-600">{results.risk_overview.risk_heatmap.High || 0}</div>
                      <div className="text-sm text-red-600">High Risk</div>
                    </div>
                    <div className="flex-1 bg-yellow-100 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-yellow-600">{results.risk_overview.risk_heatmap.Medium || 0}</div>
                      <div className="text-sm text-yellow-600">Medium Risk</div>
                    </div>
                    <div className="flex-1 bg-green-100 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">{results.risk_overview.risk_heatmap.Low || 0}</div>
                      <div className="text-sm text-green-600">Low Risk</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              {results.summary?.executive_summary && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Executive Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{results.summary.executive_summary}</p>
                </div>
              )}
            </div>

            {/* Parties Information */}
            {results.parties && results.parties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Contract Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.parties.map((party: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-xl">
                      <div className="font-semibold text-lg text-gray-800">{party.name}</div>
                      <div className="text-sm text-gray-600 mt-1">Role: {party.role}</div>
                      {party.address && <div className="text-sm text-gray-600 mt-1">{party.address}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clauses Analysis */}
            {results.clauses && results.clauses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Clause Analysis</h3>
                <div className="space-y-4">
                  {results.clauses.map((clause: any, idx: number) => {
                    const riskColors = getRiskColor(clause.risk);
                    return (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{clause.title}</h4>
                            <p className="text-gray-600 mb-3">{clause.summary}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold border`}
                              style={{
                                backgroundColor: riskColors.bg,
                                color: riskColors.text,
                                borderColor: riskColors.border
                              }}
                            >
                              {clause.risk} Risk
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskScoreColor(clause.risk_score)}`}>
                              Score: {clause.risk_score}/5
                            </span>
                          </div>
                        </div>

                        {clause.justification && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Justification: </span>
                            <span className="text-sm text-gray-600">{clause.justification}</span>
                          </div>
                        )}

                        {clause.recommendations && clause.recommendations.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Recommendations:</span>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                              {clause.recommendations.map((rec: string, recIdx: number) => (
                                <li key={recIdx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {clause.quote && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm font-medium text-gray-700">Quote: </span>
                            <span className="text-sm text-gray-600 italic">"{clause.quote}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Missing Clauses */}
            {results.missing_clauses && results.missing_clauses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Missing Clauses</h3>
                <div className="space-y-4">
                  {results.missing_clauses.map((clause: any, idx: number) => (
                    <div key={idx} className="border border-amber-200 bg-amber-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-amber-800 mb-2">{clause.name}</h4>
                      <p className="text-amber-700 mb-3">{clause.reason}</p>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">Recommended Language:</span>
                        <p className="text-sm text-gray-600 mt-1">{clause.recommended_language}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ambiguous Terms */}
            {results.ambiguous_terms && results.ambiguous_terms.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Ambiguous Terms</h3>
                <div className="space-y-4">
                  {results.ambiguous_terms.map((term: any, idx: number) => (
                    <div key={idx} className="border border-orange-200 bg-orange-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-orange-800 mb-2">{term.text}</h4>
                      <p className="text-orange-700 mb-3">{term.issue}</p>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">Suggestion:</span>
                        <p className="text-sm text-gray-600 mt-1">{term.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Flags */}
            {results.compliance_flags && results.compliance_flags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Compliance Issues</h3>
                <div className="space-y-4">
                  {results.compliance_flags.map((flag: any, idx: number) => (
                    <div key={idx} className="border border-red-200 bg-red-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-red-800">{flag.issue}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${flag.severity === 'High' ? 'bg-red-200 text-red-800' :
                          flag.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                          {flag.severity}
                        </span>
                      </div>
                      <p className="text-red-700 mb-3">{flag.justification}</p>
                      <div className="bg-white rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">Recommended Action:</span>
                        <p className="text-sm text-gray-600 mt-1">{flag.recommended_action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Negotiation Tips */}
            {results.summary?.negotiation_tips && results.summary.negotiation_tips.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Negotiation Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.summary.negotiation_tips.map((tip: string, idx: number) => (
                    <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-600 text-lg">💡</span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Assessment */}
            {results.summary?.final_assessment && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Final Assessment</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{results.summary.final_assessment}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2025 AI Contract Reviewer Agent - Powered by Advanced AI Analysis
        </div>
      </div>
    </div>
  );
}

export default App;
