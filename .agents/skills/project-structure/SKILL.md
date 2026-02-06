---
name: project-structure
description: >
  Enforces the specific folder structure and code generation workflows for this project.
  Use when creating or refactoring Collections, Globals, or Custom UI Fields.
  Ensures consistent organization and type safety.
author: system
version: 1.0.0
---

# Project Structure & Workflow Rules

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
- [ ] Is the Colection/Global in its own folder?
- [ ] Are custom fields inside a `fields/` subfolder?
- [ ] Did you run `generate:importmap` if you touched UI components?
- [ ] Did you run `generate:types` if you touched the schema?
