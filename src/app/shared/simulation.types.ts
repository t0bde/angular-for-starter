export type SimulationSpeed = 'slow' | 'normal' | 'fast';

export const simulationSpeeds: SimulationSpeed[] = ['slow', 'normal', 'fast'];

export interface CellPosition {
  row: number;
  column: number;
}
