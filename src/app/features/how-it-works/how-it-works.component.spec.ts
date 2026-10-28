import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18nService } from '../../shared/i18n/i18n.service';
import { HowItWorksComponent } from './how-it-works.component';

describe('HowItWorks', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  async function render(lang: 'en' | 'de') {
    await TestBed.configureTestingModule({
      imports: [HowItWorksComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(I18nService).setLang(lang);
    const fixture = TestBed.createComponent(HowItWorksComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('explains the idea, the page contents and the algorithm in English', async () => {
    const root = await render('en');

    const text = root.textContent;
    expect(text).toContain('The idea');
    expect(text).toContain('What this page shows');
    expect(text).toContain('The algorithm');
    expect(text).toContain('B3/S23');
  });

  it('translates the page to German', async () => {
    const root = await render('de');

    const text = root.textContent;
    expect(text).toContain('Die Idee');
    expect(text).toContain('Der Algorithmus');
    expect(text).not.toContain('The algorithm');
  });

  it('links to the simulation page', async () => {
    const root = await render('en');

    const link = root.querySelector('.docs-cta a');
    expect(link?.getAttribute('href')).toBe('/game-of-life');
  });
});
