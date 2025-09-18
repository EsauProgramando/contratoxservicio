import {Component, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {ProgressBarModule} from 'primeng/progressbar';
import {FormsModule} from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {RatingModule} from 'primeng/rating';
import {FieldsetModule} from 'primeng/fieldset';
import {AvatarModule} from 'primeng/avatar';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ImageModule} from 'primeng/image';
import {FloatLabelModule} from 'primeng/floatlabel';
import {FileUploadModule} from 'primeng/fileupload';
import {CommonModule} from '@angular/common';
import {ToastModule} from 'primeng/toast';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {TooltipModule} from 'primeng/tooltip';
import {CargaComponent} from '../../../components/carga/carga.component';
import {DatePickerModule} from 'primeng/datepicker';
import {TextareaModule} from 'primeng/textarea';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CortesServicioRequest} from '../../../model/gestionCobranza/CortesServicioRequest';
import {EmailModel} from '../../../model/gmail/EmailModel';
import {HistorialServicioModel} from '../../../model/mantenimiento/HistorialServicioModel';
import {Cortesservice} from '../../../services/gestionCobranza/cortes.service';
import {BitacuraService} from '../../../services/mantenimiento/bitacura.service';
import {GmailService} from '../../../services/gmail/gmail.service';
import {WhatsappService} from '../../../services/whatsapp/whatsapp.service';
import {Historialservicio} from '../../../services/mantenimiento/historialservicio';
import Swal from 'sweetalert2';
import { CortesPendienteRequest } from '../../../model/gestionCobranza/CortesPendienteRequest';
import { BitacuraModel } from '../../../model/gestionCobranza/BitacuraModel';
import { CorteModel } from '../../../model/gestionCobranza/CorteModel';
import {OrdentrabajoService} from '../../../services/ordentrabajo/ordentrabajo-service';
import {TecnicosService} from '../../../services/mantenimiento/tecnicos-service';
import {tecnicoModel} from '../../../model/mantenimiento/tecnicoModel';
import {ordentrabajofiltroModel, ordentrabajoModel} from '../../../model/ordentrabajo/ordentrabajoModel';
import { AutoCompleteModule} from 'primeng/autocomplete';
import {ClientesService} from '../../../services/gestionClientes/clientes.service';
import {ListadoClientes} from '../../../model/gestionClientes/listadoclientes';
import {TipoServicio} from '../../mantenimiento/tipo-servicio/tipo-servicio';
import {TipoServicioService} from '../../../services/mantenimiento/tipo-servicio.service';
import {TipoServicioModel} from '../../../model/mantenimiento/tiposervicioModel';
import {CheckboxModule} from 'primeng/checkbox';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-orden-trabajo-component',
  templateUrl: './orden-trabajo-component.html',
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
  CargaComponent,
  DatePickerModule,
  TextareaModule,
  AutoCompleteModule,
  CheckboxModule
],
  providers: [ConfirmationService, DialogService, MessageService],
  standalone: true,
  styleUrl: './orden-trabajo-component.scss'
})
export class OrdenTrabajoComponent {
  spinner = signal<boolean>(false);
  abrirnuevaot:boolean=false;
  abrirasignar:boolean=false
  abrirreprogramar:boolean=false
  abrircierre:boolean=false
  abrirhistorial:boolean=false
  checked:boolean=false
  OrdenTrabajofiltroEnvio=signal(new ordentrabajofiltroModel)
  CortesPendienteRequest = signal<CortesPendienteRequest[]>([]);
  Listadotecnicos=signal<tecnicoModel[]>([])
  Listadoordenestrabajo=signal<ordentrabajoModel[]>([])
  // Variables de filtro
  searchQuery: string = '';
  estado: string = '';
  ordenarPor: string = 'vencimiento';
  Totalregistros: number = 0;
  showModalBitacora: boolean = false;
  fechainicial:Date=new Date()
  fechafinal:Date=new Date()
  // Datos de ejemplo (reemplazar con datos reales)
  //array de de objetos del estado
  listaHistorialOT=signal<ordentrabajoModel[]>([])
  estados = [
    { label: 'TODOS', value: 'ALL',severity:'secondary' },
    { label: 'PENDIENTE', value: 'PENDIENTE',severity:'secondary' },
    { label: 'EN PROCESO', value: 'EN PROCESO',severity:'info' },
    { label: 'COMPLETADO', value: 'COMPLETADO',severity:'success' },
    { label: 'CANCELADO', value: 'CANCELADO',severity:'danger' },
  ];
  estadoscierre = [
    { label: 'COMPLETADO', value: 'COMPLETADO',severity:'success' },
    { label: 'CANCELADO', value: 'CANCELADO',severity:'danger' },
  ];
  obtenerdetallecorte = signal<any>(new CortesServicioRequest());
  BitacuraModel = signal<BitacuraModel>(new BitacuraModel());
  listadoBitacora = signal<BitacuraModel[]>([]);
  listadoClientes=signal<ListadoClientes[]>([]);
  listadoTiposervicio=signal<TipoServicioModel[]>([])
  clientes:ListadoClientes[]=[]
  // Variables para el modal de bitácora
  bitTipo: string = 'WhatsApp';
  bitDetalle: string = '';
  bloquearboton = signal<boolean>(false);
  CorteModel = signal<CorteModel>(new CorteModel());
  enviarOrdenTrabajo=signal<ordentrabajoModel>(new ordentrabajoModel())
  op:number=0
  nombrecliente:ListadoClientes=new ListadoClientes()
  // Tipos de acción para la bitácora
  bitacoraTipos = [
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Email', value: 'Email' },
    { label: 'Llamada', value: 'Llamada' },
    { label: 'Otra', value: 'Otra' },
  ];

