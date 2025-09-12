import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { PlanServicioModel } from '../../model/mantenimiento/planservicioModel';
import { CoberturaModel } from '../../model/mantenimiento/coberturaModel';


@Injectable({
  providedIn: 'root'
})
export class CoberturaService {
    private baseUrl = `${environment.apiUrl}/cobertura`;
    constructor(private http: HttpClient) {}
     getCobranza(): Observable<Response_Generico<CoberturaModel[]>> {
    return this.http.get<Response_Generico<CoberturaModel[]>>(
      `${this.baseUrl}/listar`
    );
  }
}
