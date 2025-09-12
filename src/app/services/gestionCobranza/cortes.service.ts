import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { CorteModel } from '../../model/gestionCobranza/CorteModel';
import { CortesPendienteRequest } from '../../model/gestionCobranza/CortesPendienteRequest';
import { CortesfiltroEnvio } from '../../model/gestionCobranza/CortesfiltroEnvio';
import { CortesServicioRequest } from '../../model/gestionCobranza/CortesServicioRequest';
import { CortesenvioListadofiltro } from '../../model/gestionCobranza/CortesenvioListadofiltro';

@Injectable({
  providedIn: 'root',
})
export class Cortesservice {
  private baseUrl = `${environment.apiUrl}/corte_servicio`;

  constructor(private http: HttpClient) {}

  //op 1 registra , 2 actualiza , 3 debaja, 4 activa
  registrarcorte_servicio(
    pago: CorteModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      pago
    );
  }
  obtener_cortes_pendientes_filtro(
    factura: CortesfiltroEnvio
  ): Observable<Response_Generico<CortesPendienteRequest[]>> {
    return this.http.post<Response_Generico<CortesPendienteRequest[]>>(
      `${this.baseUrl}/buscar_pendiente_cortes`,
      factura
    );
  }
  obtener_cortes_listados(
    factura: CortesenvioListadofiltro
  ): Observable<Response_Generico<CortesServicioRequest[]>> {
    return this.http.post<Response_Generico<CortesServicioRequest[]>>(
      `${this.baseUrl}/buscar_cortes_listado`,
      factura
    );
  }
  obtener_cortes_por_id(
    id: number
  ): Observable<Response_Generico<CortesServicioRequest>> {
    return this.http.get<Response_Generico<CortesServicioRequest>>(
      `${this.baseUrl}/buscar_cortes_id/${id}`
    );
  }
}
