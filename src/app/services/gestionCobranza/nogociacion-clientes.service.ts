import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { NegociacionModel } from '../../model/gestionCobranza/NegociacionModel';
import { BuscarNegociacion } from '../../model/gestionCobranza/BuscarNegociacion';
import { NegociacionClientesRequest } from '../../model/gestionCobranza/NegociacionClientesRequest';

@Injectable({
  providedIn: 'root',
})
export class NogociacionClientesService {
  private baseUrl = `${environment.apiUrl}/negociacion`;

  constructor(private http: HttpClient) {}
  guardar_negociacion(
    negociacion: NegociacionModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/guardar_negociacion`,
      negociacion
    );
  }
  buscarNegociacion(
    filtro: BuscarNegociacion
  ): Observable<Response_Generico<NegociacionClientesRequest[]>> {
    return this.http.post<Response_Generico<NegociacionClientesRequest[]>>(
      `${this.baseUrl}/buscar_negociacion`,
      filtro
    );
  }
}
