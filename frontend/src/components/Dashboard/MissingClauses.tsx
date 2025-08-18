import React from 'react';

interface MissingClausesProps {
    results: any;
}

const MissingClauses: React.FC<MissingClausesProps> = ({ results }) => {
    if (!results.missing_clauses || results.missing_clauses.length === 0) return null;

    return (
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
    );
};

export default MissingClauses;
