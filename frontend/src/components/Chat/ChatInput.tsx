import React from 'react';

interface ChatInputProps {
    chatQuery: string;
    chatLoading: boolean;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuerySubmit: (event: React.FormEvent) => void;
    onQuickQuestionClick: (question: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    chatQuery,
    chatLoading,
    onQueryChange,
    onQuerySubmit,
    onQuickQuestionClick
}) => {
    const quickQuestions = [
        "Termination conditions?",
        "Confidentiality obligations?",
        "IP ownership?",
        "Payment terms?",
        "Dispute resolution?"
    ];

    return (
        <div className="p-6 border-t border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-b-2xl">
            <form onSubmit={onQuerySubmit} className="flex space-x-3">
                <input
                    type="text"
                    value={chatQuery}
                    onChange={onQueryChange}
                    placeholder="Ask a question about your contract..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={chatLoading}
                />
                <button
                    type="submit"
                    disabled={!chatQuery.trim() || chatLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow"
                >
                    {chatLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Asking...</span>
                        </>
                    ) : (
                        <>
                            <span>Send</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </>
                    )}
                </button>
            </form>

            {/* Quick Questions */}
            <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, idx) => (
                        <button
                            key={idx}
                            onClick={() => onQuickQuestionClick(question)}
                            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors shadow-sm"
                            disabled={chatLoading}
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
