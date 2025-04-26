import { useState, useRef, useEffect } from "react"
import { Eye, Play, Zap } from "lucide-react"
import { Star, Rss } from 'lucide-react'; // Using Lucide React for the star icon

const GameFilterButtons = () => {
    const [selected, setSelected] = useState('Live'); // Default to "Live" selected

    const handleSelect = (button) => {
        setSelected(button);
    };

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={() => handleSelect('Live')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${selected === 'Live'
                    ? 'bg-[#fa5258] text-white'
                    : 'bg-#242424 text-[#fa5258]'
                    }`}
            >
                <Rss className="w-4 h-4" />
                <span>New</span>
            </button>
            <button
                onClick={() => handleSelect('Hot')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${selected === 'Hot'
                    ? 'bg-[#fa5258] text-white'
                    : 'bg-#242424 text-[#fa5258]'
                    }`}
            >
                <Zap className="w-4 h-4" />
                <span>Hot</span>
            </button>
        </div>
    );
};

// Data structures to mimic JSON responses
const TABS = [
    { id: "popular", label: "Most popular", color: "linear-gradient(113deg, hsl(260deg 100% 64%) 0%, hsl(190deg 100% 55%) 100%)", shadow: "0px 0px 8px 0px hsl(262deg 100% 70% / 70%)" },
    { id: "stake", label: "Most stake", color: "linear-gradient(90deg, #51a14c 0%, #10c33e 100%)", shadow: "0px 0px 8px 0px rgba(47, 187, 12, 0.62)" },
    { id: "rtp", label: "Most RTP", color: "linear-gradient(90deg, #faffcc 0%, #f5eea3 10%, #ffe48a 40%, #ffb54d 65%, #ff974d 85%, #ff8052 100%)", shadow: "0px 0px 8px 0px rgba(255, 255, 255, 0.62)" },
    { id: "volatile", label: "Most Volatile", color: "linear-gradient(90deg, #e83f5b 0%, #fa5258 100%)", shadow: "0px 0px 8px 0px rgba(232, 63, 91, 0.62)" }
]

const bottomGames = [
    { id: 4, rank: 4, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 5, rank: 5, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 6, rank: 6, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 7, rank: 7, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 8, rank: 8, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 4, rank: 4, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 5, rank: 5, image: "https://placehold.co/150x150", badgeValue: 26 },
    { id: 6, rank: 6, image: "https://placehold.co/150x150", badgeValue: 26 },

]
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


]

// Reusable Small Game Card Component
const SmallGameCard = ({ image, badge, rank, badgeValue }) => {
    const badgeText = badge || rank;
    return (
        <div className="relative rounded-lg overflow-hidden">
            <img src={image} alt={`Game thumbnail ${badgeText}`} className="w-full h-auto" />
            <div className="absolute top-4 left-4 bg-[#292929] rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{badgeText}</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-[#fa5258] text-white rounded-md px-2 py-1 font-bold text-sm">
                {badgeValue}
            </div>
        </div>
    );
};

// Winner Item Component
const WinnerItem = ({ winner }) => {
    return (
        <div className="mb-6">
            <div className="flex gap-4 bg-[#292929] p-3 rounded-lg items-center">
                <div className="relative flex-shrink-0">
                    {/* <div className="absolute -left-2 top-0 bottom-0 w-1 bg-[#fa5258] rounded-full"></div>
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#fa5258] rounded-full w-6 h-6 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                    </div> */}
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
const CommentSection = ({ winners }) => {
    return (
        <div className="w-full md:w-1/3 bg-[#1B1B1B] rounded-lg p-4 flex flex-col h-[500px]">
            {/* Fixed header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold">Comments</h2>
                    <p className="mt-1">Games and News</p>
                </div>
                <GameFilterButtons />
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

const Comments = () => {

    return (
        <div className="flex flex-col md:flex-row gap-4 text-white p-4">
            {/* Left Section - Game Selection */}
            <div className="w-full md:w-2/3 rounded-lg bg-[#1B1B1B] overflow-hidden p-4">
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-3xl font-bold">Highlights</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {bottomGames.map(game => (
                        <SmallGameCard
                            key={game.id}
                            image={game.image}
                            rank={game.rank}
                            badge={game.badge}
                            badgeValue={game.badgeValue}
                        />
                    ))}
                </div>

            </div>

            {/* Winners Section */}
            <CommentSection winners={WINNERS_DATA} />
        </div>
    );
};

export default Comments;