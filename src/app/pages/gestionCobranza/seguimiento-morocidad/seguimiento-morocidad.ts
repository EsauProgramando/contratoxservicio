import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Component, signal,ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
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
import { CortesPendienteRequest } from '../../../model/gestionCobranza/CortesPendienteRequest';
import { BitacuraService } from '../../../services/mantenimiento/bitacura.service';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import { GmailService } from '../../../services/gmail/gmail.service';
import { EmailModel } from '../../../model/gmail/EmailModel';
import Swal from 'sweetalert2';
import { WhatsappService } from '../../../services/whatsapp/whatsapp.service';
import { BajaMorocidadService } from '../../../services/gestionCobranza/baja-morocidad.service';
import { BajaMorosidadModel } from '../../../model/gestionCobranza/BajaMorosidadModel';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import { TipoServicioService } from '../../../services/mantenimiento/tipo-servicio.service';
import { BusquedaMorosidad } from '../../../model/gestionCobranza/BusquedaMorosidad';
import { ListadomorosidadRequest } from '../../../model/gestionCobranza/ListadomorosidadRequest';
import { SeguimientoMorosidadService } from '../../../services/gestionCobranza/seguimiento-morosidad.service';
import { Sp_kpis_mora_total } from '../../../model/gestionCobranza/Sp_kpis_mora_total';
import { Clientes_morosidad_extModel } from '../../../model/gestionCobranza/Clientes_morosidad_extModel';
import { Clientes_morosidad_ext } from '../../../model/gestionCobranza/Clientes_morosidad_ext';
import { Detalle_facturas_moraModel } from '../../../model/gestionCobranza/Detalle_facturas_moraModel';
import { Detalle_facturas_mora } from '../../../model/gestionCobranza/Detalle_facturas_mora';
import { Historico_mora_6mRequest } from '../../../model/gestionCobranza/Historico_mora_6mRequest';
export interface MoraItem {
  periodo: string;
  deuda_mora_soles: number;
  pct_morosos: number | null;
}
Chart.register(...registerables);
@Component({
  selector: 'app-seguimiento-morocidad',
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
  templateUrl: './seguimiento-morocidad.html',
  styleUrl: './seguimiento-morocidad.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class SeguimientoMorocidad {
    @Input() data: MoraItem[] = [];
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private bajaMorocidadService: BajaMorocidadService,
    private clientesService: ClientesService,
    private tipoServicioService: TipoServicioService,
    private bitacuraService: BitacuraService,
    private SeguimientoMorosidadService: SeguimientoMorosidadService,
    private gmailService: GmailService,
    private whatsappService: WhatsappService
  ) {}
  spinner = signal<boolean>(false);
  //variables
  bajaMorosidadModel = signal<BajaMorosidadModel>(new BajaMorosidadModel());
  Sp_kpis_mora_total = signal<Sp_kpis_mora_total>(new Sp_kpis_mora_total());
  Clientes_morosidad_extModel = signal<Clientes_morosidad_extModel>(
    new Clientes_morosidad_extModel()
  );
  Clientes_morosidad_ext = signal<Clientes_morosidad_ext[]>([]);
  Totalregistros: number = 0;
  abridetalle: boolean = false;
  Detalle_facturas_moraModel = signal<Detalle_facturas_moraModel>(
    new Detalle_facturas_moraModel()
  );
  Detalle_facturas_mora = signal<Detalle_facturas_mora[]>([]);
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
  Historico_mora_6mRequest = signal<Historico_mora_6mRequest[]>([]);
  bitacoraTipos = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Email', value: 'Email' },
    { label: 'Llamada', value: 'Llamada' },
    { label: 'Otra', value: 'Otra' },
  ];
  estados: any[] = [
    { label: 'TODOS', value: 'TODOS' },
    { label: 'VENCIDO', value: 'VENCIDO' },
    { label: 'MOROSO CRONICO', value: 'MOROSO_CRONICO' },
  ];

  //variables gmail
  emailModel = signal<EmailModel>(new EmailModel());
  ngOnInit() {

    this.sp_kpis_mora_total(1);
    this.listarHistoricoMora6m();
    this.Clientes_morosidad_extModel().solo_con_saldo = 1;
    this.Clientes_morosidad_extModel().estado = 'TODOS';
  }
  sp_kpis_mora_total(solo_con_saldo: number) {
    this.spinner.set(true);
    this.SeguimientoMorosidadService.sp_kpis_mora_total(
      solo_con_saldo
    ).subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje === 'EXITO') {
          if (response.data) {
            this.Sp_kpis_mora_total.set(response.data);
          } else {
            this.Sp_kpis_mora_total.set(new Sp_kpis_mora_total());
          }
        } else {
          this.Sp_kpis_mora_total.set(new Sp_kpis_mora_total());
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje ?? 'Error al obtener los datos',
          });
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.ListadomorosidadRequest.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los datos',
        });
      },
    });
  }
  initChart() {
    const labels = this.Historico_mora_6mRequest().map(item => item.periodo);
    const deuda = this.Historico_mora_6mRequest().map(item => item.deuda_mora_soles);
    const pct = this.Historico_mora_6mRequest().map(item => item.pct_morosos || 0);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Deuda en mora (S/)',
            data: deuda,
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
            type: 'bar'
          },
          {
            label: '% de morosos',
            data: pct,
            type: 'line',
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    };

    if (this.chart) this.chart.destroy(); // Evita duplicar el gráfico
    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }
  listarHistoricoMora6m() {
    this.spinner.set(true);
    this.SeguimientoMorosidadService.sp_historico_mora_6m().subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje === 'EXITO') {
          if (response.data) {
            this.Historico_mora_6mRequest.set(response.data);
               this.initChart();
          } else {
            this.Historico_mora_6mRequest.set([]);
          }
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.Historico_mora_6mRequest.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los datos',
        });
      },
    });
  }
  // Acción
  accionEmail(row: Clientes_morosidad_ext) {
    if (!row.email || row.email.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El cliente no tiene un correo electrónico registrado.',
      });
      return;
    }
    //morosidad seguimiento
    this.emailModel().to = row.email;
    this.emailModel().subject = 'Recordatorio de Pago - Servicio Contratado';
    this.emailModel().body = `<p>Estimado/a ${row.nombre_completo},</p>
    <p>Le informamos que su cuenta presenta una deuda actual de S/. ${row.deuda_actual_soles.toFixed(
      2
    )} y se encuentra en mora por ${row.dias_en_mora} días.</p>
    <p>Le solicitamos regularizar su situación a la brevedad para evitar mayores inconvenientes.</p>
    <p>Gracias por su atención.</p>`;
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
              // this.guardarhistorial(
              //   row.id_cliente,
              //   'Email Enviado',
              //   `Se envió un recordatorio de pago al correo ${row.email} del modulo de gestión de cortes.`,
              //   'Activo'
              // );
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
  // Acción WhatsApp
  accionWhatsapp(row: Clientes_morosidad_ext) {
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
    // this.guardarhistorial(
    //   row.id_cliente,
    //   'Llamada Iniciada',
    //   `Se inició una llamada telefónica al número ${row.telefono} del módulo de gestión de cortes.`,
    //   'Activo'
    // );
    // Aquí es donde intentamos hacer la llamada telefónica usando el protocolo tel:
    window.location.href = `tel:${row.telefono}`; // Esto abrirá el marcador de teléfono con el número
  }
  limpiar_filtros() {
    this.Clientes_morosidad_extModel.set(new Clientes_morosidad_extModel());
  }
  buscarSeguimiento() {
    this.spinner.set(true);
    this.SeguimientoMorosidadService.buscar_clientes_morosidad(
      this.Clientes_morosidad_extModel()
    ).subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje === 'EXITO') {
          if (response.data) {
            this.Clientes_morosidad_ext.set(response.data);
            this.Totalregistros = response.data.length;
          }
        } else {
          // Manejar el caso en que no se encontró información
        }
      },
      error: () => {
        this.spinner.set(false);
      },
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
  verDetalle(row: Clientes_morosidad_ext) {
    this.Detalle_facturas_moraModel().id_cliente = row.id_cliente;
    this.Detalle_facturas_moraModel().id_contrato = row.id_contrato;
    this.Detalle_facturas_moraModel().solo_con_saldo = 1;
    this.Detalle_facturas_moraModel().estado = 'TODOS';

    this.abridetalle = true;

    this.SeguimientoMorosidadService.buscar_detalle_facturas_mora(
      this.Detalle_facturas_moraModel()
    ).subscribe({
      next: (response) => {
        if (response?.mensaje === 'EXITO') {
          this.Detalle_facturas_mora.set(response?.data || []);
          console.log(this.Detalle_facturas_mora());
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response?.mensaje ||
              'Error al obtener los detalles de las facturas en mora',
          });
        }
      },
    });
  }
}
