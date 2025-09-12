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
import { Cortesservice } from '../../../services/gestionCobranza/cortes.service';
import { CargaComponent } from '../../../components/carga/carga.component';
import { CortesfiltroEnvio } from '../../../model/gestionCobranza/CortesfiltroEnvio';
import { CortesPendienteRequest } from '../../../model/gestionCobranza/CortesPendienteRequest';
import { CortesServicioRequest } from '../../../model/gestionCobranza/CortesServicioRequest';
import { BitacuraService } from '../../../services/mantenimiento/bitacura.service';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import { CorteModel } from '../../../model/gestionCobranza/CorteModel';
import { GmailService } from '../../../services/gmail/gmail.service';
import { EmailModel } from '../../../model/gmail/EmailModel';
import Swal from 'sweetalert2';
import { WhatsappService } from '../../../services/whatsapp/whatsapp.service';
import { Historialservicio } from '../../../services/mantenimiento/historialservicio';
import { HistorialServicioModel } from '../../../model/mantenimiento/HistorialServicioModel';

@Component({
  selector: 'app-gestioncortes',
  templateUrl: './gestioncortes.html',
  styleUrls: ['./gestioncortes.scss'],
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
  providers: [ConfirmationService, DialogService, MessageService],
})
export class Gestioncortes {
  spinner = signal<boolean>(false);
  CortesfiltroEnvio = signal<CortesfiltroEnvio>(new CortesfiltroEnvio());
  CortesPendienteRequest = signal<CortesPendienteRequest[]>([]);
  // Variables de filtro
  searchQuery: string = '';
  estado: string = '';
  ordenarPor: string = 'vencimiento';
  Totalregistros: number = 0;
  showModalBitacora: boolean = false;
  // Datos de ejemplo (reemplazar con datos reales)
  //array de de objetos del estado
  estados = [
    { label: 'POR_VENCER', value: 'POR_VENCER' },
    { label: 'MOROSO_CRONICO', value: 'MOROSO_CRONICO' },
    { label: 'CORTADO', value: 'CORTADO' },
    { label: 'PROGRAMADO', value: 'PROGRAMADO' },
  ];
  obtenerdetallecorte = signal<any>(new CortesServicioRequest());
  BitacuraModel = signal<BitacuraModel>(new BitacuraModel());
  listadoBitacora = signal<BitacuraModel[]>([]);
  // Variables para el modal de bitácora
  bitTipo: string = 'WhatsApp';
  bitDetalle: string = '';
  bloquearboton = signal<boolean>(false);
  CorteModel = signal<CorteModel>(new CorteModel());
  // Tipos de acción para la bitácora
  bitacoraTipos = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Email', value: 'Email' },
    { label: 'Llamada', value: 'Llamada' },
    { label: 'Otra', value: 'Otra' },
  ];

  // Modal controls
  showModalProgramar: boolean = false;
  showModalCortar: boolean = false;

  // Variables del modal
  progFecha: string = '';
  progTipo: string = 'remoto';
  progResp: string = '';
  progMotivo: string = 'Deuda pendiente';

  cutMetodo: string = 'remoto';
  cutNotas: string = '';

  tipoCorteOptions = [
    { label: 'REMOTO', value: 1 },
    { label: 'CAMPO', value: 2 },
  ];
  emailModel = signal<EmailModel>(new EmailModel());
  historialServicioModel = signal<HistorialServicioModel>(
    new HistorialServicioModel()
  );
  constructor(
    private messageService: MessageService,
    private cortesservice: Cortesservice,
    private bitacuraService: BitacuraService,
    private gmailService: GmailService,
    private whatsappService: WhatsappService,
    private historialServicio: Historialservicio
  ) {}

  ngOnInit() {
    //poner valores por defecto a los filtros
    this.CortesfiltroEnvio.set({ estado: 'POR_VENCER', nombre_completo: '' });
    this.obtener_cortes_pendientes_filtro();
  }
  // Abrir modal programar corte
  abrirProgramar(row: CortesPendienteRequest) {
    this.CorteModel.set(new CorteModel());
    this.CorteModel().id_cliente = row.id_cliente;
    this.CorteModel().id_tipo = row.id_tipo;
    this.CorteModel().id_factura = row.id_factura;
    this.CorteModel().id_estado = 5; // programado
    if (
      row.id_corte !== null &&
      row.id_corte !== undefined &&
      row.id_corte !== 0
    ) {
      this.CorteModel().id_corte = row.id_corte;
      this.CorteModel().op = 2; // 1 para actualizar

      this.cortesservice.obtener_cortes_por_id(row.id_corte).subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.obtenerdetallecorte.set(
              response?.data || new CortesServicioRequest()
            );
            console.log(this.obtenerdetallecorte());
            this.CorteModel().fecha_corte = this.formatDateForDB(
              this.obtenerdetallecorte().fecha_corte
            );
            this.CorteModel().id_tipo = this.obtenerdetallecorte().id_tipo;
            this.CorteModel().responsable_corte =
              this.obtenerdetallecorte().responsable_corte;
            this.CorteModel().motivo_corte =
              this.obtenerdetallecorte().motivo_corte;
            this.CorteModel().observaciones =
              this.obtenerdetallecorte().observaciones;
            console.log(this.CorteModel());

            this.showModalProgramar = true;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response?.mensaje || 'Error al obtener los detalles del corte',
            });
          }
        },
      });
    } else {
      this.CorteModel().op = 1; // 1 para actualizar
      this.showModalProgramar = true;
    }
  }

  // Guardar programación de corte
  guardarProgramar() {
    //validar fecha corte

    if (!this.CorteModel().fecha_corte) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha de corte es requerida.',
      });
      return;
    }
    if (this.CorteModel().id_tipo == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El tipo de corte es requerido.',
      });
      return;
    }
    if (!this.CorteModel().observaciones) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El motivo de programación es requerido.',
      });
      return;
    }
    this.CorteModel().estado_corte = 2; //2 para programado
    this.CorteModel().fecha_corte = this.formatDateForDB(
      new Date(this.CorteModel().fecha_corte)
    );
    console.log(this.CorteModel());
    this.cortesservice
      .registrarcorte_servicio(this.CorteModel(), this.CorteModel().op)
      .subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Corte realizado',
              detail: 'El reprogramación ha sido realizada exitosamente.',
            });
            this.guardarhistorial(
              this.CorteModel().id_cliente,
              'Corte de Servicio Programado',
              `Se programó un corte de servicio por el motivo: ${
                this.CorteModel().observaciones
              } para la fecha: ${this.CorteModel().fecha_corte}.`,
              'Programado'
            );
            this.showModalProgramar = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al realizar el corte',
            });
          }
        },
      });
  }

  // Cerrar modal programar corte
  closeModalProgramar() {
    this.showModalProgramar = false;
  }

  // Abrir modal cortar ahora
  abrirCortar(row: CortesPendienteRequest) {
    this.CorteModel.set(new CorteModel());
    this.CorteModel().id_cliente = row.id_cliente;
    this.CorteModel().id_tipo = row.id_tipo;
    this.CorteModel().id_factura = row.id_factura;
    this.CorteModel().id_estado = 2; //cortado
    console.log(row, 'corte');
    if (
      row.id_corte !== null &&
      row.id_corte !== undefined &&
      row.id_corte !== 0
    ) {
      this.CorteModel().id_corte = row.id_corte;
      this.CorteModel().op = 2; // 1 para actualizar

      this.cortesservice.obtener_cortes_por_id(row.id_corte).subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.obtenerdetallecorte.set(
              response?.data || new CortesServicioRequest()
            );
            console.log(this.obtenerdetallecorte());
            this.CorteModel().fecha_corte = this.formatDateForDB(
              this.obtenerdetallecorte().fecha_corte
            );

            this.CorteModel().id_tipo = this.obtenerdetallecorte().id_tipo;
            this.CorteModel().responsable_corte =
              this.obtenerdetallecorte().responsable_corte;
            this.CorteModel().motivo_corte =
              this.obtenerdetallecorte().motivo_corte;
            this.CorteModel().observaciones =
              this.obtenerdetallecorte().observaciones;
            console.log(this.CorteModel());
            this.showModalCortar = true;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response?.mensaje || 'Error al obtener los detalles del corte',
            });
          }
        },
      });
    } else {
      this.CorteModel().op = 1; // 1 para actualizar
      this.showModalCortar = true;
    }
  }

  // Guardar corte ahora
  guardarCorte() {
    //validar id_tipo
    if (this.CorteModel().id_tipo == 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El tipo de corte es requerido.',
      });
      return;
    }
    this.CorteModel().estado_corte = 1; //corte inmediato
    this.CorteModel().fecha_corte = this.formatDateForDB(new Date());
    this.cortesservice
      .registrarcorte_servicio(this.CorteModel(), this.CorteModel().op)
      .subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Corte realizado',
              detail: 'El corte ha sido realizado exitosamente.',
            });
            this.guardarhistorial(
              this.CorteModel().id_cliente,
              'Corte de Servicio',
              `Se realizó un corte de servicio por el motivo: ${
                this.CorteModel().observaciones
              }.`,
              'Cortado'
            );
            this.showModalCortar = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al realizar el corte',
            });
          }
        },
      });
  }

  // Cerrar modal cortar ahora
  closeModalCortar() {
    this.showModalCortar = false;
  }

  // Acción WhatsApp
  accionWhatsapp(row: CortesPendienteRequest) {
    Swal.fire({
      title: 'Confirmar envío de WhatsApp',
      html: `¿Está seguro de enviar un mensaje por WhatsApp al cliente <strong>${row.nombre_completo}</strong> con el teléfono <strong>${row.telefono}</strong>?`,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
        this.guardarhistorial(
          row.id_cliente,
          'WhatsApp Enviado',
          `Se envió un mensaje por WhatsApp al número ${row.telefono} del módulo de gestión de cortes.`,
          'Activo'
        );
        const url =
          this.whatsappService.generarwhatsapPlantillaCortesPendientes(
            row.telefono,
            row.nombre_completo,
            row.periodo,
            row.saldo
          );
        window.open(url, '_blank');

        this.spinner.set(false);
      }
    });
  }

  // Acción Email
  accionEmail(row: CortesPendienteRequest) {
    if (!row.email || row.email.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El cliente no tiene un correo electrónico registrado.',
      });
      return;
    }
    this.emailModel().to = row.email;
    this.emailModel().subject = 'Recordatorio de Pago - Servicio Contratado';
    this.emailModel().body = `Estimado/a ${row.nombre_completo},<br><br>Le recordamos que su servicio contratado está pendiente de pago. Por favor, realice el pago a la brevedad para evitar inconvenientes.<br><br>Gracias por su atención.<br><br>Atentamente,<br>Su Empresa`;
    Swal.fire({
      title: 'Confirmar envío de email',
      html: `¿Está seguro de enviar un email a <strong>${row.email}</strong>?`,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
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
                row.id_cliente,
                'Email Enviado',
                `Se envió un recordatorio de pago al correo ${row.email} del modulo de gestión de cortes.`,
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

  // Acción Llamada
  accionLlamada(row: CortesPendienteRequest) {
    // Si el cliente no tiene teléfono
    if (!row.telefono || row.telefono.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El cliente no tiene un número de teléfono registrado.',
      });
      return;
    }
    this.guardarhistorial(
      row.id_cliente,
      'Llamada Iniciada',
      `Se inició una llamada telefónica al número ${row.telefono} del módulo de gestión de cortes.`,
      'Activo'
    );
    // Aquí es donde intentamos hacer la llamada telefónica usando el protocolo tel:
    window.location.href = `tel:${row.telefono}`; // Esto abrirá el marcador de teléfono con el número
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
  onFileChange() {}
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
          this.listadodbitacora();
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

  obtener_cortes_pendientes_filtro() {
    this.spinner.set(true);
    this.CortesPendienteRequest.set([]);
    this.cortesservice
      .obtener_cortes_pendientes_filtro(this.CortesfiltroEnvio())
      .subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cortes pendientes obtenidos correctamente',
            });
            // Aquí puedes asignar los datos recibidos a una variable para mostrarlos en la tabla
            console.log(response.data);
            this.CortesPendienteRequest.set(response?.data || []);
            console.log(this.CortesPendienteRequest());
            //cuandos datos tiene el array
            this.Totalregistros = response?.data?.length;
          } else {
            this.Totalregistros = 0;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response?.mensaje || 'Error al obtener los cortes pendientes',
            });
          }
          this.spinner.set(false);
        },
        error: (err) => {
          this.spinner.set(false);
          this.CortesPendienteRequest.set([]);
          this.Totalregistros = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.mensaje || 'Error en la comunicación con el servidor',
          });
        },
      });
  }
  limpiar_filtros() {
    this.CortesfiltroEnvio.set(new CortesfiltroEnvio());
  }
  formatDateForDB(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
    const hours = String(date.getHours()).padStart(2, '0'); // Hora con dos dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con dos dígitos
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Segundos con dos dígitos

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
}
