import { Component, EventEmitter, Output, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImageModule } from 'primeng/image';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';

import { CallesService } from '../../services/mantenimiento/calles.service';
import { ListadoCalles } from '../../model/mantenimiento/listadoCalles';
import { CalleModel } from '../../model/mantenimiento/callesModel';

@Component({
  selector: 'app-calles-search',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    RatingModule,
    FieldsetModule,
    AvatarModule,
    DialogModule,
    ConfirmDialogModule,
    ImageModule,
    FloatLabelModule,
    CommonModule,
  ],
  templateUrl: './calles-search.html',
  styleUrl: './calles-search.scss',
})
export class CallesSearch {
  listaCalles = signal<ListadoCalles[]>([]);
  clientesModel = signal<CalleModel | null>(null);
  _cols: any[] = [];
  @Output()
  _emisor = new EventEmitter<ListadoCalles>();
  visible: boolean = false;
  loadingcalle: boolean = false;
  selectedProduct: any;
  constructor(
    private callesService: CallesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit() {
    this.cargarCalles();
    this._cols = [
      {
        header: 'Seleccionar',
        width: '10%',
      },
      { header: 'Calle', width: '10%', sort: 'codcalle' },
      { header: 'Tipo', width: '10%', sort: 'tipocalle' },
      { header: 'Descripcion', width: '80%', sort: 'descripcioncalle' },
    ];
  }

  private cargarCalles() {
    this.callesService.getCalles().subscribe({
      next: (response) => {
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
        this.listaCalles.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar calles',
        });
      },
    });
  }
  seleccionarCalle(calle: ListadoCalles) {
    this._emisor.emit(calle);
  }
  saveCalle() {
    const calle = this.clientesModel();
    if (calle !== null) {
      this.callesService.registrarCalles(calle, 1).subscribe({
        next: (response) => {
          if (response.mensaje == 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Calle guardada correctamente',
            });
            this.cargarCalles();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.mensaje,
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar calle',
          });
        },
      });
    } else {
      // Opcional: manejar caso cuando clientesModel() es null
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Datos de calle inválidos',
      });
    }
  }
}
