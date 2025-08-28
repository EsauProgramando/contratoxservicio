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

import { FacturacionService } from '../../../services/gestionClientes/facturacion.service';
import { FacturacionRequest } from '../../../model/gestionClientes/FacturacionRequest';
import { FacturacionEnvio } from '../../../model/gestionClientes/facturacionEnvio';
import { CargaComponent } from '../../../components/carga/carga.component';
import { TipoServicioModel } from '../../../model/mantenimiento/tiposervicioModel';
import { TipoServicioService } from '../../../services/mantenimiento/tipo-servicio.service';
import { PagosModel } from '../../../model/gestionCobranza/pagosModel';
import { PagosService } from '../../../services/gestionCobranza/pagos.service';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'app-cobranzas',
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
  templateUrl: './cobranzas.html',
  styleUrl: './cobranzas.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class Cobranzas {
  spinner = signal<boolean>(false);
  abrimodalfacturacion = signal<boolean>(false);
  facturas = signal<FacturacionRequest[]>([]);
  facturacionEnvio = signal<FacturacionEnvio>(new FacturacionEnvio());
  searchValue: string = '';
  ref: DynamicDialogRef | undefined;
  listaTpoServicioes_servicio = signal<TipoServicioModel[]>([]);
  disabled = signal<boolean>(false);
  //pagos
  pagos = signal<PagosModel>(new PagosModel());
  abrimodelpagos: boolean = false;
  formErrors = {
    id_metodo: signal(false),
    monto_pagado: signal(false),
    saldo: signal(false),
    fecha_pago: signal(false),
  };
  metodosPago = [
    { label: 'Efectivo', value: 1 },
    { label: 'Transferencia', value: 2 },
    { label: 'Tarjeta', value: 3 },
    { label: 'Yape', value: 4 },
    { label: 'Plin', value: 5 },
  ];

  estados: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'POR VENCER', value: 'POR_VENCER' },
    { label: 'VENCIDO', value: 'VENCIDO' },
    { label: 'MOROSO CRONICO', value: 'MOROSO_CRONICO' },
    { label: 'PAGADO', value: 'PAGADO' },
  ];

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private facturacionService: FacturacionService,
    private tipoServicioService: TipoServicioService,
    private pagosService: PagosService
  ) {}
  ngOnInit() {
    this.cargarTipoServicio();
  }
  buscarFacturas() {
    this.spinner.set(true);
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
    this.facturacionEnvio().estado = '';
    this.searchValue = '';
    this.facturacionEnvio().nombre_completo = '';
  }
  //recordatorio
  recordarPago(factura: FacturacionRequest) {
    // Lógica para recordar el pago de la factura
  }

  registrarPago(factura: FacturacionRequest) {
    // Lógica para registrar el pago de la factura
    this.abrimodelpagos = true;
    this.pagos.update((prev) => ({
      ...prev,
      id_factura: factura.id_factura,
      id_cliente: factura.id_cliente,
      monto_pagado: factura.saldo,
      saldo: factura.saldo,
      nombre_completo: factura.nombre_completo,
    }));
  }

  verHistorial(factura: FacturacionRequest) {
    // Lógica para ver el historial de la factura
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
  private cargarTipoServicio() {
    this.tipoServicioService.getTipoServicio().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaTpoServicioes_servicio.set(
            response.data.filter((item) => item.es_servicio)
          );
          //agregar un valor mas que seria 0 es igual a TODOS
          // ✅ o con update (usa el valor anterior)
          this.listaTpoServicioes_servicio.update((prev) => [
            { descripcion: 'TODOS', es_servicio: true, estareg: 1, id_tipo: 0 },
            ...prev,
          ]);
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
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string; // esto incluye "data:mime/type;base64,..."
        this.pagos.update((prev) => ({
          ...prev,
          adjunto_boleta: base64,
        }));
      };

      reader.readAsDataURL(file); // lee como DataURL para mantener metadata y tipo
    }
  }

  cerrarModal() {
    this.abrimodelpagos = false;
    this.pagos.set(new PagosModel());
  }
  guardarPago() {
    // Lógica para guardar el pago
    if (!this.validarForm()) {
      return;
    }
    this.spinner.set(true);
    this.disabled.set(true);
    console.log(this.pagos());
    //transformar fecha Mon Aug 04 2025 00:00:00 GMT-0500 (hora estándar de Perú) {} - eso formarto a año/mm/dd
    const fecha = new Date(this.pagos().fecha_pago);
    const fechaFormateada = `${fecha.getFullYear()}/${(fecha.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')}`;
    console.log(fechaFormateada);
    this.pagos.update((prev) => ({
      ...prev,
      fecha_pago: fechaFormateada,
    }));
    console.log(fechaFormateada);
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
          this.cerrarModal();
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

  validarForm(): boolean {
    let valido = true;

    // validar fecha
    if (!this.pagos().fecha_pago) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de pago es requerida',
      });
      this.formErrors.fecha_pago.set(true);
      valido = false;
    } else {
      this.formErrors.fecha_pago.set(false);
    }

    // validar monto
    if (!this.pagos().monto_pagado) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El monto de pago es requerido',
      });
      this.formErrors.monto_pagado.set(true);
      valido = false;
    } else {
      this.formErrors.monto_pagado.set(false);
    }

    // validar método de pago
    if (!this.pagos().id_metodo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El método de pago es requerido',
      });
      this.formErrors.id_metodo.set(true);
      valido = false;
    } else {
      this.formErrors.id_metodo.set(false);
    }

    // validar monto vs saldo
    if (this.pagos().monto_pagado > this.pagos().saldo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El monto de pago no puede ser mayor al saldo',
      });
      this.formErrors.saldo.set(true);
      valido = false;
    } else {
      this.formErrors.saldo.set(false);
    }

    return valido;
  }
}
