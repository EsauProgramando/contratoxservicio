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
  ): Observable<Response_Generico<any>> {
    return this.http.get<Response_Generico<any>>(
      `${this.baseUrl}/detalle_contratos_x_servicio/${idCliente}/${nroContrato}`
    );
  }

  registrarContratoConArchivo(
    op: number,
    contrato: ContratoModel,
    archivoSoporte?: File,
    archivoDocumento?: File,
    archivoCroquis?: File
  ): Observable<Response_Generico<any>> {
    const formData = new FormData();

    // JSON debe llamarse 'form' como espera Spring
    formData.append(
      'form',
      new Blob([JSON.stringify(contrato)], { type: 'application/json' })
    );

    // Archivos
    if (archivoSoporte) formData.append('fileContrato', archivoSoporte);
    if (archivoDocumento) formData.append('fileDocumento', archivoDocumento);
    if (archivoCroquis) formData.append('fileCroquis', archivoCroquis);
    console.log(formData, 'envio');
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      formData
    );
  }
}
