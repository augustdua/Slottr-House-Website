import { useState, useEffect, useCallback, useRef } from 'react';
import { WebClient } from '../services/httpclient';

export const useRankingData = () => {
    const [popularGames, setPopularGames] = useState(null);
    const [stakeGames, setStakeGames] = useState(null);
    const [rtpGames, setRtpGames] = useState(null);
    const [volatileGames, setVolatileGames] = useState(null);
    const [winnerGames, setWinnerGames] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Add a ref to track if we're already fetching
    const isFetchingRef = useRef(false);

    const fetchRankingData = useCallback(async (endpoint, setter) => {
        try {
            const data = await WebClient.get(endpoint);
            console.log(`Fetched data from ${endpoint}:`, data);

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

    const fetchAllData = useCallback(async () => {
        // Prevent multiple simultaneous fetches
        if (isFetchingRef.current) {
            console.log("Already fetching data, skipping...");
            return;
        }

        isFetchingRef.current = true;
        setIsLoading(true);

        try {
            await Promise.all([
                fetchRankingData('/by-total-spins', setPopularGames),
                fetchRankingData('/by-total-bet', setStakeGames),
                fetchRankingData('/by-rtp', setRtpGames),
                fetchRankingData('/by-volatility', setVolatileGames),
                fetchRankingData('/by-max-win', setWinnerGames),
                fetchRankingData('/last-updated', setLastUpdated)
            ]);

            setLastUpdated(new Date());
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [fetchRankingData]);

    useEffect(() => {
        // Prevent double execution in StrictMode
        let mounted = true;

        const initialFetch = async () => {
            if (mounted) {
                await fetchAllData();
            }
        };

        initialFetch();

        // Set up interval for periodic updates
        const intervalId = setInterval(() => {
            if (mounted) {
                console.log("Refreshing data...");
                fetchAllData();
            }
        }, 60000000); // 60 seconds

        // Cleanup function
        return () => {
            mounted = false;
            clearInterval(intervalId);
            isFetchingRef.current = false;
        };
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