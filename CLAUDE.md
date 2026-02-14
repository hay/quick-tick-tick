# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Raycast extension for adding tasks to TickTick via the TickTick Open API. TypeScript + React (JSX for Raycast views). No app installation required — uses OAuth to talk directly to the API.

## Commands
```bash
npm run dev       # Start Raycast development server
npm run build     # Build the extension
npm run lint      # Lint with Raycast ESLint config
npm run fix-lint  # Auto-fix lint issues
```

## Architecture
- `src/oauth.ts` — OAuth PKCE client setup, token exchange, and refresh. All commands wrap their export with `withAccessToken({ authorize, client })`.
- `src/api.ts` — TickTick API wrapper (`createTask`, `getProjects`). Uses access tokens from `@raycast/utils` `getAccessToken()`.
- Command files in `src/` map 1:1 to `commands` in `package.json`:
  - **No-view commands** (`add-to-inbox.ts`, `add-to-list.ts`) — receive task title via `LaunchProps` arguments, show HUD feedback
  - **View commands** (`add-to-any-list.tsx`, `set-default-list.tsx`) — render React `<Form>` with project dropdown
- `defaultProjectId` is stored in Raycast `LocalStorage` (set by `set-default-list`, read by `add-to-list`)
- Extension preferences (`clientId`, `clientSecret`) are defined in `package.json` and accessed via `getPreferenceValues<Preferences>()`
- `raycast-env.d.ts` is auto-generated from `package.json` — do not edit manually

## Key Patterns
- Every command's default export is wrapped: `export default withAccessToken({ authorize, client })(commandFn)`
- Prefer `showHUD()` for success feedback in no-view commands, `showToast()` for errors
- The TickTick API base URL is `https://api.ticktick.com/open/v1`