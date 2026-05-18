'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import PhoneInput, { Country, getCountryCallingCode } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './PhoneField.css'

type Props = {
    path: string
    label?: string
    required?: boolean
}

// Custom Country Select Component
const CountrySelect = ({ value, onChange, labels, ...rest }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    const handleSelect = (country: Country) => {
        onChange(country)
        setIsOpen(false)
    }

    // Get the flag/icon for the generated country select option
    // react-phone-number-input passes an `icon` component in `rest` if using the default export?
    // Actually, we are replacing the *select*. proper usage usually involves `rest.icon` not being available here 
    // depending on how PhoneInput renders it. 
    // However, `PhoneInput` renders the *selected* flag separately usually.
    // Let's inspect: The default `PhoneInput` renders a container with:
    // 1. A div `.PhoneInputCountry` which contains the <select> and the <Icon>.
    // If we replace `countrySelectComponent`, we are replacing the <select>.
    // But we want to replace the whole "Country Select" UI to make it a dropdown?
    // No, `countrySelectComponent` replaces just the `<select>` element which is usually invisible and overlaid on top of the flag.
    // To have a *custom* dropdown that shows *instead* of the default flag+arrow, we might need a different approach.
    // 
    // Actually, `react-phone-number-input` is hard to fully style customly via just `countrySelectComponent` because that component is expected to be a simple `select`.
    // 
    // STRATEGY: We will hide the default `.PhoneInputCountry` via CSS or props, and build our OWN wrapper if needed?
    // Better: Use `PhoneInput` but customize the `countrySelectComponent` to be a functional custom dropdown trigger?
    // No, standard `PhoneInput` structure is strict.
    // 
    // ALTERNATIVE: Use `react-phone-number-input/input` (core) and build the country selector completely ourselves.
    // This gives us full control.

    // Let's stick to `PhoneInput` but standard customization first:
    // We can't easily put a "custom dropdown with flags" *inside* the `countrySelectComponent` prop cleanly because the library expects an HTML select-like behavior (onChange with value).
    //
    // However, we can use `countrySelectComponent` to render a custom UI *if* we manage the open state.
    // But the library places the `Icon` next to it.

    // Let's try to override the styling of the native select to be invisible (default) and just style the container better?
    // The user wants "When I open the dropdown I see thumbnails of flags".
    // Native select on Windows/Mac usually shows text only (Country Name). It DOES NOT show images.
    // So we MUST implement a custom DOM-based dropdown.

    // To do this with `react-phone-number-input`, it is best to use the `Input` import and build the control wrapper ourselves.
    // Or we pass `countrySelectComponent` that returns a `div` (acting as trigger) and a `ul` (list).
    // The `PhoneInput` component renders:
    // <div class="PhoneInput">
    //   <div class="PhoneInputCountry">
    //      <CountrySelect/> -> This is what we replace.
    //      <CountryIcon/> -> This renders the selected flag.
    //   </div>
    //   <Input/>
    // </div>
    //
    // If we replace `CountrySelect` with our custom component, the `CountryIcon` might still be there.
    // We can pass `displayInitialValueAsLocalNumber` or similar? No.
    //
    // Let's try to implement `countrySelectComponent` that *includes* the logic to show the list.
    // And we might need to hide the default `CountryIcon` via CSS if our custom component handles strict layout.

    return (
        <div ref={wrapperRef} className="custom-country-select-wrapper">
            {/* The trigger is actually overlaid by default styling, but if we provide a component, 
                 Use CSS to position it or make the parent relative. */}

            {/* Invisible button to toggle? Or just strict DOM integration? */}
            <div
                className="custom-country-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title={labels[value]}
            >
                {/* We rely on the SIBLING `CountryIcon` for the "current" flag usually. 
                    But if we want to customize size/style, maybe we ignore that. 
                    Actually, making the native select replacement work as a dropdown is tricky z-index wise. */}
            </div>

            {isOpen && (
                <div className="custom-country-select-dropdown">
                    {rest.options.map((option: any) => (
                        <div
                            key={option.value}
                            className={`country-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {/* We need the flag icon here. `react-phone-number-input` exports `Flag`? No, it passes `icon` component in props to PhoneInput. */}
                            {/* We can import flags or just use emoji/names? User wants thumbnails. */}

                            {/* Ideally we use `react-phone-number-input/flags`? This is not a standard export path usually. */}
                            {/* We will rely on simple text for now OR try to use `getCountryCallingCode` to show info. */}
                            <span className="country-option-label">{option.label}</span>
                            <span className="country-option-code">+{getCountryCallingCode(option.value)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Wait, doing a full custom dropdown with flags *thumbnails* from scratch is hard without access to the flag icons source.
// `react-phone-number-input` uses `country-flag-icons` package internally usually.
// 
// SIMPLER APPROACH:
// Use `react-phone-number-input` default UI but STYLE it to look integrated.
// The user explicitly asked for "custom dropdown with flag thumbnails".
// Native select doesn't support images.
//
// REVISED PLAN:
// Use `react-phone-number-input/input` to render JUST the input.
// Build a separate "Country Selector" dropdown next to it using standard state.
// Getting the list of countries: `import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'`
// Getting flags: URL like `https://purecatamphetamine.github.io/country-flag-icons/3x2/{code}.svg` or just emojis if easiest.
// Or usage of `react-phone-number-input/flags`?
// Let's use a public CDN for flags to ensure "thumbnails" work without complex asset bundling.

// Let's update `PhoneField.tsx` to use this decoupling.

export const PhoneField: React.FC<Props> = ({ path, label, required }) => {
    const { value, setValue } = useField<string>({ path })
    const [country, setCountry] = useState<Country>('CO')

    // Need to sync country when value changes? 
    // `react-phone-number-input`'s `PhoneInput` usually handles this.
    // If we decouple, we must handle it. 

    // Instead of completely decoupling, let's use `PhoneInput` but pass a `countrySelectComponent` that is a fully featured dropdown.
    // And we hide the default `CountryIcon` via CSS (`.PhoneInputCountryIcon { display: none }`).
    // And our `CountrySelect` renders the Current Flag + Arrow + Dropdown.

    return (
        <div className="field-type text">
            <label className="field-label">
                {label}
                {required && <span className="required">*</span>}
            </label>
            <div className="phone-field-container">
                <PhoneInput
                    placeholder="300 123 4567"
                    value={value}
                    onChange={setValue}
                    defaultCountry="CO"
                    className="payload-phone-input"
                    countrySelectComponent={CustomCountrySelect}
                    numberInputProps={{
                        className: 'payload-phone-input-input' // Custom class for the specific input element
                    }}
                />
            </div>
        </div>
    )
}

const CustomCountrySelect = ({ value, onChange, options, ...rest }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [wrapperRef])

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
        // Reset search when closed
        if (!isOpen) {
            setSearch('')
        }
    }, [isOpen])

    const handleSelect = (country: string) => {
        onChange(country)
        setIsOpen(false)
    }

    const FlagIcon = ({ countryCode }: { countryCode: string }) => (
        <img
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
            alt={countryCode}
            style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }}
        />
    )

    // Filter options
    const filteredOptions = options.filter((option: any) => {
        if (!option.value) return false // Remove headers/separators like "International"
        const label = option.label.toLowerCase()
        const query = search.toLowerCase()
        const code = getCountryCallingCode(option.value)
        return label.includes(query) || code.includes(query)
    })

    return (
        <div className="custom-country-select" ref={wrapperRef}>
            <button
                type="button"
                className="selected-country-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? <FlagIcon countryCode={value} /> : <span>🌐</span>}
                <span className="arrow-down">▼</span>
            </button>

            {isOpen && (
                <div className="country-dropdown-list">
                    <div className="country-search-wrapper">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="country-search-input"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="country-list-scroll">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option: any) => (
                                <div
                                    key={option.value || 'unknown'}
                                    className={`country-item ${value === option.value ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (option.value) handleSelect(option.value)
                                    }}
                                >
                                    {option.value && <FlagIcon countryCode={option.value} />}
                                    <span className="country-name">{option.label}</span>
                                    {option.value && (
                                        <span className="country-code">+{getCountryCallingCode(option.value)}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="country-no-results">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
