import {Component, signal} from '@angular/core';

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from "@fullcalendar/core/locales/es";
import listPlugin from '@fullcalendar/list';
import {DateSelectArg, EventClickArg, EventContentArg} from 'fullcalendar';
import {ButtonModule} from 'primeng/button';
import {FullCalendarModule} from "@fullcalendar/angular";
import {OrdentrabajoService} from '../../../services/ordentrabajo/ordentrabajo-service';
import {ordentrabajofiltroModel, ordentrabajoModel} from '../../../model/ordentrabajo/ordentrabajoModel';
import {DatePicker} from "primeng/datepicker";
import {Select} from "primeng/select";
import {Tag} from "primeng/tag";
import {FormsModule} from '@angular/forms';
import {tecnicoModel, tecnicoresumenModel} from '../../../model/mantenimiento/tecnicoModel';
import {TecnicosService} from '../../../services/mantenimiento/tecnicos-service';
import {PanelModule} from 'primeng/panel';
import {AvatarModule} from 'primeng/avatar';
import {CargaComponent} from '../../../components/carga/carga.component';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {ListadoClientes} from '../../../model/gestionClientes/listadoclientes';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {OverlayModule} from 'primeng/overlay';
import {OverlayBadgeModule} from 'primeng/overlaybadge';
import {BadgeModule} from 'primeng/badge';
import {ChipModule} from 'primeng/chip';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {RadioButtonModule} from 'primeng/radiobutton';
@Component({
  selector: 'app-agencia-tecnica-component',
  imports: [ButtonModule, FullCalendarModule, DatePicker, Select, Tag, FormsModule, PanelModule,
    AvatarModule, CargaComponent,TooltipModule,ToastModule,ConfirmDialogModule,TableModule,BadgeModule,ChipModule,IconFieldModule,
  InputIconModule,InputTextModule,CardModule,RadioButtonModule],
  templateUrl: './agencia-tecnica-component.html',
  standalone: true,
  styleUrl: './agencia-tecnica-component.scss'
})
export class AgenciaTecnicaComponent {
  spinner = signal<boolean>(false);
  listafechas:ordentrabajoModel[]=[]
  Listadoresumentec=signal<tecnicoresumenModel[]>([])
  estadoSeleccionado:string='ALL'

  calendarOptions: any = {
    initialView: 'dayGridMonth', // Vista mensual
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin],// Configura el plugin aquí
    locale: esLocale, // Establece el idioma español
    events: [],
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    height:600,
    fixedWeekCount: false,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    // Drag & Drop
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    headerToolbar: {
      left: 'prev,next today', // Controles de navegación
      center: 'title', // Título del calendario
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // Vista actual
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
  };

