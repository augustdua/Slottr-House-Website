document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const API_BASE_URL = 'https://slottr-out-db-server.onrender.com/api/games/rankings';
    const UPDATE_INTERVAL_MS = 60 * 1000; // 60 seconds
    const PLACEHOLDER_IMAGE = 'placeholder.png'; // Path to your placeholder image
    const TOP_SPINS_LIMIT = 100; // How many top spins to fetch

    // --- DOM Elements ---
    const rankingListEl = document.getElementById('ranking-list');
    const categoryButtonsContainer = document.getElementById('ranking-categories');
    const loadingIndicatorEl = document.getElementById('loading-indicator');
    const errorMessageEl = document.getElementById('error-message');
    const currentRankingTitleEl = document.getElementById('current-ranking-title');
    const lastUpdatedSpanEl = document.getElementById('last-updated');
    // Removed timeframe span element reference

    // --- STATE ---
    let currentRankingType = 'by-total-spins'; // Default ranking type
    let updateIntervalId = null;

    // --- Helper Functions ---

    function formatNumber(num) {
        // Handle potential Decimal(string) values from Sequelize
        const number = parseFloat(num);
        if (num === null || num === undefined || isNaN(number)) return 'N/A';
        return Math.round(number).toLocaleString();
    }

    function formatCurrency(num) {
         const number = parseFloat(num);
         if (num === null || num === undefined || isNaN(number)) return 'N/A';
         return '$' + number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatPercentage(num) {
        const number = parseFloat(num);
        if (num === null || num === undefined || isNaN(number)) return 'N/A';
        return `${number.toFixed(2)}%`; // Assumes number is already percentage value (e.g., 96.5)
    }

     function formatVolatility(num) {
        const number = parseFloat(num);
        if (num === null || num === undefined || isNaN(number)) return 'N/A';
        return number.toFixed(4);
    }

    function formatTimestamp(dateString) {
        if (!dateString) return 'N/A';
        try {
             const date = new Date(dateString);
             return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
        } catch (e) {
             return 'Invalid Date';
        }
    }


    // Gets the primary metric string for display
    function getMetricDisplay(rankingType, item) {
        switch (rankingType) {
            // These read directly from GameStatsAllTime columns
            case 'by-total-spins':
                return `Spins: ${formatNumber(item.total_normal_spins)}`; // Use actual column name
            case 'by-total-bet':
                return `Staked: ${formatCurrency(item.total_normal_bet)}`; // Use actual column name
            case 'by-rtp':
                return `RTP: ${formatPercentage(item.rtp)}`; // Use 'rtp' column (total_normal_rtp)
            case 'by-volatility':
                 return `Volatility: ${formatVolatility(item.volatility)}`; // Use 'volatility' column
            case 'by-max-win':
                return `Max Win: ${formatCurrency(item.max_win)}`; // Use 'max_win' column
            // This reads from SpinModel data
            case 'top-winning-spins':
                return `Win: ${formatCurrency(item.win_amount)}`;
            default:
                return '';
        }
    }

     // Gets secondary details based on ranking type
     function getDetailDisplay(rankingType, item) {
        switch (rankingType) {
            case 'by-rtp': // Example: Show spins context for RTP
                 return `(${formatNumber(item.total_normal_spins)} spins)`;
            case 'by-volatility': // Example: Show spins context for Volatility
                 return `(${formatNumber(item.total_normal_spins)} spins)`;
            case 'top-winning-spins': // Show the time of the winning spin
                return `Time: ${formatTimestamp(item.spin_timestamp)}`;
            // For general game rankings, show the last update time from the row
            case 'by-total-spins':
            case 'by-total-bet':
            case 'by-max-win':
                return `Updated: ${formatTimestamp(item.last_updated)}`; // Use 'last_updated' field from formatted data
            default:
                return '';
        }
    }

    function updateLastUpdatedTime() {
        lastUpdatedSpanEl.textContent = new Date().toLocaleTimeString();
    }

    // --- Core Functions ---

    function renderRankings(items, rankingType) {
        rankingListEl.innerHTML = '';
        errorMessageEl.style.display = 'none';
    
        if (!items || items.length === 0) {
            rankingListEl.innerHTML = '<li>No data available for this ranking.</li>';
            return;
        }
    
        items.forEach((item, index) => {
            const listItem = document.createElement('li');
    
            const rankPosition = document.createElement('span');
            rankPosition.className = 'rank-position';
            rankPosition.textContent = `${index + 1}.`;
    
            const gameImage = document.createElement('img');
            gameImage.className = 'game-image';
            gameImage.src = item.game_image || PLACEHOLDER_IMAGE;
            gameImage.alt = item.game_name;
            gameImage.onerror = () => { gameImage.src = PLACEHOLDER_IMAGE; };
    
            const gameInfo = document.createElement('div');
            gameInfo.className = 'game-info';
    
            const gameDetailsDiv = document.createElement('div');
            gameDetailsDiv.className = 'game-details';
    
            const gameName = document.createElement('span');
            gameName.className = 'game-name';
            gameName.textContent = item.game_name || 'Unknown Game';
            gameDetailsDiv.appendChild(gameName);
    
            // Display secondary details (like timestamp or last updated)
            const detailText = getDetailDisplay(rankingType, item);
            if (detailText) {
                const detailSpan = document.createElement('span');
                detailSpan.className = 'spin-detail'; // Existing class for timestamp/update time
                detailSpan.textContent = detailText;
                gameDetailsDiv.appendChild(detailSpan);
            }
    
            // *** NEW: Add User ID specifically for top winning spins ***
            if (rankingType === 'top-winning-spins' && item.user_id) {
                const userIdSpan = document.createElement('span');
                userIdSpan.className = 'spin-detail'; // Use same style as timestamp, or create a new class
                // Displaying part of the user ID might be better if it's long (like a UUID)
                let displayUserId = item.user_id;
                if (typeof displayUserId === 'string' && displayUserId.length > 15) { // Example: truncate long UUIDs
                     displayUserId = displayUserId.substring(0, 8) + '...';
                }
                userIdSpan.textContent = `User: ${displayUserId}`;
                gameDetailsDiv.appendChild(userIdSpan); // Add it below name/timestamp
            }
            // *** END NEW ***
    
            const gameMetric = document.createElement('span');
            gameMetric.className = 'game-metric';
            gameMetric.textContent = getMetricDisplay(rankingType, item);
    
            gameInfo.appendChild(gameDetailsDiv);
            gameInfo.appendChild(gameMetric);
    
            listItem.appendChild(rankPosition);
            listItem.appendChild(gameImage);
            listItem.appendChild(gameInfo);
    
            rankingListEl.appendChild(listItem);
        });
    }

    async function fetchAndDisplayRankings(rankingType) {
        loadingIndicatorEl.style.display = 'block';
        errorMessageEl.style.display = 'none';
        rankingListEl.innerHTML = '';

        // Construct URL - No timeframe needed for game rankings. Add limit for top spins.
        let apiUrl = `${API_BASE_URL}/${rankingType}`;
        if (rankingType === 'top-winning-spins') {
           apiUrl += `?limit=${TOP_SPINS_LIMIT}`;
        }

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                let errorData = { message: `HTTP error! Status: ${response.status}` };
                try { errorData = await response.json(); } catch (e) { /* ignore */ }
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json(); // Expect { data: [...] }

            if (!result || !Array.isArray(result.data)) {
                 throw new Error("Invalid data format received from API.");
            }

            renderRankings(result.data, rankingType);
            updateLastUpdatedTime();

        } catch (error) {
            console.error(`Error fetching rankings for ${rankingType}:`, error);
            errorMessageEl.textContent = `Failed to load rankings: ${error.message}`;
            errorMessageEl.style.display = 'block';
            rankingListEl.innerHTML = '';
        } finally {
            loadingIndicatorEl.style.display = 'none';
        }
    }

    function setActiveButton(selectedButton) {
        categoryButtonsContainer.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        selectedButton.classList.add('active');
        currentRankingTitleEl.textContent = selectedButton.textContent;
    }

    function startAutoUpdate() {
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
        }
        console.log(`Setting auto-update for ${currentRankingType} every ${UPDATE_INTERVAL_MS}ms`);
        updateIntervalId = setInterval(() => {
            console.log(`Auto-updating ranking: ${currentRankingType}`);
            fetchAndDisplayRankings(currentRankingType); // Fetch data for the current type
        }, UPDATE_INTERVAL_MS);
    }

    // --- Event Listeners ---

    categoryButtonsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const rankingType = event.target.getAttribute('data-ranking');
            if (rankingType && rankingType !== currentRankingType) {
                currentRankingType = rankingType;
                setActiveButton(event.target);
                fetchAndDisplayRankings(currentRankingType); // Fetch immediately on click
                startAutoUpdate(); // Restart interval for the new category
            }
        }
    });

    // --- Initial Load ---
    const initialButton = categoryButtonsContainer.querySelector(`button[data-ranking="${currentRankingType}"]`);
    if(initialButton){ setActiveButton(initialButton); }
    else { /* Handle fallback if needed */ }

    fetchAndDisplayRankings(currentRankingType); // Fetch initial data
    startAutoUpdate(); // Start the timer

}); // End DOMContentLoaded