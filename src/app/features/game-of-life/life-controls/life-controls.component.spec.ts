import { ComponentFixture, TestBed } from '@angular/core/testing';
import { seedPresets } from '../game-of-life-engine';
import { LifeControlsComponent } from './life-controls.component';

describe('LifeControlsComponent', () => {
  let fixture: ComponentFixture<LifeControlsComponent>;
  let component: LifeControlsComponent;
  let root: HTMLElement;

  const button = (label: string): HTMLButtonElement => {
    const match = Array.from(root.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === label,
    );
    if (!match) throw new Error(`No button labelled "${label}"`);
    return match;
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [LifeControlsComponent] }).compileComponents();
    fixture = TestBed.createComponent(LifeControlsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('running', false);
    fixture.componentRef.setInput('speed', 'normal');
    fixture.componentRef.setInput('wrapEdges', true);
    fixture.componentRef.setInput('presets', seedPresets);
    fixture.componentRef.setInput('activePreset', 'acorn');
    fixture.componentRef.setInput('activeSeedInfo', seedPresets[0]);
    fixture.componentRef.setInput('selectedBrush', 'single');
    await fixture.whenStable();
    root = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => localStorage.clear());

  it('emits run, step, replant and clear requests', () => {
    const run = vi.fn();
    const step = vi.fn();
    const reset = vi.fn();
    const clear = vi.fn();
    component.runToggled.subscribe(run);
    component.stepRequested.subscribe(step);
    component.resetRequested.subscribe(reset);
    component.clearRequested.subscribe(clear);

    button('Germinate').click();
    button('Step').click();
    button('Replant').click();
    button('Clear').click();

    expect([run, step, reset, clear].map((spy) => spy.mock.calls.length)).toEqual([1, 1, 1, 1]);
  });

  it('offers Pause while running', async () => {
    fixture.componentRef.setInput('running', true);
    await fixture.whenStable();

    expect(root.querySelector('.primary-command')?.textContent?.trim()).toBe('Pause');
  });

  it('reflects and toggles the wrap-around setting', () => {
    const wrap = vi.fn();
    component.wrapToggled.subscribe(wrap);
    const checkbox = root.querySelector<HTMLInputElement>('.wrap-toggle input')!;

    expect(checkbox.checked).toBe(true);
    checkbox.click();

    expect(wrap).toHaveBeenCalledTimes(1);
  });

  it('lists every seed with its cell count and marks the active one', () => {
    const seed = vi.fn();
    component.presetSelected.subscribe(seed);
    const seeds = root.querySelectorAll<HTMLButtonElement>('.preset-list button');

    expect(seeds).toHaveLength(seedPresets.length);
    expect(seeds[0].classList).toContain('selected');
    expect(seeds[0].textContent).toContain('7 cells');

    seeds[1].click();
    expect(seed).toHaveBeenCalledWith(seedPresets[1].id);
  });

  it('emits the chosen speed and brush', () => {
    const speed = vi.fn();
    const brush = vi.fn();
    component.speedSelected.subscribe(speed);
    component.brushSelected.subscribe(brush);

    button('fast').click();
    root.querySelectorAll<HTMLButtonElement>('.tool-list button').forEach((tool) => tool.click());

    expect(speed).toHaveBeenCalledWith('fast');
    expect(brush.mock.calls.map(([tool]) => tool)).toEqual([
      'single',
      'acorn',
      'glider',
      'blinker',
      'eraser',
    ]);
  });
});
