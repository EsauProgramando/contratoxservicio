import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response_Generico} from '../../model/responseGeneric';
import {
  ejecucionordentrabajoModel,
  ordentrabajofiltroModel,
  ordentrabajoModel
} from '../../model/ordentrabajo/ordentrabajoModel';

@Injectable({
  providedIn: 'root'
})
export class EjecucionotServices {
  private baseUrl = `${environment.apiUrl}/ejecucion-ot`;

  constructor(private http: HttpClient) {}
  getdetalle_x_ejecucionot(idordentrabajo:string): Observable<Response_Generico<ejecucionordentrabajoModel>> {
    return this.http.get<Response_Generico<ejecucionordentrabajoModel>>(`${this.baseUrl}/buscar/${idordentrabajo}`);
  }
  getlistaejecucionot(requestorden:ordentrabajofiltroModel): Observable<Response_Generico<ejecucionordentrabajoModel[]>> {
    return this.http.post<Response_Generico<ejecucionordentrabajoModel[]>>(`${this.baseUrl}/listado`,requestorden);
  }
  registrarejecucionot(ejecucionot:ejecucionordentrabajoModel,op:number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/${op}`, ejecucionot);
  }
}
