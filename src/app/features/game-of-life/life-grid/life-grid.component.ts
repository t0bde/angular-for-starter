import { Component, inject, input, output } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { LifeCell } from '../game-of-life-engine';
import type { CellPosition } from '../../../shared/simulation.types';
import { moveGridFocus } from '../../../shared/grid-navigation';

@Component({
  selector: 'app-life-grid',
  templateUrl: './life-grid.component.html',
  styleUrl: './life-grid.component.css',
})
export class LifeGridComponent {
  protected readonly t = inject(I18nService).t;
  readonly grid = input.required<LifeCell[][]>();
  readonly activeCell = input.required<CellPosition>();
  readonly cellPainted = output<CellPosition>();
  readonly activeCellChanged = output<CellPosition>();

  cellStageClass(cell: LifeCell): string {
    return this.stage(cell) ?? 'dead';
  }

  cellLabel(cell: LifeCell, row: number, column: number): string {
    const stage = this.stage(cell);
    if (!stage) {
      return this.t('lifeGrid.emptySoil', { row: row + 1, column: column + 1 });
    }
    return this.t('lifeGrid.cell', {
      row: row + 1,
      column: column + 1,
      stage: this.t(`stage.${stage}`),
      age: cell.age,
    });
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
    moveGridFocus(
      event,
      row,
      column,
      this.grid().length,
      this.grid()[0]?.length ?? 0,
      'life-cell',
      (position) => this.activeCellChanged.emit(position),
    );
  }

  private stage(cell: LifeCell): 'sprout' | 'flora' | 'perennial' | undefined {
    if (!cell.alive) return undefined;
    if (cell.age === 1) return 'sprout';
    return cell.age <= 5 ? 'flora' : 'perennial';
  }
}
