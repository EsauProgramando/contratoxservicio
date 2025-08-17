import { Component, ViewEncapsulation } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  standalone: true,
  styleUrl: './sidebar.scss',
  imports: [
    DrawerModule,
    ButtonModule,
    AvatarModule,
    PanelMenuModule,
    PanelModule,
    DialogModule,
  ],
})
export class Sidebar {
  // @ViewChild('drawerRef') drawerRef!: Drawer;visible: boolean = false;

  position:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'center'
    | 'topleft'
    | 'topright'
    | 'bottomleft'
    | 'bottomright' = 'center';

  showDialog(
    position:
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'center'
      | 'topleft'
      | 'topright'
      | 'bottomleft'
      | 'bottomright'
  ) {
    this.position = position;
    this.visible = true;
  }
  constructor(private router: Router) {}
  items: MenuItem[] = [];
  // closeCallback(e:any): void {
  //   this.drawerRef.close(e);
  // }

  visible: boolean = false;
  ngOnInit() {
    this.items = [
      {
        label: 'Gestión de Clientes',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Registro Clientes',
            icon: 'pi pi-plus',
            routerLink: './clientes',
          },
          {
            label: 'Asignación de Plan',
            icon: 'pi pi-check-circle',
          },
          {
            label: 'Estado del Servicio',
            icon: 'pi pi-info-circle',
          },
          {
            label: 'Configuración Técnica del Servicio',
            icon: 'pi pi-cog',
          },
          {
            label: 'Adjuntos',
            icon: 'pi pi-paperclip',
          },
          {
            label: 'Historial de Cambios',
            icon: 'pi pi-history',
          },
          {
            label: 'Búsqueda y Filtros',
            icon: 'pi pi-filter',
          },
          {
            label: 'Integración con mapa',
            icon: 'pi pi-map', // mapa
          },
          {
            label: 'Botón para Corte/Activación',
            icon: 'pi pi-power-off',
          },
          {
            label: 'Contrato por Servicio',
            icon: 'pi pi-file',
            routerLink: './contrato-servicio',
          },
          {
            label: 'Gestión de Clientes y Servicios',
            icon: 'pi pi-users',
          },
          {
            label: 'Gestión de Servicios Contratados',
            icon: 'pi pi-briefcase',
          },
        ],
      },
      {
        label: 'Cobranzas y Suspensión',
        icon: 'pi pi-wallet', // ícono general para cobranzas/pagos
        items: [
          {
            label: 'Gestión de Cobranzas',
            icon: 'pi pi-users', // gestión de clientes/cobranzas
          },
          {
            label: 'Registro Manual de Pagos',
            icon: 'pi pi-money-bill', // registro de pagos
          },
          {
            label: 'Visualización de Pagos',
            icon: 'pi pi-eye', // ver pagos
          },
          {
            label: 'Configuración de Reglas de Corte y Reconexión',
            icon: 'pi pi-cog', // configuración
          },
          {
            label: 'Pantalla de Control de Cortes',
            icon: 'pi pi-sliders-h', // panel de control
          },
          {
            label: 'Pantalla de Clientes Morosos',
            icon: 'pi pi-exclamation-triangle', // alerta/morosos
          },
          {
            label: 'Reportes de Cobranza',
            icon: 'pi pi-chart-line', // gráfico de línea como reporte
          },
        ],
      },
      {
        label: 'Recaudación y Métodos de Pago',
        icon: 'pi pi-wallet', // ícono general de pagos/recaudación
        items: [
          {
            label: 'Métodos de Pago Disponibles',
            icon: 'pi pi-credit-card', // representa métodos de pago
          },
          {
            label: 'Registro de Pagos Manuales',
            icon: 'pi pi-money-bill', // registro de dinero/pagos
          },
          {
            label: 'Validación de Vouchers',
            icon: 'pi pi-check-square', // validación/aprobación
          },
          {
            label: 'Historial de Recaudación',
            icon: 'pi pi-calendar', // historial/registro por fecha
          },
        ],
      },

      {
        separator: true,
      },
      {
        label: 'Morosidad y Retención',
        icon: 'pi pi-users', // representa clientes en general
        items: [
          {
            label: 'Clasificación de Clientes Morosos',
            icon: 'pi pi-filter', // filtrar clientes morosos
          },
          {
            label: 'Seguimiento de Morosidad',
            icon: 'pi pi-eye', // seguimiento/visualización
          },
          {
            label: 'Retención y Negociación',
            icon: 'pi pi-briefcase', // negociación y retención
          },

          {
            label: 'Baja Definitiva',
            icon: 'pi pi-trash', // baja/eliminación
          },
          {
            label: 'Reportes de Morosidad y Retención',
            icon: 'pi pi-file', // reporte/documento
          },
        ],
      },
      {
        label: 'Instalación y Configuración',
        icon: 'pi pi-cog', // configuración general
        items: [
          {
            label: 'Ordenes de Instalación (OT)',
            icon: 'pi pi-list', // lista de órdenes
          },
          {
            label: 'Agenda Técnica',
            icon: 'pi pi-calendar', // seguimiento/agenda
          },
          {
            label: 'Ejecución de Instalación',
            icon: 'pi pi-check-circle', // instalación completada
          },
          {
            label: 'Inventario Técnico y Asignación',
            icon: 'pi pi-box', // inventario
          },
          {
            label: 'Reporte de Instalaciones',
            icon: 'pi pi-file', // documento/reporte
          },
          {
            label: 'Módulo de Facturación Electrónica',
            icon: 'pi pi-wallet', // representa facturación/pagos
          },

          {
            label: 'Módulo de Reportes de Gestión y Operación',
            icon: 'pi pi-chart-line', // reportes gráficos
          },
        ],
      },
      /*
      {
        label: 'Mantenimientos',
        icon: 'pi pi-cog', // configuración general
        items: [
          {
            label: 'Calles',
            icon: 'pi pi-map', // relacionado con direcciones/mapas
            routerLink: './calles',
          },
          {
            label: 'Plan por Servicio',
            icon: 'pi pi-briefcase', // planes/servicios empresariales o residenciales
            routerLink: './plan-servicio',
          },
          {
            label: 'Tipo de Servicio',
            icon: 'pi pi-sitemap', // FTTH, Wireless, etc.
            routerLink: './tipo-servicio',
          },
          {
            label: 'Velocidad de Servicio',
            icon: 'pi pi-bolt', // velocidad, rapidez (⚡)
            routerLink: './velocidad-servicio',
          },
        ],
      },
      */
    ];
  }
}
