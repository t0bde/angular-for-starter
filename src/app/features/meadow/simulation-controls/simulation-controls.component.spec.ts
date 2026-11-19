import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationControlsComponent } from './simulation-controls.component';

describe('SimulationControlsComponent', () => {
  let fixture: ComponentFixture<SimulationControlsComponent>;
  let component: SimulationControlsComponent;
  let root: HTMLElement;

  const button = (label: string): HTMLButtonElement => {
    const match = Array.from(root.querySelectorAll('button')).find(
      (candidate) =>
        candidate.textContent?.trim() === label || candidate.getAttribute('aria-label') === label,
    );
    if (!match) throw new Error(`No button labelled "${label}"`);
    return match;
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [SimulationControlsComponent] }).compileComponents();
    fixture = TestBed.createComponent(SimulationControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('running', false);
    fixture.componentRef.setInput('speed', 'normal');
    fixture.componentRef.setInput('selectedTool', 'plant');
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => localStorage.clear());

  it('emits run, step and reset requests', () => {
    const run = vi.fn();
    const step = vi.fn();
    const reset = vi.fn();
    component.runToggled.subscribe(run);
    component.stepRequested.subscribe(step);
    component.resetRequested.subscribe(reset);

    button('Play').click();
    button('Advance one day').click();
    button('Reset balanced meadow').click();

    expect(run).toHaveBeenCalledTimes(1);
    expect(step).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('offers Pause while running', async () => {
    fixture.componentRef.setInput('running', true);
    await fixture.whenStable();

    expect(root.querySelector('.primary-command')?.textContent?.trim()).toBe('Pause');
  });

  it('emits the chosen speed and marks the current one', () => {
    const speed = vi.fn();
    component.speedSelected.subscribe(speed);

    button('fast').click();

    expect(speed).toHaveBeenCalledWith('fast');
    expect(button('normal').classList).toContain('selected');
    expect(button('fast').classList).not.toContain('selected');
  });

  it('emits each story preset', () => {
    const preset = vi.fn();
    component.presetSelected.subscribe(preset);

    root.querySelectorAll<HTMLButtonElement>('.preset-list button').forEach((story) => story.click());

    expect(preset.mock.calls.map(([name]) => name)).toEqual(['balanced', 'meadow', 'predator-boom']);
  });

  it('emits the painted species, including the eraser', () => {
    const tool = vi.fn();
    component.toolSelected.subscribe(tool);

    root.querySelectorAll<HTMLButtonElement>('.tool-list button').forEach((choice) => choice.click());

    expect(tool.mock.calls.map(([species]) => species)).toEqual([
      'plant',
      'herbivore',
      'predator',
      'empty',
    ]);
    expect(root.querySelector('.tool-list .selected')?.textContent).toContain('Plant');
  });
});
