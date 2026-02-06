---
name: project-rules
description: >
  General project rules and workflows. Enforces folder structure, code generation patterns, and strict policies on build/commit/push operations.
  Use for all project development tasks.
author: system
version: 2.0.0
---

# Project Rules & Workflows

## 🚨 STRICT POLICY: Version Control & Builds

**You must NOT run the following commands automatically:**
1.  `npm run build` / `pnpm build` / `next build`
2.  `git commit`
3.  `git push`

**Rule:** You may ONLY execute these commands if the user **explicitly requests them** in the current prompt. Never assume "it's time to save" or "verify integrity" by running these without permission.

## Directory Structure

All Collections and Globals **MUST** follow the "Folder-per-Resource" pattern:

### Collections
```
src/collections/
└── [CollectionName]/
    ├── index.ts                # Collection Config definition
    ├── fields/                 # Custom UI Fields specific to this collection
    │   └── [FieldName]/
    │       └── index.tsx       # Field Component
    └── cells/                  # Custom List View Cells
        └── [CellName]/
            └── index.tsx       # Cell Component
```

### Globals
```
src/globals/
└── [GlobalName]/
    ├── index.ts                # Global Config definition
    └── fields/                 # Custom UI Fields specific to this global
        └── [FieldName]/
            └── index.tsx       # Field Component
```

**Refactoring Rule**: If you see a standalone file like `src/collections/MyCol.ts`, you **MUST** refactor it to `src/collections/MyCol/index.ts` and move related components inside.

## Code Generation Workflows

You must run specific generation scripts immediately after modifying stricture-related files.

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
- [ ] Are custom fields inside a `fields/` subfolder?
- [ ] Did you run `generate:importmap` if you touched UI components?
- [ ] Did you run `generate:types` if you touched the schema?
