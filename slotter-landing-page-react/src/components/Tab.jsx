import e from 'express';
import React, { useState, useEffect } from 'react';

const Tab = ({ title, apiEndpoint, children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Replace with your actual API endpoint
                const response = await fetch(apiEndpoint || 'https://api.example.com/data');
                if (!response.ok) throw new Error('Failed to fetch data');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiEndpoint]); // Fetch data when the endpoint changes or tab mounts

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-400">Error: {error}</div>;

    // Pass data to children if it's a function, otherwise render static content
    return (
        <div>
            {typeof children === 'function' ? children(data) : children}
        </div>
    );
};

export default Tab;