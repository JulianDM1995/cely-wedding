import { motion } from 'framer-motion'
import React from 'react'

// Define the shape of our configuration
export interface ParallaxConfig {
    characterConfig: {
        juan: { x: number, y: number, z: number }
        tatiana: { x: number, y: number, z: number }
        gatoL: { x: number, y: number, z: number }
        gatoR: { x: number, y: number, z: number }
    }
    flowerOpts: {
        width: string
        maxWidth: string
        bleedX: string
        bleedY: string
    }
    parallaxIntensity: {
        watercolor: string
        flowers: number
    }
}

interface ParallaxDebugModalProps {
    isOpen: boolean
    onClose: () => void
    config: ParallaxConfig
    onUpdate: (newConfig: ParallaxConfig) => void
    onReset: () => void
}

const ParallaxDebugModal: React.FC<ParallaxDebugModalProps> = ({
    isOpen,
    onClose,
    config,
    onUpdate,
    onReset
}) => {
    if (!isOpen) return null

    // Helper to update nested state
    const updateCharacter = (char: keyof ParallaxConfig['characterConfig'], field: 'x' | 'y' | 'z', value: number) => {
        onUpdate({
            ...config,
            characterConfig: {
                ...config.characterConfig,
                [char]: {
                    ...config.characterConfig[char],
                    [field]: value
                }
            }
        })
    }

    const updateFlower = (field: keyof ParallaxConfig['flowerOpts'], value: string) => {
        onUpdate({
            ...config,
            flowerOpts: {
                ...config.flowerOpts,
                [field]: value
            }
        })
    }

    const updateIntensity = (field: keyof ParallaxConfig['parallaxIntensity'], value: string | number) => {
        onUpdate({
            ...config,
            parallaxIntensity: {
                ...config.parallaxIntensity,
                [field]: value
            }
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg shadow-xl w-[90vw] max-w-md max-h-[80vh] overflow-y-auto pointer-events-auto relative flex flex-col"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
                    <h2 className="text-lg font-semibold">Parallax Debugger</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onReset}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                            title="Reset to Defaults"
                        >
                            🔄
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-6">
                    {/* Characters */}
                    <Section title="Characters (vh / px)">
                        {Object.entries(config.characterConfig).map(([name, values]) => (
                            <div key={name} className="border-b pb-2 last:border-0 last:pb-0">
                                <h4 className="capitalize font-medium text-sm mb-2 text-gray-700">{name}</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <NumberInput label="X (vh)" value={values.x} onChange={(v) => updateCharacter(name as any, 'x', v)} />
                                    <NumberInput label="Y (vh)" value={values.y} onChange={(v) => updateCharacter(name as any, 'y', v)} />
                                    <NumberInput label="Z (px)" value={values.z} onChange={(v) => updateCharacter(name as any, 'z', v)} />
                                </div>
                            </div>
                        ))}
                    </Section>

                    {/* Flowers */}
                    <Section title="Flowers">
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput label="Width" value={config.flowerOpts.width} onChange={(v) => updateFlower('width', v)} />
                            <TextInput label="Max Width" value={config.flowerOpts.maxWidth} onChange={(v) => updateFlower('maxWidth', v)} />
                            <TextInput label="Bleed X" value={config.flowerOpts.bleedX} onChange={(v) => updateFlower('bleedX', v)} />
                            <TextInput label="Bleed Y" value={config.flowerOpts.bleedY} onChange={(v) => updateFlower('bleedY', v)} />
                        </div>
                    </Section>

                    {/* Intensity */}
                    <Section title="Intensity">
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput label="Watercolor Depth" value={config.parallaxIntensity.watercolor} onChange={(v) => updateIntensity('watercolor', v)} />
                            <NumberInput label="Flowers Parallax (px)" value={config.parallaxIntensity.flowers} onChange={(v) => updateIntensity('flowers', v)} />
                        </div>
                    </Section>
                </div>
            </motion.div>
        </div>
    )
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border rounded-md p-3">
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
)

const NumberInput: React.FC<{ label: string; value: number; onChange: (val: number) => void }> = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="border rounded px-2 py-1 text-sm w-full"
            step={1}
        />
    </div>
)

const TextInput: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
        />
    </div>
)

export default ParallaxDebugModal
