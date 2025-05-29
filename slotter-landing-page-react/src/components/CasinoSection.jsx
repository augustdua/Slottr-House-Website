import { Trophy, Zap } from "lucide-react" // Changed Star to Trophy, added Zap for multiplier

export const TopWinnersSection = () => { // Renamed component
    const winners = [ // Renamed data array
        { id: 1, name: "PlayerX123", game: "Crazy Time", image: "https://placehold.co/40x40/777/fff?text=PX", multiplier: "1500x" },
        { id: 2, name: "LuckyLucy", game: "Mega Ball", image: "https://placehold.co/40x40/888/fff?text=LL", multiplier: "850x" },
        { id: 3, name: "BigWinBob", game: "Monopoly Live", image: "https://placehold.co/40x40/999/fff?text=BB", multiplier: "700x" },
        { id: 4, name: "SpinnerPro", game: "Lightning Roulette", image: "https://placehold.co/40x40/aaa/fff?text=SP", multiplier: "500x" },
        { id: 5, name: "JackpotJen", game: "Sweet Bonanza", image: "https://placehold.co/40x40/bbb/fff?text=JJ", multiplier: "450x" },
        { id: 6, name: "GamerAce", game: "Dream Catcher", image: "https://placehold.co/40x40/ccc/fff?text=GA", multiplier: "400x" }, // Added 6th winner

    ];

    return (
        <div className="bg-[#1b1b1b] rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-xl  font-bold mb-4 flex items-center flex-shrink-0">
                <Trophy className="w-5 h-5 text-[#ffb636] mr-2" fill="#ffb636" /> {/* Changed icon */}
                Top Winners
            </h2>
            {/* Increased gap to gap-4 or gap-5 to utilize more vertical space */}
            <div className="flex flex-col gap-4 flex-grow overflow-y-auto"> {/* Adjusted gap from gap-3 to gap-4 */}
                {winners.map((winner) => (
                    <div
                        key={winner.id}
                        className="bg-[#292929] rounded-lg p-3 flex items-center w-full
                                   hover:bg-[#333]
                                   hover:scale-[1.02]
                                   hover:shadow-lg
                                   transition-all duration-200 cursor-pointer"
                    >
                        <img src={winner.image} alt={winner.name} className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0" /> {/* Adjusted image size and shape */}
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate text-sm">{winner.name}</div> {/* Smaller name text */}
                            <div className="text-xs text-gray-400 truncate">{winner.game}</div> {/* Added game name */}
                        </div>
                        <div className="ml-2 flex items-center text-[#fa5258] font-semibold text-sm flex-shrink-0"> {/* Multiplier display */}
                            <Zap size={14} className="mr-1 text-[#fa5258]" /> {/* Zap icon for multiplier */}
                            {winner.multiplier}
                        </div>
                    </div>
                ))}
            </div>
            {/* Optional: Add a small footer or link if space still allows and it's relevant */}
            {/* <div className="mt-auto pt-3 text-center flex-shrink-0">
                <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    View All Winners
                </a>
            </div> */}
        </div>
    );
};