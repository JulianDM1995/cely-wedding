---
name: project-rules
description: Essential strict coding standards, directory structures, type safety patterns, and code generation workflows for Apptelier.
---

# Project Rules & Workflows

## Directory Structure

All Collections and Globals **MUST** follow the "Folder-per-Resource" pattern:

### Collections

**1. Simple Collections:**
- Use a single file in `src/collections/` (e.g., `src/collections/Orders.ts`).
- Use this when the collection has standard fields and no custom UI components.

**2. Complex Collections (with Custom UI):**
- Use a folder in `src/collections/` (e.g., `src/collections/Customers/`).
- Must contain an `index.ts` as the main configuration.
- Must use a `ui/` subdirectory to group custom components by feature.

**Folder Structure for Complex Collections:**
```text
src/collections/
└── [CollectionName]/
    ├── index.ts                # Collection Config definition
    ├── actions.ts              # (Optional) Server Actions specific to this collection
    └── ui/                     # Container for custom UI components
        └── [FeatureName]/      # Feature-specific folder (e.g., UpdatePassword, UserInfo)
            ├── Field.tsx       # Custom Field Component (PascalCase)
            ├── Cell.tsx        # Custom Cell Component (PascalCase)
            └── actions.ts      # (Optional) Co-located Server Actions
```

**Media Collections:**

Following the same pattern, specific media collections should be organized as:
```text
src/collections/
└── [ParentCollection]/     # e.g., Products, Staff, ProductCollections
    └── media/
        └── [MediaCollectionName].ts  # e.g., ProductPhotos.ts
```

### Globals

**1. Simple Globals:**
- Use a single file in `src/globals/` (e.g., `src/globals/Settings.ts`).
- Use this when the global has standard fields and no custom UI components.

**2. Complex Globals (with Custom UI):**
- Use a folder in `src/globals/` (e.g., `src/globals/Header/`).
- Must contain an `index.ts` as the main configuration.
- Must use a `ui/` subdirectory to group custom components by feature.

**Folder Structure for Complex Globals:**
```text
src/globals/
└── [GlobalName]/
    ├── index.ts                # Global Config definition
    ├── actions.ts              # (Optional) Server Actions specific to this global
    └── ui/                     # Container for custom UI components
        └── [FeatureName]/      # Feature-specific folder (e.g., HeaderActions, Menu)
            ├── Field.tsx       # Custom Field Component (PascalCase)
            ├── Cell.tsx        # Custom Cell Component (PascalCase)
            └── actions.ts      # (Optional) Co-located Server Actions
```

**Refactoring Rule**: If you see a standalone file like `src/collections/MyCol.ts`, you **MUST** refactor it to `src/collections/MyCol/index.ts` and move related components inside.

## 🚨 Type Safety & Reuse

**ALWAYS reuse Payload-generated types.**

When creating sub-components or utility functions that accept data from a Collection or Global, **DO NOT** manually define a new interface. Instead, use Indexed Access Types to extract the specific type from the main generated types.

### ❌ Bad Pattern (Redundant Definition)
```typescript
// Component receiving user personalization
interface PersonalizationProps {
  color: string;
  shape: string;
}

export const UserBadge = ({ personalization }: PersonalizationProps) => { ... }
```

### ✅ Good Pattern (Single Source of Truth)
```typescript
import type { User } from '@/payload-types'

// Use Indexed Access to get the exact type of the 'personalization' field
type PersonalizationProps = User['personalization']

export const UserBadge = (props: PersonalizationProps) => { ... }
```

## ⚛️ Component Exports

**Prefer Named Exports.**

Use named exports for all React components to ensure consistent naming during imports and better tree-shaking support.

### ❌ Bad Pattern
```typescript
const MyComponent = () => <div />
export default MyComponent
```

### ✅ Good Pattern
```typescript
export const MyComponent = () => <div />
```

## 🚨 Strict Coding Standards

### 1. Type Safety
- **NO `any`**: Strictly avoid `any`. It defeats the purpose of TypeScript.
  - **Use Payload Types**: Import generated types from `@/payload-types`.
  - **Derive Types**: If a type isn't exported, derive it using `typeof` or `ReturnType<typeof function>`.
  - **Unknown**: If you genuinely don't know the structure, usage of `unknown` with type narrowing is preferred over `any`.
  - **Exceptions**: Only use `any` if it is impossible to type correctly without extreme effort (e.g. some external libraries with bad types), but add a `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment with a justification.

### 2. Performance & Optimization
- **Use `next/image`**: Always use the `<Image />` component from `next/image` instead of the standard `<img>` tag.
  - This provides automatic image optimization, lazy loading, and avoids layout shifts.
  - Example: `import Image from 'next/image'; ... <Image src={...} alt="..." width={...} height={...} />`

### 3. Clean Code
- **No Unused Variables**: Never leave unused constants, variables, or imports in the code.
  - **Delete them**: If a variable like `setIsUploading` is defined but never used, simply remove it.
  - **Linting**: Ensure `eslint` passes without warnings about unused vars. 
  - **Destructuring**: If you need to ignore a specific destructured property, prefix it with `_` (underscore). e.g., `const { _unused, used } = props;`

## Code Generation Workflows

You must run specific generation scripts immediately after modifying stricture-related files (Payload Globals or Payload Collections or a field inside them).

### 1. `pnpm payload generate:importmap`
**When to run:**
- Adding a new Custom Component (Field, View, etc.).
- Renaming or moving a Custom Component.
- Changing the path to a component in a Config file.

### 2. `pnpm payload generate:types`
**When to run:**
- modifying any Collection or Global `fields`.
- Changing slugs or config options.
- Adding new Collections or Globals.

## Summary Checklist
- [ ] **STOP**: Did the user ask to commit/build? If no, DO NOT DO IT.
- [ ] Is the Colection/Global in its own folder?
- [ ] Are custom fields inside a `ui/` subfolder according to the complex grouping?
- [ ] Did you run `generate:importmap` if you touched UI components?
- [ ] Did you run `generate:types` if you touched the schema?
