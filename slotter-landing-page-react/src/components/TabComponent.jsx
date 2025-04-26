import React from 'react'
import Tabs from './Tabs'
import Tab from './Tab'
function TabComponent() {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-4xl font-bold text-center mb-6 text-white">CSS Tabs</h1>
                <Tabs>
                    <Tab title="Product" apiEndpoint="/api/product">
                        <h2
                            style={{
                                background: 'linear-gradient(60deg, hsl(202deg 100% 75%), hsl(270deg 100% 72%))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                            className="text-2xl font-bold mb-4"
                        >
                            Sweep + Slide Dog Toy
                        </h2>
                        <p className="text-white">
                            <span className="text-sm font-semibold mr-2 text-gray-300">1</span>
                            The Sweep + Slide is an indoor dog toy with a sleek base designed to glide across any floor...
                        </p>
                    </Tab>
                    <Tab title="Options" apiEndpoint="/api/options">
                        <h2
                            style={{
                                background: 'linear-gradient(10deg, #02ce85, #02ceab)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                            className="text-2xl font-bold mb-4"
                        >
                            Tab 2
                        </h2>
                        <p className="text-white">
                            <span className="text-sm font-semibold mr-2 text-gray-300">2</span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </p>
                    </Tab>
                    <Tab title="Shipping" apiEndpoint="/api/shipping">
                        <h2
                            style={{
                                background: 'linear-gradient(10deg, #f7ec9c, #ff8651)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                            className="text-2xl font-bold mb-4"
                        >
                            Tab 3
                        </h2>
                        <p className="text-white">
                            <span className="text-sm font-semibold mr-2 text-gray-300">3</span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </p>
                    </Tab>
                    <Tab title="Published" apiEndpoint="/api/published">
                        <h2
                            style={{
                                background: 'linear-gradient(70deg, #c51574, #97389b)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                            className="text-2xl font-bold mb-4"
                        >
                            Tab 4
                        </h2>
                        <p className="text-white">
                            <span className="text-sm font-semibold mr-2 text-gray-300">4</span>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </p>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default TabComponent