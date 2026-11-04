---
id: game-of-life
type: module-design
status: draft
title: Conway's Way of Life
parent: app-shell
depends-on: [i18n]
---

## Responsibility

Conway's Game of Life as a garden the visitor can seed, brush, and run. The rule is B3/S23. There is no score and no win state.

## Boundary

May depend on `i18n` and the shell helpers for speed names, cell position, and grid focus. Must not import `meadow` or `how-it-works`. Birth, survival, and death stay in the Life engine. `how-it-works` states this rule for visitors and must not be imported to enforce it.

## Rules

Each generation is one pass over the current grid. A dead cell with exactly 3 live neighbors is born. A live cell with 2 or 3 live neighbors survives and ages by one. Any other live cell dies. Age is display only: sprout at 1, growing flora at 2–5, perennial at 6 and above. Age does not change the rule. The withered count is deaths in the last generation, not an age stage.

Wrap-around is on by default, so opposite edges meet. The visitor can turn it off; cells past the edge then count as dead. Toggling wrap does not reset the generation. This topology is not shared with `meadow`.

Playback stops when no cell is alive, and will not start from an empty field.

Seeds (acorn, R-pentomino, diehard, rabbits, glider armada) and brushes (single cell, glider, blinker, acorn, eraser) only plant or erase. Replant restores the active seed. Clear empties the field and keeps the current wrap setting.
