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
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmationService, MessageService} from 'primeng/api';
import {
  ejecucionordentrabajoModel, HistorialordentrabajoModel, materialesModel,
  ordentrabajofiltroModel,
  ordentrabajoModel, tipomaterialModel
} from '../../../model/ordentrabajo/ordentrabajoModel';
import {tecnicoModel} from '../../../model/mantenimiento/tecnicoModel';
import {CortesServicioRequest} from '../../../model/gestionCobranza/CortesServicioRequest';
import {ListadoClientes} from '../../../model/gestionClientes/listadoclientes';
import {TipoServicioModel} from '../../../model/mantenimiento/tiposervicioModel';
import {EmailModel} from '../../../model/gmail/EmailModel';
import {HistorialServicioModel} from '../../../model/mantenimiento/HistorialServicioModel';
import {Cortesservice} from '../../../services/gestionCobranza/cortes.service';
import {BitacuraService} from '../../../services/mantenimiento/bitacura.service';
import {GmailService} from '../../../services/gmail/gmail.service';
import {WhatsappService} from '../../../services/whatsapp/whatsapp.service';
import {Historialservicio} from '../../../services/mantenimiento/historialservicio';
import {OrdentrabajoService} from '../../../services/ordentrabajo/ordentrabajo-service';
import {TecnicosService} from '../../../services/mantenimiento/tecnicos-service';
import {ClientesService} from '../../../services/gestionClientes/clientes.service';
import {TipoServicioService} from '../../../services/mantenimiento/tipo-servicio.service';
import { CortesPendienteRequest } from '../../../model/gestionCobranza/CortesPendienteRequest';
import {PanelModule} from 'primeng/panel';
import {InputNumberModule} from 'primeng/inputnumber';
import {TipomaterialServices} from '../../../services/mantenimiento/tipomaterial-services';
import {MostrarPdf} from '../../../components/mostrar-pdf/mostrar-pdf';
import {FirmaElec} from '../../../components/firma-elec/firma-elec';
import {TimelineModule} from 'primeng/timeline';
import {CardModule} from 'primeng/card';
import {Upload} from '../../../model/upload';
import {EjecucionotServices} from '../../../services/ordentrabajo/ejecucionot-services';
interface EventItem {
  status?: string;
  descripcion?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}
