import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Response_Generico } from '../../model/responseGeneric';
import { PagosModel } from '../../model/gestionCobranza/pagosModel';
import { EmailModel } from '../../model/gmail/EmailModel';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private baseUrl = `${environment.apiUrl}/email`;

  constructor(private http: HttpClient) {}

  mensajesimple(email: EmailModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/mensajesimple`, email);
  }
}
