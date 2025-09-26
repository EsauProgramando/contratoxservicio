import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {AuthServices} from './auth-services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthServices) {}

  canActivate(): boolean {
    const token = this.authService.getToken();

    if (token && !this.authService.isTokenExpired()) {
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
