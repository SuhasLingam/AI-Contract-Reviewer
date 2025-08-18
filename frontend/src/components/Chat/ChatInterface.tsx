import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
    chatMessages: Array<{
        id: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: Date;
        supportingClauses?: string[];
        limitations?: string;
    }>;
    chatQuery: string;
    chatLoading: boolean;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onQuerySubmit: (event: React.FormEvent) => void;
    onQuickQuestionClick: (question: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    chatMessages,
    chatQuery,
    chatLoading,
    onQueryChange,
    onQuerySubmit,
    onQuickQuestionClick
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
            <ChatHeader />
            <ChatMessages chatMessages={chatMessages} chatLoading={chatLoading} />
            <ChatInput
                chatQuery={chatQuery}
                chatLoading={chatLoading}
                onQueryChange={onQueryChange}
                onQuerySubmit={onQuerySubmit}
                onQuickQuestionClick={onQuickQuestionClick}
            />
        </div>
    );
};

export default ChatInterface;
