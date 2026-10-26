import { Component, input, output } from '@angular/core';
import type { LifeCell } from '../game-of-life-engine';
import type { CellPosition } from '../../../shared/simulation.types';

@Component({
  selector: 'app-life-grid',
  templateUrl: './life-grid.component.html',
  styleUrl: './life-grid.component.css',
})
export class LifeGridComponent {
  readonly grid = input.required<LifeCell[][]>();
  readonly activeCell = input.required<CellPosition>();
  readonly cellPainted = output<CellPosition>();
  readonly activeCellChanged = output<CellPosition>();

  cellStageClass(cell: LifeCell): string {
    if (!cell.alive) {
      return 'dead';
    }
    if (cell.age === 1) {
      return 'sprout';
    }
    if (cell.age <= 5) {
      return 'flora';
    }
    return 'perennial';
  }

  cellLabel(cell: LifeCell, row: number, column: number): string {
    if (!cell.alive) {
      return `Row ${row + 1}, column ${column + 1}: empty soil`;
    }
    const stage =
      cell.age === 1 ? 'fresh sprout' : cell.age <= 5 ? 'growing flora' : 'perennial canopy';
    return `Row ${row + 1}, column ${column + 1}: ${stage} (age ${cell.age})`;
  }

  cellTabIndex(row: number, column: number): number {
    const active = this.activeCell();
    return active.row === row && active.column === column ? 0 : -1;
  }

  paint(row: number, column: number): void {
    const position = { row, column };
    this.activeCellChanged.emit(position);
    this.cellPainted.emit(position);
  }

  moveFocus(event: KeyboardEvent, row: number, column: number): void {
    const rows = this.grid().length;
    const columns = this.grid()[0]?.length ?? 0;
    const next = { row, column };

    if (event.key === 'ArrowUp') next.row = Math.max(0, row - 1);
    else if (event.key === 'ArrowDown') next.row = Math.min(rows - 1, row + 1);
    else if (event.key === 'ArrowLeft') next.column = Math.max(0, column - 1);
    else if (event.key === 'ArrowRight') next.column = Math.min(columns - 1, column + 1);
    else return;

    event.preventDefault();
    this.activeCellChanged.emit(next);
    queueMicrotask(() =>
      document.getElementById(`life-cell-${next.row}-${next.column}`)?.focus(),
    );
  }
}
