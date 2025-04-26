import { useState, useRef, useEffect } from "react"
import { Eye, Play, Zap } from "lucide-react"
import ExpandableCard from "./expandableCard"
import { useRankingData } from "../hooks/fetchData"
import { mapPopularGames, mapStakeGames, mapRtpGames, mapVolatileGames, mapWinnerData } from "../utils/HelperFunction"

// Data structures to mimic JSON responses
const TABS = [
    { id: "popular", label: "Most popular", color: "linear-gradient(113deg, hsl(260deg 100% 64%) 0%, hsl(190deg 100% 55%) 100%)", shadow: "0px 0px 8px 0px hsl(262deg 100% 70% / 70%)" },
    { id: "stake", label: "Most stake", color: "linear-gradient(90deg, #51a14c 0%, #10c33e 100%)", shadow: "0px 0px 8px 0px rgba(47, 187, 12, 0.62)" },
    { id: "rtp", label: "Most RTP", color: "linear-gradient(90deg, #faffcc 0%, #f5eea3 10%, #ffe48a 40%, #ffb54d 65%, #ff974d 85%, #ff8052 100%)", shadow: "0px 0px 8px 0px rgba(255, 255, 255, 0.62)" },
    { id: "volatile", label: "Most Volatile", color: "linear-gradient(90deg, #e83f5b 0%, #fa5258 100%)", shadow: "0px 0px 8px 0px rgba(232, 63, 91, 0.62)" }
]

// Mock data for each tab
const TAB_DATA = {
    popular: {
        featuredGames: [
            { id: 2, rank: 2, image: "https://placehold.co/300x300", badgeValue: 51, borderStyle: "border-2 border-[#c0c0c0] shadow-md", badgeColor: "bg-white", badgeTextColor: "text-[#ffb636]" },
            { id: 1, rank: 1, image: "https://placehold.co/300x300", badgeValue: 51, borderStyle: "border-4 border-[#ffb636] shadow-lg", badgeColor: "bg-[#ffb636]", badgeTextColor: "text-white" },
            { id: 3, rank: 3, image: "https://placehold.co/300x300", badgeValue: 51, borderStyle: "shadow-sm", badgeColor: "bg-[#00cc00]", badgeTextColor: "text-white" }
        ],
        bottomGames: [
            { id: 4, rank: 4, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 5, rank: 5, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 6, rank: 6, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 7, rank: 7, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 8, rank: 8, image: "https://placehold.co/150x150", badgeValue: 26 }
        ]
    },
    stake: {
        featuredGames: [
            { id: 1, rank: 1, image: "https://placehold.co/300x300", badgeValue: 51, badgeColor: "bg-[#ffb636]", badgeTextColor: "text-white" },
            { id: 2, rank: 2, image: "https://placehold.co/300x300", badgeValue: 51, badgeColor: "bg-white", badgeTextColor: "text-[#ffb636]" },
            { id: 3, rank: 3, image: "https://placehold.co/300x300", badgeValue: 51, badgeColor: "bg-[#00cc00]", badgeTextColor: "text-white" }
        ],
        bottomGames: [
            { id: 4, rank: 4, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 5, rank: 5, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 6, rank: 6, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 7, rank: 7, image: "https://placehold.co/150x150", badgeValue: 26 },
            { id: 8, rank: 8, image: "https://placehold.co/150x150", badgeValue: 26 }
        ]
    },
    rtp: {
        featuredGames: [
            { id: 1, badge: "97%", image: "https://placehold.co/300x300", badgeValue: "RTP", badgeColor: "bg-[#ff8c00]", badgeTextColor: "text-white" },
            { id: 2, badge: "96%", image: "https://placehold.co/300x300", badgeValue: "RTP", badgeColor: "bg-[#ff8c00]", badgeTextColor: "text-white" },
            { id: 3, badge: "95%", image: "https://placehold.co/300x300", badgeValue: "RTP", badgeColor: "bg-[#ff8c00]", badgeTextColor: "text-white" }
        ],
        bottomGames: [
            { id: 4, badge: "94%", image: "https://placehold.co/150x150", badgeValue: "RTP" },
            { id: 5, badge: "93%", image: "https://placehold.co/150x150", badgeValue: "RTP" },
            { id: 6, badge: "92%", image: "https://placehold.co/150x150", badgeValue: "RTP" },
            { id: 7, badge: "91%", image: "https://placehold.co/150x150", badgeValue: "RTP" },
            { id: 8, badge: "90%", image: "https://placehold.co/150x150", badgeValue: "RTP" }
        ]
    },
    volatile: {
        featuredGames: [
            { id: 1, badge: "High", image: "https://placehold.co/300x300", badgeValue: "5x", badgeColor: "bg-[#e83f5b]", badgeTextColor: "text-white" },
            { id: 2, badge: "V.High", image: "https://placehold.co/300x300", badgeValue: "10x", badgeColor: "bg-[#e83f5b]", badgeTextColor: "text-white", badgeSize: "text-xs" },
            { id: 3, badge: "Extreme", image: "https://placehold.co/300x300", badgeValue: "15x", badgeColor: "bg-[#e83f5b]", badgeTextColor: "text-white", badgeSize: "text-xs" }
        ],
        bottomGames: [
            { id: 4, badge: "Med", image: "https://placehold.co/150x150", badgeValue: "2x" },
            { id: 5, badge: "Med+", image: "https://placehold.co/150x150", badgeValue: "4x" },
            { id: 6, badge: "High", image: "https://placehold.co/150x150", badgeValue: "6x" },
            { id: 7, badge: "High+", image: "https://placehold.co/150x150", badgeValue: "8x" },
            { id: 8, badge: "Max", image: "https://placehold.co/150x150", badgeValue: "10x" }
        ]
    }
}

