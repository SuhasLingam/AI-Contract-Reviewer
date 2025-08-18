import React, { useState } from 'react';

interface ChatMessageProps {
    message: {
        id: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: Date;
        supportingClauses?: string[];
        limitations?: string;
    };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch { }
    };

    return (
        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'assistant' && (
                <div className="mr-2 mt-1 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow">AI</div>
            )}
            <div
                className={`relative group max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                        : 'bg-gray-100 text-gray-800 shadow-sm'
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {message.type === 'assistant' && message.supportingClauses && message.supportingClauses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-600 mb-2">Supporting Clauses:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {message.supportingClauses.map((clause, idx) => (
                                <li key={idx} className="italic">"{clause}"</li>
                            ))}
                        </ul>
                    </div>
                )}

                {message.type === 'assistant' && message.limitations && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-yellow-600 mb-1">Note:</p>
                        <p className="text-xs text-yellow-600">{message.limitations}</p>
                    </div>
                )}

                <div className={`text-[10px] mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                {/* Copy button */}
                <button
                    onClick={handleCopy}
                    title="Copy"
                    className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded-full border ${message.type === 'user' ? 'bg-white/20 border-white/40 text-white' : 'bg-white border-gray-200 text-gray-600'
                        }`}
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            {message.type === 'user' && (
                <div className="ml-2 mt-1 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shadow-inner">You</div>
            )}
        </div>
    );
};

export default ChatMessage;
