---
id: i18n
type: submodule-design
status: draft
title: Visitor language
parent: app-shell
---

## Responsibility

English and German visitor strings, and the remembered language. The document language follows the choice.

## Boundary

English is the key set. German must define every English key. A missing German key is a broken contract.

The only stored preference is the language entry. This module must not store a grid, a seed, or any other visitor data, and it must not set a cookie.

It does not own the legal notice. That page reads the language signal and is not a dictionary (`app-shell`).

On first visit, use the saved choice if it is English or German. Otherwise use German when the browser language starts with `de`, and English otherwise. If storage is unavailable, skip the save and still switch the document language.
