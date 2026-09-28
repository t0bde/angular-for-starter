import { Component, input, output } from '@angular/core';
import type { EcosystemCell } from '../ecosystem-engine';
import { speciesImages, type CellPosition } from '../ecosystem-ui.types';

@Component({ selector: 'app-meadow-grid', templateUrl: './meadow-grid.component.html', styleUrl: './meadow-grid.component.css' })
export class MeadowGridComponent {
  readonly grid = input.required<EcosystemCell[][]>(); readonly activeCell = input.required<CellPosition>();
  readonly cellPainted = output<CellPosition>(); readonly activeCellChanged = output<CellPosition>();
  cellImage(cell: EcosystemCell): string | null { return speciesImages[cell.species] ?? null; }
  cellLabel(cell: EcosystemCell, row: number, column: number): string { const name = cell.species === 'herbivore' ? 'plant eater' : cell.species; return `Row ${row + 1}, column ${column + 1}: ${name}`; }
  cellTabIndex(row: number, column: number): number { const active = this.activeCell(); return active.row === row && active.column === column ? 0 : -1; }
  paint(row: number, column: number): void { const position = { row, column }; this.activeCellChanged.emit(position); this.cellPainted.emit(position); }
  moveFocus(event: KeyboardEvent, row: number, column: number): void { const rows = this.grid().length; const columns = this.grid()[0]?.length ?? 0; const next = { row, column }; if (event.key === 'ArrowUp') next.row = Math.max(0,row-1); else if (event.key === 'ArrowDown') next.row = Math.min(rows-1,row+1); else if (event.key === 'ArrowLeft') next.column = Math.max(0,column-1); else if (event.key === 'ArrowRight') next.column = Math.min(columns-1,column+1); else return; event.preventDefault(); this.activeCellChanged.emit(next); queueMicrotask(() => document.getElementById(`habitat-cell-${next.row}-${next.column}`)?.focus()); }
}
