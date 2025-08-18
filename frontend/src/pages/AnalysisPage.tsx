import React from 'react';
import DocumentOverview from '../components/Dashboard/DocumentOverview';
import KeyTerms from '../components/Dashboard/KeyTerms';
import PartiesInfo from '../components/Dashboard/PartiesInfo';
import ClauseAnalysis from '../components/Dashboard/ClauseAnalysis';
import MissingClauses from '../components/Dashboard/MissingClauses';
import AmbiguousTerms from '../components/Dashboard/AmbiguousTerms';
import MissingInformation from '../components/Dashboard/MissingInformation';
import NegotiationTips from '../components/Dashboard/NegotiationTips';
import FinalAssessment from '../components/Dashboard/FinalAssessment';

interface AnalysisPageProps {
    results: any;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ results }) => {
    return (
        <div className="space-y-8">
            <DocumentOverview results={results} />
            <KeyTerms results={results} />
            <PartiesInfo results={results} />
            <ClauseAnalysis results={results} />
            <MissingClauses results={results} />
            <AmbiguousTerms results={results} />
            <MissingInformation results={results} />
            <NegotiationTips results={results} />
            <FinalAssessment results={results} />
        </div>
    );
};

export default AnalysisPage;
