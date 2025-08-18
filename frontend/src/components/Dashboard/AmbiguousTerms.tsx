import React from 'react';

interface AmbiguousTermsProps {
    results: any;
}

const AmbiguousTerms: React.FC<AmbiguousTermsProps> = ({ results }) => {
    if (!results.ambiguous_terms || results.ambiguous_terms.length === 0) return null;

    return (
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
    );
};

export default AmbiguousTerms;
