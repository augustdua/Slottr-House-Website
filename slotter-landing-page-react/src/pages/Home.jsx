// src/pages/Home.jsx
import React, { useEffect } from 'react'
import { Card, CardContent } from '../components/Card'
import SelectableButton from '../components/button'
import GamingPlatform from '../components/GaminPlatform';
import Comments from '../components/Comments';
import { WebClient } from '../services/httpclient';
function Home() {
    const date = new Date();
    const API_URL = import.meta.env.VITE_BASE_URL;
    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            // Don't use API_URL here - WebClient already has the base URL configured
            const data = await WebClient.get('/by-total-spins');

            // No need to access .data - your interceptor already returns just the data
            console.log('API Response:', data);

            // Do something with the data
            // setYourState(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Format date as "MMM dd, yyyy"
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
    return (
        <>
            <div className="relative w-full overflow-hidden"
                style={{ height: 'calc(100vh - 100px)' }}>
                {/* 1) Full-width background image */}
                <img
                    src="/frame-84.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                />

                {/* 2) Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* 3) Content flex container (top-left aligned) */}
                <div className="relative flex justify-start items-start p-4 sm:p-6 md:p-10 lg:px-20 lg:py-16">
                    <Card className="w-full max-w-md bg-white/10 border border-white/15 rounded-3xl backdrop-blur-lg">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col items-start gap-2">
                                <h1 className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-snug">
                                    Warcraft 3 Reforged Tokyo Tournament
                                </h1>
                                <h2 className="text-white/70 font-semibold text-lg">Updating</h2>
                                <p className="text-white/70 font-medium text-base">
                                    Gear up for an adrenaline-fueled experience as you step into the world of
                                    high-stakes battles and thrilling challenges. Compete against top players,
                                    explore vast gaming universes, and carve your path to victory.
                                </p>
                                <time className="text-[#c8c8c8b2] font-medium text-sm" dateTime={date.toISOString()}>
                                    {formattedDate}
                                </time>
                            </div>

                            <div className="mt-6 w-full">
                                <SelectableButton
                                    selected
                                    className="w-full h-12 rounded-xl"
                                    onClick={() => { }}
                                >
                                    <span className="font-medium text-white text-base">Explore</span>
                                </SelectableButton>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <GamingPlatform />
            <Comments />

        </>

    )
}

export default React.memo(Home)
