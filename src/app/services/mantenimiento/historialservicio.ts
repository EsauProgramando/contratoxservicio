import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { HistorialServicioModel } from '../../model/mantenimiento/HistorialServicioModel';

@Injectable({
  providedIn: 'root',
})
export class Historialservicio {
  private baseUrl = `${environment.apiUrl}/historial_servicio`;

  constructor(private http: HttpClient) {}
  getHistorialServicio(
    id_cliente: number
  ): Observable<Response_Generico<HistorialServicioModel[]>> {
    return this.http.get<Response_Generico<HistorialServicioModel[]>>(
      `${this.baseUrl}/obtener_historial/${id_cliente}`
    );
  }
  registrarHistorialServicio(
    historial: HistorialServicioModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar`,
      historial
    );
  }
}
