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
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

import { ToastModule } from 'primeng/toast';

import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { Reaperturaservice } from '../../../services/gestionCobranza/reapertura.service';
import { Cortesservice } from '../../../services/gestionCobranza/cortes.service';
import { CortesenvioListadofiltro } from '../../../model/gestionCobranza/CortesenvioListadofiltro';
import { CortesServicioRequest } from '../../../model/gestionCobranza/CortesServicioRequest';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ReaperturaModel } from '../../../model/gestionCobranza/ReaperturaModel';
import Swal from 'sweetalert2';
import { Historialservicio } from '../../../services/mantenimiento/historialservicio';
import { HistorialServicioModel } from '../../../model/mantenimiento/HistorialServicioModel';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import { GmailService } from '../../../services/gmail/gmail.service';
import { WhatsappService } from '../../../services/whatsapp/whatsapp.service';
import { BitacuraService } from '../../../services/mantenimiento/bitacura.service';
import { Clientes_morosidad_extModel } from '../../../model/gestionCobranza/Clientes_morosidad_extModel';
import { NogociacionClientesService } from '../../../services/gestionCobranza/nogociacion-clientes.service';
import { NegociacionModel } from '../../../model/gestionCobranza/NegociacionModel';
import { FacturacionService } from '../../../services/gestionClientes/facturacion.service';
import { FacturacionRequest } from '../../../model/gestionClientes/FacturacionRequest';
import { BuscarNegociacion } from '../../../model/gestionCobranza/BuscarNegociacion';
import { NegociacionClientesRequest } from '../../../model/gestionCobranza/NegociacionClientesRequest';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import { ListadoClientes } from '../../../model/gestionClientes/listadoclientes';
import { TipoServicioService } from '../../../services/mantenimiento/tipo-servicio.service';
import { TipoServicioModel } from '../../../model/mantenimiento/tiposervicioModel';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-retencion-negociacion-cliente',
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
    AutoCompleteModule,
    PanelModule,
    RadioButtonModule,
  ],
  templateUrl: './retencion-negociacion-cliente.html',
  styleUrl: './retencion-negociacion-cliente.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class RetencionNegociacionCliente {
  spinner = signal<boolean>(false);
  formErrors = {
    nombre_completo: signal(false),
    direccion: signal(false),
    fechaorden: signal(false),
  };
  BuscarNegociacion = signal<BuscarNegociacion>(new BuscarNegociacion());
  negociacionClientesRequest = signal<NegociacionClientesRequest[]>([]);
  // Variables para el modal de bitácora
  bitTipo: string = 'WhatsApp';
  bitDetalle: string = '';
  bloquearboton = signal<boolean>(false);
  BitacuraModel = signal<BitacuraModel>(new BitacuraModel());
  listadoBitacora = signal<BitacuraModel[]>([]);

  negociacionModel = signal<NegociacionModel>(new NegociacionModel());
  cargarbitacora: boolean = false;
  showModalBitacora: boolean = false;
  Totalregistros: number = 0;
  negociacionDialog: boolean = false;
  bitacoraTipos = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Email', value: 'Email' },
    { label: 'Llamada', value: 'Llamada' },
    { label: 'Otra', value: 'Otra' },
  ];
  canal_preferidoList = [
    { label: 'WHATSAPP', value: 'WHATSAPP' },
    { label: 'SMS', value: 'SMS' },
    { label: 'EMAIL', value: 'EMAIL' },
    { label: 'LLAMADA', value: 'LLAMADA' },
  ];
  facturas = signal<FacturacionRequest[]>([]);
  estadosbusqueda: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'VIGENTE', value: 'VIGENTE' },
    { label: 'CUMPLIDA', value: 'CUMPLIDA' },
    { label: 'INCUMPLIDA', value: 'INCUMPLIDA' },
    { label: 'CANCELADA', value: 'CANCELADA' },
  ];
  autorecordatorioList = [
    { label: 'SI', value: 1 },
    { label: 'NO', value: 0 },
  ];
  // Listado de clientes para el autocomplete
  listadoClientes = signal<ListadoClientes[]>([]);
  nombrecliente: ListadoClientes = new ListadoClientes();
  // Tipos de acción para la bitácora
  listadoTiposervicio = signal<TipoServicioModel[]>([]);
  clientes: ListadoClientes[] = [];
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private gmailService: GmailService,
    private whatsappService: WhatsappService,
    private bitacuraService: BitacuraService,
    private nogociacionClientesService: NogociacionClientesService,
    private facturacionService: FacturacionService,
    private clienteSerice: ClientesService,
    private tiposervicioServicio: TipoServicioService
  ) {}

  ngOnInit() {
    this.BuscarNegociacion().estado = 'TODOS';
    this.cargarListados();
  }
  private cargarListados() {
    this.buscarNegociacion();
    this.cargarclientes();
  }

  buscarNegociacion() {
    this.negociacionClientesRequest.set([]);
    this.spinner.set(true);
    this.nogociacionClientesService
      .buscarNegociacion(this.BuscarNegociacion())
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje === 'EXITO') {
            this.negociacionClientesRequest.set(response?.data || []);
            this.Totalregistros = this.negociacionClientesRequest()?.length;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al buscar la negociación',
            });
          }
        },
        error: (err) => {
          this.negociacionClientesRequest.set([]);
          this.spinner.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al buscar la negociación',
          });
        },
      });
  }

  // Acción WhatsApp
  accionWhatsapp(row: any) {
    Swal.fire({
      title: 'Confirmar envío de WhatsApp',
      html: `¿Está seguro de enviar un mensaje por WhatsApp al cliente <strong>${row.nombre_completo}</strong> con el teléfono <strong>${row.telefono}</strong>?`,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
        // this.guardarhistorial(
        //   row.id_cliente,
        //   'WhatsApp Enviado',
        //   `Se envió un mensaje por WhatsApp al número ${row.telefono} del módulo de gestión de cortes.`,
        //   'Activo'
        // );
        const url = this.whatsappService.generarwhatsparamorosidad(
          row.telefono,
          row.nombre_completo,
          row.deuda_actual_soles,
          row.dias_en_mora
        );
        window.open(url, '_blank');

        this.spinner.set(false);
      }
    });
  }
  abrirBitacora(data: any) {
    this.showModalBitacora = true;
    this.BitacuraModel().id_cliente = data.id_cliente;
    this.listadoBitacora.set([]);
    this.listadodbitacora();
  }

  listadodbitacora() {
    this.bitacuraService
      .buscarBitacoraPoridcliente(this.BitacuraModel().id_cliente)
      .subscribe({
        next: (response) => {
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
      });
  }
  // Agregar un nuevo registro a la bitácora
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
          // this.listadodbitacora();
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

  // Cerrar modal de bitácora
  closeModalBitacora() {
    this.showModalBitacora = false;
  }

  limpiar_filtros() {
    this.BuscarNegociacion.set(new BuscarNegociacion());
  }

  guardar_negociacion() {
    this.nogociacionClientesService
      .guardar_negociacion(this.negociacionModel())
      .subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Negociación guardada exitosamente.',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al guardar la negociación',
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al guardar la negociación',
          });
        },
      });
  }

  verFacturacion(idContrato: number, idCliente: number) {
    this.spinner.set(true);
    this.facturacionService
      .obtener_facturas_x_contrato(idContrato, idCliente)
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje == 'EXITO') {
            this.facturas.set(response.data);
          } else {
            this.facturas.set([]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
          }
        },
        error: (error) => {
          this.spinner.set(false);
          this.facturas.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener facturación',
          });
        },
      });
  }
  openDialog() {
    this.negociacionDialog = true;
  }
  cargarclientes() {
    this.clienteSerice.getClientes().subscribe({
      next: (data) => {
        const clientes = data.data.map((c: any) => ({
          ...c,
          nombreapellido: `${c.nombres} ${c.apellidos}`,
        }));

        this.listadoClientes.set(clientes);
      },
    });
    this.tiposervicioServicio.getTipoServicio().subscribe({
      next: (data) => {
        this.listadoTiposervicio.set(data.data);
      },
    });
  }
  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toUpperCase();
    this.clientes = this.listadoClientes().filter((p) =>
      p.nombreapellido?.toUpperCase().includes(query)
    );
  }
  cambionombre() {
    this.negociacionModel().nombre_completo =
      this.nombrecliente.nombres + ' ' + this.nombrecliente.apellidos;
    this.negociacionModel().id_cliente = this.nombrecliente.id;
    this.negociacionModel().nrodocident = this.nombrecliente.nrodocident;
    this.negociacionModel().email = this.nombrecliente.email;
    this.negociacionModel().telefono = this.nombrecliente.telefono;
  }
  guardarNegociacion() {
    if (this.negociacionModel().id_cliente == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un cliente válido.',
      });
      return;
    }
    if (this.negociacionModel().acciones_negociacion.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Las acciones de negociación no pueden estar vacías.',
      });
      return;
    }
  }
}
