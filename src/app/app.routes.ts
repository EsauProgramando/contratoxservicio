import { Routes } from '@angular/router';
import {pagesRoutes} from './pages/pages.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'pages', loadComponent: () =>
      import('./pages/pages').then(m => m.Pages), children: pagesRoutes},
  { path: '**', redirectTo: 'pages' }
];
