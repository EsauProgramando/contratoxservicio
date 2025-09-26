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
import { PlanServicioModel } from '../../../model/mantenimiento/planservicioModel';
import { PlanServicioService } from '../../../services/mantenimiento/plan-servicio.service';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-servicio',
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
  ],
  templateUrl: './plan-servicio.html',
  styleUrl: './plan-servicio.scss',
  providers: [ConfirmationService, MessageService],
})
export class PlanServicio {
  spinner = signal<boolean>(false);
  searchValue: string = '';
  listaPlanServicio = signal<PlanServicioModel[]>([]);
  planServicioModel = signal<PlanServicioModel>(new PlanServicioModel());
  planDialog: boolean = false;
  constructor(
    private planServicioService: PlanServicioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  estado = [
    { label: 'Activo', value: 1 },
    { label: 'Inactivo', value: 0 },
  ];
  ngOnInit() {
    this.cargarPlanServicio();
  }
  private cargarPlanServicio() {
    this.spinner.set(true);
    this.planServicioService.getPlanServicio().subscribe({
      next: (response) => {
        this.spinner.set(false);

        if (response?.mensaje == 'EXITO') {
          this.listaPlanServicio.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaPlanServicio.set([]);
        }
      },
      error: (error) => {
        this.spinner.set(false);

        this.listaPlanServicio.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }
  openPlanDialog() {
    this.planDialog = true;
    this.planServicioModel.set(new PlanServicioModel());
    this.planServicioModel().op = 1;
  }
  editPlan(data: PlanServicioModel) {
    this.planDialog = true;
    // Cargar datos en el formulario de edición
    this.planServicioModel.set(data);
    this.planServicioModel().op = 2;
  }
  deletePlan(data: PlanServicioModel) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el plan de servicio "${data.descripcion}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
        // Lógica para eliminar el plan de servicio
        data.estareg = 0; // Suponiendo que 0 es inactivo
        data.op = 3; // Operación de eliminación
        this.planServicioService
          .registrarPlanServicio(data, data.op)
          .subscribe({
            next: (response) => {
              this.spinner.set(false);
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Plan de servicio eliminado exitosamente.',
                });
                this.cargarPlanServicio();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: response?.mensaje,
                });
              }
            },
            error: (error) => {
              this.spinner.set(false);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el plan de servicio.',
              });
            },
          });
      }
    });
  }
  activarPlan(data: PlanServicioModel) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas activar el plan de servicio "${data.descripcion}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.set(true);
        // Lógica para activar el plan de servicio
        data.estareg = 1; // Suponiendo que 1 es activo
        data.op = 4;
        this.planServicioService
          .registrarPlanServicio(data, data.op)
          .subscribe({
            next: (response) => {
              this.spinner.set(false);
              if (response?.mensaje == 'EXITO') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Plan de servicio activado exitosamente.',
                });
                this.cargarPlanServicio();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: response?.mensaje,
                });
              }
            },
            error: (error) => {
              this.spinner.set(false);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al activar el plan de servicio.',
              });
            },
          });
      }
    });
  }

  save() {
    if (this.planServicioModel().descripcion.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La descripción es obligatoria.',
      });
      return;
    }
    this.spinner.set(true);
    this.planServicioService
      .registrarPlanServicio(
        this.planServicioModel(),
        this.planServicioModel().op
      )
      .subscribe({
        next: (response) => {
          this.spinner.set(false);
          if (response?.mensaje == 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail:
                this.planServicioModel().op == 1
                  ? 'Plan de servicio creado exitosamente.'
                  : 'Plan de servicio actualizado exitosamente.',
            });
            this.planDialog = false;
            this.cargarPlanServicio();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje,
            });
          }
        },
        error: (error) => {
          this.spinner.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el plan de servicio.',
          });
        },
      });
  }
}
