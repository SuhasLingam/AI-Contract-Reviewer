import React from 'react';

interface ErrorMessageProps {
    error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center space-x-2">
                <span className="text-red-500">⚠</span>
                <span className="font-medium">{error}</span>
            </div>
        </div>
    );
};

export default ErrorMessage;
