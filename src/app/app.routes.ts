import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'meadow' },
  {
    path: 'meadow',
    loadComponent: () => import('./features/meadow/meadow.component').then((m) => m.MeadowComponent),
    title: 'title.meadow',
  },
  {
    path: 'game-of-life',
    loadComponent: () =>
      import('./features/game-of-life/game-of-life.component').then((m) => m.GameOfLifeComponent),
    title: 'title.life',
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./features/impressum/impressum.component').then((m) => m.ImpressumComponent),
    title: 'title.impressum',
  },
];
