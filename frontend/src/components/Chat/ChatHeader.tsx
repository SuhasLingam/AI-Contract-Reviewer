import React from 'react';

const ChatHeader: React.FC = () => {
    return (
        <div className="p-6 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-t-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">AI</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Contract Assistant</h3>
                        <p className="text-sm text-gray-500">Ask me anything about your contract</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
