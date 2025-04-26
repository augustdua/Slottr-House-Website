import { useState, useEffect, useRef } from "react";
import { Zap, Eye, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Optional for animations

export const WinnerSection = () => {
    const [winners, setWinners] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        const connectWebSocket = () => {
            const ws = new WebSocket('wss://your-websocket-endpoint.com/winners');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                // Clear any reconnection timeout if it exists
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                const newWinner = JSON.parse(event.data);

                // Add the new winner to the beginning of the list and maintain a max length
                setWinners(prevWinners => {
                    const updatedWinners = [newWinner, ...prevWinners.slice(0, 19)]; // Keep only 20 recent winners
                    return updatedWinners;
                });
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);

                // Implement reconnection strategy
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connectWebSocket();
                }, 3000); // Try to reconnect after 3 seconds
            };
        };

        // Initial connection
        connectWebSocket();

        // Cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full md:w-1/3 bg-[#1b1b1b] rounded-lg p-4 flex flex-col h-[680px]">
            {/* Header with connection status */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Winners</h2>
                <div className="flex items-center gap-4">
                    <span className={`${isConnected ? 'bg-[#fa5258]' : 'bg-gray-500'} text-white px-3 py-1 rounded-md font-bold transition-colors`}>
                        {isConnected ? 'Live' : 'Connecting...'}
                    </span>
                    <div className="w-12 h-6 bg-[#292929] rounded-full flex items-center p-1">
                        <div className={`w-5 h-5 rounded-full ${isConnected ? 'bg-white' : 'bg-gray-400'} ml-auto flex items-center justify-center transition-colors`}>
                            <Zap className={`w-3 h-3 ${isConnected ? 'text-[#fa5258]' : 'text-gray-600'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable winner list with animation */}
            <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#292929] scrollbar-track-transparent">
                <AnimatePresence>
                    {winners.map((winner) => (
                        <motion.div
                            key={winner.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <WinnerItem winner={winner} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {winners.length === 0 && (
                    <div className="flex justify-center items-center h-full text-white/50">
                        Waiting for winners...
                    </div>
                )}
            </div>
        </div>
    );
};

// WinnerItem component remains the same
const WinnerItem = ({ winner }) => {
    return (
        <div className="mb-6">
            <div className="flex gap-4 bg-[#292929] p-3 rounded-lg items-center">
                <div className="relative flex-shrink-0">
                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#fa5258] rounded-full"></div>
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#fa5258] rounded-full w-6 h-6 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                    </div>
                    <img src={winner.image} alt="Winner game" className="w-20 h-20 rounded-lg object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-medium truncate mr-2">{winner.gameName}</span>
                        <div className="flex gap-2 flex-shrink-0">
                            <button className="rounded-full bg-[#1b1b1b] hover:bg-[#333] transition-colors p-1">
                                <Eye className="w-4 h-4 text-white" />
                            </button>
                            <button className="rounded-full bg-[#1b1b1b] hover:bg-[#333] transition-colors p-1">
                                <Play className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-white text-xl font-bold">{winner.amount}</span>
                        <span className="text-[#d9d9d9] text-sm">{winner.platform}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[#d9d9d9] text-sm">{winner.sponsor}</span>
                        <span className="text-[#d9d9d9] text-sm">{winner.timeAgo}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};