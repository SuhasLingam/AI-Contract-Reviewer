import React from 'react';

interface DocumentOverviewProps {
    results: any;
}

const DocumentOverview: React.FC<DocumentOverviewProps> = ({ results }) => {
    return (
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
    );
};

export default DocumentOverview;
