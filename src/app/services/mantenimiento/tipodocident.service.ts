import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Response_Generico } from '../../model/responseGeneric';
import { ListadoTipoDocIdent } from '../../model/mantenimiento/listadotipodocident';

@Injectable({
  providedIn: 'root',
})
export class TipodocidentService {
  private baseUrl = `${environment.apiUrl}/tipodocident`;

  constructor(private http: HttpClient) {}

  getTipoDocIdent(): Observable<Response_Generico<ListadoTipoDocIdent[]>> {
    return this.http.get<Response_Generico<ListadoTipoDocIdent[]>>(
      `${this.baseUrl}/listar`
    );
  }
}
