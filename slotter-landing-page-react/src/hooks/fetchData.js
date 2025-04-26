import { useState, useEffect, useCallback } from 'react';
import { WebClient } from '../services/httpclient';

// Custom hook to fetch and manage game rankings data
export const useRankingData = () => {
    // State for each ranking type
    const [popularGames, setPopularGames] = useState(null);
    const [stakeGames, setStakeGames] = useState(null);
    const [rtpGames, setRtpGames] = useState(null);
    const [volatileGames, setVolatileGames] = useState(null);
    const [winnerGames, setWinnerGames] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    // Fetch data for a specific ranking type
    const fetchRankingData = useCallback(async (endpoint, setter) => {
        try {
            const data = await WebClient.get(endpoint);
            console.log(`Fetched data from ${endpoint}:`, data);

            // Check if data is different before updating state
            setter(prevData => {
                if (JSON.stringify(prevData) !== JSON.stringify(data)) {
                    console.log(`Data changed for ${endpoint}`);
                    return data.data;
                }
                return prevData;
            });

            return data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            setError(`Failed to fetch ${endpoint}`);
            return null;
        }
    }, []);

    // Fetch all data types
    const fetchAllData = useCallback(async () => {
        setIsLoading(true);

        await Promise.all([
            fetchRankingData('/by-total-spins', setPopularGames),
            fetchRankingData('/by-total-bet', setStakeGames),
            fetchRankingData('/by-rtp', setRtpGames),
            fetchRankingData('/by-volatility', setVolatileGames),
            fetchRankingData('/by-max-win', setWinnerGames),
            fetchRankingData('/last-updated', setLastUpdated)

        ]);

        setLastUpdated(new Date());
        setIsLoading(false);
    }, [fetchRankingData]);

    // Initial data fetch and interval setup
    useEffect(() => {
        // Fetch data immediately
        fetchAllData();

        // Set up interval for periodic updates
        const intervalId = setInterval(() => {
            console.log("Refreshing data...");
            fetchAllData();
        }, 60000000); // 60 seconds

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [fetchAllData]);

    return {
        popularGames,
        stakeGames,
        rtpGames,
        volatileGames,
        winnerGames,
        isLoading,
        error,
        lastUpdated,
        refetch: fetchAllData
    };
};