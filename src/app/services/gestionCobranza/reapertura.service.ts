import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { ReaperturaModel } from '../../model/gestionCobranza/ReaperturaModel';

@Injectable({
  providedIn: 'root',
})
export class Reaperturaservice {
  private baseUrl = `${environment.apiUrl}/reapetura_servicio`;

  constructor(private http: HttpClient) {}

  //op 1 registra , 2 actualiza , 3 debaja, 4 activa
  registrarreapetura_servicio(
    pago: ReaperturaModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      pago
    );
  }
  actualizarreapetura_servicio(
    pago: ReaperturaModel
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/actualizar`,
      pago
    );
  }
}
