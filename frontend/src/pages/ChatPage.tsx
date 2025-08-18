import React from 'react';
import ChatInterface from '../components/Chat/ChatInterface';

interface ChatPageProps {
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

const ChatPage: React.FC<ChatPageProps> = ({
    chatMessages,
    chatQuery,
    chatLoading,
    onQueryChange,
    onQuerySubmit,
    onQuickQuestionClick
}) => {
    return (
        <ChatInterface
            chatMessages={chatMessages}
            chatQuery={chatQuery}
            chatLoading={chatLoading}
            onQueryChange={onQueryChange}
            onQuerySubmit={onQuerySubmit}
            onQuickQuestionClick={onQuickQuestionClick}
        />
    );
};

export default ChatPage;
