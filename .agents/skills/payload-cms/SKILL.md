---
name: payload-cms
description: >
  Enhanced Payload CMS skill. Use when working with Payload CMS projects (payload.config.ts, collections, fields, hooks, access control, Payload API).
  Contains comprehensive rules and patterns from .cursor/rules and project-specific agent instructions.
  Triggers on tasks involving: collection definitions, field configurations, hooks, access control, database queries,
  custom endpoints, authentication, file uploads, drafts/versions, live preview, or plugin development.
author: payloadcms (enhanced)
version: 2.0.0
---

# Payload CMS Development (Enhanced)

This skill combines project-specific guidelines from `AGENTS.md` and detailed architectural rules from `.cursor/rules`.

## Quick Access

- **[Project Guidelines](AGENTS.md)** - Main project rules and security patterns.
- **[Access Control](references/access-control.md)** - Detailed RBAC and security examples.
- **[Collections](references/collections.md)** - Schema design and hook patterns.
- **[Fields](references/fields.md)** - Field types and validation.
- **[Hooks](references/hooks.md)** - Lifecycle event handling.
- **[Queries](references/queries.md)** - Local API and REST usage.

## Usage

Consult these resources when planning or implementing features to ensure strict adherence to project standards, especially regarding:
1. **Local API Security** (`overrideAccess: false`).
2. **Transaction Integrity** (passing `req`).
3. **Type Safety** (using generated types).
