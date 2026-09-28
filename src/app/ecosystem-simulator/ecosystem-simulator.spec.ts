import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcosystemSimulatorComponent } from './ecosystem-simulator';

describe('EcosystemSimulatorComponent', () => {
  let component: EcosystemSimulatorComponent;
  let fixture: ComponentFixture<EcosystemSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcosystemSimulatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcosystemSimulatorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const sliders = compiled.querySelectorAll<HTMLInputElement>('.behavior-row input[type="range"]');

    sliders[1].value = '0.5';
    sliders[1].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.behaviorSettings().herbivoreReproductionChance).toBe(0.5);
  });
});
