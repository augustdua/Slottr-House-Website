import { useState, useRef, useEffect } from "react"
import { Eye, Play, Zap, Flame, DollarSign, TrendingUp, Bolt } from "lucide-react"
import ExpandableCard from "./expandableCard"
import { FavoriteCasinos } from "./CasinoSection"
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

// Winner Item Component
const WinnerItem = ({ winner }) => {
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
};
// Winners Section Component
export const WinnerSection = ({ winners }) => {
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
};

// Tab Content Component
const TabContent = ({ activeTab, data }) => {
    console.log("data for Tab content", data);

    if (!data || !data.featuredGames || data.featuredGames.length < 3) {
        // Handle cases with insufficient data (optional: show a message or different layout)
        return <div className="text-center py-10 text-gray-500">Not enough data to display podium.</div>;
    }

    const top3Games = data.featuredGames;

    // Define size mappings for ExpandableCard based on podium rank/cardSize
    const cardDimensions = {
        large: { defaultWidth: 240, expandedWidth: 480, height: 280 },
        medium: { defaultWidth: 220, expandedWidth: 440, height: 240 },
        small: { defaultWidth: 200, expandedWidth: 400, height: 200 }
    };
    // Helper function to render a podium position
    const PodiumPosition = ({ game, rank, bgColor, heightClass, cardSize }) => {
        const dimensions = cardDimensions[cardSize];

        // Prepare the item object for RankedGameCard
        const cardItem = {
            id: game?.id,
            rank: game?.rank || rank,
            gameName: game?.gameName || `Game #${rank}`,
            image: game?.image,
            badgeValue: game?.badgeValue || "",
            // Add any other properties RankedGameCard might use (e.g., tagline, releaseDate)
            tagline: `Ranked #${game?.rank || rank} with value ${game?.badgeValue || ""}`,
            // releaseDate: game?.releaseDate // Example if you have it
        };

        return (
            // The heightClass (pt-*) still controls the vertical alignment of the base
            <div className={`flex flex-col items-center ${heightClass}`}>
                <RankedGameCard
                    item={cardItem} // Pass the prepared item object
                    defaultWidth={dimensions.defaultWidth}
                    expandedWidth={dimensions.expandedWidth}
                    height={dimensions.height}
                />
                {/* Integrated Base */}
            </div>
        );
    };

    return (
        <>
            {/* Podium Section - Using Flexbox for alignment */}
            {/* Add relative positioning and z-index to the main podium container */}
            <div className="mt-6 flex justify-center items-end gap-4 md:gap-8 px-4 relative z-0">
                {/* Second Place */}
                {/* Add relative positioning to allow z-index to work */}
                <div className="w-1/4 md:w-auto relative z-0">
                    <PodiumPosition
                        game={top3Games[1]}
                        rank={2}
                        bgColor="bg-[#c0c0c0]" // Silver
                        heightClass="pt-8"
                        cardSize="medium"
                    />
                </div>

                {/* First Place */}
                {/* Ensure the first place wrapper allows the expanded card to overlap */}
                <div className="w-1/3 md:w-auto relative z-10"> {/* Higher z-index */}
                    <PodiumPosition
                        game={top3Games[0]}
                        rank={1}
                        bgColor="bg-[#ffb636]" // Gold
                        heightClass="pt-0"
                        cardSize="large"
                    />
                </div>

                {/* Third Place */}
                {/* Add relative positioning */}
                <div className="w-1/4 md:w-auto relative z-0">
                    <PodiumPosition
                        game={top3Games[2]}
                        rank={3}
                        bgColor="bg-[#cd7f32]" // Bronze
                        heightClass="pt-12"
                        cardSize="small"
                    />
                </div>
            </div>

            {/* Bottom Games List - Also using RankedGameCard */}
            <HorizontalCardList
                items={data.bottomGames || []}
                renderItem={(item) => (
                    <RankedGameCard
                        item={{
                            ...item,
                            title: item.gameName, // Ensure title is passed if needed by RankedGameCard internally
                            tagline: `Ranked #${item.rank} with ${item.badgeValue}`,
                        }}
                        defaultWidth={180}
                        expandedWidth={380}
                        height={150}
                    />
                )}
                gap={12}
                className="mt-8"
                title="More Popular Games"
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

    const mappedData = {
        popular: popularGames ? mapPopularGames(popularGames) : [],
        stake: stakeGames ? mapStakeGames(stakeGames) : [],
        rtp: rtpGames ? mapRtpGames(rtpGames) : [],
        volatile: volatileGames ? mapVolatileGames(volatileGames) : []
    };
    const mappedWinners = winnerGames ? mapWinnerData(winnerGames) : [];
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
                    <FavoriteCasinos />
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
                            className="absolute bottom-0 h-[3px]" // Remove the old background color class
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