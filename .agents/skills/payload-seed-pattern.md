---
name: payload-seed-script-pattern
description: Reference skill for the Payload CMS seed script patterns. Use this when writing or modifying the main database seed script to handle correct wiping, hierarchical entity creation, and mock image generation.
---

# Payload CMS Seed Script Pattern

## Context
This skill outlines the standard pattern for building a robust seed script in Payload CMS 3.0. This pattern ensures safe media wipes, dynamic asset fetching without cluttering the repo with mock images, and hierarchical procedural data generation.

## Key Principles

1. **Standalone Execution Wrapper:** Use `tsx` directly via `tsx src/scripts/seed/index.ts` executed from `package.json`.
2. **Centralized Helpers:** Contain generic mocking and cleaning functions (`makeLexical`, `fetchMockImage`, `nukeMediaDirectory`).
3. **Mock Image Handling:** Use the `placehold.co` API passing texts and colors, and use the `--download-assets` flag from the terminal as a control to temporarily store assets and prevent wasting requests.
4. **Structured Phasing:** Clearly separate the main function's phases:
   - *WIPE:* Clean local folders and systematically empty collections.
   - *ADMIN USER:* Seed staff and primary accounts.
   - *PROCEDURAL SEEDING:* Generate interdependent collections (e.g.: Collections -> Capsules -> Products) through iterations.
   - *GLOBALS:* Finish by seeding the globals.

## Anatomy of the Seed Script (`src/scripts/seed/index.ts`)

```typescript
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { Payload, getPayload } from 'payload'
import configPromise from '../../payload.config'

export const seed = async (payload: Payload) => {
  payload.logger.info('🚀 Starting Minimal Wipe & Admin Seeding Process...')

  // 1. HELPERS
  // nukeMediaDirectory() to clean the /media folder
  // fetchMockImage(keyword, id, bg, fg, name) to cache locally from placehold.co (respecting --download-assets)
  // makeLexical(text) structured wrapper for Lexical nodes

  // 2. WIPE
  // Delete using payload.delete({...}) for every registered collection name

  // 3. ADMIN CREATION
  // Create user with password 'password' and set env variables or defaults

  // 4. ENTITY LOOPS (HIERARCHY)
  // Iterate through structured dependencies, creating media and relational links in let variables.
  
  // 5. MOCK GLOBALS
  // payload.updateGlobal({...})

  payload.logger.info('🎉 Full Seeding Process Completed!')
}

export default seed

// Standalone execution wrapper
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('seed/index.ts')) {
  const runSeed = async () => {
    const payload = await getPayload({ config: configPromise })
    await seed(payload)
    process.exit(0)
  }

  runSeed().catch((err) => {
    console.error('❌ Error seeding data:', err)
    process.exit(1)
  })
}
```

## `package.json` Configuration
Ensure the seed script uses `tsx` and loads `.env.local` variables directly in context:
```json
"scripts": {
  "seed": "env-cmd -f .env.local cross-env NODE_OPTIONS=--no-deprecation tsx src/scripts/seed/index.ts"
}
```
