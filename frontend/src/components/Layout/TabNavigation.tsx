import React from 'react';

interface TabNavigationProps {
    activeTab: "analysis" | "chat";
    onTabChange: (tab: "analysis" | "chat") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => onTabChange("analysis")}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === "analysis"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                >
                    Contract Analysis
                </button>
                <button
                    onClick={() => onTabChange("chat")}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === "chat"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                >
                    Ask Questions
                </button>
            </div>
        </div>
    );
};

export default TabNavigation;
