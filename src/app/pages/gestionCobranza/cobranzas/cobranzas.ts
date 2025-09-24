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
import { GmailService } from '../../../services/gmail/gmail.service';
import { EmailModel } from '../../../model/gmail/EmailModel';
import Swal from 'sweetalert2';
import { Historialservicio } from '../../../services/mantenimiento/historialservicio';
import { HistorialServicioModel } from '../../../model/mantenimiento/HistorialServicioModel';
import {creardocumentoModel} from '../../../model/documento/documento';
import {DocumentoService} from '../../../services/documento/documento-service';
import {AnimateOnScrollModule} from 'primeng/animateonscroll';
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
    AnimateOnScrollModule
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
  fila_select=signal<FacturacionRequest>(new FacturacionRequest())
  //pagos
  pagos = signal<PagosModel>(new PagosModel());
  facturaEnvio = signal<creardocumentoModel>(new creardocumentoModel());
  abrimodelpagos: boolean = false;
  formErrors = {
    id_metodo: signal(false),
    monto_pagado: signal(false),
    saldo: signal(false),
    fecha_pago: signal(false),
  };
  formErrorsFactura = {
    numeroDocumentoCliente: signal(false),
    direccionCliente: signal(false)
  };
  abrirdetallefactura:boolean=false
  emailModel = signal<EmailModel>(new EmailModel());
  historialServicioModel = signal<HistorialServicioModel>(
    new HistorialServicioModel()
  );
  listaHistorialServicio = signal<HistorialServicioModel[]>([]);
  abrimodalhistorial: boolean = false;
  metodosPago = [
    { label: 'Efectivo', value: 1 },
    { label: 'Transferencia', value: 2 },
  ];
  tipodocumento = [
    { label: 'RUC', value: '6' },
    { label: 'DNI', value: '1' },
    { label: 'OTROS', value: '0' },
  ];

  estados: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'POR VENCER', value: 'POR_VENCER' },
    { label: 'VENCIDO', value: 'VENCIDO' },
    { label: 'MOROSO CRONICO', value: 'MOROSO_CRONICO' },
    { label: 'PAGADO', value: 'PAGADO' },
  ];
  tipocomprobante = [
    { label: 'Boleta', value: '03' },
    { label: 'Factura', value: '01' }
  ];

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private facturacionService: FacturacionService,
    private tipoServicioService: TipoServicioService,
    private pagosService: PagosService,
    private gmailService: GmailService,
    private historialServicio: Historialservicio,
    private documentoService:DocumentoService
  ) {}
  ngOnInit() {
    this.cargarTipoServicio();
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
    this.facturacionEnvio().estado = '';
    this.searchValue = '';
    this.facturacionEnvio().nombre_completo = '';
  }
  //recordatorio
  recordarPago(factura: FacturacionRequest) {
    if (!factura.email || factura.email.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El cliente no tiene un correo electrónico registrado.',
      });
      return;
    }

    // Lógica para recordar el pago de la factura
    this.emailModel().to = factura.email;
    this.emailModel().subject = 'Recordatorio de Pago de Factura';
    this.emailModel().body = `Estimado/a ${
      factura.nombre_completo
    },<br><br>Le recordamos que su factura con código ${
      factura.codigo_factura
    } por un saldo de S/. ${factura.saldo.toFixed(
      2
    )} está pendiente de pago. La fecha de vencimiento es ${
      factura.fecha_vencimiento
    }.<br><br>Por favor, realice el pago a la brevedad para evitar inconvenientes.<br><br>Gracias por su atención.<br><br>Atentamente,<br>Su Empresa`;
    console.log(this.emailModel());
    //Swail preguntar si desea enviar el correo
    Swal.fire({
      title: '¿Enviar recordatorio de pago?',
      text: `Se enviará un recordatorio de pago a ${factura.email}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
        // Lógica para enviar el correo
        this.gmailService.mensajesimple(this.emailModel()).subscribe({
          next: (rest) => {
            this.spinner.set(false);
            if (rest?.response == 'EXITO') {
              Swal.fire({
                title: 'Éxito',
                text: 'Recordatorio de pago enviado.',
                icon: 'success',
              });

              this.guardarhistorial(
                factura.id_cliente,
                'Recordatorio de Pago',
                `Se envió un recordatorio de pago a ${
                  factura.email
                } por el monto de S/. ${factura.saldo.toFixed(
                  2
                )} correspondiente a la factura ${factura.codigo_factura}.`,
                'Activo'
              );
            } else {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar el recordatorio de pago.',
                icon: 'error',
              });
            }
          },
          error: (error) => {
            this.spinner.set(false);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo enviar el recordatorio de pago.',
              icon: 'error',
            });
          },
        });
      }
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
      codigo_factura: factura.codigo_factura,
    }));
  }
  detallefactura(factura: FacturacionRequest){
    this.facturaEnvio.set(new creardocumentoModel())
    console.log(factura)
    this.fila_select.set(factura)
    // this.facturaEnvio.update((e)=>({
    //   ...e,
    //   idContrato:factura.id_contrato,
    //   nombreCliente:factura.nombre_completo,
    //   tipoComprobante:factura.tipodocident==5?'03':'01',
    //   tipoDocumentoCliente:factura.tipodocident==7?'1':factura.tipodocident==5?'6':'0',
    //   direccionCliente:factura.direccion,
    //   numeroDocumentoCliente: factura.nrodocident
    // }))
    this.facturaEnvio.update((prev) => ({
      ...prev,
      codigoFactura:factura.codigo_factura,
      tipoComprobante: factura.codigo_factura.substring(0,1)=='B'?'03':'01',
      tipoDocumentoCliente:  factura.tipodocident==5?'1':factura.tipodocident==7?'6':'0',
      numeroDocumentoCliente: factura.nrodocident,
      nombreCliente:    factura.nombre_completo,
      razonSocialCliente:     factura.nombre_completo,
      direccionCliente: factura.direccion
    }));
    this.abrirdetallefactura=true
    console.log(this.facturaEnvio())
  }
  generarDocumento(factura: FacturacionRequest) {
    if (!this.validarFormFactura()) {
      return;
    }
    this.spinner.set(true);
    this.abrirdetallefactura=false
// console.log(factura,this.facturaEnvio(),'data')
    this.documentoService.registrarDocumento(this.facturaEnvio()).subscribe({
      next:(data)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Aviso de Usuario',
          detail: 'Se creó el documento de envío',
        });
        if(this.facturaEnvio().tipoComprobante=='03'){

          this.documentoService.getBoleta(factura.codigo_factura).subscribe({
            next:(data)=>{
              this.spinner.set(false);
              this.messageService.add({
                severity: 'success',
                summary: 'Aviso de Usuario',
                detail: 'Se creó el documento de envío',
              });
              this.buscarFacturas()
            },error:(err)=>{
              this.abrirdetallefactura=true
              this.messageService.add({
                severity: 'error',
                summary: 'Aviso de Usuario',
                detail: 'Ocurrió un error al generar la boleta',
              });
              this.spinner.set(false);
            }
          })
        }else {
          this.documentoService.getFactura(factura.codigo_factura).subscribe({
            next:(data)=>{

              this.messageService.add({
                severity: 'success',
                summary: 'Aviso de Usuario',
                detail: 'Se creó la factura con ÉXITO',
              });
              this.spinner.set(false);
              this.buscarFacturas()
            },error:(err)=>{

              this.messageService.add({
                severity: 'error',
                summary: 'Aviso de Usuario',
                detail: 'Ocurrió un error al crear la factura',
              });
              this.spinner.set(false);
            }
          })
        }
      },error:(err)=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Aviso de Usuario',
          detail: err.error?.resultado || 'Ocurrió un error al crear el documento',
        });
        this.spinner.set(false);
      }
    })
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
    this.abrirdetallefactura=false
    this.pagos.set(new PagosModel());
    this.facturaEnvio.set(new creardocumentoModel())
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
          this.buscarFacturas();
          this.guardarhistorial(
            this.pagos().id_cliente,
            'Registro de Pago',
            `Se registró un pago de S/. ${this.pagos().monto_pagado.toFixed(
              2
            )} para la factura ID ${this.pagos().id_factura}.`,
            'Activo'
          );
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
  validarFormFactura(): boolean {
    let valido = true;

    // validar fecha
    if (!this.facturaEnvio().direccionCliente) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La razón social',
      });
      this.formErrorsFactura.direccionCliente.set(true);
      valido = false;
    } else {
      this.formErrorsFactura.direccionCliente.set(false);
    }

    // validar monto
    if (!this.facturaEnvio().numeroDocumentoCliente) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El número de documento es necesario',
      });
      this.formErrorsFactura.numeroDocumentoCliente.set(true);
      valido = false;
    } else {
      this.formErrorsFactura.numeroDocumentoCliente.set(false);
    }


    return valido;
  }
  imprimirpdf(factura: FacturacionRequest) {
    if (factura.url_pdf) {
      window.open(factura.url_pdf, '_blank');
    } else {
      console.error('No existe URL de PDF en la factura');
    }
  }
  cambiocomprobante(){
    this.facturaEnvio().tipoDocumentoCliente=this.facturaEnvio().tipoComprobante=='01'?'6':'1'
  }
}
