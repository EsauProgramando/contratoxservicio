import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { CalleModel } from '../../model/mantenimiento/callesModel';
import { ListadoCalles } from '../../model/mantenimiento/listadoCalles';

@Injectable({
  providedIn: 'root',
})
export class CallesService {
  private baseUrl = `${environment.apiUrl}/calles`;

  constructor(private http: HttpClient) {}

  getCalles(): Observable<Response_Generico<ListadoCalles[]>> {
    return this.http.get<Response_Generico<ListadoCalles[]>>(
      `${this.baseUrl}/listar`
    );
  }
  registrarCalles(
    calle: CalleModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      calle
    );
  }
}
