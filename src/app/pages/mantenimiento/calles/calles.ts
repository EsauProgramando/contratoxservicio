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
import { ListadoCalles } from '../../../model/mantenimiento/listadoCalles';
import { CallesService } from '../../../services/mantenimiento/calles.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-calles',
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
  templateUrl: './calles.html',
  styleUrl: './calles.scss',
  providers: [ConfirmationService, MessageService],
})
export class Calles {
  spinner = signal<boolean>(false);
  listaCalles = signal<ListadoCalles[]>([]);
  searchValue: string = '';
  calledilog = signal<boolean>(false);
  ngOnInit() {
    this.cargarCalles();
  }
  constructor(
    private callesService: CallesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  private cargarCalles() {
    this.spinner.set(true);
    this.callesService.getCalles().subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response.mensaje == 'EXITO') {
          this.listaCalles.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje,
          });
          this.listaCalles.set([]);
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.listaCalles.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar calles',
        });
      },
    });
  }
  openCallesDialog() {
    this.calledilog.set(true);
  }
  editCalle(dato: ListadoCalles) {}
  deleteCalle(dato: ListadoCalles) {}
  activarCalle(dato: ListadoCalles) {}
}
