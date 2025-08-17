import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { PlanServicioModel } from '../../model/mantenimiento/planservicioModel';

@Injectable({
  providedIn: 'root',
})
export class PlanServicioService {
  private baseUrl = `${environment.apiUrl}/plan_servicio`;
  constructor(private http: HttpClient) {}
  getPlanServicio(): Observable<Response_Generico<PlanServicioModel[]>> {
    return this.http.get<Response_Generico<PlanServicioModel[]>>(
      `${this.baseUrl}/listar`
    );
  }
  registrarPlanServicio(
    dato: PlanServicioModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      dato
    );
  }
}
