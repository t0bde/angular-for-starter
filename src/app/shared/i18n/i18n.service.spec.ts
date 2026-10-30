import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from '../../app';
import { routes } from '../../app.routes';
import { ImpressumComponent } from '../../features/impressum/impressum.component';
import { MeadowComponent } from '../../features/meadow/meadow.component';
import { de } from './de';
import { en } from './en';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('has the same keys in both languages', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
  });

  it('prefers the saved language over the browser language', () => {
    localStorage.setItem('lang', 'de');
    expect(TestBed.inject(I18nService).lang()).toBe('de');
  });

  it('falls back to the browser language', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-AT');
    expect(TestBed.inject(I18nService).lang()).toBe('de');
    vi.restoreAllMocks();
  });

  it('translates, fills placeholders and persists the choice', async () => {
    const i18n = TestBed.inject(I18nService);
    expect(i18n.t('meadow.day', { day: 3 })).toBe('Day 3');

    i18n.setLang('de');
    TestBed.tick();
    expect(i18n.t('meadow.day', { day: 3 })).toBe('Tag 3');
    expect(localStorage.getItem('lang')).toBe('de');
    expect(document.documentElement.lang).toBe('de');
  });

  it('switches the whole page from the navbar', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const buttons = root.querySelectorAll<HTMLButtonElement>('.lang-switch button');

    expect(root.textContent).toContain('Meadow Makers');
    buttons[1].click();
    await fixture.whenStable();

    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(root.querySelector('.lab-brand')?.textContent?.trim()).toBe('Living Systems Lab');
    expect(root.querySelector('.lab-link')?.textContent?.trim()).toBe('Meadow Makers');
    expect(root.querySelector('.eyebrow')?.textContent?.trim()).toBe('Living systems lab');
    expect(root.querySelector('h1')?.textContent?.trim()).toBe('Meadow Makers');
    expect(root.textContent).toContain('Tag 0');
  });

  it('translates simulation text, including labels set in code', async () => {
    TestBed.inject(I18nService).setLang('de');
    const fixture = TestBed.createComponent(MeadowComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[aria-label="Einen Tag weiter"]')).not.toBeNull();
    expect(root.querySelector('.habitat-cell')?.getAttribute('aria-label')).toContain('Zeile 1');
  });

  it('shows the English courtesy copy of the Impressum', async () => {
    TestBed.inject(I18nService).setLang('en');
    const fixture = TestBed.createComponent(ImpressumComponent);
    await fixture.whenStable();
    const main = (fixture.nativeElement as HTMLElement).querySelector('main');

    expect(main?.getAttribute('lang')).toBe('en');
    expect(main?.textContent).toContain('Legal Disclosure');
  });
});
