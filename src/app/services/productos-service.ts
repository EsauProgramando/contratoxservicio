import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response_Generico} from '../model/responseGeneric';
import {ListaProductosModel, ListatipoProductosModel, ProductosModel} from '../model/productosModel';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}
  getProductos(): Observable<Response_Generico<ListaProductosModel[]>> {
    return this.http.get<Response_Generico<ListaProductosModel[]>>(`${this.baseUrl}/lista-productos`);
  }
  registrarProductos(producto:ProductosModel,op:number): Observable<Response_Generico<any>> {
    return this.http.post<Response_Generico<any>>(`${this.baseUrl}/registrar/${op}`, producto);
  }
  gettipoProductos(): Observable<Response_Generico<ListatipoProductosModel[]>> {
    return this.http.get<Response_Generico<ListatipoProductosModel[]>>(`${this.baseUrl}/lista-tipo-productos`);
  }
  getImagenProducto(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/productos/mostrar?id=${id}`, {
      responseType: 'blob' // Muy importante
    });
  }

}
