import { Component } from '@angular/core';

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from "@fullcalendar/core/locales/es";
import {DateSelectArg, EventClickArg} from 'fullcalendar';
import {ButtonModule} from 'primeng/button';
import {FullCalendarModule} from "@fullcalendar/angular";
import {OrdentrabajoService} from '../../../services/ordentrabajo/ordentrabajo-service';
import {ordentrabajoModel} from '../../../model/ordentrabajo/ordentrabajoModel';
@Component({
  selector: 'app-agencia-tecnica-component',
  imports: [ButtonModule,FullCalendarModule],
  templateUrl: './agencia-tecnica-component.html',
  standalone: true,
  styleUrl: './agencia-tecnica-component.scss'
})
export class AgenciaTecnicaComponent {
  listafechas:ordentrabajoModel[]=[]
  calendarOptions: any = {
    initialView: 'dayGridMonth', // Vista mensual
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],// Configura el plugin aquí
    locale: esLocale, // Establece el idioma español
    events: [],
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    height:600,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today', // Controles de navegación
      center: 'title', // Título del calendario
      right: 'dayGridMonth,timeGridWeek,timeGridDay', // Vista actual
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
  };

  constructor(private ordentrabajoService:OrdentrabajoService) {
  }
  ngOnInit() {
    //poner valores por defecto a los filtros
    this.cargarfechas();
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    alert('date click! ' + selectInfo)
  }
  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   // clickInfo.event.remove();
    // }
    // this.cargardetalle_x_plan(clickInfo.event)
  }
  getSeverityButton(
    title: string
  ): "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined {
    if (!title) return "info"; // Valor por defecto si está vacío

    const firstLetter = title.charAt(0).toUpperCase();

    switch (firstLetter) {
      case "M":
        return "success";
      case "A":
        return "secondary";
      default:
        return "warn"; // corregido para coincidir con el tipo definido
    }
  }

  cargarfechas(){
    this.ordentrabajoService.getlistaordentrabajos_x_estado_tecnico('TODOS',1).subscribe({
      next:(data)=>{
        this.listafechas=data.data
        this.calendarOptions = {
          ...this.calendarOptions, // clona todas las opciones previas
          events: this.listafechas.map((item: any) => ({
            title: item.tecnico ?? 'Sin técnico',
            start: item.fechaorden ? item.fechaorden.replace(" ", "T") : undefined,
            extendedProps: {
              motivo: item.motivo,
              servicio: item.servicio,
              direccion: item.direccion,
              observacion: item.observacion
            }
          }))
        };
      },error:(err)=>{

      }
    })
  }
}
