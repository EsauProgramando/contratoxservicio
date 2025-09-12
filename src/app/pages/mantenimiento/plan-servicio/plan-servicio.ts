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
  planDialog = signal<boolean>(false);
  constructor(
    private planServicioService: PlanServicioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
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
    this.planDialog.set(true);
  }
  editPlan(data: PlanServicioModel) {}
  deletePlan(data: PlanServicioModel) {}
  activarPlan(data: PlanServicioModel) {}
}
