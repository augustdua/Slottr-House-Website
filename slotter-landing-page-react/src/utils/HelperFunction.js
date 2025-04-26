// Create a default placeholder image URL based on game name
const getGameImage = (game) => {
    return game.game_image || `https://placehold.co/300x300/222/fff?text=${encodeURIComponent(game.game_name.substring(0, 10))}`;
};

// Common mapper function for all game types
const mapGames = (games, valueKey, badgeFormatter) => {
    if (!games || games.length === 0) return { featuredGames: [], bottomGames: [] };

    // Sort games by the specified key in descending order
    const sortedGames = [...games].sort((a, b) => b[valueKey] - a[valueKey]);

    // Map the top 3 games as featured games
    const featuredGames = sortedGames.slice(0, 3).map((game, index) => ({
        id: game.game_id,
        rank: index + 1,
        image: getGameImage(game),
        badgeValue: badgeFormatter ? badgeFormatter(game[valueKey]) : game[valueKey],
        borderStyle: index === 0 ? "border-4 border-[#ffb636] shadow-lg" :
            index === 1 ? "border-2 border-[#c0c0c0] shadow-md" : "shadow-sm",
        badgeColor: index === 0 ? "bg-[#ffb636]" :
            index === 1 ? "bg-white" : "bg-[#00cc00]",
        badgeTextColor: index === 1 ? "text-[#ffb636]" : "text-white"
    }));

    // Map the next 5 games as bottom games
    const bottomGames = sortedGames.slice(3, 8).map((game, index) => ({
        id: game.game_id,
        rank: index + 4,
        image: getGameImage(game),
        badgeValue: badgeFormatter ? badgeFormatter(game[valueKey]) : game[valueKey]
    }));

    return { featuredGames, bottomGames };
};

// Mappers for each tab
export const mapPopularGames = (games) => {
    return mapGames(games, 'total_normal_spins', (val) => Math.round(val));
};

export const mapStakeGames = (games) => {
    return mapGames(games, 'total_normal_bet', (val) => `$${Math.round(val)}`);
};

export const mapRtpGames = (games) => {
    return {
        ...mapGames(games, 'rtp', (val) => `${val.toFixed(1)}%`),
        featuredGames: mapGames(games, 'rtp').featuredGames.map(game => ({
            ...game,
            badge: `${parseFloat(game.badgeValue).toFixed(1)}%`,
            badgeValue: "RTP",
            badgeColor: "bg-[#ff8c00]"
        })),
        bottomGames: mapGames(games, 'rtp').bottomGames.map(game => ({
            ...game,
            badge: `${parseFloat(game.badgeValue).toFixed(1)}%`,
            badgeValue: "RTP"
        }))
    };
};

export const mapVolatileGames = (games) => {
    // Function to convert volatility number to descriptive label
    const getVolatilityLabel = (val) => {
        if (val >= 9) return "Extreme";
        if (val >= 7) return "V.High";
        if (val >= 5) return "High";
        if (val >= 3) return "Med+";
        return "Med";
    };

    // Function to convert volatility to multiplier display
    const getVolatilityMultiplier = (val) => {
        return `${Math.round(val)}x`;
    };

    return {
        ...mapGames(games, 'volatility'),
        featuredGames: mapGames(games, 'volatility').featuredGames.map(game => ({
            ...game,
            badge: getVolatilityLabel(game.badgeValue),
            badgeValue: getVolatilityMultiplier(game.badgeValue),
            badgeColor: "bg-[#e83f5b]",
            badgeSize: parseFloat(game.badgeValue) >= 7 ? "text-xs" : ""
        })),
        bottomGames: mapGames(games, 'volatility').bottomGames.map(game => ({
            ...game,
            badge: getVolatilityLabel(game.badgeValue),
            badgeValue: getVolatilityMultiplier(game.badgeValue)
        }))
    };
};

// Map winner data from max win values
export const mapWinnerData = (games) => {
    // Sort by max win
    const sortedGames = [...games]
        .sort((a, b) => b.max_win - a.max_win)
        .filter(game => game.max_win > 0)
        .slice(0, 8);

    return sortedGames.map((game, index) => ({
        id: game.game_id || index,
        gameName: game.game_name || "Unknown Game",
        amount: `€${game.max_win.toFixed(2)}`,
        platform: game.provider || "1000xbet",
        sponsor: "Bonus by",
        timeAgo: "Just now",
        image: getGameImage(game)
    }));
};