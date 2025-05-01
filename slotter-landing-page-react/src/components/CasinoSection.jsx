import { Star } from "lucide-react"
// ...other imports

export const FavoriteCasinos = () => {
    const casinos = [
        { id: 1, name: "1000xBet Casino", image: "https://placehold.co/100x50?text=1000xBet", rating: 4.8 },
        { id: 2, name: "Lucky Spin", image: "https://placehold.co/100x50?text=LuckySpin", rating: 4.7 },
        { id: 3, name: "Golden Palace", image: "https://placehold.co/100x50?text=GoldenPalace", rating: 4.6 },
        { id: 4, name: "Star Casino", image: "https://placehold.co/100x50?text=StarCasino", rating: 4.5 },
        { id: 5, name: "Diamond Club", image: "https://placehold.co/100x50?text=DiamondClub", rating: 4.4 },
    ];

    return (
        <div className="bg-[#1b1b1b] rounded-lg p-4 h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Star className="w-5 h-5 text-[#ffb636] mr-2" fill="#ffb636" />
                Top Casinos
            </h2>
            <div className="flex flex-col gap-3">
                {casinos.map((casino) => (
                    <div
                        key={casino.id}
                        className="bg-[#292929] rounded-lg p-3 flex items-center 
                                   hover:bg-[#333] transition-colors 
                                   hover:scale-[1.05] hover:shadow-lg 
                                   transition-transform duration-200 cursor-pointer"
                    >
                        <img src={casino.image} alt={casino.name} className="w-12 h-12 rounded object-cover mr-3" />
                        <div className="flex-1">
                            <div className="font-medium">{casino.name}</div>
                            <div className="text-[#fa5258] text-sm">★ {casino.rating}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
