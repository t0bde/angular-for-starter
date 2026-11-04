---
id: app-shell
type: module-design
status: draft
title: App shell
parent: architecture
depends-on: [i18n]
---

## Responsibility

Chrome and routing for the lab: the brand, links to the meadow, Life, and the Conway explanation, the language switch, and the legal footer. The empty path opens the meadow. Pages load on navigation.

Shared helpers live here because both labs need them and neither owns them: the speed names, a cell position, and keyboard movement of grid focus. They are not a third simulation. Arrow keys move focus and stop at the edge. Focus does not wrap, including on the Life grid, whose wrap setting applies only to the neighbor rule.

## Boundary

May use the router and `i18n`. Must not import a feature engine, or a feature component except through the route loader. Must not reach into another feature to read or write its grid.

The legal page is one route, not a module boundary, and it does not own simulation behavior. It states the operator and the privacy notice. Specs do not copy the operator's name or address. German on that page is the binding text; English is a courtesy translation. A language switch swaps the whole notice. Those paragraphs are not `i18n` keys, which is why this page is the exception to the string invariant in `architecture`. Hosting and analytics sentences there are the notice's own claims. Unconfirmed: this repository does not embed an analytics client, so those sentences are not an app behavior.
