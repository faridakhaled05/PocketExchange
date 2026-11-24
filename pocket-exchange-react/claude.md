# Pocket Exchange (React): learning sessions R5 and R6

I'm a TrianglZ intern learning React by rebuilding Pocket Exchange. This is a learning project, not a feature project. Stay strictly inside the scope below.

## Current state (already done, don't redo)
R1-R4: Vite + React + TS, components/JSX/props, conditional rendering, lists and keys, useState, updater functions, immutable array updates. History add (newest first, cap 20), delete, clear all work. `lastConversion` state drives the result line.

## Scope: only these two sessions

### R5: controlled inputs and forms, state structure and derived values, lifting state up
Docs: react.dev/learn "Reacting to Input with State", "Choosing the State Structure", "Sharing State Between Components".
Build:
- Filter dropdown is controlled (`filter` state).
- Visible history is computed during render from `history` + `filter`, not stored in state.
- Totals line ("Totals: 7,696.74 EGP | 25.32 USD") is computed during render, not stored.
- State lives in `App`; children receive props and callbacks.

### R6: preserving and resetting state (the `key` trick), useEffect basics
Docs: react.dev/learn "Preserving and Resetting State", "Synchronizing with Effects" (basics only).
Build:
- Save/load history with localStorage, key `pocket-exchange:history`.
- Rates load through a 1-second async `loadRates()`; "Loading rates..." shows and Convert is disabled until ready; dropdowns fill when rates arrive.
- A small separate exercise for the `key` reset trick (it has no natural place in the app).
- Final check of the app against the assignment feature list (claude/pocket-exchange-requirements.md).

## Hard limits (do not break these)
- Do not add features, libraries, styling, tests, routing, or refactors that are not listed above.
- Do not touch topics from later in the React docs (useReducer, Context, useMemo, custom hooks, etc.). If one would "help", don't use it.
- Do not rewrite or reformat files I didn't ask about. Smallest possible diff.
- No new dependencies. No `any`. Keep strict TypeScript.
- If you notice an improvement, bug, or better pattern outside the scope, do NOT implement it. Add one line to a "Noticed, not done" list and show it at the end of the session. I will discuss those with my mentor.


## Known leftovers from R4 (fix only if I ask)
- Add `data-id={item.id}` to the delete button
- Result line uses `=`, history items use `->`
- One shared `formatMoney` instead of two copies