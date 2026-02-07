'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React from 'react'

const FLOWER_OPTS = {
    width: '35vw',
    maxWidth: '350px',
    bleedX: '-4.5%',   // Horizontal bleed (left/right)
    bleedY: '-10%',    // Vertical bleed (top/bottom) - Increased to avoid clipping
}

// Configuration for parallax intensity (adjust numbers to calibrate)
const PARALLAX_INTENSITY = {
    watercolor: '5%',   // Background depth
    juan: 15,           // Middle ground (pixels)
    tatiana: 10,        // Background character (pixels)
    catLeft: 45,        // Foreground close (pixels)
    catRight: 25,       // Foreground far (pixels)
    flowers: 65         // Very close (frame)
}

// Configuration for character X positions (adjust for spacing)
const CHARACTER_POSITION = {
    juan: '-6vh',       // marginRight (pulls center)
    tatiana: '-6vh',    // marginLeft (pulls center)
    catLeft: '-20vh',   // left offset
    catRight: '-8vh'    // right offset
}

const ParallaxPhoto: React.FC = () => {
    // Mouse position state
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Configuration State (Responsive)
    const [flowerOpts, setFlowerOpts] = React.useState(FLOWER_OPTS)
    const [characterPos, setCharacterPos] = React.useState(CHARACTER_POSITION)
    const [isTiltActive, setIsTiltActive] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // Smooth spring animation configuration
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 } // "Floaty" feel

    // Create smoothed mouse values
    const mouseXSpring = useSpring(mouseX, springConfig)
    const mouseYSpring = useSpring(mouseY, springConfig)

    // Calculate transforms for different layers (depth)
    // Watercolor Background (Deep depth - moves opposite to mouse)
    const watercolorX = useTransform(mouseXSpring, [-0.5, 0.5], [PARALLAX_INTENSITY.watercolor, `-${PARALLAX_INTENSITY.watercolor}`])
    const watercolorY = useTransform(mouseYSpring, [-0.5, 0.5], [PARALLAX_INTENSITY.watercolor, `-${PARALLAX_INTENSITY.watercolor}`])

    // Juan (Middle ground)
    const juanX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.juan}px`, `${PARALLAX_INTENSITY.juan}px`])
    const juanY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.juan}px`, `${PARALLAX_INTENSITY.juan}px`])

    // Tatiana (Slightly behind Juan - moves less)
    const tatianaX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.tatiana}px`, `${PARALLAX_INTENSITY.tatiana}px`])
    const tatianaY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.tatiana}px`, `${PARALLAX_INTENSITY.tatiana}px`])

    // Cats (Foreground)
    // Left Cat (Gato1) - Closest foreground (moves most)
    const catLeftX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.catLeft}px`, `${PARALLAX_INTENSITY.catLeft}px`])
    const catLeftY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.catLeft}px`, `${PARALLAX_INTENSITY.catLeft}px`])

    // Right Cat (Gato0) - Slightly behind left cat
    const catRightX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.catRight}px`, `${PARALLAX_INTENSITY.catRight}px`])
    const catRightY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.catRight}px`, `${PARALLAX_INTENSITY.catRight}px`])

    // Flowers (Frame - Very Close)
    const flowerX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.flowers}px`, `${PARALLAX_INTENSITY.flowers}px`])
    const flowerY = useTransform(mouseYSpring, [-0.5, 0.5], [`-${PARALLAX_INTENSITY.flowers}px`, `${PARALLAX_INTENSITY.flowers}px`])


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
            if (window.innerWidth < 768) {
                // Mobile Configuration
                setIsMobile(true)
                setFlowerOpts({
                    width: '45vw', // Larger flowers on mobile to fill frame
                    maxWidth: 'none',
                    bleedX: '-8%',
                    bleedY: '-5%',
                })
                setCharacterPos({
                    juan: '-4vh', // Tighter spacing
                    tatiana: '-4vh',
                    catLeft: '-10vh', // Reduce offset so it doesn't go off screen
                    catRight: '-2vh'
                })
            } else {
                // Desktop Configuration (Reset)
                setIsMobile(false)
                setFlowerOpts(FLOWER_OPTS)
                setCharacterPos(CHARACTER_POSITION)
            }
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
                        x: watercolorX,
                        y: watercolorY,
                        opacity: 0.5,
                        mixBlendMode: 'darken'
                    }}
                />
            </div>

            {/* Characters Container - Centered */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                zIndex: 5,
                paddingBottom: '5vh' // Reduced padding to allow more space
            }}>
                <div style={{ position: 'relative', width: 'auto', height: '75vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

                    {/* Couple - Middle Layer (Split for individual parallax) */}
                    <div style={{ position: 'relative', display: 'flex', zIndex: 6 }}>
                        <motion.img
                            src="/designs/juan.png"
                            alt="Juan"
                            style={{
                                height: '70vh',
                                objectFit: 'contain',
                                marginRight: characterPos.juan,
                                position: 'relative',
                                zIndex: 2,
                                x: juanX,
                                y: juanY
                            }}
                        />
                        <motion.img
                            src="/designs/tatiana.png"
                            alt="Tatiana"
                            style={{
                                height: '70vh',
                                objectFit: 'contain',
                                marginLeft: characterPos.tatiana,
                                position: 'relative',
                                zIndex: 1,
                                x: tatianaX,
                                y: tatianaY
                            }}
                        />
                    </div>

                    {/* Left Cat (Gato1) - Foreground (Closest) */}
                    <motion.img
                        src="/designs/gato1.png"
                        alt="Gato 1"
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            left: characterPos.catLeft,
                            height: '32vh',
                            objectFit: 'contain',
                            zIndex: 9, // Closest
                            x: catLeftX,
                            y: catLeftY
                        }}
                    />

                    {/* Right Cat (Gato0) - Foreground (Slightly behind) */}
                    <motion.img
                        src="/designs/gato0.png"
                        alt="Gato 0"
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            right: characterPos.catRight,
                            height: '32vh',
                            objectFit: 'contain',
                            zIndex: 8,
                            x: catRightX,
                            y: catRightY
                        }}
                    />
                </div>
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
                    y: flowerY
                }}
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
                    y: flowerY
                }}
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
                    y: flowerY
                }}
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
                    y: flowerY
                }}
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
