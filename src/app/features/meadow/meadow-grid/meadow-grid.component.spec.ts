import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { animalCell } from '../meadow-engine';
import type { CellPosition } from '../../../shared/simulation.types';
import { MeadowGridComponent } from './meadow-grid.component';

describe('MeadowGridComponent pointer handling', () => {
  let component: MeadowGridComponent;
  let fixture: ComponentFixture<MeadowGridComponent>;
  let cell: HTMLElement;
  let cellPainted: Mock<(position: CellPosition) => void>;

  const pointer = (pointerType: 'mouse' | 'touch') =>
    ({ pointerType, currentTarget: cell }) as unknown as PointerEvent;
  const click = (detail: number) => ({ detail }) as MouseEvent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MeadowGridComponent] }).compileComponents();

    fixture = TestBed.createComponent(MeadowGridComponent);
    fixture.componentRef.setInput('grid', [[animalCell('herbivore', 3)]]);
    fixture.componentRef.setInput('activeCell', { row: 0, column: 0 });
    fixture.detectChanges();
    component = fixture.componentInstance;
    cell = fixture.nativeElement.querySelector('#habitat-cell-0-0');
    cellPainted = vi.fn<(position: CellPosition) => void>();
    component.cellPainted.subscribe(cellPainted);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens the hover card for mouse only', () => {
    const hovered = vi.fn();
    component.cellHovered.subscribe(hovered);

    component.hoverStart(pointer('touch'), 0, 0);
    expect(hovered).not.toHaveBeenCalled();

    component.hoverStart(pointer('mouse'), 0, 0);
    expect(hovered).toHaveBeenCalledWith(expect.objectContaining({ position: { row: 0, column: 0 } }));
  });

  it('paints on a normal click', () => {
    component.pressStart(pointer('mouse'), 0, 0);
    component.pressEnd();

    component.paint(0, 0, click(1));

    expect(cellPainted).toHaveBeenCalledWith({ row: 0, column: 0 });
  });

  it('pins after a long press and skips only the pointer click that follows', () => {
    vi.useFakeTimers();
    const pinned = vi.fn();
    component.cellPinned.subscribe(pinned);

    component.pressStart(pointer('touch'), 0, 0);
    vi.advanceTimersByTime(500);
    component.pressEnd();

    expect(pinned).toHaveBeenCalledTimes(1);

    component.paint(0, 0, click(1));
    expect(cellPainted).not.toHaveBeenCalled();

    component.paint(0, 0, click(0));
    expect(cellPainted).toHaveBeenCalledTimes(1);
  });

  it('does not pin when released before the long-press delay', () => {
    vi.useFakeTimers();
    const pinned = vi.fn();
    component.cellPinned.subscribe(pinned);

    component.pressStart(pointer('touch'), 0, 0);
    vi.advanceTimersByTime(200);
    component.pressEnd();
    vi.advanceTimersByTime(500);

    expect(pinned).not.toHaveBeenCalled();
  });
});
