import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'meadow' },
  {
    path: 'meadow',
    loadComponent: () => import('./features/meadow/meadow.component').then((m) => m.MeadowComponent),
    title: 'Meadow Makers · Living Systems Lab',
  },
  {
    path: 'game-of-life',
    loadComponent: () =>
      import('./features/game-of-life/game-of-life.component').then((m) => m.GameOfLifeComponent),
    title: "Conway's Way of Life · Living Systems Lab",
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./features/impressum/impressum.component').then((m) => m.ImpressumComponent),
    title: 'Impressum & Datenschutz · Living Systems Lab',
  },
];
