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
import { VelocidadServicioModel } from '../../../model/mantenimiento/velocidadservicio';
import { VelocidadServicioService } from '../../../services/mantenimiento/velocidad-servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-velocidad-servicio',
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
  ],
  templateUrl: './velocidad-servicio.html',
  styleUrl: './velocidad-servicio.scss',
  providers: [ConfirmationService, MessageService],
})
export class VelocidadServicio {
  spinner = signal<boolean>(false);
  listaVelocidad = signal<VelocidadServicioModel[]>([]);
  searchValue: string = '';
  velocidadDialog: boolean = false;
  velocidadModel = signal<VelocidadServicioModel>(new VelocidadServicioModel());

  constructor(
    private velocidadServicioService: VelocidadServicioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit() {
    this.cargarVelocidadServicio();
  }
  private cargarVelocidadServicio() {
    this.spinner.set(true);
    this.velocidadServicioService.getVelocidadServicio().subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje == 'EXITO') {
          this.listaVelocidad.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaVelocidad.set([]);
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.listaVelocidad.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  openVelocidadDialog() {
    this.velocidadDialog = true;
    this.velocidadModel.set(new VelocidadServicioModel());
  }
  editVelocidad(dato: VelocidadServicioModel) {
    this.velocidadModel.set({ ...dato, op: 2 });
    this.velocidadDialog = true;
  }
  deleteVelocidad(dato: VelocidadServicioModel) {
    Swal.fire({
      title: '¿Está seguro de eliminar la velocidad de servicio?',
      text: 'No podrá revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.velocidadServicioService
          .registrarVelocidadServicio({ ...dato, op: 3 }, 3)
          .subscribe({
            next: (response) => {
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Velocidad de servicio eliminada correctamente',
                });
                this.cargarVelocidadServicio();
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
                detail: 'Error al eliminar la velocidad de servicio',
              });
            },
          });
      }
    });
  }
  activarVelocidad(dato: VelocidadServicioModel) {
    Swal.fire({
      title: '¿Está seguro de activar la velocidad de servicio?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.velocidadServicioService
          .registrarVelocidadServicio({ ...dato, op: 4 }, 4)
          .subscribe({
            next: (response) => {
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Velocidad de servicio activada correctamente',
                });
                this.cargarVelocidadServicio();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Error al activar la velocidad de servicio',
                });
              }
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al activar la velocidad de servicio',
              });
            },
          });
      }
    });
  }
  save() {
    this.velocidadServicioService
      .registrarVelocidadServicio(
        this.velocidadModel(),
        this.velocidadModel().op
      )
      .subscribe({
        next: (response) => {
          if (response?.mensaje == 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Velocidad de servicio guardada correctamente',
            });
            this.cargarVelocidadServicio();
            this.velocidadDialog = false;
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
            detail: 'Error al guardar velocidad de servicio',
          });
        },
      });
  }
}
