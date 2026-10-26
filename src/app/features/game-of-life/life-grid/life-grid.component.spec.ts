import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import type { CellPosition } from '../../../shared/simulation.types';
import { aliveCell, deadCell } from '../game-of-life-engine';
import { LifeGridComponent } from './life-grid.component';

describe('LifeGridComponent', () => {
  let component: LifeGridComponent;
  let fixture: ComponentFixture<LifeGridComponent>;
  let activeCellChanged: Mock<(position: CellPosition) => void>;
  let cellPainted: Mock<(position: CellPosition) => void>;

  const buildGrid = (rows: number, columns: number) =>
    Array.from({ length: rows }, () => Array.from({ length: columns }, () => deadCell()));

  const press = (key: string, row: number, column: number): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    component.moveFocus(event, row, column);
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LifeGridComponent] }).compileComponents();

    fixture = TestBed.createComponent(LifeGridComponent);
    fixture.componentRef.setInput('grid', buildGrid(6, 8));
    fixture.componentRef.setInput('activeCell', { row: 2, column: 3 });
    component = fixture.componentInstance;
    activeCellChanged = vi.fn<(position: CellPosition) => void>();
    cellPainted = vi.fn<(position: CellPosition) => void>();
    component.activeCellChanged.subscribe(activeCellChanged);
    component.cellPainted.subscribe(cellPainted);
    await fixture.whenStable();
  });

  it('renders one button per cell with only the active cell tabbable', () => {
    const cells: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.garden-cell'),
    );

    expect(cells.length).toBe(48);
    expect(cells.filter((cell) => cell.tabIndex === 0).map((cell) => cell.id)).toEqual([
      'life-cell-2-3',
    ]);
  });

  it('emits the active cell and painted cell on click', () => {
    fixture.nativeElement.querySelector('#life-cell-1-4').click();

    expect(activeCellChanged).toHaveBeenCalledWith({ row: 1, column: 4 });
    expect(cellPainted).toHaveBeenCalledWith({ row: 1, column: 4 });
  });

  it('describes cells by growth stage', () => {
    expect(component.cellStageClass(deadCell())).toBe('dead');
    expect(component.cellStageClass(aliveCell(1))).toBe('sprout');
    expect(component.cellStageClass(aliveCell(5))).toBe('flora');
    expect(component.cellStageClass(aliveCell(6))).toBe('perennial');
    expect(component.cellLabel(deadCell(), 0, 0)).toBe('Row 1, column 1: empty soil');
    expect(component.cellLabel(aliveCell(1), 1, 2)).toBe(
      'Row 2, column 3: fresh sprout (age 1)',
    );
  });

  it('moves the active cell in each arrow direction', () => {
    expect(press('ArrowUp', 3, 3).defaultPrevented).toBe(true);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 2, column: 3 });

    press('ArrowDown', 3, 3);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 4, column: 3 });

    press('ArrowLeft', 3, 3);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 3, column: 2 });

    press('ArrowRight', 3, 3);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 3, column: 4 });
  });

  it('clamps movement at the grid edges', () => {
    press('ArrowUp', 0, 0);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 0, column: 0 });

    press('ArrowLeft', 0, 0);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 0, column: 0 });

    press('ArrowDown', 5, 7);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 5, column: 7 });

    press('ArrowRight', 5, 7);
    expect(activeCellChanged).toHaveBeenLastCalledWith({ row: 5, column: 7 });
  });

  it('ignores non-arrow keys without preventing default', () => {
    expect(press('a', 3, 3).defaultPrevented).toBe(false);
    expect(activeCellChanged).not.toHaveBeenCalled();
  });
});
