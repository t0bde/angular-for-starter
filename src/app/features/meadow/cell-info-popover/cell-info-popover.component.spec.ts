import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { animalCell } from '../meadow-engine';
import type { CellInspection } from '../meadow-ui.types';
import { CellInfoPopoverComponent } from './cell-info-popover.component';

describe('CellInfoPopoverComponent', () => {
  let fixture: ComponentFixture<CellInfoPopoverComponent>;
  let dismissed: Mock<() => void>;

  const inspection = (overrides: Partial<CellInspection> = {}): CellInspection => ({
    position: { row: 2, column: 4 },
    anchor: { left: 100, top: 120, right: 130, bottom: 150 },
    pinned: false,
    species: 'herbivore',
    cell: animalCell('herbivore', 7),
    ...overrides,
  });

  const card = () => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.cell-info')!;

  async function render(info: CellInspection): Promise<void> {
    fixture = TestBed.createComponent(CellInfoPopoverComponent);
    fixture.componentRef.setInput('info', info);
    dismissed = vi.fn<() => void>();
    fixture.componentInstance.dismissed.subscribe(dismissed);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [CellInfoPopoverComponent] }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('shows the animal, its energy and its 1-based position', async () => {
    await render(inspection());

    const text = card().textContent ?? '';
    expect(text).toContain('Plant eater');
    expect(text).toContain('7');
    expect(text).toContain('Row 3, column 5');
    expect(text).not.toContain('Plant underneath');
  });

  it('reports a hidden plant under the animal', async () => {
    await render(inspection({ cell: animalCell('herbivore', 7, true) }));

    expect(card().textContent).toContain('Plant underneath');
  });

  it('sits to the right of the cell when there is room', async () => {
    await render(inspection());

    expect(card().style.left).toBe('140px');
  });

  it('flips to the left of the cell when it would leave the viewport', async () => {
    const anchor = { left: window.innerWidth - 40, top: 120, right: window.innerWidth - 10, bottom: 150 };
    await render(inspection({ anchor }));

    expect(card().style.left).toBe(`${anchor.left - 10 - 200}px`);
  });

  it('dismisses on Escape', async () => {
    await render(inspection());

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(dismissed).toHaveBeenCalledTimes(1);
  });

  it('dismisses on an outside press only when pinned', async () => {
    await render(inspection({ pinned: false }));
    document.dispatchEvent(new Event('pointerdown'));
    expect(dismissed).not.toHaveBeenCalled();

    fixture.destroy();
    await render(inspection({ pinned: true }));
    document.dispatchEvent(new Event('pointerdown'));
    expect(dismissed).toHaveBeenCalledTimes(1);
  });
});