// Winners mock data
const WINNERS_DATA = [
    {
        id: 1,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 2,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 3,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 4,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },

    {
        id: 112,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 22,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 23,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    },
    {
        id: 24,
        gameName: "Outsourced:payday",
        amount: "€151.49",
        platform: "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "38 minutes ago",
        image: "https://placehold.co/80x80"
    }

]

const GamesHorizontalList = ({ games }) => {
    const scrollContainerRef = useRef(null)
    return (
        <div className="w-full mt-6 max-w-7xl mx-auto">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollBehavior: "smooth" }}
            >
                {games.map((game) => (
                    <div key={game.id} className="snap-start">
                        <ExpandableCard
                            title={`Game ${game.rank || game.badge}`}
                            image={game.image}
                            color="bg-[#292929]"
                            scrollContainer={scrollContainerRef}
                            badgeText={game.badge || game.rank}
                            badgeValue={game.badgeValue}
                            defaultWidth={150}
                            expandedWidth={250}
                            height={150}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
// Winner Item Component
const WinnerItem = ({ winner }) => {
    return (
        <div className="mb-6">
            <div className="flex gap-4 bg-[#292929] p-3 rounded-lg items-center">
                <div className=" ml-1 relative flex-shrink-0">
                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#fa5258] rounded-full"></div>
                    <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 bg-[#fa5258] rounded-full w-4 h-4 flex items-center justify-center">
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

// Winners Section Component
export const WinnerSection = ({ winners }) => {
    return (
        <div className="w-full md:w-1/3 bg-[#1b1b1b] rounded-lg p-4 flex flex-col h-[680px]">
            {/* Fixed header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Winners</h2>
                <div className="flex items-center gap-4">
                    <span className="bg-[#fa5258] text-white px-3 py-1 rounded-md font-bold">Live</span>
                    <div className="w-12 h-6 bg-[#292929] rounded-full flex items-center p-1">
                        <div className="w-5 h-5 rounded-full bg-white ml-auto flex items-center justify-center">
                            <Zap className="w-3 h-3 text-[#fa5258]" />
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

    if (!data) return null;
    // Extract the top three games
    const top3Games = data.featuredGames || [];


    return (
        <>
            {/* Podium-style Top 3 Games */}
            <div className="mt-4 flex items-end justify-center gap-10">
                {/* Second Place - Medium Height */}
                <div className="order-1 relative">
                    <GameCard
                        image={top3Games[1]?.image || "https://placehold.co/300x300"}
                        rank={top3Games[1]?.rank || 2}
                        badge={top3Games[1]?.badge}
                        badgeValue={top3Games[1]?.badgeValue || ""}
                        badgeColor={top3Games[1]?.badgeColor || "bg-white"}
                        badgeTextColor={top3Games[1]?.badgeTextColor || "text-[#ffb636]"}
                        borderStyle="border-2 border-[#c0c0c0] shadow-md"
                        cardSize="medium"
                    />
                    <div className="bg-[#c0c0c0] h-6 w-full rounded-b-lg flex items-center justify-center text-white font-bold">
                        2nd
                    </div>
                </div>

                {/* First Place - Tallest */}
                <div className="order-2 relative z-10">
                    <GameCard
                        image={top3Games[0]?.image || "https://placehold.co/300x300"}
                        rank={top3Games[0]?.rank || 1}
                        badge={top3Games[0]?.badge}
                        badgeValue={top3Games[0]?.badgeValue || ""}
                        badgeColor={top3Games[0]?.badgeColor || "bg-[#ffb636]"}
                        badgeTextColor={top3Games[0]?.badgeTextColor || "text-white"}
                        borderStyle="border-4 border-[#ffb636] shadow-lg"
                        cardSize="large"
                    />
                    <div className="bg-[#ffb636] h-10 w-full rounded-b-lg flex items-center justify-center text-white font-bold">
                        1st
                    </div>
                </div>

                {/* Third Place - Shortest */}
                <div className="order-3 relative">
                    <GameCard
                        image={top3Games[2]?.image || "https://placehold.co/300x300"}
                        rank={top3Games[2]?.rank || 3}
                        badge={top3Games[2]?.badge}
                        badgeValue={top3Games[2]?.badgeValue || ""}
                        badgeColor={top3Games[2]?.badgeColor || "bg-[#00cc00]"}
                        badgeTextColor={top3Games[2]?.badgeTextColor || "text-white"}
                        borderStyle="shadow-sm"
                        cardSize="small"
                    />
                    <div className="bg-[#00cc00] h-4 w-full rounded-b-lg flex items-center justify-center text-white text-sm font-bold">
                        3rd
                    </div>
                </div>
            </div>

            {/* Bottom Games Grid */}
            <GamesHorizontalList games={data.bottomGames || []} />
        </>
    );
};

const GameCard = ({
    image,
    badgeValue,
    badge,
    rank,
    badgeColor = "bg-[#292929]",
    badgeTextColor = "text-white",
    badgeSize = "",
    borderStyle = "",
    cardSize = "medium"
}) => {
    const badgeText = badge || rank;

    // Define size-specific styles with fixed heights and widths
    const sizeStyles = {
        large: "h-[350px] w-[300px]",
        medium: "h-[295px] w-[280px]",
        small: "h-[250px] w-[260px]"
    };

    const badgeSizeStyles = {
        large: "w-14 h-14",
        medium: "w-12 h-12",
        small: "w-10 h-10"
    };

    return (
        <div className={`relative rounded-t-lg overflow-hidden ${borderStyle} ${sizeStyles[cardSize]}`}>
            <div className="h-full w-full">
                <img
                    src={image}
                    alt="Game thumbnail"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute top-4 left-4 bg-white rounded-full p-1">
                <div className={`${badgeColor} rounded-full ${badgeSizeStyles[cardSize]} flex items-center justify-center`}>
                    <span className={`${badgeTextColor} font-bold ${badgeSize}`}>{badgeText}</span>
                </div>
            </div>
            <div className="absolute top-4 right-4 bg-[#fa5258] text-white rounded-md px-2 py-1 font-bold">
                {badgeValue}
            </div>
        </div>
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
        lastUpdated,
        refetch
    } = useRankingData();

    const mappedData = {
        popular: popularGames ? mapPopularGames(popularGames) : TAB_DATA.popular,
        stake: stakeGames ? mapStakeGames(stakeGames) : TAB_DATA.stake,
        rtp: rtpGames ? mapRtpGames(rtpGames) : TAB_DATA.rtp,
        volatile: volatileGames ? mapVolatileGames(volatileGames) : TAB_DATA.volatile
    };
    const mappedWinners = winnerGames ? mapWinnerData(winnerGames) : WINNERS_DATA;
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
            {/* Left Section - Game Selection */}
            <div className="w-full md:w-2/3 rounded-lg bg-[#1b1b1b] overflow-hidden">
                {/* Tabs */}
                <div className="relative flex border-b border-[#292929]">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            ref={tabRefs[tab.id]}
                            className={`flex-1 px-4 py-3 font-bold text-lg md:text-2xl ${activeTab === tab.id ? "text-[#fa5258]" : "text-white"}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Glider */}
                    <div
                        className="absolute bottom-0 h-[4px]"
                        style={{
                            left: `${gliderStyle.left}px`,
                            width: `${gliderStyle.width}px`,
                            background: gliderStyle.background,
                            boxShadow: gliderStyle.boxShadow,
                            transition: "all 0.3s",
                        }}
                    />
                </div>

                {/* Content based on active tab */}
                <TabContent activeTab={activeTab} data={mappedData[activeTab]} />
            </div>

            {/* Winners Section */}
            <WinnerSection winners={mappedWinners} />
        </div>
    );
};

export default GamingPlatform;