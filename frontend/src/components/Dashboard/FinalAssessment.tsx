import React from 'react';

interface FinalAssessmentProps {
    results: any;
}

const FinalAssessment: React.FC<FinalAssessmentProps> = ({ results }) => {
    if (!results.summary?.final_assessment) return null;

    return (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Final Assessment</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{results.summary.final_assessment}</p>
        </div>
    );
};

export default FinalAssessment;
