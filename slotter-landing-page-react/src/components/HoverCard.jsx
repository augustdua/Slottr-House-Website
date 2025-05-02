"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight } from "lucide-react"
// Reusable Card Component

const RankedGameCard = ({ item, defaultWidth = 150, expandedWidth = 400, height = 150 }) => {
    const [isHovered, setIsHovered] = useState(false)
    const cardRef = useRef(null)
    const isCompact = defaultWidth < 200 // Check if the card is compact

    const titleClass = isCompact ? "text-xs" : "text-lg"
    const overlayPadding = isCompact ? "p-2" : "p-4"
    const buttonPadding = isCompact ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm"
    const getImageUrl = (image) => {
        return image || `https://placehold.co/400x${height}/1a1a1a/ffffff?text=Rank${item.rank}`
    }

    // Calculate expansion direction
    const calculateExpandDirection = () => {
        if (!cardRef.current) return 0

        const rect = cardRef.current.getBoundingClientRect()
        const windowWidth = window.innerWidth
        const cardCenterX = rect.left + rect.width / 2

        // If card is in the right half of the screen, expand left
        if (cardCenterX > windowWidth / 2) {
            return -(expandedWidth - defaultWidth)
        }
        // Otherwise expand right (default behavior)
        return 0
    }

    // Extract or generate dynamic content
    const title = item.title || item.gameName || `Game #${item.rank}`
    const displayValueLabel = item.releaseDate ? "Released" : "Value"
    const displayValue = item.releaseDate
        ? new Date(item.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
        : item.badgeValue

    // Single animation for the entire card
    return (
        <div className="overflow-visible" style={{ width: `${defaultWidth}px`, height: `${height}px` }}>
            <motion.div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-full"
                initial={false}
                animate={{
                    width: isHovered ? expandedWidth : defaultWidth,
                    x: isHovered ? calculateExpandDirection() : 0,
                    zIndex: isHovered ? 20 : 1,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic bezier for smoother feel
                    width: { duration: 0.3 },
                    x: { duration: 0.3 },
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Base Card Content */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <img
                        src={getImageUrl(item?.image) || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute top-2 left-2 bg-[#292929] bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center shadow">
                        <span className="text-white font-bold text-xs">{item.rank}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#fa5258] text-white rounded-md px-2 py-0.5 font-bold text-xs shadow">
                        {item.badgeValue}
                    </div>
                </motion.div>

                {/* Hover Overlay - Single Animation */}
                <motion.div
                    className="absolute inset-0 flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{
                        flexDirection: calculateExpandDirection() < 0 ? "row-reverse" : "row",
                        pointerEvents: isHovered ? "auto" : "none",
                    }}
                >
                    {/* Content Side */}
                    {/* Content Side - Improved Layout */}
                    <div
                        className={`w-1/2 bg-gradient-to-br from-black/90 to-black/80 backdrop-blur-sm ${overlayPadding} flex flex-col justify-between`}
                    >
                        {/* Top Content Area */}
                        <div>
                            <h3 className={`${titleClass} font-semibold text-white leading-tight mb-1`}>{title}</h3>


                            {/* Stats Section - Using Grid for Alignment */}
                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5"> {/* Increased top margin, added gaps */}
                                {/* Rank */}
                                <div>
                                    <span className="block text-xs text-gray-400">Rank</span>
                                    <span className="block text-sm font-medium text-white">{item.rank}</span> {/* Slightly larger value */}
                                </div>

                                {/* Value/Date */}
                                <div>
                                    <span className="block text-xs text-gray-400">{displayValueLabel}</span>
                                    <span className="block text-sm font-medium text-white">{displayValue}</span>
                                </div>

                                {/* Genre (Conditional) */}
                                {item.genre && (
                                    <div>
                                        <span className="block text-xs text-gray-400">Genre</span>
                                        <span className="block text-sm font-medium text-white">{item.genre}</span>
                                    </div>
                                )}

                                {/* Platform (Conditional) */}
                                {item.platform && (
                                    <div>
                                        <span className="block text-xs text-gray-400">Platform</span>
                                        <span className="block text-sm font-medium text-white">{item.platform}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buttons Area */}
                        <div className={`flex space-x-2 ${isCompact ? "mt-3" : "mt-4"}`}> {/* Increased gap, adjusted margin */}
                            <button
                                className={`flex-1 ${buttonPadding} bg-[#fa5258] text-white font-semibold rounded-md shadow-lg hover:bg-[#e83f5b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa5258] focus:ring-opacity-50`} // Added focus styles
                            >
                                Demo
                            </button>
                            <button
                                className={`flex-1 ${buttonPadding} bg-[#292929] text-white font-semibold rounded-md shadow-lg hover:bg-[#444] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`} // Added focus styles
                            >
                                Stats
                            </button>
                        </div>
                    </div>
                    {/* // ... rest of the component */}

                    {/* Image Side */}
                    <div className="w-1/2 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${getImageUrl(item?.image)})` }}
                            animate={{ scale: 1.05 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute bottom-2 right-2 text-white text-opacity-90 font-medium text-xs bg-black/60 px-1.5 py-0.5 rounded">
                            Preview
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

// Reusable Horizontal List Component
const HorizontalCardList = ({
    items = [],
    renderItem,
    cardWidth = 200,
    // expandedWidth, cardHeight not needed here
    gap = 8,
    className = "",
    title = "",
}) => {
    const scrollContainerRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // --- Scroll Check Logic ---
    const checkScrollability = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 1); // Use a small threshold
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1); // Use a small threshold
        }
    }, []); // No dependencies needed as it only uses the ref

    // --- Scroll Button Handlers ---
    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            // Scroll by roughly the width of one card + gap
            const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // --- Effects for Initial Check and Resize/Scroll ---
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Initial check
        checkScrollability();

        // Check on scroll
        container.addEventListener('scroll', checkScrollability, { passive: true });

        // Check on resize (using ResizeObserver for better performance)
        const resizeObserver = new ResizeObserver(checkScrollability);
        resizeObserver.observe(container);

        // Cleanup
        return () => {
            container.removeEventListener('scroll', checkScrollability);
            resizeObserver.unobserve(container);
        };
    }, [checkScrollability, items]); // Re-check if items change

    return (
        <div className={`w-full ${className}`}>
            {title && <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>}

            {/* Added relative positioning for absolute button placement */}
            <div className="relative group"> {/* Group for hover visibility */}
                {/* Left Arrow Button */}
                <AnimatePresence>
                    {canScrollLeft && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory hide-scrollbar"
                    style={{
                        scrollBehavior: "smooth", // Already smooth
                        gap: `${gap}px`,
                        // Add padding to prevent buttons overlapping first/last card content
                        paddingLeft: `${gap}px`,
                        paddingRight: `${gap}px`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="snap-start flex-shrink-0 overflow-visible"
                            style={{
                                width: `${cardWidth}px`,
                                position: 'relative',
                                zIndex: hoveredIndex === index ? 10 : 1,
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Pass scrollContainerRef if needed by RankedGameCard for its logic */}
                            {/* If RankedGameCard doesn't need it, just use: renderItem(item, index) */}
                            {renderItem(item, index, scrollContainerRef)}
                        </div>
                    ))}
                </div>

                {/* Right Arrow Button */}
                <AnimatePresence>
                    {canScrollRight && (
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export { HorizontalCardList, RankedGameCard }
