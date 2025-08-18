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
import { ContratoModel } from '../../model/gestionClientes/contratoModel';
import { Servicios_contratadosModel } from '../../model/gestionClientes/servicios_contratadosModel';
import { ServicioContratadoRequest } from '../../model/gestionClientes/servicioContratadoRequest';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ContratosService } from '../../services/gestionClientes/contratos.service';
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
    DatePickerModule,
    CheckboxModule,
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
  //para guardar
  contratoModel = signal<ContratoModel>(new ContratoModel());
  servicios_contratadosModel = signal<Servicios_contratadosModel[]>([]);

  loading = signal<boolean>(false);
  mostrartabla = signal<boolean>(false);
  detalledelcliente = signal<boolean>(false);
  spinnerStroke = '4';
  // Variables para almacenar un solo archivo por campo
  fileContrato: File | null = null;
  fileDocumento: File | null = null;
  fileCroquis: File | null = null;

  PRECIO_IP_FIJA = 30;
  constructor(
    private velocidadServicioService: VelocidadServicioService,
    private tipoServicioService: TipoServicioService,
    private planServicioService: PlanServicioService,
    private clientesService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private contratosService: ContratosService
  ) {}
  ngOnInit() {
    this.cargarListados();

    this.loading.set(false);
    this.mostrartabla.set(false);
    this.detalledelcliente.set(false);
    if (this.config.data && this.config.data.op == 1) {
    } else if (this.config.data && this.config.data.op == 2) {
      this.mostrardetalleimagen(
        this.config.data.id_cliente,
        this.config.data.id_contrato
      );
    }
  }

  private mostrardetalleimagen(idCliente: number, nroContrato: number) {
    this.contratosService
      .getDetalleContratoServicio(idCliente, nroContrato)
      .subscribe({
        next: (response) => {
          if (response?.mensaje == 'EXITO') {
            const nuevosServicios: Servicios_contratadosModel[] =
              response.data.ite.map((item: any) => ({
                id_servicio_contratado: item.id_servicio_contratado,
                id_contrato: item.id_contrato ?? 0,
                id_tipo: item.id_tipo,
                id_plan: item.id_plan,
                id_velocidad: item.id_velocidad,
                precio_mensual: item.precio_mensual,
                cargo_instalacion: item.cargo_instalacion,
                ip_fija: item.ip_fija,
                equipo_mac: item.equipo_mac,
                fecha_activacion: item.fecha_activacion,
                notas: item.notas,
                estareg: item.estareg,
              }));
            console.log(response.data.ite, '   response.data.ite');
            // Actualizamos el observable
            this.servicios_contratadosModel.set([...nuevosServicios]);
            console.log(nuevosServicios, 'nuevosServicios');
            this.detalleBusquedaCliente.set(response.data.cab);
            this.detalleBusquedaCliente().estareg = response.data.cab.estareg
              ? 1
              : 0;
            const contrato: ContratoModel = this.contratoModel();
            if (this.config.data.op == 1) {
              contrato.id_cliente = this.detalleBusquedaCliente().id;
            } else {
              contrato.id_cliente = response.data.cab.id_cliente;
              contrato.id_contrato = response.data.cab.id_contrato;
            }
            this.detalledelcliente.set(true);
            this.mostrartabla.set(true);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
            this.servicios_contratadosModel.set([]);
          }
        },
        error: (error) => {
          this.servicios_contratadosModel.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar tipos de documento de identidad',
          });
        },
      });
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
    this.detalledelcliente.set(false);
    this.mostrartabla.set(false);
    this.loading.set(true);
    this.mostrartabla.set(true);
    this.clientesService.buscarClientes(busqueda).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.mostrartabla.set(true);
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
      },
      error: () => {
        this.listaBusquedaCliente.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar búsqueda de clientes',
        });
        this.loading.set(false);
        this.mostrartabla.set(true);
      },
    });
  }
  mostrardetalledeBusqueda(cliente: BuscarClientes) {
    // lógica para manejar selección
    console.log('Cliente seleccionado:', cliente);
    this.detalleBusquedaCliente.set(cliente);
    this.detalledelcliente.set(true);
    this.mostrartabla.set(true);
  }
  // --- Servicios ---
  agregarServicio() {
    const nuevosServicios = [...this.servicios_contratadosModel()];

    const nuevoServicio: Servicios_contratadosModel = {
      id_servicio_contratado: nuevosServicios.length + 1, // ID local incremental
      id_contrato: this.contratoModel().id_contrato ?? 0,
      id_tipo: 1,
      id_plan: 0,
      id_velocidad: 0,
      precio_mensual: 0,
      cargo_instalacion: 0,
      ip_fija: false, // como string ('1' o '0')
      equipo_mac: '',
      fecha_activacion: '',
      notas: '',
      estareg: 1,
    };

    nuevosServicios.push(nuevoServicio);
    this.servicios_contratadosModel.set(nuevosServicios);
  }

  quitarServicio(servicio: Servicios_contratadosModel) {
    this.servicios_contratadosModel.set(
      this.servicios_contratadosModel().filter(
        (s) => s.id_servicio_contratado !== servicio.id_servicio_contratado
      )
    );
  }

  actualizarImporte(s: Servicios_contratadosModel) {
    if (s.ip_fija) {
      s.precio_mensual = s.precio_mensual + this.PRECIO_IP_FIJA;
    } else {
      s.precio_mensual = s.precio_mensual - this.PRECIO_IP_FIJA;
    }

    this.servicios_contratadosModel.set([...this.servicios_contratadosModel()]);
  }

  toggleIPFija(s: Servicios_contratadosModel) {
    this.actualizarImporte(s);
  }

  // --- Totales ---
  get totalMensual() {
    return this.servicios_contratadosModel().reduce(
      (acc, s) => acc + (s.precio_mensual ?? 0),
      0
    );
  }

  get totalInstalacion() {
    return this.servicios_contratadosModel().reduce(
      (acc, s) => acc + (s.cargo_instalacion ?? 0),
      0
    );
  }
  // Cuando vas a guardar
  guardarContrato() {
    const contrato: ContratoModel = this.contratoModel();
    if (this.config.data.op == 1) {
      contrato.id_cliente = this.detalleBusquedaCliente().id;
    }

    contrato.detalle = [...this.servicios_contratadosModel()];

    this.contratosService
      .registrarContratoConArchivo(
        this.config.data.op,
        contrato,
        this.fileContrato ?? undefined,
        this.fileDocumento ?? undefined,
        this.fileCroquis ?? undefined
      )
      .subscribe({
        next: (res) => {
          console.log('Contrato guardado correctamente', res);

          // Reset
          this.fileContrato = null;
          this.fileDocumento = null;
          this.fileCroquis = null;
          this.contratoModel.set(new ContratoModel());
          this.servicios_contratadosModel.set([]);
        },
        error: (err) => {
          console.error('Error guardando contrato', err);
        },
      });
  }

  reiniciar() {
    //cancelar cerrar
  }
  onFileSelected(event: any, campo: string) {
    const archivo: File = event.target.files[0]; // solo el primero
    if (!archivo) return;

    switch (campo) {
      case 'url_soporte_contrato':
        this.fileContrato = archivo;
        break;
      case 'url_documento':
        this.fileDocumento = archivo;
        break;
      case 'url_croquis':
        this.fileCroquis = archivo;
        break;
    }
  }
}
