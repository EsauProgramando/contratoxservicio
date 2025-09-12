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
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

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

@Component({
  selector: 'app-gestionreaperturas',
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
  templateUrl: './gestionreaperturas.html',
  styleUrl: './gestionreaperturas.scss',
})
export class Gestionreaperturas {
  spinner = signal<boolean>(false);
  // Datos de ejemplo (reemplazar con datos reales)
  Totalregistros: number = 0;

  searchQuery: string = '';

  // Modal control variables
  showModalReapertura: boolean = false;
  ReaperturaModel = signal<ReaperturaModel>(new ReaperturaModel());
  // Variables del modal
  reaperturaFecha: string = '';
  reaperturaResponsable: string = '';
  reaperturaObservaciones: string = '';
  abrimodalhistorial: boolean = false;
  // Opciones del dropdown cliente
  estadoOptions = [
    { label: 'CORTADO', value: 2 },
    { label: 'REPROGRAMADO', value: 3 },
    { label: 'RECONECTAR', value: 4 },
  ];
  CortesenvioListadofiltro = signal<CortesenvioListadofiltro>(
    new CortesenvioListadofiltro()
  );
  CortesServicioRequest = signal<CortesServicioRequest[]>([]);
  historialServicioModel = signal<HistorialServicioModel>(
    new HistorialServicioModel()
  );
  listaHistorialServicio = signal<HistorialServicioModel[]>([]);
  constructor(
    private messageService: MessageService,
    private reaperturaservice: Reaperturaservice,
    private cortesservice: Cortesservice,
    private historialServicio: Historialservicio
  ) {}

  // Aplicar filtros

  // Limpiar filtros
  limpiarFiltros() {
    this.CortesenvioListadofiltro.set(new CortesenvioListadofiltro());
  }
  ngOnInit() {
    ///valor por defecto
    this.CortesenvioListadofiltro().estado_corte = 2;

    this.obtener_cortes_listados();
  }
  // Abrir el modal de reapertura
  abrirReapertura(id: string) {
    this.showModalReapertura = true;
  }

  // Guardar la reapertura
  guardarReapertura() {
    this.messageService.add({
      severity: 'success',
      summary: 'Reapertura realizada',
      detail: 'El servicio ha sido reabierto exitosamente.',
    });
    this.showModalReapertura = false;
  }

  // Cerrar el modal de reapertura
  closeModalReapertura() {
    this.showModalReapertura = false;
  }

