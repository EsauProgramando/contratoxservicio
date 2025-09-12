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
  velocidadDialog = signal<boolean>(false);
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
    this.velocidadDialog.set(true);
  }
  editVelocidad(dato: VelocidadServicioModel) {}
  deleteVelocidad(dato: VelocidadServicioModel) {}
  activarVelocidad(dato: VelocidadServicioModel) {}
}
