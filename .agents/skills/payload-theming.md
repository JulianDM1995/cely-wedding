---
name: payload-theming
description: Reference skill for styling the Payload CMS Admin UI. Covers typography integration, CSS variables overriding for brand colors, and maintaining consistent Custom Field UI Look & Feel using Payload's token system.
---

# Payload UI Theming

Payload 3.0 allows complete visual control over the Admin Panel using **CSS Custom Properties** (Variables). It is absolutely critical that the Admin Panel consistently matches the aesthetic branding of your project.

First, ensure your `payload.config.ts` links to your custom stylesheet:
```typescript
admin: {
  css: path.resolve(__dirname, 'admin.scss'), // or .css
}
```

## 1. Configuring Typography
To use custom fonts that align aesthetically, redefine the base typography CSS variables utilizing `next/font` or a Google Fonts web import.

```css
:root {
  /* Override default Payload typographic tokens */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-display: 'Oswald', system-ui, sans-serif;
}
```

## 2. Configuring the Color Palette
Do not rely on the factory default blue/black Payload theme. You must redefine specific semantic CSS variables to tint elevations, backgrounds, and brand accents. Ensure you construct robust tokens for both Light Mode and Dark Mode.

### Light Mode Base Tokens
```css
:root {
  /* --- BRAND ACCENTS --- */
  /* Override success/primary tokens for action buttons (e.g. Save button) */
  --theme-success-400: #00d4ff; /* Project primary brand color */
  --theme-success-500: #008fb3; /* Darker variant for hover states */

  /* --- BACKGROUNDS & ELEVATION (Light Mode) --- */
  /* Nav panels and master list backgrounds */
  --theme-bg: #ffffff;
  --theme-elevation-50: #fdfdfd;
  --theme-elevation-100: #f7f7f7;   /* Marginally elevated elements (Cards, panels) */
  --theme-elevation-200: #ededed;   /* Higher elevation (Dropdowns, modals, inputs) */
  
  /* --- BORDERS & TEXT --- */
  --theme-text: #1a1a1a;
  --theme-border-color: #e5e5e5;
}
```

### Dark Mode Perfect Adjustments

```css
[data-theme='dark'] {
  --theme-success-400: #33e1ff; 

  --theme-bg: #09090b;              
  --theme-elevation-50: #0c0c0e;
  --theme-elevation-100: #121214;   
  --theme-elevation-200: #18181b;   
  
  --theme-text: #f4f4f5;
  --theme-border-color: #27272a;
}
```

## 3. Custom Field UI Look & Feel
When designing custom React components for fields in the Admin UI, you MUST maintain perfect consistency with Payload's native feel (similar to how AIAgent inputs are styled). 

Utilize Payload's native CSS variables instead of hard-coding hex colors to ensure seamless Light/Dark mode transitions.

### Standardized Field Architecture
Always implement inputs and labels conforming to this structural CSS and React structure:

```tsx
// Example of a Custom Field UI 
import React from 'react'
import { useField } from '@payloadcms/ui'

export const CustomInputField: React.FC<{ path: string; label: string; required?: boolean }> = ({ path, label, required }) => {
  const { value, setValue, showError } = useField<string>({ path })

  return (
    <div className="custom-field-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
      
      {/* 1. Label Alignment & Styling */}
      <label style={{ fontSize: '13px', color: 'var(--theme-text)', fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>}
      </label>

      {/* 2. Input Sizing & Theme Elevations */}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          border: \`1px solid \${showError ? '#ff4d4f' : 'var(--theme-elevation-200)'}\`,
          backgroundColor: 'var(--theme-elevation-50)',
          color: 'var(--theme-text)',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
      {showError && <span style={{ fontSize: '11px', color: '#ff4d4f' }}>Este campo es obligatorio.</span>}
    </div>
  )
}
```

**Key Styling Mandates:**
1. **Inputs:** `background: var(--theme-elevation-50)`, `border: 1px solid var(--theme-elevation-200)`.
2. **Padding:** Use `12px 14px` for tall, touch-friendly inputs.
3. **Corner Radius:** `8px` is standard for a clean aesthetic.
4. **Labels:** `13px` font size with `600` weight, text-colored `var(--theme-text)`, positioned with `gap: 6px` above the input.
5. **Transitions:** Always add `transition: border-color 0.2s ease` to gracefully handle focus and error states.
