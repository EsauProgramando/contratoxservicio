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
import { ValidarFormularioContrato } from '../../model/gestionClientes/validarformulariocontrato';
import { environment } from '../../environments/environment';

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
  listaTpoServicioes_servicio = signal<TipoServicioModel[]>([]);
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
  disabled = signal<boolean>(false);
  //validar formulario varios campos
  ValidarFormularioContrato = signal(new ValidarFormularioContrato());
  // datos del cliente como signal
  environment = environment;
  // señales para controlar errores en el formulario
  formErrors = {
    tiempo_contrato: signal(false),
    periodo_gracia: signal(false),
    servicios_contratados: signal(false),
    id_tipo: signal(false),
  };
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
  // utils.ts (o dentro del mismo componente)
  toEmpty = (v: any): string => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' && v.trim().toLowerCase() === 'null') return '';
    return String(v);
  };
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
                equipo_mac: this.toEmpty(item.equipo_mac), // 👈 limpia "null"
                fecha_activacion: item.fecha_activacion,
                notas: this.toEmpty(item.notas), // 👈 idem
                estareg: item.estareg,
              }));

            // Actualizamos el observable
            this.servicios_contratadosModel.set([...nuevosServicios]);
            console.log(nuevosServicios, 'nuevosServicios');

            this.detalleBusquedaCliente.set(response.data.cab);
            this.detalleBusquedaCliente().estareg = response.data.cab.estareg
              ? 1
              : 0;
            //igualar cab
            const contrato: ContratoModel = this.contratoModel();
            contrato.tiempo_contrato = response.data.cab.tiempo_contrato;
            contrato.periodo_gracia = response.data.cab.periodo_gracia;
            contrato.url_soporte_contrato =
              response.data.cab.url_soporte_contrato;
            contrato.url_documento = response.data.cab.url_documento;
            contrato.url_croquis = response.data.cab.url_croquis;
            contrato.observaciones = response.data.cab.observaciones;
            contrato.fechabaja = response.data.cab.fechabaja;
            contrato.observacion_baja =
              response.data.cab?.observacion_baja || '';
            contrato.id_tipo = response.data.cab.id_tipo;
            console.log(contrato, 'contrato');
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
          this.listaTpoServicioes_servicio.set(
            response.data.filter((item) => item.es_servicio)
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaTpoServicio.set([]);
          this.listaTpoServicioes_servicio.set([]);
        }
      },
      error: (error) => {
        this.listaTpoServicio.set([]);
        this.listaTpoServicioes_servicio.set([]);
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

    //validar
    if (!this.validarForm()) {
      return;
    }

    this.disabled.set(true);
    //igual contrato con detalleBusquedaCliente
    contrato.tiempo_contrato = this.detalleBusquedaCliente().tiempo_contrato;
    contrato.periodo_gracia = this.detalleBusquedaCliente().periodo_gracia;
    contrato.url_soporte_contrato =
      this.detalleBusquedaCliente().url_soporte_contrato;
    contrato.url_documento = this.detalleBusquedaCliente().url_documento;
    contrato.url_croquis = this.detalleBusquedaCliente().url_croquis;
    contrato.observaciones = this.detalleBusquedaCliente().observaciones;
    contrato.fechabaja = this.detalleBusquedaCliente().fechabaja;
    contrato.observacion_baja = this.detalleBusquedaCliente().observacion_baja;
    //id_imagen
    contrato.id_soporte_contrato =
      this.detalleBusquedaCliente().id_soporte_contrato;
    contrato.id_documento = this.detalleBusquedaCliente().id_documento;
    contrato.id_croquis = this.detalleBusquedaCliente().id_croquis;
    contrato.id_tipo = this.detalleBusquedaCliente().id_tipo;
    contrato.detalle = [...this.servicios_contratadosModel()];
    console.log(contrato, 'contrato');

    this.contratosService
      .registrarContratoConArchivo(
        this.config.data.op,
        contrato,
        this.fileContrato ?? undefined,
        this.fileDocumento ?? undefined,
        this.fileCroquis ?? undefined
      )
      .subscribe({
        next: (response) => {
          this.disabled.set(false);
          console.log('Contrato guardado correctamente', response);
          if (response?.mensaje == 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Contrato guardado correctamente',
            });
            // Reset
            this.fileContrato = null;
            this.fileDocumento = null;
            this.fileCroquis = null;
            this.contratoModel.set(new ContratoModel());
            this.servicios_contratadosModel.set([]);
            this.ref!.close();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje,
            });
          }
        },
        error: (err) => {
          this.disabled.set(false);
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

  validarForm(): boolean {
    let valido = true;

    // Validar tiempo_contrato
    const tiempo = this.detalleBusquedaCliente().tiempo_contrato;
    if (!tiempo || tiempo === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un tiempo de contrato',
      });
      this.formErrors.tiempo_contrato.set(true);
      valido = false;
    } else {
      this.formErrors.tiempo_contrato.set(false);
    }

    // Validar periodo_gracia
    const periodo = this.detalleBusquedaCliente().periodo_gracia;
    if (!periodo || periodo === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un período de gracia',
      });
      this.formErrors.periodo_gracia.set(true);
      valido = false;
    } else {
      this.formErrors.periodo_gracia.set(false);
    }
    //validar id_tipo
    if (!this.detalleBusquedaCliente().id_tipo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un tipo de servicio',
      });
      this.formErrors.id_tipo.set(true);
      valido = false;
    } else {
      this.formErrors.id_tipo.set(false);
    }

    //validar si hay datos servicios_contratadosModel
    if (!this.servicios_contratadosModel().length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Agregue al menos un servicio contratado',
      });
      valido = false;
      this.formErrors.servicios_contratados.set(true);
    }

    return valido;
  }
  getDirectLink(url: string | null | undefined): string {
    if (!url || url === 'null') return '';

    // Extraer ID de la URL de Google Drive
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }

    return url; // si no es de Drive, se devuelve tal cual
  }
  //getImagenProducto
  getmostrarimagen(id: string) {
    if (!id) return '';
    this.contratosService.getImagenProducto(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        return url;
      },
      error: (err) => {
        console.error('Error al cargar imagen', err);
        return '';
      },
    });
    return '';
  }
}
