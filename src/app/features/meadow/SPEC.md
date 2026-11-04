---
id: meadow
type: module-design
status: draft
title: Meadow Makers
parent: app-shell
depends-on: [i18n]
---

## Responsibility

The food-chain lab. A visitor paints and runs a meadow of plants, plant eaters, and predators, and watches each group affect the next.

## Boundary

May depend on `i18n` and the shell helpers for speed names and grid focus. Must not import `game-of-life` or `how-it-works`. The engine has no UI dependency. The page may schedule playback and paint cells; it must not reimplement a day.

The grid is walled. Animals do not wrap. That is not the Life edge rule (`architecture`).

## Rules

A day proceeds in this order:

1. An empty tile grows a plant when enough neighboring plants exist and the growth roll succeeds. A plant hidden under an animal counts as a plant neighbor.
2. An animal that reaches its max age dies and leaves no move.
3. A hungry animal, one whose energy is below its hunger line, may eat an adjacent prey: plants for plant eaters, plant eaters for predators. A full animal does not hunt. It wanders onto an empty or plant tile and spends energy. Satiation is the lesson, and the hunger sliders are part of it.
4. Predators resolve before plant eaters. An eaten plant eater does not finish its move. Predators win that race.
5. Walking onto a plant does not eat it. The plant stays hidden and regrows when the tile is empty again. Only a hungry plant eater consumes a plant. A predator that eats a plant eater keeps that hidden plant, so the plant is not lost with the prey.
6. An animal with enough energy may reproduce into a different empty neighbor, paying an energy cost. An animal whose energy would fall to zero or below is not placed.

Playback stops when no animals remain, and will not start on a meadow with none.

Balanced, Green meadow, and Predator boom open from fixed seeds, so each story starts the same way. Running days are not seeded. The same opening is meant to diverge.

Behavior sliders change growth, reproduction chance, food energy, max age, and hunger for the next day. They do not rewrite the current grid.

Inspection shows one animal's energy, position, and whether a plant is hidden under it. Hover previews. A pinned card stays until dismissed, or until that cell no longer holds that animal.
