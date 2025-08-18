import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
    chatMessages: Array<{
        id: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: Date;
        supportingClauses?: string[];
        limitations?: string;
    }>;
    chatLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatMessages, chatLoading }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, chatLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <span className="text-gray-400 text-2xl">💬</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Start a conversation</h4>
                    <p className="text-gray-500">Ask questions about your contract to get instant answers</p>
                </div>
            ) : (
                chatMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))
            )}
            {chatLoading && <TypingIndicator />}
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages;
