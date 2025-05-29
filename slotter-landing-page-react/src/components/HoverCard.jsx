"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Removed Zap as it's not used here

// Reusable Card Component
const RankedGameCard = ({
    item,
    defaultWidth = 150,
    expandedWidth = 400,
    height = 150,
    onMouseEnter: externalOnMouseEnter,
    onMouseLeave: externalOnMouseLeave,
    forceHover = false
}) => {
    const [isInternallyHovered, setIsInternallyHovered] = useState(false); // Renamed for clarity
    const cardRef = useRef(null);
    const isCompact = defaultWidth < 200;

    // Determine if the card should display its hover state
    // It should hover if EITHER the parent is forcing it OR the mouse is internally over it.
    const shouldShowHover = forceHover || isInternallyHovered;

    const handleMouseEnter = useCallback(() => {
        setIsInternallyHovered(true); // Always set internal state to true on mouse enter
        if (externalOnMouseEnter) {
            externalOnMouseEnter();
        }
    }, [externalOnMouseEnter]); // setIsInternallyHovered is stable

    const handleMouseLeave = useCallback(() => {
        setIsInternallyHovered(false); // Always set internal state to false on mouse leave
        if (externalOnMouseLeave) {
            externalOnMouseLeave();
        }
    }, [externalOnMouseLeave]); // setIsInternallyHovered is stable

    const titleClass = isCompact ? "text-xs" : "text-lg";
    const overlayPadding = isCompact ? "p-2" : "p-4";
    const buttonPadding = isCompact ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";

    const getImageUrl = (image) => {
        return image || `https://placehold.co/400x${height}/1a1a1a/ffffff?text=Rank${item.rank}`;
    };

    const calculateExpandDirection = useCallback(() => {
        if (!cardRef.current) return 0;
        const rect = cardRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const cardCenterX = rect.left + rect.width / 2;
        if (cardCenterX > windowWidth / 2) {
            return -(expandedWidth - defaultWidth);
        }
        return 0;
    }, [expandedWidth, defaultWidth]);

    const title = item.title || item.gameName || `Game #${item.rank}`;
    const displayValueLabel = item.releaseDate ? "Released" : "Value";
    const displayValue = item.releaseDate
        ? new Date(item.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
        : item.badgeValue;

    return (
        <div className="overflow-visible" style={{ width: `${defaultWidth}px`, height: `${height}px` }}>
            <motion.div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-full"
                initial={false}
                animate={{
                    width: shouldShowHover ? expandedWidth : defaultWidth,
                    x: shouldShowHover ? calculateExpandDirection() : 0,
                    zIndex: shouldShowHover ? 30 : 1,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1.0],
                    width: { duration: 0.3 },
                    x: { duration: 0.3 },
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Base Card Content */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: shouldShowHover ? 0 : 1 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ pointerEvents: shouldShowHover ? "none" : "auto" }} // Make base content non-interactive when overlay is shown
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
                    animate={{ opacity: shouldShowHover ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{
                        flexDirection: calculateExpandDirection() < 0 ? "row-reverse" : "row",
                        pointerEvents: shouldShowHover ? "auto" : "none",
                    }}
                >
                    {/* Content Side */}
                    <div
                        className={`w-1/2 bg-gradient-to-br from-black/90 to-black/80 backdrop-blur-sm ${overlayPadding} flex flex-col justify-between`}
                    >
                        <div>
                            <h3 className={`${titleClass} font-semibold text-white leading-tight mb-1`}>{title}</h3>
                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                <div>
                                    <span className="block text-xs text-gray-400">Rank</span>
                                    <span className="block text-sm font-medium text-white">{item.rank}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400">{displayValueLabel}</span>
                                    <span className="block text-sm font-medium text-white">{displayValue}</span>
                                </div>
                                {item.genre && (
                                    <div>
                                        <span className="block text-xs text-gray-400">Genre</span>
                                        <span className="block text-sm font-medium text-white">{item.genre}</span>
                                    </div>
                                )}
                                {item.platform && (
                                    <div>
                                        <span className="block text-xs text-gray-400">Platform</span>
                                        <span className="block text-sm font-medium text-white">{item.platform}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`flex space-x-2 ${isCompact ? "mt-3" : "mt-4"}`}>
                            <button
                                className={`flex-1 ${buttonPadding} bg-[#fa5258] text-white font-semibold rounded-md shadow-lg hover:bg-[#e83f5b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa5258] focus:ring-opacity-50`}
                            >
                                Demo
                            </button>
                            <button
                                className={`flex-1 ${buttonPadding} bg-[#292929] text-white font-semibold rounded-md shadow-lg hover:bg-[#444] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50`}
                            >
                                Stats
                            </button>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="w-1/2 relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${getImageUrl(item?.image)})` }}
                            animate={{ scale: shouldShowHover ? 1.05 : 1 }} // Conditional scale
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
    );
};

// Reusable Horizontal List Component - Memoized for performance
const HorizontalCardList = React.memo(({
    items = [],
    renderItem,
    cardWidth = 200,
    gap = 8,
    className = "",
    title = "",
}) => {
    const scrollContainerRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null); // This is for the list's own logic (e.g. z-index)
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollability = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 1);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    }, []);

    const scroll = useCallback((direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, [cardWidth, gap]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        checkScrollability();
        container.addEventListener('scroll', checkScrollability, { passive: true });
        const resizeObserver = new ResizeObserver(checkScrollability);
        resizeObserver.observe(container);
        return () => {
            container.removeEventListener('scroll', checkScrollability);
            resizeObserver.unobserve(container);
        };
    }, [checkScrollability, items]);

    const handleItemMouseEnter = useCallback((index) => {
        setHoveredIndex(index);
    }, []);

    const handleItemMouseLeave = useCallback(() => {
        setHoveredIndex(null);
    }, []);

    return (
        <div className={`w-full ${className}`}>
            {title && <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>}
            <div className="relative group">
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
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory hide-scrollbar"
                    style={{
                        scrollBehavior: "smooth",
                        gap: `${gap}px`,
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
                            // These handlers are for the HorizontalCardList's hoveredIndex,
                            // not directly for RankedGameCard's forceHover.
                            // RankedGameCard will manage its own hover or be forced by PodiumPosition.
                            onMouseEnter={() => handleItemMouseEnter(index)}
                            onMouseLeave={handleItemMouseLeave}
                        >
                            {/*
                If HorizontalCardList itself needs to forceHover on its children:
                You would pass `forceHover={hoveredIndex === index}` to renderItem.
                Example: renderItem(item, index, scrollContainerRef, hoveredIndex === index)
                And RankedGameCard would pick up this forceHover.
                
                For now, as per your PodiumPosition structure, only Podium manages forceHover
                explicitly. HorizontalCardList items will use their internal hover.
              */}
                            {renderItem(item, index, scrollContainerRef)}
                        </div>
                    ))}
                </div>
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
});

HorizontalCardList.displayName = 'HorizontalCardList';

export { HorizontalCardList, RankedGameCard };