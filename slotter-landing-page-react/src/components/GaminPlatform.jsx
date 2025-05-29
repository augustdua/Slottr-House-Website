import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Eye, Play, Zap, Flame, DollarSign, TrendingUp, Bolt } from "lucide-react"
import React from "react"
import { TopWinnersSection } from "./CasinoSection"
import { useRankingData } from "../hooks/fetchData"
import { mapPopularGames, mapStakeGames, mapRtpGames, mapVolatileGames, mapWinnerData } from "../utils/HelperFunction"
import { HorizontalCardList, RankedGameCard } from "./HoverCard"
import { motion, AnimatePresence } from "framer-motion"

// Data structures to mimic JSON responses
const TABS = [
    { id: "popular", label: "Most popular", icon: <Flame size={18} /> },
    { id: "stake", label: "Most stake", icon: <DollarSign size={18} /> },
    { id: "rtp", label: "Most RTP", icon: <TrendingUp size={18} /> },
    { id: "volatile", label: "Most Volatile", icon: <Bolt size={18} /> }
];

// Winner Item Component - Memoized to prevent unnecessary re-renders
const WinnerItem = React.memo(({ winner }) => {
    return (
        <div className="mb-3">
            <div className="flex gap-2 bg-[#292929] p-2 rounded-lg items-center">
                <div className="ml-1 relative flex-shrink-0">
                    <div className="absolute -left-1.5 top-0 bottom-0 w-1 bg-[#fa5258] rounded-full"></div>
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[#fa5258] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white" />
                    </div>
                    <img src={winner.image} alt="Winner game" className="w-16 h-16 rounded-lg object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-medium truncate mr-2 text-sm">{winner.gameName}</span>
                        <div className="flex gap-1 flex-shrink-0">
                            <button className="rounded-full bg-[#1b1b1b] hover:bg-[#333] transition-colors p-1">
                                <Eye className="w-3 h-3 text-white" />
                            </button>
                            <button className="rounded-full bg-[#1b1b1b] hover:bg-[#333] transition-colors p-1">
                                <Play className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-white text-base font-bold">{winner.amount}</span>
                        <span className="text-[#d9d9d9] text-xs">{winner.platform}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[#d9d9d9] text-xs">{winner.sponsor}</span>
                        <span className="text-[#d9d9d9] text-xs">{winner.timeAgo}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Winners Section Component - Memoized
export const WinnerSection = React.memo(({ winners }) => {
    return (
        <div className="w-full md:w-1/4 bg-[#1b1b1b] rounded-lg p-3 flex flex-col h-[600px]">
            {/* Fixed header - smaller text and padding */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">Winners</h2>
                <div className="flex items-center gap-2">
                    <span className="bg-[#fa5258] text-white px-2 py-0.5 rounded-md font-bold text-sm">Live</span>
                    <div className="w-10 h-5 bg-[#292929] rounded-full flex items-center p-1">
                        <div className="w-4 h-4 rounded-full bg-white ml-auto flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-[#fa5258]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable winner list */}
            <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#292929] scrollbar-track-transparent">
                {winners.map((winner) => (
                    <WinnerItem key={winner.id} winner={winner} />
                ))}
            </div>
        </div>
    );
});

// Memoized PodiumPosition component
const PodiumPosition = React.memo(({ game, rank, heightClass, cardSize, isHovered, onMouseEnter, onMouseLeave }) => {
    const cardDimensions = {
        large: { defaultWidth: 240, expandedWidth: 480, height: 280 },
        medium: { defaultWidth: 220, expandedWidth: 440, height: 240 },
        small: { defaultWidth: 200, expandedWidth: 400, height: 200 }
    };

    const dimensions = cardDimensions[cardSize];

    // Prepare the item object for RankedGameCard
    const cardItem = useMemo(() => ({
        id: game?.id,
        rank: game?.rank || rank,
        gameName: game?.gameName || `Game #${rank}`,
        image: game?.image,
        badgeValue: game?.badgeValue || "",
        tagline: `Ranked #${game?.rank || rank} with value ${game?.badgeValue || ""}`,
    }), [game, rank]);

    return (
        <div className={`flex flex-col items-center ${heightClass}`}>
            <RankedGameCard
                item={cardItem}
                defaultWidth={dimensions.defaultWidth}
                expandedWidth={dimensions.expandedWidth}
                height={dimensions.height}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                forceHover={isHovered}
            />
        </div>
    );
});

// Tab Content Component
// TabContent Component
const TabContent = ({ activeTab, data }) => {
    // console.log("TabContent rendering for activeTab:", activeTab); // For debugging
    const [hoveredPodiumIndex, setHoveredPodiumIndex] = useState(null);

    const handleMouseEnterPodium = useCallback((index) => {
        setHoveredPodiumIndex(index);
    }, []);

    const handleMouseLeavePodium = useCallback(() => {
        setHoveredPodiumIndex(null);
    }, []);

    // podiumHandlers is already well-memoized
    const podiumHandlers = useMemo(() => ({
        0: { onMouseEnter: () => handleMouseEnterPodium(0), onMouseLeave: handleMouseLeavePodium },
        1: { onMouseEnter: () => handleMouseEnterPodium(1), onMouseLeave: handleMouseLeavePodium },
        2: { onMouseEnter: () => handleMouseEnterPodium(2), onMouseLeave: handleMouseLeavePodium }
    }), [handleMouseEnterPodium, handleMouseLeavePodium]);

    // Pre-process bottomGames for stable item props
    const processedBottomGames = useMemo(() => {
        if (!data || !data.bottomGames) return [];
        // Assuming your mapping functions (mapPopularGames etc.) already provide
        // most necessary fields like id, rank, gameName, badgeValue, image.
        // Add any transformations specific to RankedGameCard if needed.
        return data.bottomGames.map(game => ({
            ...game, // Spread existing properties
            id: game.id || game.rank || game.gameName, // Crucial for key and memoization
            title: game.gameName, // RankedGameCard expects 'title'
            // tagline: `Ranked #${game.rank} with ${game.badgeValue}`, // If you want to generate this here
        }));
    }, [data]); // Recompute only when 'data' (which comes from mappedData) changes

    // Memoize the renderItem function for HorizontalCardList
    const renderBottomGameCard = useCallback((processedGameItem) => (
        <RankedGameCard
            item={processedGameItem} // Pass the pre-processed item
            defaultWidth={180}
            expandedWidth={380}
            height={150}
        />
    ), []); // This function itself doesn't depend on TabContent's state/props

    if (!data || !data.featuredGames || data.featuredGames.length < 3) {
        return <div className="text-center py-10 text-gray-500">Not enough data to display podium.</div>;
    }

    const top3Games = data.featuredGames;
    const listTitle = data.listTitle || `More ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Games`;


    return (
        <>
            {/* Podium Section */}
            <div className="mt-6 flex justify-center items-end gap-4 md:gap-8 px-4 relative z-0">
                {[1, 0, 2].map((podiumIndexMapping, visualOrder) => {
                    const gameIndex = podiumIndexMapping; // 0=first, 1=second, 2=third in data
                    const game = top3Games[gameIndex];
                    if (!game) return null; // Handle cases where a game might be missing

                    const cardSize = gameIndex === 0 ? "large" : (gameIndex === 1 ? "medium" : "small");
                    const heightClass = gameIndex === 0 ? "pt-0" : (gameIndex === 1 ? "pt-8" : "pt-12");
                    const zIndexClass = hoveredPodiumIndex === gameIndex ? 'z-30' : (gameIndex === 0 ? 'z-20' : 'z-10');
                    const widthClass = gameIndex === 0 ? "w-1/3" : "w-1/4";


                    return (
                        <div key={game.id || gameIndex} className={`${widthClass} md:w-auto relative transition-all duration-200 ${zIndexClass}`}>
                            <PodiumPosition
                                game={game}
                                rank={game.rank || (gameIndex + 1)} // Use game.rank if available
                                heightClass={heightClass}
                                cardSize={cardSize}
                                isHovered={hoveredPodiumIndex === gameIndex}
                                onMouseEnter={podiumHandlers[gameIndex].onMouseEnter}
                                onMouseLeave={podiumHandlers[gameIndex].onMouseLeave}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Bottom Games List */}
            <HorizontalCardList
                items={processedBottomGames}
                renderItem={renderBottomGameCard}
                gap={12}
                className="mt-8"
                title={listTitle}
            />
        </>
    );
};


const GamingPlatform = () => {
    // State for active tab
    const [activeTab, setActiveTab] = useState("popular");
    // State for glider styles
    const [gliderStyle, setGliderStyle] = useState({
        left: 0,
        width: 0,
        background: "",
        boxShadow: "",
    });

    // Fetch data from APIs
    const {
        popularGames,
        stakeGames,
        rtpGames,
        volatileGames,
        winnerGames,
        isLoading,
        error,
        refetch
    } = useRankingData();

    // Memoize mapped data to prevent unnecessary recalculations
    const mappedData = useMemo(() => ({
        popular: popularGames ? mapPopularGames(popularGames) : [],
        stake: stakeGames ? mapStakeGames(stakeGames) : [],
        rtp: rtpGames ? mapRtpGames(rtpGames) : [],
        volatile: volatileGames ? mapVolatileGames(volatileGames) : []
    }), [popularGames, stakeGames, rtpGames, volatileGames]);

    const mappedWinners = useMemo(() =>
        winnerGames ? mapWinnerData(winnerGames) : []
        , [winnerGames]);

    // Refs for tab buttons
    const tabRefs = {
        popular: useRef(null),
        stake: useRef(null),
        rtp: useRef(null),
        volatile: useRef(null)
    };

    // Update glider position and style when activeTab changes
    useEffect(() => {
        const currentTabRef = tabRefs[activeTab];
        if (currentTabRef && currentTabRef.current) {
            const { offsetLeft, offsetWidth } = currentTabRef.current;
            const currentTab = TABS.find(tab => tab.id === activeTab);

            if (currentTab) {
                setGliderStyle({
                    left: offsetLeft,
                    width: offsetWidth,
                    background: currentTab.color,
                    boxShadow: currentTab.shadow,
                });
            }
        }
    }, [activeTab]);

    return (
        <div className="flex flex-col md:flex-row gap-4 text-white p-4">
            {/* Left Section */}
            <div className="w-full md:w-3/4 flex flex-col md:flex-row gap-4">
                {/* Favorite Casinos Section */}
                <div className="w-full md:w-1/4">
                    <TopWinnersSection />
                </div>

                {/* Game Selection Tabs - IMPROVED STYLING */}
                <div className="w-full md:w-3/4 rounded-lg bg-[#1b1b1b] overflow-hidden shadow-lg border border-[#292929]">
                    {/* Loading indicator - changed to red */}
                    {isLoading && (
                        <div className="absolute top-2 right-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#fa5258] animate-pulse"></div>
                            <span className="text-xs text-[#fa5258]">Updating...</span>
                        </div>
                    )}

                    {/* Improved Tabs */}
                    <div className="relative">
                        {/* Tab buttons with new styling */}
                        <div className="flex">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    ref={tabRefs[tab.id]}
                                    className={`flex-1 px-4 py-4 font-bold transition-all duration-300 border-b-2 ${activeTab === tab.id
                                        ? "text-[#fa5258] border-[#fa5258] bg-[#222]"
                                        : "text-gray-400 border-transparent hover:text-white hover:bg-[#292929]"
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-lg">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Glider - simplified to just use red */}
                        <motion.div
                            className="absolute bottom-0 h-[3px]"
                            style={{
                                background: "linear-gradient(90deg, #e83f5b 0%, #fa5258 100%)",
                                boxShadow: "0px 0px 8px 0px rgba(232, 63, 91, 0.62)",
                            }}
                            initial={false}
                            animate={{
                                left: gliderStyle.left,
                                width: gliderStyle.width
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    </div>

                    {/* Tab content with animation */}
                    <div className="p-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TabContent activeTab={activeTab} data={mappedData[activeTab]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Winners Section */}
            <WinnerSection winners={mappedWinners} />
        </div>
    );
};

export default GamingPlatform;