  // Acción para visualizar historial
  verHistorial(row: CortesServicioRequest) {
    this.abrimodalhistorial = true;
    this.listaHistorialServicio.set([]);
    this.cargarHistorial(row.id_cliente);
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
  // Acción de Reconectar
  reconectar(row: CortesServicioRequest) {
    this.ReaperturaModel().id_estado = 4; //Reconectar
    if (
      row.id_reapertura !== null &&
      row.id_reapertura !== undefined &&
      row.id_reapertura !== 0
    ) {
      this.ReaperturaModel().id_reapertura = row.id_reapertura;
      this.ReaperturaModel().op = 2; // actualizar
    } else {
      this.ReaperturaModel().id_reapertura = 0;
      this.ReaperturaModel().op = 1; // insertar
    }
    this.ReaperturaModel().id_cliente = row.id_cliente;
    this.ReaperturaModel().id_tipo = row.id_tipo;
    this.ReaperturaModel().id_corte = row.id_corte;
    this.ReaperturaModel().fecha_reconexion = this.formatDateForDB(new Date());
    this.ReaperturaModel().motivo_reconexion = 'RECONEXION';
    this.ReaperturaModel().observaciones = 'RECONEXION';
    this.ReaperturaModel().estado_reconexion = 1;
    this.ReaperturaModel().responsable_reconexion = 'ADMIN';
    this.ReaperturaModel().creador = 'ADMIN';
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reconectar',
      cancelButtonText: 'No, cancelar',
    }).then((confirmResult) => {
      if (confirmResult.isConfirmed) {
        this.reaperturaservice
          .registrarreapetura_servicio(
            this.ReaperturaModel(),
            this.ReaperturaModel().op
          )
          .subscribe({
            next: (response) => {
              if (response?.mensaje === 'EXITO') {
                this.guardarhistorial(
                  this.ReaperturaModel().id_cliente,
                  'REAPERTURA',
                  'Se ha realizado una reapertura',
                  'REAPERTURADO'
                );
                this.messageService.add({
                  severity: 'success',
                  summary: 'Reapertura registrada',
                  detail: 'La reapertura ha sido registrada exitosamente.',
                });
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Advertencia',
                  detail: 'No se pudo registrar la reapertura.',
                });
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al registrar reapertura',
                detail: error.message,
              });
            },
          });
      }
    });
  }

  // Acción de Reprogramar
  // Acción de Reprogramar
  reprogramar(row: CortesServicioRequest) {
    this.ReaperturaModel().id_estado = 3; //Reprogramado

    if (
      row.id_reapertura !== null &&
      row.id_reapertura !== undefined &&
      row.id_reapertura !== 0
    ) {
      this.ReaperturaModel().id_reapertura = row.id_reapertura;
      this.ReaperturaModel().op = 2; // actualizar
    } else {
      this.ReaperturaModel().id_reapertura = 0;
      this.ReaperturaModel().op = 1; // insertar
    }

    this.ReaperturaModel().id_cliente = row.id_cliente;
    this.ReaperturaModel().id_tipo = row.id_tipo;
    this.ReaperturaModel().id_corte = row.id_corte;
    this.ReaperturaModel().motivo_reconexion = 'REPROGRAMACION';
    this.ReaperturaModel().observaciones = 'REPROGRAMACION';
    this.ReaperturaModel().estado_reconexion = 3;
    this.ReaperturaModel().responsable_reconexion = 'ADMIN';
    this.ReaperturaModel().creador = 'ADMIN';

    // Solicitar fecha_reconexion con SweetAlert
    Swal.fire({
      title: 'Ingresa la fecha de reconexión',
      input: 'datetime-local', // Usar input de tipo fecha y hora
      inputPlaceholder: 'Selecciona una fecha y hora',
      showCancelButton: true,
      confirmButtonText: 'Reprogramar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.ReaperturaModel().fecha_reconexion = result.value;

        // Confirmar la acción de reprogramar
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, reprogramar',
          cancelButtonText: 'No, cancelar',
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            this.reaperturaservice
              .registrarreapetura_servicio(
                this.ReaperturaModel(),
                this.ReaperturaModel().op
              )
              .subscribe({
                next: (response) => {
                  if (response?.mensaje === 'EXITO') {
                    this.guardarhistorial(
                      this.ReaperturaModel().id_cliente,
                      'REPROGRAMACION',
                      'Se ha realizado una reprogramación fecha de reconexión: ' +
                        this.ReaperturaModel().fecha_reconexion,
                      'REPROGRAMADO'
                    );
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Reapertura registrada',
                      detail: 'La reapertura ha sido registrada exitosamente.',
                    });
                  } else {
                    this.messageService.add({
                      severity: 'warn',
                      summary: 'Advertencia',
                      detail: 'No se pudo registrar la reapertura.',
                    });
                  }
                },
                error: (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error al registrar reapertura',
                    detail: error.message,
                  });
                },
              });
          }
        });
      }
    });
  }

  // Acción de agregar Observaciones
  agregarObs(row: CortesServicioRequest) {
    this.ReaperturaModel().id_estado = 2; //Cortado

    if (
      row.id_reapertura !== null &&
      row.id_reapertura !== undefined &&
      row.id_reapertura !== 0
    ) {
      this.ReaperturaModel().id_reapertura = row.id_reapertura;
      this.ReaperturaModel().op = 2; // actualizar
      this.ReaperturaModel().id_cliente = row.id_cliente;
      this.ReaperturaModel().id_tipo = row.id_tipo;
      this.ReaperturaModel().id_corte = row.id_corte;

      // Solicitar al usuario que ingrese una observación con SweetAlert
      Swal.fire({
        title: 'Ingrese una observación',
        input: 'textarea', // Usamos un campo de texto
        inputPlaceholder: 'Escribe aquí la observación...',
        showCancelButton: true,
        confirmButtonText: 'Guardar Observación',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          // Guardar la observación en el modelo
          this.ReaperturaModel().observaciones = result.value;

          // Realizar la actualización de la reapertura
          this.reaperturaservice
            .actualizarreapetura_servicio(this.ReaperturaModel())
            .subscribe({
              next: (response) => {
                if (response?.mensaje === 'EXITO') {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Reapertura actualizada',
                    detail: 'La reapertura ha sido actualizada exitosamente.',
                  });
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'No se pudo actualizar la reapertura.',
                  });
                }
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error al actualizar reapertura',
                  detail: error.message,
                });
              },
            });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No existe una reapertura para agregar observaciones.',
      });
    }
  }

  obtener_cortes_listados() {
    this.spinner.set(true);
    this.CortesServicioRequest.set([]);
    this.cortesservice
      .obtener_cortes_listados(this.CortesenvioListadofiltro())
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje === 'EXITO') {
            this.CortesServicioRequest.set(response.data);
            this.Totalregistros = response.data.length;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'No se encontraron cortes.',
            });
          }
        },
        error: (error) => {
          this.spinner.set(false);
          this.CortesServicioRequest.set([]);
          this.Totalregistros = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error al obtener cortes',
            detail: error.message,
          });
        },
      });
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
