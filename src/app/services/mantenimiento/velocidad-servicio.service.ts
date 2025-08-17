import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Response_Generico } from '../../model/responseGeneric';
import { VelocidadServicioModel } from '../../model/mantenimiento/velocidadservicio';

@Injectable({
  providedIn: 'root',
})
export class VelocidadServicioService {
  private baseUrl = `${environment.apiUrl}/velocidad_servicio`;
  constructor(private http: HttpClient) {}
  getVelocidadServicio(): Observable<
    Response_Generico<VelocidadServicioModel[]>
  > {
    return this.http.get<Response_Generico<VelocidadServicioModel[]>>(
      `${this.baseUrl}/listar`
    );
  }
  registrarVelocidadServicio(
    dato: VelocidadServicioModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      dato
    );
  }
}
