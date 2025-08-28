import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { PagosModel } from '../../model/gestionCobranza/pagosModel';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private baseUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  //op 1 registra , 2 actualiza , 3 debaja, 4 activa
  registrarPagos(
    pago: PagosModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      pago
    );
  }
}
