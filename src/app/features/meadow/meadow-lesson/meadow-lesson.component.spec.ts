import { TestBed } from '@angular/core/testing';
import { MeadowLessonComponent } from './meadow-lesson.component';
import { PopulationSummaryComponent } from '../population-summary/population-summary.component';

describe('Meadow display components', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MeadowLessonComponent, PopulationSummaryComponent],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('MeadowLessonComponent announces the clue politely and describes the food chain', async () => {
    const fixture = TestBed.createComponent(MeadowLessonComponent);
    fixture.componentRef.setInput('message', 'Plants are scarce.');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[aria-live="polite"]')).not.toBeNull();
    expect(root.querySelector('h2')?.textContent?.trim()).toBe('Plants are scarce.');
    expect(root.querySelector('.food-chain')?.getAttribute('aria-label')).toContain(
      'plants feed plant eaters',
    );
  });

  it('PopulationSummaryComponent shows each total next to its label', async () => {
    const fixture = TestBed.createComponent(PopulationSummaryComponent);
    fixture.componentRef.setInput('populations', { plant: 12, herbivore: 5, predator: 2 });
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const read = (name: string) => root.querySelector(`.${name}`)?.textContent?.replace(/\s+/g, ' ').trim();

    expect(read('plants')).toBe('Plants12');
    expect(read('herbivores')).toBe('Plant eaters5');
    expect(read('predators')).toBe('Predators2');
  });
});
