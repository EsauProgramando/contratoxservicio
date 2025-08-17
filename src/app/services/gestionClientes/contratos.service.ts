import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { IndexListadoContrato } from '../../model/gestionClientes/indexListadoContrato';
import { ContratoModel } from '../../model/gestionClientes/contratoModel';
import { Detalle_contratoxservicioRequest } from '../../model/gestionClientes/detalle_contratoxservicioRequest';
@Injectable({
  providedIn: 'root',
})
export class ContratosService {
  private baseUrl = `${environment.apiUrl}/contratos_x_servicio`;
  constructor(private http: HttpClient) {}
  getContrato(): Observable<Response_Generico<IndexListadoContrato[]>> {
    return this.http.get<Response_Generico<IndexListadoContrato[]>>(
      `${this.baseUrl}/listar`
    );
  }
  // 📌 Buscar detalle contrato x servicio
  getDetalleContratoServicio(
    idCliente: number,
    nroContrato: number
  ): Observable<Response_Generico<Detalle_contratoxservicioRequest>> {
    return this.http.get<Response_Generico<Detalle_contratoxservicioRequest>>(
      `${this.baseUrl}/detalle_contratos_x_servicio/${idCliente}/${nroContrato}`
    );
  }

  // 📌 Registrar, actualizar, dar de baja o activar contrato
  registrarContrato(
    op: number,
    contrato: ContratoModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      contrato
    );
  }
}