  // Modal controls
  showModalProgramar: boolean = false;
  showModalCortar: boolean = false;
  formErrors = {
    nombre_completo: signal(false),
    direccion: signal(false),
    fechaorden: signal(false)
  };
  // Variables del modal
  progFecha: string = '';
  progTipo: string = 'remoto';
  progResp: string = '';
  progMotivo: string = 'Deuda pendiente';

  cutMetodo: string = 'remoto';
  cutNotas: string = '';

  tipoCorteOptions = [
    { label: 'REMOTO', value: 1 },
    { label: 'CAMPO', value: 2 },
  ];
  emailModel = signal<EmailModel>(new EmailModel());
  historialServicioModel = signal<HistorialServicioModel>(
    new HistorialServicioModel()
  );
  constructor(
    private messageService: MessageService,
    private cortesservice: Cortesservice,
    private bitacuraService: BitacuraService,
    private gmailService: GmailService,
    private whatsappService: WhatsappService,
    private historialServicio: Historialservicio,
    private ordentrabajoService:OrdentrabajoService,
    private tecnicoService:TecnicosService,
    private clienteSerice:ClientesService,
    private tiposervicioServicio:TipoServicioService
  ) {}

  ngOnInit() {
    //poner valores por defecto a los filtros
    this.cargarordenestrabajo();
    this.cargartecnicos()
    this.cargarclientes()
  }
  cargartecnicos(){
    this.tecnicoService.getlistatecnicos().subscribe({
      next:(data)=>{
        this.Listadotecnicos.set(data.data)
        this.Listadotecnicos().unshift({
          idtecnico:'ALL',
          nombres:'TODOS',
          apellidos:'',
          especialidad:'TODOS'
        })
        this.OrdenTrabajofiltroEnvio().idtecnico='ALL'
      }
    })
  }
  cargarordenestrabajo(){
    this.spinner.set(true)
    this.ordentrabajoService.getlistaordentrabajos().subscribe({
      next:(data)=>{

        this.messageService.add({
          severity: 'success',
          summary: 'Aviso de usuario',
          detail: 'Se encontraron coincidencias',
        });
        this.Listadoordenestrabajo.set(data.data)
        this.spinner.set(false)
        this.Totalregistros = this.Listadoordenestrabajo().length;
      },error:(err)=>{

        this.messageService.add({
          severity: 'error',
          summary: 'Advertencia',
          detail: 'Ocurrió un problema al cargar las órdenes de trabajo',
        });
        this.spinner.set(false)
      }
    })
  }


