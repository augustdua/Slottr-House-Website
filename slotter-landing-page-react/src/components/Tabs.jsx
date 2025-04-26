import React, { useState } from 'react';

// Define tab-specific text colors and glider gradients
const tabTextColors = [
    'text-blue-400',   // Product
    'text-green-400',  // Options
    'text-yellow-400', // Shipping
    'text-pink-400',   // Published
];

const tabGradients = [
    'linear-gradient(113deg, hsl(260deg 100% 64%) 0%, hsl(190deg 100% 55%) 100%)', // Product
    'linear-gradient(90deg, #51a14c 0%, #10c33e 100%)',                            // Options
    'linear-gradient(90deg, #faffcc 0%, #f5eea3 10%, #ffe48a 40%, #ffb54d 65%, #ff974d 85%, #ff8052 100%)', // Shipping
    'linear-gradient(90deg, #b9326f 0%, #ff5ddc 100%)',                            // Published
];

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="relative">
            {/* Tab Headers */}
            <div className="flex bg-gray-800 rounded-t-lg">
                {React.Children.map(children, (child, index) => (
                    <button
                        key={index}
                        className={`flex­

-1 px-4 py-2 text-sm font-medium text-center uppercase tracking-wider ${activeTab === index ? tabTextColors[index] : 'text-gray-300'} bg-gray-800 rounded-t-md border-t border-gray-700 focus:outline-none transition-colors duration-300`}
                        onClick={() => setActiveTab(index)}
                    >
                        {child.props.title}
                    </button>
                ))}
            </div>
            {/* Glider (Active Tab Indicator) */}
            <div
                className="absolute bottom-0 h-1 w-1/4 transition-all duration-300"
                style={{
                    left: `${activeTab * 25}%`,
                    background: tabGradients[activeTab],
                    boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.3)',
                }}
            />
            {/* Tab Content */}
            <div className="bg-gray-900 p-6 rounded-b-lg border-t border-gray-700 text-white">
                {children[activeTab]}
            </div>
        </div>
    );
};

export default Tabs;