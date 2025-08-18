import React from 'react';

interface MissingInformationProps {
    results: any;
}

const MissingInformation: React.FC<MissingInformationProps> = ({ results }) => {
    if (!results.missing_information || results.missing_information.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Missing Information</h3>
            <div className="space-y-4">
                {results.missing_information.map((info: any, idx: number) => (
                    <div key={idx} className="border border-blue-200 bg-blue-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">{info.item}</h4>
                        <p className="text-blue-700">{info.why_needed}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MissingInformation;
