import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { TipoServicioModel } from '../../model/mantenimiento/tiposervicioModel';

@Injectable({
  providedIn: 'root',
})
export class TipoServicioService {
  private baseUrl = `${environment.apiUrl}/tipo_servicio`;
  constructor(private http: HttpClient) {}
  getTipoServicio(): Observable<Response_Generico<TipoServicioModel[]>> {
    return this.http.get<Response_Generico<TipoServicioModel[]>>(
      `${this.baseUrl}/listar`
    );
  }
  registrarTipoServicio(
    dato: TipoServicioModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      dato
    );
  }
}
