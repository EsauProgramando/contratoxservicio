import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { BitacuraModel } from '../../model/gestionCobranza/BitacuraModel';

@Injectable({
  providedIn: 'root',
})
export class BitacuraService {
  private baseUrl = `${environment.apiUrl}/bitacura`;

  constructor(private http: HttpClient) {}
  registrarBitacora(
    bitacora: BitacuraModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      bitacora
    );
  }
  buscarBitacoraPoridcliente(
    id_cliente: number
  ): Observable<Response_Generico<BitacuraModel[]>> {
    return this.http.get<Response_Generico<BitacuraModel[]>>(
      `${this.baseUrl}/buscar/${id_cliente}`
    );
  }
}
