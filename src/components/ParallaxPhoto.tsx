'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React from 'react'

const FLOWER_OPTS = {
    width: '35vw',
    maxWidth: '350px',
    bleedX: '-4.5%',   // Horizontal bleed (left/right)
    bleedY: '-10%',    // Vertical bleed (top/bottom) - Increased to avoid clipping
}

// Configuration for parallax intensity (adjust numbers to calibrate)
const DESKTOP_PARALLAX_INTENSITY = {
    watercolor: '15%',   // Background depth
    flowers: 65         // Very close (frame)
}

const MOBILE_PARALLAX_INTENSITY = {
    watercolor: '15%',
    flowers: 90         // Strong frame movement (90)
}

// Configuration for characters (x, y, z)
const DESKTOP_CHARACTER_CONFIG = {
    gatoL: { x: -25, y: 10, z: 40 },     // Far Left, Distinct from Frame (65)
    juan: { x: -12, y: 15, z: 15 },       // Near Left
    tatiana: { x: 12, y: 15, z: 5 },     // Near Right
    gatoR: { x: 25, y: 10, z: 40 },      // Far Right, Distinct from Frame (65)
}

const MOBILE_CHARACTER_CONFIG = {
    juan: { x: -8, y: 3, z: 10 },       // Lifted (3vh), Background Z (10)
    tatiana: { x: 8, y: 3, z: 10 },     // Lifted (3vh), Background Z (10)
    gatoL: { x: -12, y: 0, z: 30 },      // Midground Z (30)
    gatoR: { x: 12, y: 0, z: 30 },       // Midground Z (30)
}

const DESKTOP_FLOWER_OPTS = {
    width: '35vw',
    maxWidth: '350px',
    bleedX: '-4.5%',
    bleedY: '-10%',
}

const MOBILE_FLOWER_OPTS = {
    width: '45vw', // Larger flowers on mobile to fill frame
    maxWidth: 'none',
    bleedX: '-8%',
    bleedY: '-5%',
}

const ParallaxPhoto: React.FC = () => {
    // Mouse position state
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Configuration State (Responsive)
    const [isTiltActive, setIsTiltActive] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // Derived Configuration
    const characterConfig = isMobile ? MOBILE_CHARACTER_CONFIG : DESKTOP_CHARACTER_CONFIG
    const flowerOpts = isMobile ? MOBILE_FLOWER_OPTS : DESKTOP_FLOWER_OPTS
    const parallaxIntensity = isMobile ? MOBILE_PARALLAX_INTENSITY : DESKTOP_PARALLAX_INTENSITY

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

    // Handle Resize for Responsive Layout
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize() // Init
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

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
        const x = gamma / 90 // Map -45..45 to -0.5..0.5

        // Beta: Front/Back tilt (-180 to 180)
        // Standard holding is around 45 degrees.
        // We want 45 to be "center" (0).
        // 0 (flat) -> -0.5
        // 90 (upright) -> 0.5
        const beta = Math.min(Math.max(e.beta, 0), 90)
        const y = (beta - 45) / 90 // Map 0..90 to -0.5..0.5

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
                top: '50%',
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
                    alt="Juan"
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
                    alt="Tatiana"
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
                    onClick={(e) => {
                        e.stopPropagation()
                        alert('🐈 PRRRRR')
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        height: '24vh',
                        objectFit: 'contain',
                        zIndex: 9, // Closest
                        pointerEvents: 'auto',
                        cursor: 'pointer',
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
                    onClick={(e) => {
                        e.stopPropagation()
                        alert('🐱 MEOW')
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        height: '24vh',
                        objectFit: 'contain',
                        zIndex: 8,
                        pointerEvents: 'auto',
                        cursor: 'pointer',
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
        </div>
    )
}

export default ParallaxPhoto
