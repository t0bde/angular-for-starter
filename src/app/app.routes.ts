import { Routes } from '@angular/router';
import { EcosystemSimulatorComponent } from './ecosystem-simulator/ecosystem-simulator';
import { GameOfLifeComponent } from './game-of-life/game-of-life';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'meadow' },
  { path: 'meadow', component: EcosystemSimulatorComponent, title: 'Meadow Makers · Living Systems Lab' },
  { path: 'game-of-life', component: GameOfLifeComponent, title: "Conway's Way of Life · Living Systems Lab" },
];
