import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServices } from './auth-services';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServices);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && !authService.isTokenExpired()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
