import { Routes } from '@angular/router';
export const pagesRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./gestionClientes/clientes/clientes.module').then(
        (m) => m.ClientesModule
      ),
  },

  {
    path: 'contrato-servicio',
    loadChildren: () =>
      import(
        './gestionClientes/contrato-servicio/contrato-servicio.module'
      ).then((m) => m.ContratoServicioModule),
  },

  //mantenimientos
  {
    path: 'calles',
    loadChildren: () =>
      import('./mantenimiento/calles/calles.module').then(
        (m) => m.CallesModule
      ),
  },
  {
    path: 'plan-servicio',
    loadChildren: () =>
      import('./mantenimiento/plan-servicio/plan-servicio.module').then(
        (m) => m.PlanServicioModule
      ),
  },
  {
    path: 'tipo-servicio',
    loadChildren: () =>
      import('./mantenimiento/tipo-servicio/tipo-servicio.module').then(
        (m) => m.TipoServicioModule
      ),
  },
  {
    path: 'velocidad-servicio',
    loadChildren: () =>
      import(
        './mantenimiento/velocidad-servicio/velocidad-servicio.module'
      ).then((m) => m.VelocidadServicioModule),
  },

  { path: '**', redirectTo: 'home' },
];
0;
