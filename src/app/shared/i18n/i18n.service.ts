import { Injectable, effect, signal } from '@angular/core';
import { de } from './de';
import { en, TranslationKey } from './en';

export type Lang = 'en' | 'de';

const storageKey = 'lang';
const dictionaries: Record<Lang, Record<TranslationKey, string>> = { en, de };

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'en' || saved === 'de') {
      return saved;
    }
  } catch {
    // storage unavailable: fall back to the browser language
  }
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(initialLang());
  // Set by the title strategy so the page title follows language changes.
  readonly titleKey = signal<string | null>(null);

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      const key = this.titleKey();
      if (key) {
        document.title = this.t(key);
      }
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      // the choice just won't persist
    }
  }

  // Arrow property so components can use `readonly t = inject(I18nService).t`.
  readonly t = (key: string, params?: Record<string, string | number>): string => {
    const text = dictionaries[this.lang()][key as TranslationKey] ?? key;
    return params ? text.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? '')) : text;
  };
}
