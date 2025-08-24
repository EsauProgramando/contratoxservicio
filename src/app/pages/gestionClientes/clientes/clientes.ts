import { Component, signal, computed } from '@angular/core';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { CargaComponent } from '../../../components/carga/carga.component';
import { ClientesService } from '../../../services/gestionClientes/clientes.service';
import { ListadoClientes } from '../../../model/gestionClientes/listadoclientes';
import { TooltipModule } from 'primeng/tooltip';
import { CallesSearch } from '../../../components/calles-search/calles-search';
import { ListadoCalles } from '../../../model/mantenimiento/listadoCalles';

import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { TipodocidentService } from '../../../services/mantenimiento/tipodocident.service';
import { ListadoTipoDocIdent } from '../../../model/mantenimiento/listadotipodocident';
import { ClientesModel } from '../../../model/gestionClientes/clientesModel';
import { CoberturaService } from '../../../services/mantenimiento/cobertura.service';
import { CoberturaModel } from '../../../model/mantenimiento/coberturaModel';
@Component({
  selector: 'app-clientes',
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
    CargaComponent,
    CallesSearch,
    InputNumberModule,
    ToastModule,
    TextareaModule,
    TooltipModule,
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
  providers: [ConfirmationService, MessageService],
})
export class Clientes {
  loading: boolean = false;
  spinner: boolean = false;
  clientesDialog: boolean = false;
  callesDialog: boolean = false;

  listaClientes = signal<ListadoClientes[]>([]);
  listaTipoDocIdent = signal<ListadoTipoDocIdent[]>([]);

  clientemodel = signal<ClientesModel>(new ClientesModel());
  listadoCoberturas = signal<CoberturaModel[]>([]);
  searchValue: any;
  constructor(
    private clientesService: ClientesService,
    private tipodocidentService: TipodocidentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private coberturaService: CoberturaService
  ) {}

  ngOnInit() {
    this.cargarListados();
  }

  private cargarListados() {
    this.cargarClientes();
    this.cargarTipoDocIdent();
    this.cargarCoberturas();
  }

  private cargarClientes() {
    this.spinner = true;
    this.clientesService.getClientes().subscribe({
      next: (response) => {
        this.spinner = false;
        if (response?.mensaje == 'EXITO') {
          this.listaClientes.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaClientes.set([]);
        }
      },
      error: (error) => {
        this.spinner = false;
        this.listaClientes.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar clientes',
        });
      },
    });
  }
  private cargarCoberturas() {
    this.coberturaService.getCobranza().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listadoCoberturas.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listadoCoberturas.set([]);
        }
      },
      error: (error) => {
        this.listadoCoberturas.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar coberturas',
        });
      },
    });
  }

  ///validaciones por campo html
  // Computed para longitud máxima según tipo de documento
  // Computed que devuelve la longitud máxima según el tipo seleccionado
  longitudMaxima = computed(() => {
    const tipo = this.clientemodel().tipodocident;
    const doc = this.listaTipoDocIdent().find((d) => d.tipodocident === tipo);
    return doc?.longitud ?? 0;
  });

  // Getter y setter para NgModel con señales
  get nrodocident(): string {
    return this.clientemodel().nrodocident;
  }

  set nrodocident(value: string) {
    // Truncar si excede longitud
    const max = this.longitudMaxima();
    if (value.length > max) {
      value = value.slice(0, max);
    }
    this.clientemodel.update((current) => ({ ...current, nrodocident: value }));
  }

  // Getter y setter para tipo de documento
  get tipodocident(): number | null {
    return this.clientemodel().tipodocident;
  }

  set tipodocident(value: null) {
    this.clientemodel.update((current) => ({
      ...current,
      tipodocident: Number(value),

      nrodocident: '',
    }));
  }
  excedeLongitud = signal(false);

  onNroDocInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const max = this.longitudMaxima();
    let value = input.value;

    // Verifica si excedió
    this.excedeLongitud.set(value.length > max);

    // Truncar si excede longitud
    if (value.length > max) {
      value = value.slice(0, max);
      input.value = value;
    }

    // Actualiza la señal del cliente
    this.clientemodel.update((current) => ({ ...current, nrodocident: value }));
  }
  // Computed para validar el correo
  emailInvalido = computed(() => {
    const value = this.clientemodel().email;
    if (!value) return false;
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return !regex.test(value);
  });

  // Setter para actualizar el email en la señal
  setEmail(value: string) {
    this.clientemodel.update((current) => ({ ...current, email: value }));
  }

  private cargarTipoDocIdent() {
    this.tipodocidentService.getTipoDocIdent().subscribe({
      next: (response) => {
        if (response?.mensaje == 'EXITO') {
          this.listaTipoDocIdent.set(response.data);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.mensaje,
          });
          this.listaTipoDocIdent.set([]);
        }
      },
      error: (error) => {
        this.listaTipoDocIdent.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tipos de documento de identidad',
        });
      },
    });
  }

  //opent cliente
  openClienteDialog() {
    this.clientemodel.set(new ClientesModel());
    this.clientesDialog = true;
  }
  //opent calle
  openCalleDialog() {
    this.callesDialog = true;
  }

  editCliente(cliente: any) {
    this.clientemodel.set(new ClientesModel());
    this.clientemodel.set(cliente);
    //variable direccion  this.clientemodel().codcalle = event.codcalle;
    this.clientemodel().direccion =
      cliente.destipocalle + ' ' + cliente.descripcioncalle;
    this.clientesDialog = true;
  }
  deleteCliente(cliente: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      accept: () => {
        this.clientesService.registrarClientes(cliente, 3).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cliente eliminado correctamente',
              });
              this.cargarClientes();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.mensaje,
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar cliente',
            });
          },
        });
      },
    });
  }
  activarCliente(cliente: any) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas activar este cliente?',
      accept: () => {
        this.clientesService.registrarClientes(cliente, 4).subscribe({
          next: (response) => {
            if (response?.mensaje == 'EXITO') {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cliente activado correctamente',
              });
              this.cargarClientes();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.mensaje,
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al activar cliente',
            });
          },
        });
      },
    });
  }
  //op 1 registra , 2 actualiza id es 0 porque registrar diferencia actualiza
  saveCliente() {
    // Validar campos requeridos
    if (!this.clientemodel().nombres || !this.clientemodel().apellidos) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Los campos Nombres y Apellidos son requeridos',
      });
      return;
    }
    if (!this.clientemodel().tipodocident || !this.clientemodel().nrodocident) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Tipo de documento y número de documento son requeridos',
      });
      return;
    }
    //validar codcalle
    if (!this.clientemodel().codcalle) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo Direccion es requerido',
      });
      return;
    }
    //validar cobertura
    if (!this.clientemodel().cobertura_id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo Cobertura es requerido',
      });
      return;
    }
    if (this.clientemodel().id == 0) {
      //creador es igual admin
      this.clientemodel().creador = 'ADMIN';
    }
    const cliente = this.clientemodel();
    if (cliente) {
      const op = cliente.id && cliente.id !== 0 ? 2 : 1; // si id existe y no es 0, actualizar, sino registrar
      this.clientesService.registrarClientes(cliente, op).subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente guardado correctamente',
            });
            this.cargarClientes();
            this.clientesDialog = false;
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
            detail: 'Error al guardar cliente',
          });
        },
      });
    }
  }
  recibe_datos(event: ListadoCalles) {
    this.clientemodel().codcalle = event.codcalle;
    this.clientemodel().direccion =
      event.destipocalle + ' ' + event.descripcioncalle;
    this.callesDialog = false;
  }
  emailValido = computed(() => {
    const email = this.clientemodel().email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });
}
