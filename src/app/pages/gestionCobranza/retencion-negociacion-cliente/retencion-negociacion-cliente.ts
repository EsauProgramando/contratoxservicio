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
import { CargaComponent } from '../../../components/carga/carga.component';
import Swal from 'sweetalert2';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import { GmailService } from '../../../services/gmail/gmail.service';
import { WhatsappService } from '../../../services/whatsapp/whatsapp.service';
import { BitacuraService } from '../../../services/mantenimiento/bitacura.service';
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
import { ClienteContratoxServicio } from '../../../model/gestionCobranza/ClienteContratoxServicio';
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
  verdetalle: boolean = false;
  negociacionModel = signal<NegociacionModel>(new NegociacionModel());
  cargarbitacora: boolean = false;
  showModalBitacora: boolean = false;
  Totalregistros: number = 0;
  negociacionDialog: boolean = false;
  mostrardetallenegociacion = signal<NegociacionClientesRequest>(
    new NegociacionClientesRequest()
  );
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
  estados: { label: string; value: string }[] = [
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
  clienteContratoxServicio = signal<ClienteContratoxServicio[]>([]);
  obtenerOneclienteContratoxServicio: ClienteContratoxServicio =
    new ClienteContratoxServicio();
  get totalMonto() {
    return this.facturas().reduce((acc, factura) => acc + factura.monto, 0);
  }
  get totalMontodeuda() {
    return this.facturas().reduce((acc, factura) => {
      if (factura.estado !== 'PAGADO') {
        acc += factura.monto;
      }
      return acc;
    }, 0);
  }
  tablafraccionamiento: FacturacionRequest[] = [];

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
    this.spinner.set(true);
    this.bitacuraService
      .buscarBitacoraPoridcliente(this.BitacuraModel().id_cliente)
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje === 'EXITO') {
            this.listadoBitacora.set(response?.data || []);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al obtener la bitácora',
            });
          }
        },
        error: (err) => {
          this.spinner.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al obtener la bitácora',
          });
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
  clientesxServicioContratados() {
    if (this.negociacionModel().id_cliente == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un cliente válido.',
      });
      return;
    }
    this.spinner.set(true);
    this.clienteContratoxServicio.set([]);
    this.nogociacionClientesService
      .clientesxServicioContratados(this.negociacionModel().id_cliente)
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje == 'EXITO') {
            this.clienteContratoxServicio.set(response.data);
          } else {
            this.clienteContratoxServicio.set([]);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
          }
        },
        error: (error) => {
          this.spinner.set(false);
          this.clienteContratoxServicio.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener contratos y servicios',
          });
        },
      });
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
    this.facturas.set([]);
    this.tablafraccionamiento = [];
    this.facturacionService
      .obtener_facturas_x_contrato(idContrato, idCliente)
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje == 'EXITO') {
            this.facturas.set(response.data);
            this.tablafraccionamiento = response.data.filter(
              (f) => f.estado !== 'PAGADO'
            );
            //igualar monto_fraccionado al saldo
            this.tablafraccionamiento.forEach((f) => {
              f.monto_fraccionado = f.saldo;
            });
            console.log(this.tablafraccionamiento, 'TABLA FRACCIONAMIENTO');
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
    this.negociacionModel.set(new NegociacionModel());
    this.facturas.set([]);
    this.tablafraccionamiento = [];
    this.obtenerOneclienteContratoxServicio = new ClienteContratoxServicio();
    this.nombrecliente = new ListadoClientes();
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
    this.facturas.set([]);
    //resetear el contrato seleccionado
    this.obtenerOneclienteContratoxServicio = new ClienteContratoxServicio();
    this.negociacionModel.set(new NegociacionModel());
    this.negociacionModel().nombre_completo =
      this.nombrecliente.nombres + ' ' + this.nombrecliente.apellidos;
    this.negociacionModel().id_cliente = this.nombrecliente.id;
    this.negociacionModel().nrodocident = this.nombrecliente.nrodocident;
    this.negociacionModel().email = this.nombrecliente.email;
    this.negociacionModel().telefono = this.nombrecliente.telefono;
    this.clientesxServicioContratados();
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
    this.bloquearboton.set(true);
    this.spinner.set(true);
    this.negociacionModel().id_contrato =
      this.obtenerOneclienteContratoxServicio.id_contrato;
    this.negociacionModel().id_tipo =
      this.obtenerOneclienteContratoxServicio.id_tipo;
    this.negociacionModel().fecha_inicio = this.formatDateForDB(
      this.negociacionModel().fecha_inicio
    );
    this.negociacionModel().facturas = this.tablafraccionamiento.map(
      (factura) => ({
        id_factura: factura.id_factura,
        monto: factura.monto,
        monto_fraccionado: factura.monto_fraccionado || 0,
        fecha_vencimiento: factura.fecha_vencimiento,
        fecha_vencimiento_nuevo: factura.fecha_vencimiento_nuevo,
      })
    );
    this.negociacionModel().usuario_crea = 'ADMIN'; // Reemplaza con el usuario actual
    this.negociacionModel().monto_total = this.totalMontodeuda;
    console.log(this.negociacionModel());
    this.nogociacionClientesService
      .guardar_negociacion(this.negociacionModel())
      .subscribe({
        next: (response) => {
          this.bloquearboton.set(false);
          this.spinner.set(false);
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Negociación guardada exitosamente.',
            });
            this.negociacionDialog = false;
            this.buscarNegociacion();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al guardar la negociación',
            });
          }
        },
        error: (err) => {
          this.bloquearboton.set(false);
          this.spinner.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error al guardar la negociación',
          });
        },
      });
  }

  generarFraccionamiento() {
    const montoPagarInicial = this.negociacionModel().montopagar_inicial;

    // Validación de monto
    if (montoPagarInicial <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El monto a pagar inicial debe ser mayor a cero.',
      });
      return;
    }

    // Paso 1: Restar del saldo de la primera factura y actualizar monto_fraccionado
    let montoRestante = montoPagarInicial;

    if (this.tablafraccionamiento.length > 0) {
      let primeraFactura = this.tablafraccionamiento[0];

      if (primeraFactura.saldo >= montoRestante) {
        // Si el saldo de la primera factura es mayor o igual al monto que se paga
        primeraFactura.monto_fraccionado = montoRestante; // Asignamos el monto fraccionado
        primeraFactura.saldo = 0; // El saldo de la primera factura se paga completamente
        montoRestante = 0; // No queda monto restante para distribuir
      } else {
        // Si el saldo de la primera factura es menor que el monto a pagar
        primeraFactura.monto_fraccionado = primeraFactura.saldo; // El monto fraccionado es igual al saldo
        montoRestante -= primeraFactura.saldo; // Restamos el saldo de la primera factura
        primeraFactura.saldo = 0; // La factura queda completamente saldada
      }
    }

    // Paso 2: Si queda monto restante, distribuirlo entre las demás facturas
    if (montoRestante > 0) {
      // Calculamos el total de los saldos restantes de las facturas que no son la primera
      const totalSaldoRestante = this.tablafraccionamiento.reduce(
        (total, factura, index) => {
          if (index > 0) {
            // Ignoramos la primera factura
            return total + factura.saldo;
          }
          return total;
        },
        0
      );

      // Paso 3: Distribuir proporcionalmente entre las facturas restantes
      if (totalSaldoRestante > 0) {
        for (let i = 1; i < this.tablafraccionamiento.length; i++) {
          let factura = this.tablafraccionamiento[i];

          // Calculamos cuánto se distribuye a cada factura en proporción a su saldo
          let montoProporcional =
            (factura.saldo / totalSaldoRestante) * montoRestante;

          // Almacenamos el monto fraccionado en el campo monto_fraccionado
          factura.monto_fraccionado = montoProporcional;
        }
      }
    }

    console.log('Fraccionamiento finalizado:', this.tablafraccionamiento);
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
  verdetalleNegociacion(row: NegociacionClientesRequest) {
    this.verdetalle = true;
    this.mostrardetallenegociacion.set(row);
    this.verFacturacion(row.id_contrato, row.id_cliente);
    this.BitacuraModel().id_cliente = row.id_cliente;
    this.listadodbitacora();
  }
  actualizarEstado(row: NegociacionClientesRequest) {
    // precarga el modelo
    this.negociacionModel().id_negociacion = row.id_negociacion;
    this.negociacionModel().id_cliente = row.id_cliente;
    this.negociacionModel().id_contrato = row.id_contrato;
    this.negociacionModel().id_tipo = row.id_tipo;
    this.negociacionModel().estado = row.estado;

    // convierte tus estados a inputOptions de SweetAlert
    const inputOptions = Object.fromEntries(
      this.estados.map((e) => [e.value, e.label])
    );

    Swal.fire({
      title: 'Confirmar actualización de estado',
      html: `¿Está seguro de actualizar el estado de la negociación del cliente <strong>${row.nombre_completo}</strong>?`,
      input: 'select',
      inputOptions,
      inputValue: row.estado ?? 'VIGENTE',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No, cancelar',
      preConfirm: (nuevoEstado) => {
        if (!nuevoEstado) {
          Swal.showValidationMessage('Seleccione un estado');
          return;
        }
        return nuevoEstado;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const payload = { ...this.negociacionModel(), estado: result.value };
        console.log(payload, 'Payload para actualizar estado');

        this.nogociacionClientesService.modificar_estado(payload).subscribe({
          next: () => {
            this.buscarNegociacion();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Estado de la negociación actualizado correctamente.',
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar el estado de la negociación.',
            });
          },
        });
      }
    });
  }
}
