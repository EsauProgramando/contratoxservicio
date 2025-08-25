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
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { ToastModule } from 'primeng/toast';

import { FacturacionService } from '../../../services/gestionClientes/facturacion.service';
import { FacturacionRequest } from '../../../model/gestionClientes/FacturacionRequest';
import { FacturacionEnvio } from '../../../model/gestionClientes/facturacionEnvio';

@Component({
  selector: 'app-cobranzas',
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
  ],
  templateUrl: './cobranzas.html',
  styleUrl: './cobranzas.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class Cobranzas {
  spinner = signal<boolean>(false);
  abrimodalfacturacion = signal<boolean>(false);
  facturas = signal<FacturacionRequest[]>([]);
  facturacionEnvio = signal<FacturacionEnvio>(new FacturacionEnvio());
  searchValue: string = '';
  ref: DynamicDialogRef | undefined;
  estados: any[] = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Por Vencer', value: 'POR_VENCER' },
    { label: 'Vencido', value: 'VENCIDO' },
    { label: 'Moroso Crónico', value: 'MOROSO_CRONICO' },
    { label: 'Pagado', value: 'PAGADO' },
  ];

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private facturacionService: FacturacionService
  ) {}
  buscarFacturas() {
    this.spinner.set(true);
    this.facturacionService.buscar_facturas(this.facturacionEnvio()).subscribe({
      next: (response) => {
        this.spinner.set(false);
        if (response?.mensaje == 'EXITO') {
          this.facturas.set(response.data);
        } else {
          this.facturas.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
        }
      },
      error: (err) => {
        this.spinner.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al buscar facturas',
        });
      },
    });
  }
  limpiarFiltros() {
    this.facturacionEnvio().estado = '';
    this.facturacionEnvio().periodo = '';
    this.searchValue = '';
    this.facturacionEnvio().nombre_completo = '';
  }
}