@Component({
  selector: 'app-ejecucion-orden-trabajo',
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
    CheckboxModule,
    PanelModule,
    InputNumberModule,
    ConfirmDialogModule,
    MostrarPdf,
    FirmaElec,
    TimelineModule,
    CardModule
  ],
  standalone: true,
  templateUrl: './ejecucion-orden-trabajo.html',
  styleUrl: './ejecucion-orden-trabajo.scss'
})
export class EjecucionOrdenTrabajo {
  spinner = signal<boolean>(false);
  events: EventItem[]=[];
  abrirnuevaot:boolean=false;
  abrirasignar:boolean=false
  abrirreprogramar:boolean=false
  abrircierre:boolean=false
  abrirhistorial:boolean=false
  checked:boolean=false
  abrirejecucion:boolean=false
  OrdenTrabajofiltroEnvio=signal(new ejecucionordentrabajoModel())
  OrdenTrabajomaterial=signal(new materialesModel())
  CortesPendienteRequest = signal<CortesPendienteRequest[]>([]);
  Listadotecnicos=signal<tecnicoModel[]>([])
  Listadotipomaterial=signal<tipomaterialModel[]>([])
  idtipomaterial:{ idtipomaterial: number; destipo: string }=new tipomaterialModel()
  ordentrabajoselected:ordentrabajoModel=new ordentrabajoModel()
  listafechas=signal<ordentrabajoModel[]>([])
  // Variables de filtro
  searchQuery: string = '';
  estado: string = '';
  ordenarPor: string = 'vencimiento';
  Totalregistros: number = 0;
  listaHistorialEOT=signal<HistorialordentrabajoModel[]>([])
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
  // BitacuraModel = signal<BitacuraModel>(new BitacuraModel());
  // listadoBitacora = signal<BitacuraModel[]>([]);
  listadoClientes=signal<ListadoClientes[]>([]);
  listadoTiposervicio=signal<TipoServicioModel[]>([])
  clientes:ListadoClientes[]=[]
  // Variables para el modal de bitácora
  bitTipo: string = 'WhatsApp';
  bitDetalle: string = '';
  bloquearboton = signal<boolean>(false);
  // CorteModel = signal<CorteModel>(new CorteModel());
  enviarOrdenTrabajo=signal<ordentrabajoModel>(new ordentrabajoModel())
  op:number=0
  tipoenvio:string=''
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
  historialejecucionModel = signal<HistorialordentrabajoModel[]>(
    []
  );
  itemhistorial=signal<HistorialordentrabajoModel>(new HistorialordentrabajoModel());
  registroHistorial=signal<HistorialordentrabajoModel>(new HistorialordentrabajoModel());

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
    private tiposervicioServicio:TipoServicioService,
    private tipomaterialService:TipomaterialServices,
    private confirmationService: ConfirmationService,
    private ejecucionService:EjecucionotServices
  ) {}

  ngOnInit() {
    // this.events = [
    //   { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    //   { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    //   { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    //   { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    // ];
    this.cargartipomaterial()
    this.cargartecnicos()
    this.cargarclientes()
    this.itemhistorial().color='#c0c0c0'
    this.itemhistorial().descripcion='INICIO DE LA EJECUCIÓN'
    this.itemhistorial().icon='pi pi-lightbulb'
    this.itemhistorial().fecha=this.formatDateForDB(new Date())
    this.historialejecucionModel().push(this.itemhistorial())
    this.itemhistorial.set(new HistorialordentrabajoModel())

  }
  cargartecnicos(){
    this.tecnicoService.getlistatecnicos().subscribe({
      next:(data)=>{
        this.Listadotecnicos.set(data.data)
      }
    })
  }
  cargartipomaterial(){
    this.tipomaterialService.getlistatipomaterials().subscribe({
      next:(data)=>{
        this.Listadotipomaterial.set(data.data)
        this.idtipomaterial={
          idtipomaterial:1,
          destipo: "ONP/CPE"
        }
      }
    })
  }
  // cargarordenestrabajo(){
  //   this.spinner.set(true)
  //   this.OrdenTrabajofiltroEnvio().fechainicial=this.formatDateForDB(this.fechainicial)
  //   this.OrdenTrabajofiltroEnvio().fechafinal=this.formatDateForDB(this.fechafinal)
  //   this.ordentrabajoService.getlistaordentrabajos(this.OrdenTrabajofiltroEnvio()).subscribe({
  //     next:(data)=>{
  //
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Aviso de usuario',
  //         detail: 'Se encontraron coincidencias',
  //       });
  //       this.Listadoordenestrabajo.set(data.data)
  //       this.spinner.set(false)
  //       this.Totalregistros = this.Listadoordenestrabajo().length;
  //     },error:(err)=>{
  //
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Advertencia',
  //         detail: 'Ocurrió un problema al cargar las órdenes de trabajo',
  //       });
  //       this.spinner.set(false)
  //     }
  //   })
  // }

  limpiar_filtros() {
    // this.OrdenTrabajo.set(new CortesfiltroEnvio());
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
          // this.cargarordenestrabajo()

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
    this.enviarOrdenTrabajo().motivo=this.tipoenvio+' '+this.enviarOrdenTrabajo().motivo
    this.spinner.set(true)
    this.abrirasignar=false
    this.abrirreprogramar=false
    this.abrircierre=false
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
          // this.cargarordenestrabajo()
          this.tipoenvio=''

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
    this.tipoenvio='ASIGNAR'
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrirasignar=true
    this.enviarOrdenTrabajo.set({ ...row })
  }
  reprogramar(row:ordentrabajoModel){
    this.tipoenvio='REPROGRAMAR'
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrirreprogramar=true
    this.enviarOrdenTrabajo.set({ ...row })
  }
  cerrarot(row:ordentrabajoModel){
    this.tipoenvio='CIERRE'
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    this.op=2
    this.abrircierre=true
    this.enviarOrdenTrabajo.set({ ...row })
    this.OrdenTrabajofiltroEnvio().estado='COMPLETADO'
  }
  // historialot(row:ordentrabajoModel){
  //   this.enviarOrdenTrabajo.set(new ordentrabajoModel())
  //   this.enviarOrdenTrabajo.set({ ...row })
  //   this.listaHistorialOT.set([])
  //   this.spinner.set(true)
  //   this.ordentrabajoService.gethistorial_x_ordentrabajo(row.idordentrabajo).subscribe({
  //     next:(data)=>{
  //       this.abrirhistorial=true
  //       this.listaHistorialOT.set(data.data)
  //       this.spinner.set(false)
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Éxito',
  //         detail: 'Se cargó correctamente el historial de la OT',
  //       });
  //     },error:(err)=>{
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Ocurrió un problema al cargar el historial de la OT',
  //       });
  //       this.spinner.set(false)
  //     }
  //   })
  // }
  getSeverity(product: ordentrabajoModel) {
    switch (product.estadoejecucion) {
      case 'COMPLETADO':
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
  private formatDateForDB(date: Date): string {
    if (!date) return '';
    const pad = (n: number) => n < 10 ? '0' + n : n;

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  }
  cambiotecnico(){
    this.cargarfechas(this.OrdenTrabajofiltroEnvio().estadoejecucion,this.OrdenTrabajofiltroEnvio().idtecnico)
  }
  cargarfechas(estado:string,idtecnico:string){
    this.spinner.set(true)
    this.ordentrabajoService.getlistaordentrabajos_x_estado_ejecucion_tecnico(estado,idtecnico).subscribe({
      next:(data)=>{
        this.listafechas.set(data.data)

        this.spinner.set(false)
      },error:(err)=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Aviso de usuario',
          detail: 'Ocurrió un problema al cargar las fechas',
        });
        this.spinner.set(false)
      }
    })
  }
  agregarmaterial(){
    const nuevo = this.OrdenTrabajomaterial();

    nuevo.idtipo=this.idtipomaterial.idtipomaterial
    nuevo.tipo=this.idtipomaterial.destipo
    const existe = this.OrdenTrabajofiltroEnvio().materiales.some(
      (m) => m.idtipo === nuevo.idtipo
    );
    if (existe) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso de usuario',
        detail: 'El tipo de material ya fue agregado',
      });
      return;
    }
    this.OrdenTrabajofiltroEnvio().materiales.unshift(nuevo);
    this.OrdenTrabajomaterial.set(new materialesModel());
    this.messageService.add({
      severity: 'success',
      summary: 'Aviso de usuario',
      detail: 'Material agregado al listado',
    });
  }
  eliminarmaterial(material:materialesModel){
    this.OrdenTrabajofiltroEnvio().materiales=this.OrdenTrabajofiltroEnvio().materiales.filter(
      (m) => m.idtipo !== material.idtipo
    );
  }
  confirm(material:materialesModel) {
    this.confirmationService.confirm({
      header: 'Está seguro de eliminar?',
      message: 'Confirmación del proceso para el material '+ material.tipo + ' ?',
      accept: () => {
        this.eliminarmaterial(material)
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Material eliminado' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Se canceló el proceso' });
      },
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      // ⚡ importante: crea nueva referencia
      const nuevoHistorial = {
        ...this.registroHistorial(),
        extensiondoc: extension || '',
        archivobase64: base64
      };
      this.registroHistorial.set(nuevoHistorial); // si usas signal()

      console.log(this.registroHistorial());

      // event.target.value = '';
    };

    reader.readAsDataURL(file);
  }


  buscarcoordenadas() {
    this.spinner.set(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.spinner.set(false)
          this.OrdenTrabajofiltroEnvio().latitud = position.coords.latitude;
          this.OrdenTrabajofiltroEnvio().longitud = position.coords.longitude;
            const nuevo = new HistorialordentrabajoModel();
            nuevo.icon = 'pi pi-map-marker';
            nuevo.descripcion = 'UBICACIÓN CAPTURADA'
            nuevo.fecha=this.formatDateForDB(new Date())
            nuevo.color = '#d0475b';

            this.historialejecucionModel.update(arr => [nuevo, ...arr]);

            this.messageService.add({
              severity: 'success',
              summary: 'Aviso de usuario',
              detail: 'Se generó un registro nuevo en el historial',
            });
            this.itemhistorial.set(new HistorialordentrabajoModel());

        },
        (error) => {
        },
        {
          enableHighAccuracy: true, // intenta usar GPS si hay
          timeout: 10000,           // 10 segundos
          maximumAge: 0             // no usar cache
        }
      );
    } else {
      console.error('La geolocalización no está soportada en este navegador.');
    }
  }
  subirevidencia() {
    const nuevo = new HistorialordentrabajoModel();
    nuevo.icon = 'pi pi-image';
    nuevo.archivobase64 = this.registroHistorial().archivobase64;
    nuevo.extensiondoc = this.registroHistorial().extensiondoc;
    nuevo.descripcion = 'SE SUBIÓ UNA EVIDENCIA';
    nuevo.fecha=this.formatDateForDB(new Date())
    nuevo.color = '#47b4ce';

    this.historialejecucionModel.update(arr => [nuevo, ...arr]);

    this.itemhistorial.set(new HistorialordentrabajoModel());
    this.registroHistorial.set(new HistorialordentrabajoModel())
    this.messageService.add({
      severity: 'success',
      summary: 'Aviso de usuario',
      detail: 'Se generó un registro nuevo en el historial',
    });
  }
  recibefirma(event: Upload[]){
    const nuevo = new HistorialordentrabajoModel();
    nuevo.icon = 'pi pi-user-edit';
    nuevo.archivobase64 = event[0].imgbase64;
    nuevo.extensiondoc = 'jpeg';
    nuevo.descripcion = 'SE SUBIÓ LA FIRMA DEL USUARIO';
    nuevo.fecha=this.formatDateForDB(new Date())
    nuevo.color = '#a147ce';

    this.historialejecucionModel.update(arr => [nuevo, ...arr]);

    this.itemhistorial.set(new HistorialordentrabajoModel());
  }
  guardarejecucion(op:number){
    this.abrirejecucion=false
    this.spinner.set(true)
    this.OrdenTrabajofiltroEnvio().historial=this.historialejecucionModel()
    this.OrdenTrabajofiltroEnvio().idordentrabajo=this.ordentrabajoselected.idordentrabajo
    this.ejecucionService.registrarejecucionot(this.OrdenTrabajofiltroEnvio(),op).subscribe({
      next:(data)=>{
        this.spinner.set(false)
        if(data.mensaje=='EXITO'){

          this.messageService.add({
            severity: 'success',
            summary: 'Aviso de usuario',
            detail: 'Se guardó correctamente la ejecución de la orden de trabajo',
          });
          this.cambiotecnico()
        }else{
          this.abrirejecucion=true

          this.messageService.add({
            severity: 'error',
            summary: 'Aviso de usuario',
            detail: 'Ocurrió un problema al registrar la ejecución',
          });
        }
      },error:(err)=>{
        this.abrirejecucion=true
        this.spinner.set(false)
        this.messageService.add({
          severity: 'error',
          summary: 'Aviso de usuario',
          detail: 'Ocurrió un problema al registrar la ejecución',
        });

      }
    })
  }
  ejecucionot(row:ordentrabajoModel){
    this.OrdenTrabajofiltroEnvio.set(new ejecucionordentrabajoModel())
    this.historialejecucionModel.set([])
    this.ordentrabajoselected=row
    this.abrirejecucion=true
  }
  editarejecucionot(row:ordentrabajoModel){
    this.spinner.set(true)
    this.OrdenTrabajofiltroEnvio.set(new ejecucionordentrabajoModel())
    this.historialejecucionModel.set([])
    this.ordentrabajoselected=row
    this.ejecucionService.getdetalle_x_ejecucionot(row.idejecucion).subscribe({
      next:(data)=>{
        this.OrdenTrabajofiltroEnvio.set(data.data)
        this.historialejecucionModel.set(data.data.historial)
        this.abrirejecucion=true
        this.spinner.set(false)
      },error:(err)=>{
        this.messageService.add({
          severity: 'error',
          summary: 'Aviso de usuario',
          detail: 'Ocurrió un problema al buscar la ejecución',
        });
        this.spinner.set(false)
      }
    })
  }
}
