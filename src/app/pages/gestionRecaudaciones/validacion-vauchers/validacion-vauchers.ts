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
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { CargaComponent } from '../../../components/carga/carga.component';
import { TextareaModule } from 'primeng/textarea';
import { FacturacionRequest } from '../../../model/gestionClientes/FacturacionRequest';
import { FacturacionEnvio } from '../../../model/gestionClientes/facturacionEnvio';
import { TipoServicioModel } from '../../../model/mantenimiento/tiposervicioModel';
import { PagosModel } from '../../../model/gestionCobranza/pagosModel';
import { creardocumentoModel } from '../../../model/documento/documento';
import { HistorialServicioModel } from '../../../model/mantenimiento/HistorialServicioModel';
import { FacturacionService } from '../../../services/gestionClientes/facturacion.service';
import { Historialservicio } from '../../../services/mantenimiento/historialservicio';
import { PagosService } from '../../../services/gestionCobranza/pagos.service';
import { ActuatulizarFacturaModel } from '../../../model/gestionClientes/ActuatulizarFacturaModel';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-validacion-vauchers',
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
    TextareaModule,
    DatePickerModule,
  ],
  templateUrl: './validacion-vauchers.html',
  styleUrl: './validacion-vauchers.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class ValidacionVauchers {
  spinner = signal<boolean>(false);

  abrimodalfacturacion = signal<boolean>(false);
  facturas = signal<FacturacionRequest[]>([]);
  facturacionEnvio = signal<FacturacionEnvio>(new FacturacionEnvio());
  searchValue: string = '';
  ref: DynamicDialogRef | undefined;
  listaTpoServicioes_servicio = signal<TipoServicioModel[]>([]);
  disabled = signal<boolean>(false);
  fila_select = signal<FacturacionRequest>(new FacturacionRequest());
  //pagos
  pagos = signal<PagosModel>(new PagosModel());
  facturaEnvio = signal<creardocumentoModel>(new creardocumentoModel());
  abrimodelpagos: boolean = false;
  abrirmodalrechazo: boolean = false;
  abrirmodalvalidacion: boolean = false;
  formErrors = {
    id_metodo: signal(false),
    monto_pagado: signal(false),
    saldo: signal(false),
    fecha_pago: signal(false),
    monto_confirmado: signal(false),
    fecharevision: signal(false),
  };
  formErrorsFactura = {
    numeroDocumentoCliente: signal(false),
    direccionCliente: signal(false),
  };
  abrirdetallefactura: boolean = false;
  historialServicioModel = signal<HistorialServicioModel>(
    new HistorialServicioModel()
  );
  listaHistorialServicio = signal<HistorialServicioModel[]>([]);
  abrimodalhistorial: boolean = false;

  estados: any[] = [
    { label: 'PENDIENTE REVISION', value: 'PENDIENTE_REVISION' },
    { label: 'RECHAZADO', value: 'RECHAZADO' },
  ];
  rechazoMotivo: any[] = [
    { label: 'Monto no coincide', value: 'MONTO_NO_COINCIDE' },
    {
      label: 'Número de operación inválido',
      value: 'NUMERO_OPERACION_INVALIDO',
    },
    {
      label: 'Número de operación duplicado',
      value: 'NUMERO_OPERACION_DUPLICADO',
    },
    {
      label: 'Evidencia ilegible / faltante',
      value: 'EVIDENCIA_ILEGIBLE_FALTANTE',
    },
    { label: 'Operación no encontrada', value: 'OPERACION_NO_ENCONTRADA' },
    { label: 'Otro', value: 'OTRO' },
  ];

  actuatulizarFacturaModel = signal<ActuatulizarFacturaModel>(
    new ActuatulizarFacturaModel()
  );
  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private facturacionService: FacturacionService,
    private historialServicio: Historialservicio,
    private pagosService: PagosService
  ) {}
  ngOnInit() {
    this.facturacionEnvio().estado = 'PENDIENTE_REVISION';
    this.buscarFacturas();
  }
  buscarFacturas() {
    this.spinner.set(true);
    this.facturas.set([]);
    this.facturacionService.buscar_facturas(this.facturacionEnvio()).subscribe({
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
      error: (err) => {
        this.spinner.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al buscar facturas',
        });
      },
    });
  }
  limpiarFiltros() {
    this.facturacionEnvio().estado = 'PENDIENTE_REVISION';
    this.searchValue = '';
    this.facturacionEnvio().nombre_completo = '';
  }
  getTotales() {
    const facturas = this.facturas(); // Asumiendo que es un getter
    let montoTotal = 0;
    let saldoTotal = 0;

    for (const f of facturas) {
      montoTotal += Number(f.monto) || 0;
      saldoTotal += Number(f.saldo) || 0;
    }

    return {
      monto: montoTotal.toFixed(2),
      saldo: saldoTotal.toFixed(2),
    };
  }
  verHistorial(factura: FacturacionRequest) {
    this.abrimodalhistorial = true;
    this.listaHistorialServicio.set([]);
    this.cargarHistorial(factura.id_cliente);
  }
  cargarHistorial(id_cliente: number) {
    this.historialServicio.getHistorialServicio(id_cliente).subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaHistorialServicio.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el historial de servicios',
        });
      },
    });
  }
  validarVoucher(factura: FacturacionRequest) {
    this.pagos.update((prev) => ({
      ...prev,
      id_factura: factura.id_factura,
      id_cliente: factura.id_cliente,
      monto_pagado: factura.saldo,
      saldo: factura.saldo,
      nombre_completo: factura.nombre_completo,
      codigo_factura: factura.codigo_factura,
      fecha_pago: factura.fecha_pago,
      ticket: factura.ticket,
      observacion_vache: factura.observacion_vache,
      fecharevision: factura.fecharevision,
      monto_confirmado: factura.saldo,
      motivo_rechaso: factura.motivo_rechaso,
    }));
    this.abrirmodalvalidacion = true;
  }
  rechazarVoucher(factura: FacturacionRequest) {
    this.abrirmodalrechazo = true;
    this.actuatulizarFacturaModel().id_factura = factura.id_factura;
    this.actuatulizarFacturaModel().id_cliente = factura.id_cliente;
    this.actuatulizarFacturaModel().id_contrato = factura.id_contrato;
    this.actuatulizarFacturaModel().ticket = factura.ticket;
    this.actuatulizarFacturaModel().fecha_pago = factura.fecha_pago;
    this.actuatulizarFacturaModel().motivo_rechaso = '';
    this.actuatulizarFacturaModel().observacion_vache = '';
    this.actuatulizarFacturaModel().estado = 'RECHAZADO';
  }
  guardarPago() {
    // Lógica para guardar el pago
    if (!this.validarForm()) {
      return;
    }
    this.spinner.set(true);
    this.disabled.set(true);
    console.log(this.pagos());

    this.pagos.update((prev) => ({
      ...prev,
      fecharevision: this.formatDateForDB(this.pagos().fecharevision),
      id_metodo: 4, //yape
      observaciones: 'Pago validado por sistema',
    }));

    this.pagosService.registrarPagos(this.pagos(), 1).subscribe({
      next: (response) => {
        this.spinner.set(false);
        this.disabled.set(false);
        if (response?.mensaje === 'EXITO') {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Pago registrado correctamente',
          });
          this.buscarFacturas();
          this.guardarhistorial(
            this.pagos().id_cliente,
            'Registro de Pago',
            `Se registró un pago de S/. ${this.pagos().monto_pagado.toFixed(
              2
            )} para la factura ID ${this.pagos().id_factura}.`,
            'Activo'
          );
          // this.cerrarModal();
        } else {
          this.spinner.set(false);
          this.disabled.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al registrar el pago',
        });
      },
    });
  }
  guardarhistorial(
    id_cliente: number,
    accion: string,
    descripcion: string,
    estado_servicio: string
  ) {
    this.historialServicioModel().id_cliente = id_cliente;
    this.historialServicioModel().tipo_accion = accion;
    this.historialServicioModel().fecha_accion = new Date().toISOString();
    this.historialServicioModel().descripcion = descripcion;
    this.historialServicioModel().estado_servicio = estado_servicio;
    this.historialServicio
      .registrarHistorialServicio(this.historialServicioModel())
      .subscribe({
        next: (response) => {
          if (response?.mensaje == 'EXITO') {
            console.log('Historial de servicio guardado');
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el historial de servicios',
          });
        },
      });
  }
  validarForm(): boolean {
    let valido = true;
    if (!this.pagos().fecharevision) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de revisión es requerida',
      });
      this.formErrors.fecharevision.set(true);
      valido = false;
    } else {
      this.formErrors.fecharevision.set(false);
    }

    // validar monto
    if (!this.pagos().monto_confirmado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El monto confirmado es obligatorio',
      });
      this.formErrors.monto_confirmado.set(true);
      valido = false;
    } else {
      this.formErrors.monto_confirmado.set(false);
    }
    // Validar id_metodo
    return valido;
  }
  cerrarModal_rechazo() {
    this.abrirmodalrechazo = false;
  }

  actualizar_factura() {
    //validar campos
    if (!this.actuatulizarFacturaModel().motivo_rechaso) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione un motivo de rechazo',
      });
      return;
    }

    this.disabled.set(true);
    if (this.actuatulizarFacturaModel().observacion_vache != '') {
      this.actuatulizarFacturaModel().observacion_vache =
        this.actuatulizarFacturaModel().observacion_vache.toUpperCase();
    }
    this.spinner.set(true);
    this.facturacionService
      .actualizar_factura(this.actuatulizarFacturaModel())
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          this.disabled.set(false);
          this.cerrarModal_rechazo();
          this.buscarFacturas();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Factura actualizada correctamente',
          });
        },
        error: (error) => {
          this.spinner.set(false);
          this.disabled.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la factura',
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
}
