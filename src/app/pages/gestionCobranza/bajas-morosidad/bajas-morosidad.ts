import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { CargaComponent } from '../../../components/carga/carga.component';
import { BitacuraService } from '../../../services/mantenimiento/bitacura.service';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import Swal from 'sweetalert2';
import { BajaMorocidadService } from '../../../services/gestionCobranza/baja-morocidad.service';
import { BajaMorosidadModel } from '../../../model/gestionCobranza/BajaMorosidadModel';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import { ListadoClientes } from '../../../model/gestionClientes/listadoclientes';
import { TipoServicioModel } from '../../../model/mantenimiento/tiposervicioModel';
import { TipoServicioService } from '../../../services/mantenimiento/tipo-servicio.service';
import { BusquedaMorosidad } from '../../../model/gestionCobranza/BusquedaMorosidad';
import { ListadomorosidadRequest } from '../../../model/gestionCobranza/ListadomorosidadRequest';

@Component({
  selector: 'app-bajas-morosidad',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    RatingModule,
    FieldsetModule,
    AvatarModule,
    DialogModule,
    ConfirmDialogModule,
    ImageModule,
    FloatLabelModule,
    FileUploadModule,
    CommonModule,
    ToastModule,
    DynamicDialogModule,
    TooltipModule,
    CargaComponent,
    DatePickerModule,
    TextareaModule,
  ],
  templateUrl: './bajas-morosidad.html',
  styleUrl: './bajas-morosidad.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class BajasMorosidad {
  bajaMorosidadModel = signal<BajaMorosidadModel>(new BajaMorosidadModel());
  spinner: boolean = false;
  listaClientes = signal<ListadoClientes[]>([]);
  listaTpoServicioes_servicio = signal<TipoServicioModel[]>([]);
  morocidadDialog: boolean = false;
  clientesDialog: boolean = false;
  Totalregistros: number = 0;
  // Variables para el modal de bitácora
  bitTipo: string = 'WhatsApp';
  bitDetalle: string = '';
  bloquearboton = signal<boolean>(false);
  BitacuraModel = signal<BitacuraModel>(new BitacuraModel());
  BusquedaMorosidad = signal<BusquedaMorosidad>(new BusquedaMorosidad());
  ListadomorosidadRequest = signal<ListadomorosidadRequest[]>([]);
  listadoBitacora = signal<BitacuraModel[]>([]);
  detallebajasMorosidadmostrar = signal<ListadomorosidadRequest>(
    new ListadomorosidadRequest()
  );
  cargarbitacora: boolean = false;
  showModalBitacora: boolean = false;
  bitacoraTipos = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Email', value: 'Email' },
    { label: 'Llamada', value: 'Llamada' },
    { label: 'Otra', value: 'Otra' },
  ];
  motivos: any[] = [
    { label: 'Impago crónico', value: 'IMPAGO_CRONICO' },
    { label: 'Incumplimiento de acuerdo', value: 'INCUMPLIMIENTO_ACUERDO' },
    { label: 'Decisión administrativa', value: 'DECISION_ADMINISTRATIVA' },
  ];
  estados: any[] = [
    { label: 'SI', value: 'INDEFINIDO' },
    { label: 'NO', value: 'INHABILITADO' },
  ];
  motivosbusqueda: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'Impago crónico', value: 'IMPAGO_CRONICO' },
    { label: 'Incumplimiento de acuerdo', value: 'INCUMPLIMIENTO_ACUERDO' },
    { label: 'Decisión administrativa', value: 'DECISION_ADMINISTRATIVA' },
  ];

  estadosbusqueda: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'INDEFINIDO', value: 'INDEFINIDO' },
    { label: 'INHABILITADO', value: 'INHABILITADO' },
  ];
  detallebajaxmorosidad: boolean = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private bajaMorocidadService: BajaMorocidadService,
    private clientesService: ClientesService,
    private tipoServicioService: TipoServicioService,
    private bitacuraService: BitacuraService
  ) {}
  ngOnInit() {
    this.cargarListados();
    this.bajaMorosidadModel().estado = 'SI';
    this.BusquedaMorosidad().motivos = 'TODOS';
    this.BusquedaMorosidad().estado = 'TODOS';
  }

  private cargarListados() {
    this.cargarClientes();
    this.cargarTipoServicio();
  }
  private cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaClientes.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaClientes.set([]);
        }
      },
      error: (error) => {
        this.listaClientes.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar clientes',
        });
      },
    });
  }
  private cargarTipoServicio() {
    this.tipoServicioService.getTipoServicio().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaTpoServicioes_servicio.set(
            response.data.filter((item) => item.es_servicio)
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });

          this.listaTpoServicioes_servicio.set([]);
        }
      },
      error: (error) => {
        this.listaTpoServicioes_servicio.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  selectCliente(item: ListadoClientes) {
    console.log(item, 'cliente seleccionado');
    this.bajaMorosidadModel().cliente = item.apellidos + ' ' + item.nombres;
    this.bajaMorosidadModel().id_cliente = item.id;
    this.bajaMorosidadModel().nrodocident = item.nrodocident;
    this.clientesDialog = false;
  }
  openDialog() {
    this.bajaMorosidadModel.set(new BajaMorosidadModel());
    this.bajaMorosidadModel().op = 1; //operacion registra
    this.morocidadDialog = true;
  }
  openClientesDialog() {
    this.clientesDialog = true;
  }
  // Cerrar modal de bitácora
  closeModalBitacora() {
    this.showModalBitacora = false;
  }

  abrirBitacora(data: any) {
    this.showModalBitacora = true;
    this.BitacuraModel().id_cliente = data.id_cliente;
    this.listadoBitacora.set([]);
    this.listadodbitacora(this.BitacuraModel().id_cliente);
  }
  limpiar_filtros() {
    this.BusquedaMorosidad.set(new BusquedaMorosidad());
    this.ListadomorosidadRequest.set([]);
    this.Totalregistros = 0;
  }
  listadodbitacora(id_cliente: number) {
    this.cargarbitacora = true;
    this.listadoBitacora.set([]);
    this.bitacuraService.buscarBitacoraPoridcliente(id_cliente).subscribe({
      next: (response) => {
        this.cargarbitacora = false;
        if (response?.mensaje === 'EXITO') {
          this.listadoBitacora.set(response?.data || []);
          console.log(this.listadoBitacora());
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'Error al obtener la bitácora',
          });
        }
      },
      error: (err) => {
        this.cargarbitacora = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.mensaje || 'Error al obtener la bitácora',
        });
      },
    });
  }
  agregarBitacora() {
    if (!this.BitacuraModel().detalle.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El detalle de la bitácora no puede estar vacío.',
      });
      return;
    }
    this.bloquearboton.set(true);
    this.BitacuraModel().responsable = 'Usuario Actual';
    this.bitacuraService.registrarBitacora(this.BitacuraModel(), 1).subscribe({
      next: (response) => {
        if (response?.mensaje === 'EXITO') {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Bitácora registrada exitosamente.',
          });
          this.bloquearboton.set(false);
          this.listadodbitacora(this.BitacuraModel().id_cliente);
          this.BitacuraModel.set(new BitacuraModel());
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje || 'Error al registrar la bitácora',
          });
        }
      },
      error: (err) => {
        this.bloquearboton.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.mensaje || 'Error al registrar la bitácora',
        });
      },
    });
  }

  //guardar baja de morosidad
  guardarBajaMorosidad() {
    if (this.bajaMorosidadModel().id_cliente == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un cliente.',
      });
      return;
    }
    //servicio para validar que el motivo no este vacio
    if (this.bajaMorosidadModel().id_tipo == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar un tipo de servicio.',
      });
      return;
    }

    if (this.bajaMorosidadModel().motivo.trim() == '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El motivo de baja no puede estar vacío.',
      });
      return;
    }
    // Validar que la fecha no esté vacía
    if (!this.bajaMorosidadModel().fecharebaja) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha de baja no puede estar vacía.',
      });
      return;
    }
    this.bajaMorosidadModel().fecharebaja = this.formatDateForDB(
      this.bajaMorosidadModel().fecharebaja
    );
    console.log(this.bajaMorosidadModel());
    // Aquí puedes agregar la lógica para guardar la baja de morosidad
    this.bloquearboton.set(true);
    this.bajaMorocidadService
      .registrarBajaMorosidad(
        this.bajaMorosidadModel(),
        this.bajaMorosidadModel().op
      )
      .subscribe({
        next: (response) => {
          if (response?.data?.response === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Baja de morosidad registrada exitosamente.',
            });
            this.bajaMorosidadModel.set(new BajaMorosidadModel());
            this.morocidadDialog = false;
            this.bloquearboton.set(false);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response?.mensaje || 'Error al registrar la baja de morosidad',
            });
          }
        },
        error: (err) => {
          this.bloquearboton.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al registrar la baja de morosidad',
          });
        },
      });
  }
  formatDateForDB(dateInput: any): string {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida en formatDateForDB');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  buscarmorosidad() {
    this.spinner = true;
    this.ListadomorosidadRequest.set([]);
    this.bajaMorocidadService
      .buscarBajaMorosidad(this.BusquedaMorosidad())
      .subscribe({
        next: (response) => {
          this.spinner = false;
          if (response?.mensaje === 'EXITO') {
            this.ListadomorosidadRequest.set(response?.data || []);
            this.Totalregistros = response?.data?.length || 0;
          } else {
            this.Totalregistros = 0;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al buscar morosidad',
            });
            this.ListadomorosidadRequest.set([]);
          }
        },
        error: (err) => {
          this.Totalregistros = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al buscar morosidad',
          });
          this.ListadomorosidadRequest.set([]);
          this.spinner = false;
        },
      });
  }

  cambiarestado(data: any, nuevoEstado: string) {
    //Sweetalert para confirmar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas cambiar el estado a ${nuevoEstado}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para cambiar el estado
        const bajaMorosidad = new BajaMorosidadModel();
        bajaMorosidad.id_baja = data.id_baja;
        bajaMorosidad.id_cliente = data.id_cliente;
        bajaMorosidad.estado = nuevoEstado;
        this.bloquearboton.set(true);
        this.bajaMorocidadService
          .actualizarBajaMorosidad(bajaMorosidad)
          .subscribe({
            next: (response) => {
              this.bloquearboton.set(false);
              if (response?.mensaje === 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: `Baja de morosidad ${
                    nuevoEstado === 'INHABILITADO' ? 'inhabilitada' : 'activada'
                  } exitosamente.`,
                });
                this.buscarmorosidad();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    response?.mensaje ||
                    'Error al actualizar el estado de la baja de morosidad',
                });
              }
            },
            error: (err) => {
              this.bloquearboton.set(false);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  err?.mensaje ||
                  'Error al actualizar el estado de la baja de morosidad',
              });
            },
          });
      }
    });
  }
  verDetalleBaja(data: ListadomorosidadRequest) {
    this.detallebajasMorosidadmostrar.set(data);
    this.listadodbitacora(data.id_cliente);
    this.detallebajaxmorosidad = true;
  }
}
