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
import { CommonModule } from '@angular/common';
import { InputNumber } from 'primeng/inputnumber';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ContratosService } from '../../../services/gestionClientes/contratos.service';
import { IndexListadoContrato } from '../../../model/gestionClientes/indexListadoContrato';
import { TipoServicioService } from '../../../services/mantenimiento/tipo-servicio.service';
import { TipoServicioModel } from '../../../model/mantenimiento/tiposervicioModel';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-tipo-servicio',
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
    CargaComponent,
    ToastModule,
    CheckboxModule,
  ],
  templateUrl: './tipo-servicio.html',
  styleUrl: './tipo-servicio.scss',
  providers: [ConfirmationService, MessageService],
})
export class TipoServicio {
  spinner = signal<boolean>(false);
  searchValue: string = '';
  listaTpoServicio = signal<TipoServicioModel[]>([]);
  tipoServicioModel = signal<TipoServicioModel>(new TipoServicioModel());
  tiposervicioDialog: boolean = false;
  constructor(
    private tipoServicioService: TipoServicioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit() {
    this.cargarTipoServicio();
  }
  private cargarTipoServicio() {
    this.spinner.set(true);
    this.tipoServicioService.getTipoServicio().subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje == 'EXITO') {
          this.listaTpoServicio.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaTpoServicio.set([]);
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.listaTpoServicio.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  openTipoDialog() {
    this.tiposervicioDialog = true;
    this.tipoServicioModel.set(new TipoServicioModel());
  }
  editTipo(dato: TipoServicioModel) {
    this.tipoServicioModel.set({ ...dato, op: 2 });
    this.tiposervicioDialog = true;
  }
  deleteTipo(dato: TipoServicioModel) {
    Swal.fire({
      title: '¿Está seguro de eliminar el tipo de servicio?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoServicioService
          .registrarTipoServicio({ ...dato, estareg: 0, op: 3 }, 3)
          .subscribe({
            next: (response) => {
              this.tiposervicioDialog = false;
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Tipo de servicio eliminado exitosamente.',
                });
                this.cargarTipoServicio();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al eliminar el tipo de servicio',
                });
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el tipo de servicio',
              });
            },
          });
      }
    });
  }
  activarTipo(dato: TipoServicioModel) {
    Swal.fire({
      title: '¿Está seguro de activar el tipo de servicio?',
      text: 'No podrás revertir esto',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoServicioService
          .registrarTipoServicio({ ...dato, estareg: 1, op: 4 }, 4)
          .subscribe({
            next: (response) => {
              this.tiposervicioDialog = false;
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Tipo de servicio activado exitosamente.',
                });
                this.cargarTipoServicio();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al activar el tipo de servicio',
                });
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al activar el tipo de servicio',
              });
            },
          });
      }
    });
  }

  save() {
    if (this.tipoServicioModel().descripcion.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Ingrese una descripción',
      });
      return;
    }
    this.spinner.set(true);
    this.tipoServicioService
      .registrarTipoServicio(
        this.tipoServicioModel(),
        this.tipoServicioModel().op
      )
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje == 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail:
                this.tipoServicioModel().op == 1
                  ? 'Tipo de servicio creado exitosamente.'
                  : 'Tipo de servicio actualizado exitosamente.',
            });
            this.cargarTipoServicio();
            this.tiposervicioDialog = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
          }
        },
      });
  }
}
