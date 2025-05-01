import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react'; // Or your preferred icon library
// Reusable Card Component

const RankedGameCard = ({ item, defaultWidth = 150, expandedWidth = 400, height = 150 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isCompact = defaultWidth < 200; // Check if the card is compact

    const titleClass = isCompact ? 'text-xs' : 'text-lg';
    const overlayPadding = isCompact ? 'p-2' : 'p-4';
    const buttonPadding = isCompact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm';
    const getImageUrl = (image) => {
        return image || `https://placehold.co/400x${height}/1a1a1a/ffffff?text=Rank${item.rank}`;
    };

    // --- Animation Variants ---
    const overlayVariants = {
        hidden: { opacity: 0, transition: { duration: 0.2 } },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                // Stagger children animations
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    };

    const imageVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.4, ease: "easeOut" } },
    };
    // --- End Animation Variants ---


    // Extract or generate dynamic content
    const title = item.title || item.gameName || `Game #${item.rank}`;
    const tagline = item.tagline || `Ranked #${item.rank} with value ${item.badgeValue}`;
    // Improved logic for date/value display
    const displayValueLabel = item.releaseDate ? "Released" : "Value";
    const displayValue = item.releaseDate ? new Date(item.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() : item.badgeValue;


    return (
        <div className="overflow-visible" style={{ width: `${defaultWidth}px`, height: `${height}px` }}>
            <motion.div
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-full"
                initial={{ width: defaultWidth, zIndex: 1 }}
                animate={{
                    width: isHovered ? expandedWidth : defaultWidth,
                    zIndex: isHovered ? 20 : 1 // Increase zIndex more on hover
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Base Card Content - Visible when not hovered */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <img
                        src={getImageUrl(item?.image)}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute top-2 left-2 bg-[#292929] bg-opacity-80 rounded-full w-8 h-8 flex items-center justify-center shadow">
                        <span className="text-white font-bold text-xs">#{item.rank}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#fa5258] text-white rounded-md px-2 py-0.5 font-bold text-xs shadow">
                        {item.badgeValue}
                    </div>
                </motion.div>

                {/* Enhanced Hover Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            className="absolute inset-0 flex"
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {/* Left Overlay - Improved Layout & Animation */}
                            <motion.div
                                className={`w-1/2 bg-gradient-to-br from-black/90 to-black/80 backdrop-blur-sm ${overlayPadding} flex flex-col justify-between`}
                            >
                                <motion.div variants={itemVariants}>
                                    <h3 className={`${titleClass} font-semibold text-white leading-tight mb-1`}>
                                        {title}
                                    </h3>
                                    {tagline && (
                                        <p className={`text-${isCompact ? 'xs' : 'xs'} text-gray-300 mb-2 line-clamp-2`}>
                                            {tagline}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {/* … value/date display … */}
                                    </div>
                                </motion.div>

                                {/* Buttons */}
                                <div className={`flex space-x-1 ${isCompact ? 'mt-2' : 'mt-4'}`}>
                                    <motion.button
                                        variants={itemVariants}
                                        className={`flex-1 ${buttonPadding} bg-[#fa5258] text-white font-semibold rounded-md shadow-lg hover:bg-[#e83f5b] transition-colors`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Demo
                                    </motion.button>
                                    <motion.button
                                        variants={itemVariants}
                                        className={`flex-1 ${buttonPadding} bg-[#292929] text-white font-semibold rounded-md shadow-lg hover:bg-[#444] transition-colors`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Stats
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Right Panel (Image Preview with Zoom) */}
                            <motion.div
                                className="w-1/2 relative overflow-hidden" // Added overflow-hidden
                                initial="rest"
                                animate="hover"
                                whileHover="hover" // Ensure variant applies on hover
                            >
                                <motion.div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${getImageUrl(item?.image)})` }}
                                    variants={imageVariants} // Apply zoom variant
                                />
                                <div className="absolute inset-0 bg-black/30"></div> {/* Slightly darker overlay */}
                                <div className="absolute bottom-2 right-2 text-white text-opacity-90 font-medium text-xs bg-black/60 px-1.5 py-0.5 rounded">
                                    Preview
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// Reusable Horizontal List Component
const HorizontalCardList = ({
    items = [],
    renderItem,
    cardWidth = 200,
    expandedWidth = 400,
    cardHeight = 120,
    gap = 5,
    className = "",
    title = ""
}) => {
    const scrollContainerRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className={`w-full ${className}`}>
            {title && <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>}

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    // allow y‐overflow visible, x‐overflow auto
                    className="flex overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory hide-scrollbar"
                    style={{
                        scrollBehavior: "smooth",
                        gap: `${gap}px`
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.id || index}
                            // ensure hover-overlay isn't clipped
                            className="snap-start flex-shrink-0 overflow-visible"
                            style={{
                                width: `${cardWidth}px`,
                                position: 'relative',
                                zIndex: hoveredIndex === index ? 10 : 1
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        </div>
    );
};

export { HorizontalCardList, RankedGameCard };