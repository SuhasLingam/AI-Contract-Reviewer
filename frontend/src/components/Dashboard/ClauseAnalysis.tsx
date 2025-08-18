import React from 'react';

interface ClauseAnalysisProps {
    results: any;
}

const ClauseAnalysis: React.FC<ClauseAnalysisProps> = ({ results }) => {
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

    if (!results.clauses || results.clauses.length === 0) return null;

    return (
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

                            {clause.obligations && (clause.obligations.party.length > 0 || clause.obligations.counterparty.length > 0) && (
                                <div className="mt-3">
                                    <span className="text-sm font-medium text-gray-700">Obligations:</span>
                                    {clause.obligations.party.length > 0 && (
                                        <div className="mt-1">
                                            <span className="text-xs font-medium text-gray-600">Your obligations:</span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                                {clause.obligations.party.map((obligation: string, obIdx: number) => (
                                                    <li key={obIdx}>{obligation}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {clause.obligations.counterparty.length > 0 && (
                                        <div className="mt-1">
                                            <span className="text-xs font-medium text-gray-600">Counterparty obligations:</span>
                                            <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                                                {clause.obligations.counterparty.map((obligation: string, obIdx: number) => (
                                                    <li key={obIdx}>{obligation}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClauseAnalysis;
