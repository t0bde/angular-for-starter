import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'meadow' },
  {
    path: 'meadow',
    loadComponent: () => import('./features/meadow/meadow.component').then((m) => m.MeadowComponent),
  },
  {
    path: 'game-of-life',
    loadComponent: () =>
      import('./features/game-of-life/game-of-life.component').then((m) => m.GameOfLifeComponent),
  },
  {
    path: 'how-it-works',
    loadComponent: () =>
      import('./features/how-it-works/how-it-works.component').then((m) => m.HowItWorksComponent),
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./features/impressum/impressum.component').then((m) => m.ImpressumComponent),
  },
];
