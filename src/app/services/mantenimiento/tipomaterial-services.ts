import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Response_Generico} from '../../model/responseGeneric';
import {ResponsedocData} from '../../model/documento/documento';
import {tipomaterialModel} from '../../model/ordentrabajo/ordentrabajoModel';

@Injectable({
  providedIn: 'root'
})
export class TipomaterialServices {
  private baseUrl = `${environment.apiUrl}/tipo-material`;

  constructor(private http: HttpClient) {}
  getdetalle_x_tipomaterial(idtipomaterial:number): Observable<Response_Generico<tipomaterialModel>> {
    return this.http.get<Response_Generico<tipomaterialModel>>(`${this.baseUrl}/buscar/${idtipomaterial}`);
  }
  getlistatipomaterials(): Observable<Response_Generico<tipomaterialModel[]>> {
    return this.http.get<Response_Generico<tipomaterialModel[]>>(`${this.baseUrl}/listado`);
  }
  registrartipomaterial(tipomaterial:tipomaterialModel,op:number): Observable<ResponsedocData> {
    return this.http.post<ResponsedocData>(`${this.baseUrl}/registrar/${op}`, tipomaterial);
  }
}
