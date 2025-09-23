import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response_Generico} from '../../model/responseGeneric';
import {ResponsedocData} from '../../model/documento/documento';
import {ordentrabajoModel} from '../../model/ordentrabajo/ordentrabajoModel';

@Injectable({
  providedIn: 'root'
})
export class OrdentrabajoService {
  private baseUrl = `${environment.apiUrl}/orden-trabajo`;

  constructor(private http: HttpClient) {}
  getdetalle_x_ordentrabajo(idordentrabajo:string): Observable<Response_Generico<ordentrabajoModel>> {
    return this.http.get<Response_Generico<ordentrabajoModel>>(`${this.baseUrl}/buscar/${idordentrabajo}`);
  }
  getlistaordentrabajos(): Observable<Response_Generico<ordentrabajoModel[]>> {
    return this.http.get<Response_Generico<ordentrabajoModel[]>>(`${this.baseUrl}/listado`);
  }
  registrarordentrabajo(ordentrabajo:ordentrabajoModel,op:number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/${op}`, ordentrabajo);
  }
  gethistorial_x_ordentrabajo(idordentrabajo:string): Observable<Response_Generico<ordentrabajoModel[]>> {
    return this.http.get<Response_Generico<ordentrabajoModel[]>>(`${this.baseUrl}/buscar-historial/${idordentrabajo}`);
  }
  getlistaordentrabajos_x_estado_tecnico(estado:string,idtecnico:number): Observable<Response_Generico<ordentrabajoModel[]>> {
    return this.http.get<Response_Generico<ordentrabajoModel[]>>(`${this.baseUrl}/buscar-x-estado-tecnico/${estado}/${idtecnico}`);
  }
}
