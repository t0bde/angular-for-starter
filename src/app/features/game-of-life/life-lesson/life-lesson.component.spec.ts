import { TestBed } from '@angular/core/testing';
import { LifeLessonComponent } from './life-lesson.component';
import { LifeStatsComponent } from '../life-stats/life-stats.component';

describe('Life display components', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LifeLessonComponent, LifeStatsComponent],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('LifeStatsComponent shows living, sprout, perennial and withered counts', async () => {
    const fixture = TestBed.createComponent(LifeStatsComponent);
    fixture.componentRef.setInput('stats', {
      alive: 20,
      sprouts: 6,
      perennials: 9,
      bornLastTick: 6,
      diedLastTick: 3,
    });
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const read = (name: string) => root.querySelector(`.${name}`)?.textContent?.replace(/\s+/g, ' ').trim();

    expect(read('living')).toContain('Living Cells');
    expect(read('living')).toContain('20');
    expect(read('sprouts')).toContain('6');
    expect(read('perennials')).toContain('9');
    expect(read('withered')).toContain('3');
  });

  it('LifeLessonComponent shows the message and the B3/S23 rules', async () => {
    const fixture = TestBed.createComponent(LifeLessonComponent);
    fixture.componentRef.setInput('message', 'A quiet field.');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('h2')?.textContent?.trim()).toBe('A quiet field.');
    expect(root.querySelectorAll('.rule-pill')).toHaveLength(3);
    expect(root.querySelector('.rules-pills')?.textContent).toContain('Birth (B3)');
  });
});
