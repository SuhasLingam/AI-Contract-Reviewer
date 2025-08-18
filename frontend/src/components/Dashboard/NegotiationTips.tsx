import React from 'react';

interface NegotiationTipsProps {
    results: any;
}

const NegotiationTips: React.FC<NegotiationTipsProps> = ({ results }) => {
    if (!results.summary?.negotiation_tips || results.summary.negotiation_tips.length === 0) return null;

    return (
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
    );
};

export default NegotiationTips;
