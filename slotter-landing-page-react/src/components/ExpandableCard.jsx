"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ExpandableCard({
    title,
    image,
    color,
    scrollContainer,       // ref to the scrolling wrapper
    badgeText,
    badgeValue,
    stats = { views: '1.2M', likes: '50K' },    // stats data for display
    defaultWidth = 280,
    expandedWidth = 800,
    height = 200,
    onHoverChange = () => { } // Add this prop
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [origin, setOrigin] = useState("left")   // "left" | "center" | "right"
    const cardRef = useRef(null)

    const handleMouseEnter = () => {
        if (cardRef.current && scrollContainer?.current) {
            const cardRect = cardRef.current.getBoundingClientRect()
            const containerRect = scrollContainer.current.getBoundingClientRect()
            const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2
            const third = containerRect.width / 3

            // Determine which third of the container the card is in
            if (cardCenterX < third) {
                setOrigin("left")
            } else if (cardCenterX > 2 * third) {
                setOrigin("right")
            } else {
                setOrigin("center")
            }
        }
        setIsHovered(true)
        onHoverChange(true) // Call the callback function when hovered
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        onHoverChange(false) // Call the callback function when not hovered
    }

    // Compute the CSS transform-origin based on card position
    const transformOrigin = {
        left: "left center",
        center: "center center",
        right: "right center"
    }[origin]

    return (
        <motion.div
            ref={cardRef}
            className="relative rounded-lg overflow-hidden cursor-pointer"
            style={{
                height: `${height}px`,
                width: defaultWidth,
                zIndex: isHovered ? 20 : 1,
                transformOrigin
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* BACKGROUND LAYER (color or image) */}
            <motion.div
                className={`absolute inset-0 ${color} transition-opacity duration-300`}
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
            />
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* STATIC CONTENT */}
            <div className="relative h-full z-10 flex flex-col justify-between p-0">
                <motion.div
                    className="w-full h-full relative"
                    animate={{ opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <img
                        src={image || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />

                    {/* Badge indicators */}
                    <div className="absolute top-4 left-4 bg-[#292929] rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{badgeText}</span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#fa5258] text-white rounded-md px-2 py-1 font-bold text-sm">
                        {badgeValue}
                    </div>
                </motion.div>
            </div>

            {/* HOVER EXPANDED OVERLAY */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute top-0 h-full w-full flex rounded-lg overflow-hidden"
                        style={{
                            width: expandedWidth,
                            zIndex: 30,
                            // Position the expanded overlay based on card position
                            left: origin === "right" ? "auto" : 0,
                            right: origin === "right" ? 0 : "auto",
                            transformOrigin,
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* LEFT PANEL: title + buttons + stats */}
                        <div className="w-1/2 bg-black bg-opacity-70 flex flex-col justify-center items-center p-4 gap-4">
                            <h3 className="text-white text-lg font-bold text-center">{title}</h3>

                            <div className="flex space-x-3">
                                <motion.button
                                    className="px-4 py-2 rounded-full border border-white text-white font-medium hover:bg-white hover:text-black transition"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                >
                                    Demo
                                </motion.button>

                                <motion.button
                                    className="px-4 py-2 rounded-full border border-white text-white font-medium hover:bg-white hover:text-black transition"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                >
                                    Stats
                                </motion.button>
                            </div>

                            {/* Stats display */}
                            {Object.keys(stats).length > 0 && (
                                <div className="flex space-x-6 mt-2">
                                    {Object.entries(stats).map(([label, value]) => (
                                        <div key={label} className="text-center">
                                            <div className="text-white font-bold">{value}</div>
                                            <div className="text-gray-300 text-xs">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT PANEL: background image & badge */}
                        <div
                            className="w-1/2 relative"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        >
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute bottom-3 right-3 bg-[#fa5258] text-white rounded-md px-2 py-1 text-xs font-bold">
                                {badgeValue}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}