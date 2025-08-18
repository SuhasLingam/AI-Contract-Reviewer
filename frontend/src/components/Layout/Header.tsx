import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
                AI Contract Reviewer Agent
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload your contract and get comprehensive AI analysis including risks, missing clauses, compliance issues, and professional recommendations.
            </p>
        </div>
    );
};

export default Header;
