import { Component, inject, input, output } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { EcosystemCell } from '../meadow-engine';
import { speciesImages } from '../meadow-ui.types';
import type { CellPosition } from '../../../shared/simulation.types';
import { moveGridFocus } from '../../../shared/grid-navigation';

@Component({
  selector: 'app-meadow-grid',
  templateUrl: './meadow-grid.component.html',
  styleUrl: './meadow-grid.component.css',
})
export class MeadowGridComponent {
  private readonly t = inject(I18nService).t;
  readonly grid = input.required<EcosystemCell[][]>();
  readonly activeCell = input.required<CellPosition>();
  readonly cellPainted = output<CellPosition>();
  readonly activeCellChanged = output<CellPosition>();
  cellImage(cell: EcosystemCell): string | null {
    return speciesImages[cell.species] ?? null;
  }
  cellLabel(cell: EcosystemCell, row: number, column: number): string {
    return this.t('meadow.cellLabel', {
      row: row + 1,
      column: column + 1,
      name: this.t(`species.${cell.species}Cell`),
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
      'habitat-cell',
      (position) => this.activeCellChanged.emit(position),
    );
  }
}
