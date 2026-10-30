import { Component, inject, input, output } from '@angular/core';
import { I18nService } from '../../../shared/i18n/i18n.service';
import type { EcosystemCell } from '../meadow-engine';
import { speciesImages, type CellInspectRequest } from '../meadow-ui.types';
import type { CellPosition } from '../../../shared/simulation.types';
import { moveGridFocus } from '../../../shared/grid-navigation';

const longPressDelayMs = 500;

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
  readonly cellHovered = output<CellInspectRequest>();
  readonly cellHoverEnded = output<void>();
  readonly cellPinned = output<CellInspectRequest>();
  private pressTimer?: number;
  private longPressFired = false;
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
  hoverStart(event: PointerEvent, row: number, column: number): void {
    if (event.pointerType === 'mouse') {
      this.cellHovered.emit(this.inspectRequest(event, row, column));
    }
  }
  hoverEnd(event: PointerEvent): void {
    this.cancelPress();
    if (event.pointerType === 'mouse') {
      this.cellHoverEnded.emit();
    }
  }
  pressStart(event: PointerEvent, row: number, column: number): void {
    this.cancelPress();
    this.longPressFired = false;
    const request = this.inspectRequest(event, row, column);
    this.pressTimer = window.setTimeout(() => {
      this.pressTimer = undefined;
      this.longPressFired = true;
      this.cellPinned.emit(request);
    }, longPressDelayMs);
  }
  pressEnd(): void {
    this.cancelPress();
  }
  paint(row: number, column: number, event: MouseEvent): void {
    // Keyboard clicks (detail 0) never follow a long-press, so they must not be swallowed.
    if (this.longPressFired && event.detail > 0) {
      this.longPressFired = false;
      return;
    }
    const position = { row, column };
    this.activeCellChanged.emit(position);
    this.cellPainted.emit(position);
  }
  private inspectRequest(event: PointerEvent, row: number, column: number): CellInspectRequest {
    const cell = event.currentTarget as HTMLElement;
    return { position: { row, column }, anchor: cell.getBoundingClientRect() };
  }
  private cancelPress(): void {
    if (this.pressTimer !== undefined) {
      window.clearTimeout(this.pressTimer);
      this.pressTimer = undefined;
    }
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
