import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

export const pagesRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

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
  {
    path: 'cobranzas',
    loadComponent: () =>
      import('./gestionCobranza/cobranzas/cobranzas').then((m) => m.Cobranzas),
  },
  // demás rutas mantenimientos también protegidas

  {
    path: 'calles',
    loadChildren: () =>
      import('./mantenimiento/calles/calles-routing.module').then(
        (m) => m.CallesRoutingModule
      ),
  },
  {
    path: 'plan-servicio',
    loadChildren: () =>
      import('./mantenimiento/plan-servicio/plan-servicio-routing.module').then(
        (m) => m.PlanServicioRoutingModule
      ),
  },
  {
    path: 'tipo-servicio',
    loadChildren: () =>
      import('./mantenimiento/tipo-servicio/tipo-servicio-routing.module').then(
        (m) => m.TipoServicioRoutingModule
      ),
  },
  {
    path: 'velocidad-servicio',
    loadChildren: () =>
      import(
        './mantenimiento/velocidad-servicio/velocidad-servicio.module'
      ).then((m) => m.VelocidadServicioModule),
  },
  {
    path: 'gestion-cortes',
    loadComponent: () =>
      import('./gestionCobranza/gestioncortes/gestioncortes').then(
        (m) => m.Gestioncortes
      ),
  },
  {
    path: 'gestion-reaperturas',
    loadComponent: () =>
      import('./gestionCobranza/gestionreaperturas/gestionreaperturas').then(
        (m) => m.Gestionreaperturas
      ),
  },
  {
    path: 'orden-trabajo',
    loadComponent: () =>
      import('./control/orden-trabajo-component/orden-trabajo-component').then(
        (m) => m.OrdenTrabajoComponent
      ),
  },
  {
    path: 'agencia-tecnica',
    loadComponent: () =>
      import(
        './control/agencia-tecnica-component/agencia-tecnica-component'
      ).then((m) => m.AgenciaTecnicaComponent),
  },
  {
    path: 'bajas-morosidad',
    loadComponent: () =>
      import('./gestionCobranza/bajas-morosidad/bajas-morosidad').then(
        (m) => m.BajasMorosidad
      ),
  },
  {
    path: 'seguimiento-morocidad',
    loadComponent: () =>
      import(
        './gestionCobranza/seguimiento-morocidad/seguimiento-morocidad'
      ).then((m) => m.SeguimientoMorocidad),
  },
  {
    path: 'retencion-negociacion-cliente',
    loadComponent: () =>
      import(
        './gestionCobranza/retencion-negociacion-cliente/retencion-negociacion-cliente'
      ).then((m) => m.RetencionNegociacionCliente),
  },
  { path: '**', redirectTo: 'login' },
];
