import type { CellPosition } from './simulation.types';

export function moveGridFocus(
  event: KeyboardEvent,
  row: number,
  column: number,
  rows: number,
  columns: number,
  cellIdPrefix: string,
  activeCellChanged: (position: CellPosition) => void,
): void {
  const next = { row, column };

  if (event.key === 'ArrowUp') next.row = Math.max(0, row - 1);
  else if (event.key === 'ArrowDown') next.row = Math.min(rows - 1, row + 1);
  else if (event.key === 'ArrowLeft') next.column = Math.max(0, column - 1);
  else if (event.key === 'ArrowRight') next.column = Math.min(columns - 1, column + 1);
  else return;

  event.preventDefault();
  activeCellChanged(next);
  queueMicrotask(() =>
    document.getElementById(`${cellIdPrefix}-${next.row}-${next.column}`)?.focus(),
  );
}
