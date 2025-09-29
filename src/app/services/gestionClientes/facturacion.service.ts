import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { FacturacionRequest } from '../../model/gestionClientes/FacturacionRequest';
import { FacturacionEnvio } from '../../model/gestionClientes/facturacionEnvio';
import { ActuatulizarFacturaModel } from '../../model/gestionClientes/ActuatulizarFacturaModel';
@Injectable({
  providedIn: 'root',
})
export class FacturacionService {
  private baseUrl = `${environment.apiUrl}/facturacion`;
  constructor(private http: HttpClient) {}
  obtener_facturas_x_contrato(
    id_contrato: number,
    id_cliente: number
  ): Observable<Response_Generico<FacturacionRequest[]>> {
    return this.http.get<Response_Generico<FacturacionRequest[]>>(
      `${this.baseUrl}/obtener_facturas_x_contrato/${id_contrato}/${id_cliente}`
    );
  }
  //post
  buscar_facturas(
    factura: FacturacionEnvio
  ): Observable<Response_Generico<FacturacionRequest[]>> {
    return this.http.post<Response_Generico<FacturacionRequest[]>>(
      `${this.baseUrl}/buscar_facturas`,
      factura
    );
  }

  //actualizar_factura
  actualizar_factura(
    factura: ActuatulizarFacturaModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/actualizar_factura`,
      factura
    );
  }
}
