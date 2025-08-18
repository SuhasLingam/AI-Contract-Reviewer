import React from 'react';

interface KeyTermsProps {
    results: any;
}

const KeyTerms: React.FC<KeyTermsProps> = ({ results }) => {
    if (!results.key_terms) return null;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Key Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.key_terms.payment_terms && (
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Payment Terms</h4>
                        <div className="text-sm text-gray-600">
                            <p>Amount: {results.key_terms.payment_terms.amount || 'Not specified'}</p>
                            <p>Currency: {results.key_terms.payment_terms.currency || 'Not specified'}</p>
                            <p>Schedule: {results.key_terms.payment_terms.schedule || 'Not specified'}</p>
                        </div>
                    </div>
                )}

                {results.key_terms.termination && (
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Termination</h4>
                        <div className="text-sm text-gray-600">
                            <p>Notice Period: {results.key_terms.termination.notice_period || 'Not specified'}</p>
                            <p>Grounds: {results.key_terms.termination.grounds || 'Not specified'}</p>
                            <p>Immediate: {results.key_terms.termination.immediate_termination || 'No'}</p>
                        </div>
                    </div>
                )}

                {results.key_terms.confidentiality && (
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Confidentiality</h4>
                        <div className="text-sm text-gray-600">
                            <p>Scope: {results.key_terms.confidentiality.scope || 'Not specified'}</p>
                            <p>Duration: {results.key_terms.confidentiality.duration || 'Not specified'}</p>
                        </div>
                    </div>
                )}

                {results.key_terms.ip && (
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Intellectual Property</h4>
                        <div className="text-sm text-gray-600">
                            <p>Ownership: {results.key_terms.ip.ownership || 'Not specified'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeyTerms;
