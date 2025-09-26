import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; // fecha de expiración en segundos
  [key: string]: any; // otros claims
}

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000); // segundos actuales
      return decoded.exp < now;
    } catch (e) {
      return true; // si no se puede decodificar, lo consideramos inválido
    }
  }

  logout(): void {
    sessionStorage.clear();
  }
}
