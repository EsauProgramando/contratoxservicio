import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { BajaMorosidadModel } from '../../model/gestionCobranza/BajaMorosidadModel';
import { ListadomorosidadRequest } from '../../model/gestionCobranza/ListadomorosidadRequest';
import { BusquedaMorosidad } from '../../model/gestionCobranza/BusquedaMorosidad';

@Injectable({
  providedIn: 'root',
})
export class BajaMorocidadService {
  private baseUrl = `${environment.apiUrl}/baja_morosidad`;

  constructor(private http: HttpClient) {}
  //op 1 registra , 2 actualiza , 3 debaja, 4 activa
  registrarBajaMorosidad(
    baja: BajaMorosidadModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      baja
    );
  }
  //actualizar estado
  actualizarBajaMorosidad(
    baja: BajaMorosidadModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/actualizarestado`,
      baja
    );
  }
  //buscar por filtros
  buscarBajaMorosidad(
    filtro: BusquedaMorosidad
  ): Observable<Response_Generico<ListadomorosidadRequest[]>> {
    return this.http.post<Response_Generico<ListadomorosidadRequest[]>>(
      `${this.baseUrl}/buscar_morosidad`,
      filtro
    );
  }
}
