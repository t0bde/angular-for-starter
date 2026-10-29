import { ComponentFixture, TestBed } from '@angular/core/testing';
import { animalCell, emptyCell } from './meadow-engine';
import { MeadowComponent } from './meadow.component';

describe('MeadowComponent', () => {
  let component: MeadowComponent;
  let fixture: ComponentFixture<MeadowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeadowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeadowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with the long-running ecosystem settings and restores them on reset', () => {
    const expected = {
      plantGrowthChance: 0.4,
      herbivoreReproductionChance: 0.28,
      herbivoreFoodEnergy: 6,
      predatorReproductionChance: 0.06,
      predatorFoodEnergy: 2,
    };

    expect(component.behaviorSettings()).toEqual(expected);

    component.updateBehavior({
      plantGrowthChance: 0,
      herbivoreReproductionChance: 0,
      herbivoreFoodEnergy: 1,
      predatorReproductionChance: 0,
      predatorFoodEnergy: 1,
    });
    component.reset();

    expect(component.behaviorSettings()).toEqual(expected);
  });

  it('renders the ecosystem controls and can advance one day', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const initialTick = component.world().tick;
    compiled.querySelector<HTMLButtonElement>('[aria-label="Advance one day"]')?.click();
    expect(compiled.querySelector('h1')?.textContent).toContain('Meadow Makers');
    expect(component.world().tick).toBe(initialTick + 1);
  });

  it('uses roving focus for habitat cells', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cells = compiled.querySelectorAll<HTMLButtonElement>('button.habitat-cell');

    cells[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(cells).toHaveLength(252);
    expect(cells[0].getAttribute('tabindex')).toBe('-1');
    expect(cells[1].getAttribute('tabindex')).toBe('0');
    expect(component.activeCell()).toEqual({ row: 0, column: 1 });
  });

  it('updates behavior settings from a slider and uses them on the next step', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sliders = compiled.querySelectorAll<HTMLInputElement>(
      '.behavior-row input[type="range"]',
    );

    sliders[1].value = '0.5';
    sliders[1].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.behaviorSettings().herbivoreReproductionChance).toBe(0.5);
  });

  it('stops the simulation when the last plant eater or predator dies', () => {
    component.world.set({
      grid: [[animalCell('herbivore', 1)]],
      tick: 0,
    });
    component.toggleRunning();
    expect(component.running()).toBe(true);

    component.step();

    expect(component.populations()).toEqual({ plant: 0, herbivore: 0, predator: 0 });
    expect(component.running()).toBe(false);
  });

  it('does not start the simulation when no plant eaters or predators are alive', () => {
    component.world.set({
      grid: [[{ species: 'plant' }, emptyCell()]],
      tick: 0,
    });

    component.toggleRunning();

    expect(component.running()).toBe(false);
  });
});