  Listadotecnicos=signal<tecnicoModel[]>([])
  OrdenTrabajofiltroEnvio=signal(new ordentrabajofiltroModel)
  enviarOrdenTrabajo=signal<ordentrabajoModel>(new ordentrabajoModel())
  estados = [
    { label: 'TODOS', value: 'ALL',severity:'secondary' },
    { label: 'PENDIENTE', value: 'PENDIENTE',severity:'secondary' },
    { label: 'EN PROCESO', value: 'EN PROCESO',severity:'info' },
    { label: 'COMPLETADO', value: 'COMPLETADO',severity:'success' },
    { label: 'CANCELADO', value: 'CANCELADO',severity:'danger' },
  ];
  constructor(private ordentrabajoService:OrdentrabajoService,
              private messageService: MessageService,
              private tecnicoService:TecnicosService,
              private confirmationService: ConfirmationService) {
  }
  ngOnInit() {
    //poner valores por defecto a los filtros
    this.cargarfechas('ALL','ALL');
    this.cargartecnicos()
    this.cargarresumen('ALL','ALL')
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    // const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    alert('date click! ' + selectInfo)
  }
  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   // clickInfo.event.remove();
    // }
    // this.cargardetalle_x_plan(clickInfo.event)
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
  cargarfechas(estado:string,idtecnico:string){
    this.spinner.set(true)
    this.ordentrabajoService.getlistaordentrabajos_x_estado_tecnico(estado,idtecnico).subscribe({
      next:(data)=>{
        this.listafechas=data.data
        this.calendarOptions = {
          ...this.calendarOptions, // Clona las opciones previas

          // Define la propiedad 'eventContent' aquí, a la misma altura que 'events'
          eventContent: this.renderEventContent.bind(this),

          // Ahora, define la propiedad 'events' con tu lista mapeada
          events: this.listafechas.map((item: any) => ({
            title: item.tecnico ?? 'Sin técnico',
            start: item.fechaorden ? item.fechaorden.replace(" ", "T") : undefined,
            extendedProps: {
              motivo: item.motivo,
              servicio: item.servicio,
              direccion: item.direccion,
              observacion: item.observacion,
              estado:item.estado,
              idordentrabajo:item.idordentrabajo,
              fechareg:item.fechareg,
              fechaorden:item.fechaorden,
              creador:item.creador,
              id_tecnico:item.id_tecnico,
              id_cliente:item.id_cliente,
              id_tipo:item.id_tipo,
              nombre_completo:item.nombre_completo,
              tipo:item.tipo,
              path_imagen:item.path_imagen,
            }
          }))
        };

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
  cargarresumen(estado:string,idtecnico:string){
    this.spinner.set(true)
    this.ordentrabajoService.getlistaordentrabajos_resumen_x_estado_tecnico(estado,idtecnico).subscribe({
      next:(data)=>{
        this.Listadoresumentec.set(data.data)

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
  renderEventContent(info: EventContentArg) {
    const start = info.event.start;
    const direccion = info.event.extendedProps['direccion'];
    const estado = info.event.extendedProps['estado'];
    const fechaFormateada = start ? new Date(start).toLocaleString() : 'Fecha no disponible';
    const bgClass = this.getBgByEstado(estado);
    return {
      html: `
        <div class="text-[7px] p-1 w-full ${bgClass}" >
          <b>${info.event.title}</b>
          <br>
          <span style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="text-[7px]">
             ${fechaFormateada}
          </span>
          <span style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="text-[7px]">
            ${estado ?? 'N/A'}
          </span>
          <span style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="text-[7px]">
            ${direccion ?? 'N/A'}
          </span>
        </div>
      `
    };
  }
  getSeverity(estado:string) {
    switch (estado) {
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
  // Método auxiliar (puedes ajustar colores según tus estados)
  private getBgByEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-gray-100 text-gray-600';
      case 'EN PROCESO':
        return 'bg-blue-100 text-blue-600';
      case 'COMPLETADO':
        return 'bg-green-100 text-green-600';
      case 'CANCELADO':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100';
    }
  }
  handleEventDrop(info: any) {
    this.enviarOrdenTrabajo.set(new ordentrabajoModel())
    const fecha = info.event.start;
    if (fecha) {
      const fechaFormateada = this.formatDateTime(fecha);
      // Aquí seteas tu objeto a enviar
      this.enviarOrdenTrabajo.set({ ...info.event.extendedProps });
      let fechaordenantes=this.enviarOrdenTrabajo().fechaorden
      this.enviarOrdenTrabajo().fechaorden = fechaFormateada;
      this.confirm(this.enviarOrdenTrabajo().idordentrabajo,fechaordenantes,fechaFormateada,info)

      console.log('Fecha a enviar:', fechaFormateada);
    }
    // Aquí podrías llamar a un servicio para actualizar en BD
    // this.miServicio.actualizarEvento(info.event.id, info.event.start, info.event.end).subscribe();
  }

  handleEventResize(info: any) {
    console.log('Evento redimensionado:', info.event.title);
    console.log('Nueva fecha inicio:', info.event.start);
    console.log('Nueva fecha fin:', info.event.end);

    // Igual que arriba, actualizar en BD si quieres
  }
  guardarorden(){
    this.spinner.set(true)
    this.ordentrabajoService.registrarordentrabajo(this.enviarOrdenTrabajo(),2).subscribe({
      next:(data)=>{

        this.spinner.set(false)
        if(data.mensaje=='EXITO'){
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se registró correctamente la orden trabajo',
          });
          this.enviarOrdenTrabajo.set(new ordentrabajoModel())

        }else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al registrar la orden de trabajo',
          });
        }
      },error:(err)=>{
        this.spinner.set(false)
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al registrar la orden de trabajo',
        });
      }
    })
  }
  // Función para formatear
  private formatDateTime(date: Date): string {
    const pad = (n: number) => (n < 10 ? '0' + n : n);

    return (
      date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      ' ' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
    );
  }
  confirm(idordentrabajo:string,fechanterior:string,fecha:string,info :any) {
    this.confirmationService.confirm({
      header: 'Está seguro?',
      message: 'La orden de trabajo '+idordentrabajo+' con fecha: '+fechanterior+' se actualizará a la nueva fecha: '+fecha,
      accept: () => {
        this.guardarorden()
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelada', detail: 'Se revirtió la fecha' });
        info.revert()
      },
    });
  }
  calculateCustomerTotal(tecnico: string) {
    let total = 0;

    if (this.Listadoresumentec()) {
      for (let item of this.Listadoresumentec()) {
        if (item.tecnico === tecnico) {
          total+=item.cantidad;
        }
      }
    }

    return total;
  }
  cambioestado(estado:any){
    this.OrdenTrabajofiltroEnvio().estado=estado.value
    // this.cargarfechas(estado.value,'ALL')
    // this.cargarresumen(estado.value,this.OrdenTrabajofiltroEnvio().idtecnico)
  }
  cambioestadofiltro(){
    this.estadoSeleccionado=this.OrdenTrabajofiltroEnvio().estado
  }
}
