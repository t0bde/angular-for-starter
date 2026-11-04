---
id: architecture
type: architecture-design
status: draft
title: Living Systems Lab architecture
parent: living-systems-lab
---

## Drivers

The site is a static browser lab: two simulations a visitor can open without signing in, in the language chosen in `i18n`. There is no application server and no shared session.

## Decisions

- Each page is a lazy route. The empty path opens the meadow. Feature pages do not import one another.
- The meadow is a walled habitat. Life wraps by default, and the visitor can turn wrap off. That split is deliberate: wrap-around is a Life lesson, not a rule both labs share. See `meadow` and `game-of-life`.
- A meadow story opens from a fixed seed, so the named openings match every time. Once it is running, each day draws from an unseeded random source, so the same opening is not replayable. That divergence is intentional.
- A tick's rules stay in that lab's engine. The page may schedule time, paint, and stop playback. It does not reimplement the neighbor rule.

## Invariants

- `meadow` must not import `game-of-life` or `how-it-works`, and those pages must not import `meadow`.
- Visitor strings go through `i18n`. English is the key set. The legal page is the exception (`app-shell`).
- The shell does not own a grid. Each lab owns its own world for the life of the page.

## Limitations

- Reloading the page drops the meadow and the colony. The language choice is the only preference kept.
