import { Routes } from '@angular/router';
import { pagesRoutes } from './pages/pages.routes';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  // Login: fuera del layout Pages
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },

  // Layout protegido
  {
    path: '',
    loadComponent: () => import('./pages/pages').then((m) => m.Pages),
    canActivate: [AuthGuard],
    children: pagesRoutes, // usamos el arreglo de rutas hijas
  },

  { path: '**', redirectTo: 'login' },
];
