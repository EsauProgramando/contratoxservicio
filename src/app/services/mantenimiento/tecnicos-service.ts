import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {creardocumentoModel, ResponsedocData, respuestaFactura} from '../../model/documento/documento';
import {tecnicoModel} from '../../model/mantenimiento/tecnicoModel';
import {Response_Generico} from '../../model/responseGeneric';

@Injectable({
  providedIn: 'root'
})
export class TecnicosService {
  private baseUrl = `${environment.apiUrl}/tecnicos`;

  constructor(private http: HttpClient) {}
  getdetalle_x_tecnico(idtecnico:number): Observable<Response_Generico<tecnicoModel>> {
    return this.http.get<Response_Generico<tecnicoModel>>(`${this.baseUrl}/buscar/${idtecnico}`);
  }
  getlistatecnicos(): Observable<Response_Generico<tecnicoModel[]>> {
    return this.http.get<Response_Generico<tecnicoModel[]>>(`${this.baseUrl}/listado`);
  }
  registrartecnico(tecnico:tecnicoModel,op:number): Observable<ResponsedocData> {
    return this.http.post<ResponsedocData>(`${this.baseUrl}/registrar/${op}`, tecnico);
  }
}
