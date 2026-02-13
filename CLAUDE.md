# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Quick Tick Tick is a **Raycast extension** for quickly adding TickTick tasks without opening the app. Built with TypeScript and the Raycast API.

## Commands
```bash
npm run dev       # Start Raycast development mode (hot reload)
npm run build     # Build the extension
npm run lint      # Lint with ESLint (Raycast config)
npm run fix-lint  # Auto-fix lint issues
```

All build/dev/lint commands use the `ray` CLI under the hood.

## Architecture
- **Raycast extension** — not a standalone Node.js app. Commands are defined in `package.json` under `commands[]` and map to files in `src/`.
- Each command file in `src/` exports a default function (or React component for view-mode commands).
- The `add-to-inbox` command runs in `no-view` mode (executes without rendering a UI).
- `raycast-env.d.ts` is auto-generated from `package.json` manifest — do not edit manually. It provides `Preferences` and `Arguments` types for each command.

## Key Dependencies
- `@raycast/api` — UI components, preferences, clipboard, notifications
- `@raycast/utils` — hooks and utilities for Raycast extensions

## Code Style
- Prettier: 120 char width, double quotes
- ESLint: `@raycast/eslint-config`
- TypeScript strict mode
