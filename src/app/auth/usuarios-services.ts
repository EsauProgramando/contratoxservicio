import { Injectable } from '@angular/core';
import {ordentrabajofiltroModel, ordentrabajoModel} from '../model/ordentrabajo/ordentrabajoModel';
import {Observable} from 'rxjs';
import {Response_Generico} from '../model/responseGeneric';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {loginUser, respuestaloginUser} from '../model/auth/usuariosModel';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServices {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}
  loginuser(acceso:loginUser): Observable<respuestaloginUser> {
    return this.http.post<respuestaloginUser>(`${this.baseUrl}/login`,acceso);
  }
}
