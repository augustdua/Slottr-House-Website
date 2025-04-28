"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play } from "lucide-react"

export default function ExpandableCard({
    title,
    image,
    color,
    scrollContainer,
    badgeText,
    badgeValue,
    defaultWidth = 280,
    expandedWidth = 800,
    height = 200
}) {
    const [isHovered, setIsHovered] = useState(false)
    const cardRef = useRef(null)

    const handleMouseEnter = () => {
        setIsHovered(true)

        if (cardRef.current && scrollContainer?.current) {
            const card = cardRef.current
            const container = scrollContainer.current
            const cardRect = card.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()

            if (cardRect.right + (expandedWidth - defaultWidth) > containerRect.right) {
                container.scrollBy({
                    left:
                        cardRect.right + (expandedWidth - defaultWidth) - containerRect.right,
                    behavior: "smooth",
                })
            }
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={cardRef}
            className={`relative rounded-lg overflow-hidden cursor-pointer `}
            style={{ height: `${height}px` }}
            initial={{ width: defaultWidth }}
            animate={{ width: isHovered ? expandedWidth : defaultWidth }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background color visible only when NOT hovered */}
            <motion.div
                className={`absolute inset-0 ${color} transition-opacity duration-400`}
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
            />

            {/* Background image visible only on hover */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            />

            {/* Content container */}
            <div className="relative h-full z-10 flex flex-col justify-between p-0">
                {/* Main image */}
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

            {/* Expanded content */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute top-0 right-0 h-full w-full flex rounded-lg overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Left half: text + play button */}
                        <div className="w-1/2 bg-black bg-opacity-70 flex flex-col justify-center items-center p-3 gap-2">
                            <h3 className="text-white text-lg font-bold text-center">{title}</h3>
                            <motion.button
                                className="flex items-center justify-center bg-red-600 text-white px-4 py-1 rounded-full font-medium hover:bg-red-700 transition"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <Play className="w-3 h-3 mr-1" />
                                Play
                            </motion.button>
                        </div>

                        {/* Right half: image with background */}
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
                            <div className="absolute bottom-2 right-2 bg-[#fa5258] text-white rounded-md px-2 py-1 text-xs font-bold">
                                {badgeValue}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}