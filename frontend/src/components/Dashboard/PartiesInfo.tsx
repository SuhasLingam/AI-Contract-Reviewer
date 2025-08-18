import React from 'react';

interface PartiesInfoProps {
    results: any;
}

const PartiesInfo: React.FC<PartiesInfoProps> = ({ results }) => {
    if (!results.parties || results.parties.length === 0) return null;

    return (
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
    );
};

export default PartiesInfo;
