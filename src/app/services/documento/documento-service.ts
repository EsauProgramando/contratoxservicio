import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {creardocumentoModel, ResponsedocData, respuestaFactura} from '../../model/documento/documento';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private baseUrl = `${environment.apiUrl}/documentos`;

  constructor(private http: HttpClient) {}
  getFactura(idContrato:number): Observable<respuestaFactura> {
    return this.http.get<respuestaFactura>(`${this.baseUrl}/factura/${idContrato}`);
  }
  getBoleta(idContrato:number): Observable<respuestaFactura> {
    return this.http.get<respuestaFactura>(`${this.baseUrl}/boleta/${idContrato}`);
  }
  registrarDocumento(documento:creardocumentoModel): Observable<ResponsedocData> {
    return this.http.post<ResponsedocData>(`${this.baseUrl}/crear`, documento);
  }

}
