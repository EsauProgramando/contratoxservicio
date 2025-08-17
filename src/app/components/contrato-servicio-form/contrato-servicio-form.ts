import { Component, signal, computed, model } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { VelocidadServicioService } from '../../services/mantenimiento/velocidad-servicio.service';
import { TipoServicioService } from '../../services/mantenimiento/tipo-servicio.service';
import { PlanServicioService } from '../../services/mantenimiento/plan-servicio.service';
import { TipoServicioModel } from '../../model/mantenimiento/tiposervicioModel';
import { VelocidadServicioModel } from '../../model/mantenimiento/velocidadservicio';
import { PlanServicioModel } from '../../model/mantenimiento/planservicioModel';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientesService } from '../../services/gestionClientes/clientes.service';
import { BuscarClientes } from '../../model/gestionClientes/buscarClientes';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-contrato-servicio-form',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    RatingModule,
    FieldsetModule,
    AvatarModule,
    DialogModule,
    ConfirmDialogModule,
    ImageModule,
    FloatLabelModule,
    CommonModule,
    InputNumberModule,
    ToastModule,
    TextareaModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './contrato-servicio-form.html',
  styleUrl: './contrato-servicio-form.scss',
})
export class ContratoServicioForm {
  listaTpoServicio = signal<TipoServicioModel[]>([]);
  listaVelocidad = signal<VelocidadServicioModel[]>([]);
  listaPlanServcio = signal<PlanServicioModel[]>([]);
  listaBusquedaCliente = signal<BuscarClientes[]>([]);
  clienteBusqueda = model<String>('');
  detalleBusquedaCliente = signal<BuscarClientes>(new BuscarClientes());
  loading = signal<boolean>(false);
  spinnerStroke = '4';

  constructor(
    private velocidadServicioService: VelocidadServicioService,
    private tipoServicioService: TipoServicioService,
    private planServicioService: PlanServicioService,
    private clientesService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}
  ngOnInit() {
    this.cargarListados();
    if (this.config.data && this.config.data.op == 1) {
    } else if (this.config.data && this.config.data.op == 2) {
    }
  }
  private cargarListados() {
    this.cargarVelocidadServicio();
    this.cargarTipoServicio();
    this.cargarPlanServicio();
  }

  private cargarVelocidadServicio() {
    this.velocidadServicioService.getVelocidadServicio().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaVelocidad.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaVelocidad.set([]);
        }
      },
      error: (error) => {
        this.listaVelocidad.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  private cargarTipoServicio() {
    this.tipoServicioService.getTipoServicio().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaTpoServicio.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaTpoServicio.set([]);
        }
      },
      error: (error) => {
        this.listaTpoServicio.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  private cargarPlanServicio() {
    this.planServicioService.getPlanServicio().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaPlanServcio.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaPlanServcio.set([]);
        }
      },
      error: (error) => {
        this.listaPlanServcio.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }

  //buscar cliente
  buscarclienteapi() {
    const busqueda = this.clienteBusqueda().trim();
    if (!busqueda) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Ingrese un criterio de búsqueda',
      });
      return;
    }

    this.loading.set(true);
    this.clientesService.buscarClientes(busqueda).subscribe({
      next: (response) => {
        if (response?.mensaje === 'EXITO') {
          this.listaBusquedaCliente.set(response.data ?? []);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje ?? 'Error desconocido',
          });
          this.listaBusquedaCliente.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.listaBusquedaCliente.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar búsqueda de clientes',
        });
        this.loading.set(false);
      },
    });
  }
  mostrardetalledeBusqueda(cliente: BuscarClientes) {
    // lógica para manejar selección
    console.log('Cliente seleccionado:', cliente);
  }
}
