import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { ClientesModel } from '../../model/gestionClientes/clientesModel';
import { ListadoClientes } from '../../model/gestionClientes/listadoclientes';
import { BuscarClientes } from '../../model/gestionClientes/buscarClientes';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Response_Generico<ListadoClientes[]>> {
    return this.http.get<Response_Generico<ListadoClientes[]>>(
      `${this.baseUrl}/listar`
    );
  }
  //op 1 registra , 2 actualiza , 3 debaja, 4 activa
  registrarClientes(
    cliente: ClientesModel,
    op: number
  ): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(
      `${this.baseUrl}/registrar/${op}`,
      cliente
    );
  }
  // 🔎 Buscar clientes por query (ej: apellido, nombre, etc.)
  buscarClientes(q: string): Observable<Response_Generico<BuscarClientes[]>> {
    return this.http.get<Response_Generico<BuscarClientes[]>>(
      `${this.baseUrl}/buscar?q=${encodeURIComponent(q)}`
    );
  }
}
