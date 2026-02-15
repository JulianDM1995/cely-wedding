'use client'

import type { Guest } from '@/payload-types'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React from 'react'
import { FaEnvelopeOpenText } from 'react-icons/fa'
import { InvitationRenderer } from './InvitationRenderer'




// Configuration for parallax intensity (adjust numbers to calibrate)
const DESKTOP_PARALLAX_INTENSITY = {
    watercolor: '15%',   // Background depth
    flowers: 50         // Very close (frame)
}

const MOBILE_PARALLAX_INTENSITY = {
    watercolor: '15%',
    flowers: 40         // Reduced from 85 for subtler mobile effect
}

// Sensitivity factor for mobile tilt (0.1 = very subtle, 1.0 = full range)
const MOBILE_TILT_SENSITIVITY = 0.6

// Configuration for characters (x, y, z)
const DESKTOP_CHARACTER_CONFIG = {
    gatoL: { x: -25, y: 10, z: 40 },     // Far Left, Distinct from Frame (65)
    juan: { x: -12, y: 15, z: 15 },       // Near Left
    tatiana: { x: 12, y: 15, z: 5 },     // Near Right
    gatoR: { x: 25, y: 10, z: 40 },      // Far Right, Distinct from Frame (65)
}

const MOBILE_CHARACTER_CONFIG = {
    gatoL: { x: -13, y: 10, z: 30 },     // Far Left, Distinct from Frame (65)
    juan: { x: -11, y: 11, z: 15 },       // Near Left
    tatiana: { x: 11, y: 11, z: 5 },     // Near Right
    gatoR: { x: 13, y: 10, z: 30 },      // Far Right, Distinct from Frame (65)
}

const DESKTOP_FLOWER_OPTS = {
    width: '35vw',
    maxWidth: '500px',
    bleedX: '-50px',
    bleedY: '-50px',
}

const MOBILE_FLOWER_OPTS = {
    width: '50vw',
    maxWidth: '500px',
    bleedX: '-20px',
    bleedY: '-20px',
}

const DESKTOP_WATERCOLOR_OPTS = {
    top: '50%',
    scale: 1.0
}

const MOBILE_WATERCOLOR_OPTS = {
    top: '40%', // Higher up for mobile
    scale: 1.2  // 20% larger on mobile
}

