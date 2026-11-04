---
id: how-it-works
type: module-design
status: draft
title: How Conway's Game of Life works
parent: app-shell
depends-on: [i18n]
references: [game-of-life]
---

## Responsibility

Explain Conway's Game of Life in the visitor's language: the idea, what the Life page shows, and the B3/S23 pass, including wrap-around. Link the visitor back into the simulation.

## Boundary

May depend on `i18n` only. Must not import the Life engine or turn pattern tables into a second implementation of the rule.

The prose must stay true to `game-of-life`: Moore neighborhood of 8, birth on 3, survival on 2 or 3, death otherwise, wrap on by default, and dead-beyond-the-edge when wrap is off. Age stages are display, not rule inputs.

This page explains Conway only. It does not own meadow rules; those stay in `meadow`.
