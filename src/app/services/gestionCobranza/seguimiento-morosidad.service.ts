import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { Clientes_morosidad_ext } from '../../model/gestionCobranza/Clientes_morosidad_ext';
import { Clientes_morosidad_extModel } from '../../model/gestionCobranza/Clientes_morosidad_extModel';
import { Sp_kpis_mora_total } from '../../model/gestionCobranza/Sp_kpis_mora_total';
import { Detalle_facturas_moraModel } from '../../model/gestionCobranza/Detalle_facturas_moraModel';
import { Detalle_facturas_mora } from '../../model/gestionCobranza/Detalle_facturas_mora';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoMorosidadService {
  private baseUrl = `${environment.apiUrl}/seguimiento_morosidad`;

  constructor(private http: HttpClient) {}

  //buscar_clientes_morosidad filtro
  buscar_clientes_morosidad(
    factura: Clientes_morosidad_extModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/buscar_clientes_morosidad`,
      factura
    );
  }

  //sp_kpis_mora_total get
  sp_kpis_mora_total(
    solo_con_saldo: number
  ): Observable<Response_Generico<any>> {
    return this.http.get<Response_Generico<any>>(
      `${this.baseUrl}/sp_kpis_mora_total/${solo_con_saldo}`
    );
  }

  //buscar_detalle_facturas_mora post
  buscar_detalle_facturas_mora(
    enviodata: Detalle_facturas_moraModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/buscar_detalle_facturas_mora`,
      enviodata
    );
  }
}