const ParallaxPhoto: React.FC<{ guest?: Guest; weddingDate?: string | null; couple?: { groom: string; bride: string } }> = ({ guest, weddingDate, couple }) => {
    // Mouse position state
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Invitation Modal State
    const [isInvitationOpen, setIsInvitationOpen] = React.useState(false)

    // Configuration State (Static Desktop - Positions kept as is)
    const [characterConfig, setCharacterConfig] = React.useState(DESKTOP_CHARACTER_CONFIG)
    const [flowerOpts, setFlowerOpts] = React.useState(DESKTOP_FLOWER_OPTS)
    const [parallaxIntensity, setParallaxIntensity] = React.useState(DESKTOP_PARALLAX_INTENSITY)
    const [watercolorOpts, setWatercolorOpts] = React.useState(DESKTOP_WATERCOLOR_OPTS)
    const [isTiltActive, setIsTiltActive] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // Handle Resize (Only to detect mobile state for input handling, NOT for config changing)
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)

            if (mobile) {
                setCharacterConfig(MOBILE_CHARACTER_CONFIG)
                setFlowerOpts(MOBILE_FLOWER_OPTS)
                setParallaxIntensity(MOBILE_PARALLAX_INTENSITY)
                setWatercolorOpts(MOBILE_WATERCOLOR_OPTS)
            } else {
                setCharacterConfig(DESKTOP_CHARACTER_CONFIG)
                setFlowerOpts(DESKTOP_FLOWER_OPTS)
                setParallaxIntensity(DESKTOP_PARALLAX_INTENSITY)
                setWatercolorOpts(DESKTOP_WATERCOLOR_OPTS)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Smooth spring animation configuration
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 } // "Floaty" feel

    // Create smoothed mouse values
    const mouseXSpring = useSpring(mouseX, springConfig)
    const mouseYSpring = useSpring(mouseY, springConfig)

    // Calculate transforms for different layers (depth)
    // Watercolor Background (Deep depth - moves opposite to mouse)
    const watercolorX = 0 // Fixed horizontal position
    const watercolorY = useTransform(mouseYSpring, [-0.5, 0.5], [parallaxIntensity.watercolor, `-${parallaxIntensity.watercolor}`])

    // Juan (Middle ground)
    const juanParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${characterConfig.juan.z}px`, `${characterConfig.juan.z}px`])
    const juanParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${characterConfig.juan.z}px`, `${characterConfig.juan.z}px`])
    const juanX = useMotionTemplate`calc(-50% + ${characterConfig.juan.x}vh + ${juanParallaxX})`
    const juanY = useMotionTemplate`calc(${-characterConfig.juan.y}vh + ${juanParallaxY})`

    // Tatiana (Slightly behind Juan - moves less)
    const tatianaParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${characterConfig.tatiana.z}px`, `${characterConfig.tatiana.z}px`])
    const tatianaParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${characterConfig.tatiana.z}px`, `${characterConfig.tatiana.z}px`])
    const tatianaX = useMotionTemplate`calc(-50% + ${characterConfig.tatiana.x}vh + ${tatianaParallaxX})`
    const tatianaY = useMotionTemplate`calc(${-characterConfig.tatiana.y}vh + ${tatianaParallaxY})`

    // Cats (Foreground)
    // Left Cat (GatoL) - Closest foreground (moves most)
    const gatoLParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${characterConfig.gatoL.z}px`, `${characterConfig.gatoL.z}px`])
    const gatoLParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${characterConfig.gatoL.z}px`, `${characterConfig.gatoL.z}px`])
    const gatoLX = useMotionTemplate`calc(-50% + ${characterConfig.gatoL.x}vh + ${gatoLParallaxX})`
    const gatoLY = useMotionTemplate`calc(${-characterConfig.gatoL.y}vh + ${gatoLParallaxY})`

    // Right Cat (GatoR) - Slightly behind left cat
    const gatoRParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${characterConfig.gatoR.z}px`, `${characterConfig.gatoR.z}px`])
    const gatoRParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${characterConfig.gatoR.z}px`, `${characterConfig.gatoR.z}px`])
    const gatoRX = useMotionTemplate`calc(-50% + ${characterConfig.gatoR.x}vh + ${gatoRParallaxX})`
    const gatoRY = useMotionTemplate`calc(${-characterConfig.gatoR.y}vh + ${gatoRParallaxY})`

    // Flowers (Frame - Very Close)
    const flowerX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${parallaxIntensity.flowers}px`, `${parallaxIntensity.flowers}px`])
    const flowerY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${parallaxIntensity.flowers}px`, `${parallaxIntensity.flowers}px`])


    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile || isTiltActive) return // Completely ignore mouse on mobile to prevent touch interference

        const { clientX, clientY, currentTarget } = e
        const { width, height, left, top } = currentTarget.getBoundingClientRect()

        // Calculate normalized position (-0.5 to 0.5)
        const x = (clientX - left) / width - 0.5
        const y = (clientY - top) / height - 0.5

        mouseX.set(x)
        mouseY.set(y)
    }

    // Handle Device Orientation (Tilt)
    React.useEffect(() => {
        // Only add listener automatically if NOT on iOS 13+ (which requires permission)
        // Check if permission API exists
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // Do nothing, wait for user interaction to request permission
        } else {
            // Non-iOS 13+ devices (Android, older iOS) - try adding listener immediately
            window.addEventListener('deviceorientation', handleOrientation)
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [])

    const handleOrientation = (e: DeviceOrientationEvent) => {
        if (!e.gamma || !e.beta) return

        setIsTiltActive(true) // We have valid tilt data

        // Gamma: Left/Right tilt (-90 to 90)
        // Clamp to -45 to 45 for better control
        const gamma = Math.min(Math.max(e.gamma, -45), 45)
        const x = (gamma / 90) * MOBILE_TILT_SENSITIVITY // Map -45..45 to -0.5..0.5, then dampen

        // Beta: Front/Back tilt (-180 to 180)
        // Standard holding is around 45 degrees.
        // We want 45 to be "center" (0).
        // 0 (flat) -> -0.5
        // 90 (upright) -> 0.5
        const beta = Math.min(Math.max(e.beta, 0), 90)
        const y = ((beta - 45) / 90) * MOBILE_TILT_SENSITIVITY // Map 0..90 to -0.5..0.5, then dampen

        mouseX.set(x)
        mouseY.set(y)
    }

    // Attempt to request permission on any tap/click
    const handleInteraction = async () => {
        // Check for iOS 13+ permission API
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission()
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation)
                }
            } catch (error) {
                // Ignore errors
            }
        }
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onClick={handleInteraction}
            onTouchStart={handleInteraction}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: 'white',
                perspective: '1000px' // Adds 3D perspective
            }}
        >
            {/* Background Texture - Static */}
            <img
                src="/designs/background.png"
                alt="Background"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            />

            {/* Watercolor - Dynamic Background - Wrapped for Centering */}
            <div style={{
                position: 'absolute',
                top: watercolorOpts.top,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', // Wrapper takes full width to allow centering child
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                pointerEvents: 'none'
            }}>
                <motion.img
                    src="/designs/watercolor.png"
                    alt="Watercolor"
                    style={{
                        width: 'auto',
                        height: '90%',
                        objectFit: 'contain',
                        x: 0, // Fixed horizontal position
                        y: watercolorY,
                        scale: watercolorOpts.scale,
                        mixBlendMode: 'darken',
                        willChange: 'transform'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            {/* Characters Container - Centered */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 5,
                pointerEvents: 'none' // Click passing through
            }}>
                {/* Note: pointerEvents 'auto' on images to allow clicks */}

                {/* Juan - Middle Layer */}
                <motion.img
                    src="/designs/juan.png"
                    alt={couple?.groom || 'Novio'}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%', // Centered anchor
                        height: '70vh',
                        objectFit: 'contain',
                        zIndex: 6,
                        pointerEvents: 'auto',
                        x: juanX, // Includes center offset + parallax
                        y: juanY,
                        willChange: 'transform'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* Tatiana - Middle Layer */}
                <motion.img
                    src="/designs/tatiana.png"
                    alt={couple?.bride || 'Novia'}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        height: '70vh',
                        objectFit: 'contain',
                        zIndex: 5, // Behind Juan
                        pointerEvents: 'auto',
                        x: tatianaX,
                        y: tatianaY,
                        willChange: 'transform'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* Left Cat (GatoL) - Foreground (Closest) */}
                <motion.img
                    src="/designs/gatoL.png"
                    alt="Gato L"
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        height: '24vh',
                        objectFit: 'contain',
                        zIndex: 9, // Closest
                        pointerEvents: 'auto',
                        x: gatoLX,
                        y: gatoLY,
                        willChange: 'transform'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                />

                {/* Right Cat (GatoR) - Foreground (Slightly behind) */}
                <motion.img
                    src="/designs/gatoR.png"
                    alt="Gato R"
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        height: '24vh',
                        objectFit: 'contain',
                        zIndex: 8,
                        pointerEvents: 'auto',
                        x: gatoRX,
                        y: gatoRY,
                        willChange: 'transform'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                />
            </div>

            {/* --- Flowers (Static Frame) --- */}

            {/* Top Left Flower */}
            <motion.img
                src="/designs/flowers.png"
                alt="Flower Decoration"
                style={{
                    position: 'absolute',
                    top: flowerOpts.bleedY,
                    left: flowerOpts.bleedX,
                    width: flowerOpts.width,
                    maxWidth: flowerOpts.maxWidth,
                    zIndex: 20, // Top z-index
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none', // Let mouse pass through to container
                    x: flowerX,
                    y: flowerY,
                    willChange: 'transform'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Top Right Flower - Mirror Horizontally */}
            <motion.img
                src="/designs/flowers.png"
                alt="Flower Decoration"
                style={{
                    position: 'absolute',
                    top: flowerOpts.bleedY,
                    right: flowerOpts.bleedX,
                    width: flowerOpts.width,
                    maxWidth: flowerOpts.maxWidth,
                    zIndex: 20,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    scaleX: -1,
                    x: flowerX,
                    y: flowerY,
                    willChange: 'transform'
                }}
                initial={{ opacity: 0, scaleX: -1, scaleY: 1 }}
                animate={{ opacity: 1, scaleX: -1, scaleY: 1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Bottom Right Flower - Mirror Both */}
            <motion.img
                src="/designs/flowers.png"
                alt="Flower Decoration"
                style={{
                    position: 'absolute',
                    bottom: flowerOpts.bleedY,
                    right: flowerOpts.bleedX,
                    width: flowerOpts.width,
                    maxWidth: flowerOpts.maxWidth,
                    zIndex: 20,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    scaleX: -1,
                    scaleY: -1,
                    x: flowerX,
                    y: flowerY,
                    willChange: 'transform'
                }}
                initial={{ opacity: 0, scaleX: -1, scaleY: -1 }}
                animate={{ opacity: 1, scaleX: -1, scaleY: -1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Bottom Left Flower - Mirror Vertically */}
            <motion.img
                src="/designs/flowers.png"
                alt="Flower Decoration"
                style={{
                    position: 'absolute',
                    bottom: flowerOpts.bleedY,
                    left: flowerOpts.bleedX,
                    width: flowerOpts.width,
                    maxWidth: flowerOpts.maxWidth,
                    zIndex: 20,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    scaleY: -1,
                    x: flowerX,
                    y: flowerY,
                    willChange: 'transform'
                }}
                initial={{ opacity: 0, scaleX: 1, scaleY: -1 }}
                animate={{ opacity: 1, scaleX: 1, scaleY: -1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            />

            {/* Elegant Button for Guest */}
            {guest && (
                <motion.div
                    initial={{ opacity: 0, y: 30, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    transition={{
                        delay: 1.5,
                        duration: 1,
                        type: "spring",
                        stiffness: 50
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 'clamp(40%, 20vh, 22vh)',
                        left: '50%',
                        zIndex: 50,
                        pointerEvents: 'auto',
                    }}
                >
                    <motion.button
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        animate="rest"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsInvitationOpen(true)
                        }}
                        variants={{
                            rest: {
                                scale: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
                                transition: { duration: 0.3, ease: "easeOut" }
                            },
                            hover: {
                                scale: 1.05,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 20px 40px rgba(212, 175, 55, 0.25), 0 0 0 2px rgba(212, 175, 55, 0.4) inset, 0 0 20px rgba(212, 175, 55, 0.1)',
                                transition: { duration: 0.3, ease: "easeOut" }
                            },
                            tap: { scale: 0.98 }
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '16px 32px',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderRadius: '24px',
                            border: 'none',
                            cursor: 'pointer',
                            maxWidth: '90vw',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Shimmer Effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                            backgroundSize: '200% 100%',
                            opacity: 0.6,
                            pointerEvents: 'none',
                            borderRadius: '24px'
                        }} />

                        {/* "Invitation for" Label */}
                        <span style={{
                            fontFamily: 'var(--font-great-vibes)',
                            fontSize: '28px',
                            color: '#444',
                            lineHeight: '1.2',
                            letterSpacing: '0.5px',
                            marginBottom: '8px'
                        }}>
                            Invitación especial
                        </span>

                        {/* Guest Photo - Avatar */}
                        {guest.profilePicture && typeof guest.profilePicture === 'object' && 'url' in guest.profilePicture && (
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0',
                                flexShrink: 0,
                                marginBottom: '4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <img
                                    src={(guest.profilePicture as any).url}
                                    alt={guest.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        )}

                        <span style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: 'clamp(22px, 5vw, 32px)',
                            color: '#1a1a1a',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            whiteSpace: 'nowrap',
                            marginBottom: '4px'
                        }}>
                            {guest?.name || 'Invitado'}
                        </span>

                        <div style={{
                            marginTop: '16px',
                            padding: '10px 24px',
                            border: '1px solid #d4af37',
                            borderRadius: '50px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-cormorant)',
                                fontSize: '18px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontWeight: 600,
                                color: '#d4af37',
                            }}>
                                Abrir Invitación
                            </span>
                            <FaEnvelopeOpenText style={{
                                fontSize: '16px',
                                color: '#d4af37',
                            }} />
                        </div>
                    </motion.button>
                </motion.div>
            )}

            {/* Invitation Modal Overlay */}
            <AnimatePresence>
                {isInvitationOpen && guest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 100,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background as requested
                            backdropFilter: 'blur(8px)', // Blur the background scene
                            WebkitBackdropFilter: 'blur(8px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflowY: 'auto', // Allow scrolling for the invitation
                            padding: '20px' // Mobile margin to show background
                        }}
                        onClick={() => setIsInvitationOpen(false)} // Click outside to close
                    >

                        {/* Content Container with Animation */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Spring-like ease out
                            style={{
                                width: '100%',
                                minHeight: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        // onClick removed to allow clicks to pass through to overlay
                        >
                            <InvitationRenderer
                                guest={guest}
                                transparentBg
                                onClose={() => setIsInvitationOpen(false)}
                                weddingDate={weddingDate}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Attribution */}
            <div style={{
                position: 'absolute',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
                fontSize: '10px',
                color: '#888',
                opacity: 0.6,
                fontFamily: 'sans-serif',
                pointerEvents: 'auto'
            }}>
                Creado por <a href="https://www.julian-medina.dev/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Julián Medina</a>
            </div>
        </div >
    )
}

export default ParallaxPhoto
