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
import { CargaComponent } from '../../../components/carga/carga.component';
import { ContratosService } from '../../../services/gestionClientes/contratos.service';
import { IndexListadoContrato } from '../../../model/gestionClientes/indexListadoContrato';
import { ToastModule } from 'primeng/toast';
import { ContratoServicioForm } from '../../../components/contrato-servicio-form/contrato-servicio-form';
import { FacturacionService } from '../../../services/gestionClientes/facturacion.service';
import { FacturacionRequest } from '../../../model/gestionClientes/FacturacionRequest';

@Component({
  selector: 'app-contrato-servicio',
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
    DynamicDialogModule,
    TooltipModule,
  ],
  templateUrl: './contrato-servicio.html',
  styleUrl: './contrato-servicio.scss',
  providers: [ConfirmationService, DialogService, MessageService],
})
export class ContratoServicio {
  spinner = signal<boolean>(false);
  abrimodalfacturacion = signal<boolean>(false);
  listaDatos = signal<IndexListadoContrato[]>([]);
  facturas = signal<FacturacionRequest[]>([]);
  searchValue: string = '';
  ref: DynamicDialogRef | undefined;
  constructor(
    private contratosService: ContratosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private facturacionService: FacturacionService
  ) {}
  ngOnInit() {
    this.cargarListados();
  }
  private cargarListados() {
    this.cargarContratos();
  }
  private cargarContratos() {
    this.spinner.set(true);

    this.contratosService.getContrato().subscribe({
      next: (response) => {
        this.spinner.set(false);

        if (response?.mensaje == 'EXITO') {
          this.listaDatos.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaDatos.set([]);
        }
      },
      error: (error) => {
        this.spinner.set(false);
        this.listaDatos.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar clientes',
        });
      },
    });
  }

  openContratosServicioDialog() {
    let envioData = {
      op: 1,
    };
    this.ref = this.dialogService.open(ContratoServicioForm, {
      header: 'REGISTRAR SERVICIOS CONTRATADOS',
      width: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closable: true,
      data: envioData,
    });
    this.ref.onClose.subscribe((valor) => {
      this.cargarListados();
    });
  }
  editContratoServicio(dato: IndexListadoContrato) {
    console.log(dato, 'resultado');
    let envioData = {
      op: 2,
      id_cliente: dato.id_cliente,
      id_contrato: dato.id_contrato,
    };
    this.ref = this.dialogService.open(ContratoServicioForm, {
      header: 'REGISTRAR SERVICIOS CONTRATADOS',
      width: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closable: true,
      data: envioData,
    });
    this.ref.onClose.subscribe((valor) => {
      this.cargarListados();
    });
  }
  deleteContratoServicio(dato: IndexListadoContrato) {}
  activarContratoServicio(dato: IndexListadoContrato) {}
  generarFacturas(idContrato: number, idCliente: number) {
    //debe preguntar si desea generar las facturas
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea generar las facturas?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.spinner.set(true);
        this.contratosService.generarFacturas(idContrato, idCliente).subscribe({
          next: (response) => {
            this.spinner.set(false);
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Facturas generadas correctamente',
              });
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
              detail: 'Error al generar facturas',
            });
          },
        });
      },
    });
  }
  verFacturacion(idContrato: number, idCliente: number) {
    this.spinner.set(true);
    this.abrimodalfacturacion.set(true);
    this.facturacionService
      .obtener_facturas_x_contrato(idContrato, idCliente)
      .subscribe({
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
        error: (error) => {
          this.spinner.set(false);
          this.facturas.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener facturación',
          });
        },
      });
  }
}