  listadodbitacora() {
    this.bitacuraService
      .buscarBitacoraPoridcliente(this.BitacuraModel().id_cliente)
      .subscribe({
        next: (response) => {
          if (response?.mensaje === 'EXITO') {
            this.listadoBitacora.set(response?.data || []);
            console.log(this.listadoBitacora());
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response?.mensaje || 'Error al obtener la bitácora',
            });
          }
        },
      });
  }

  limpiar_filtros() {
    // this.OrdenTrabajo.set(new CortesfiltroEnvio());
  }
  formatDateForDB(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día con dos dígitos
    const hours = String(date.getHours()).padStart(2, '0'); // Hora con dos dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos con dos dígitos
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Segundos con dos dígitos

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  cargarclientes(){
    this.clienteSerice.getClientes().subscribe({
      next:(data)=>{
        const clientes = data.data.map((c: any) => ({
          ...c,
          nombreapellido: `${c.nombres} ${c.apellidos}`
        }));

        this.listadoClientes.set(clientes);
      }
    })
    this.tiposervicioServicio.getTipoServicio().subscribe({
      next:(data)=>{
        this.listadoTiposervicio.set(data.data)
      }
    })
  }
  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toUpperCase();
    this.clientes = this.listadoClientes().filter(p =>
      p.nombreapellido?.toUpperCase().includes(query)
    );
  }
  guardarorden(){
    if (!this.validarForm()) {
    return;
  }
    this.spinner.set(true)
    this.abrirnuevaot=false
    console.log(this.enviarOrdenTrabajo())
    this.ordentrabajoService.registrarordentrabajo(this.enviarOrdenTrabajo(),this.op).subscribe({
      next:(data)=>{

        this.spinner.set(false)
        if(data.mensaje=='EXITO'){
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se registró correctamente la orden trabajo',
          });
          this.enviarOrdenTrabajo.set(new ordentrabajoModel())
          this.nombrecliente=new ListadoClientes()
          this.cargarordenestrabajo()

        }else {
          this.abrirnuevaot=true
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar la orden de trabajo',
          });
        }
      },error:(err)=>{
        this.spinner.set(false)
        this.abrirnuevaot=true
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al registrar la orden de trabajo',
        });
      }
    })
  }
  actualizarorden(){
    this.spinner.set(true)
    this.abrirasignar=false
    this.abrirreprogramar=false
    console.log(this.enviarOrdenTrabajo())
    this.ordentrabajoService.registrarordentrabajo(this.enviarOrdenTrabajo(),this.op).subscribe({
      next:(data)=>{

        this.spinner.set(false)
        if(data.mensaje=='EXITO'){
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se registró correctamente la orden trabajo',
          });
          this.enviarOrdenTrabajo.set(new ordentrabajoModel())
          this.nombrecliente=new ListadoClientes()
          this.cargarordenestrabajo()

        }else {
          this.abrirnuevaot=true
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar la orden de trabajo',
          });
        }
      },error:(err)=>{
        this.spinner.set(false)
        this.abrirnuevaot=true
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al registrar la orden de trabajo',
        });
      }
    })
  }
  validarForm(): boolean {
    let valido = true;

    // validar fecha
    if (!this.nombrecliente || !this.enviarOrdenTrabajo().nombre_completo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar el nombre del cliente',
      });
      this.formErrors.nombre_completo.set(true);
      valido = false;
    } else {
      this.formErrors.nombre_completo.set(false);
    }

    // validar monto
    if (!this.enviarOrdenTrabajo().direccion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar la dirección',
      });
      this.formErrors.direccion.set(true);
      valido = false;
    } else {
      this.formErrors.direccion.set(false);
    }

    // validar método de pago
    // validar monto
    if (!this.enviarOrdenTrabajo().fechaorden) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe ingresar la fecha',
      });
      this.formErrors.fechaorden.set(true);
      valido = false;
    } else {
      this.formErrors.fechaorden.set(false);
    }
    return valido;
  }
  cambionombre(){
    this.enviarOrdenTrabajo().nombre_completo=this.nombrecliente.nombres+' '+this.nombrecliente.apellidos
    this.enviarOrdenTrabajo().id_cliente=this.nombrecliente.id
  }
  asignartecnico(row:ordentrabajoModel){
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrirasignar=true
    this.enviarOrdenTrabajo.set({ ...row })
  }
  reprogramar(row:ordentrabajoModel){
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrirreprogramar=true
    this.enviarOrdenTrabajo.set({ ...row })
  }
  cerrarot(row:ordentrabajoModel){
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrircierre=true
    this.enviarOrdenTrabajo.set({ ...row })
    this.OrdenTrabajofiltroEnvio().estado='COMPLETADO'
  }
  historialot(row:ordentrabajoModel){
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.enviarOrdenTrabajo.set({ ...row })
    this.listaHistorialOT.set([])
    this.spinner.set(true)
    this.ordentrabajoService.gethistorial_x_ordentrabajo(row.idordentrabajo).subscribe({
      next:(data)=>{
        this.abrirhistorial=true
        this.listaHistorialOT.set(data.data)
        this.spinner.set(false)
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se cargó correctamente el historial de la OT',
        });
      },error:(err)=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un problema al cargar el historial de la OT',
        });
        this.spinner.set(false)
      }
    })
  }
  getSeverity(product: ordentrabajoModel) {
    switch (product.estado) {
      case 'ACTIVO':
        return 'success';

      case 'CANCELADO':
        return 'danger';

      case 'EN PROCESO':
        return 'info';
      case 'PENDIENTE':
        return 'secondary';

      default:
        return null;
    }
  }
  cambioproceso(){
    this.enviarOrdenTrabajo().estado=this.checked?'EN PROCESO':'PENDIENTE'
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // reader.onload = () => {
      //   const base64 = reader.result as string; // esto incluye "data:mime/type;base64,..."
      //   this.pagos.update((prev) => ({
      //     ...prev,
      //     adjunto_boleta: base64,
      //   }));
      // };

      reader.readAsDataURL(file); // lee como DataURL para mantener metadata y tipo
    }
  }
}
