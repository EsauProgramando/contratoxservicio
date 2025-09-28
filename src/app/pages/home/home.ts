import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {CardModule} from 'primeng/card';
interface JwtPayload {
  sub: string;
  iduser: number;
  nombres: string;
  apellidos: string;
  dni: string;
  rol: string;
  iat: number;
  exp: number;
}
@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    PanelModule,
    AvatarModule,
    MenuModule,
    AvatarModule,
    InputTextModule,
    RouterModule,
    CardModule
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.scss',
})
export class Home {
  items: { label?: string; icon?: string; separator?: boolean }[] = [];
  usuario!: JwtPayload;
  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.usuario = jwtDecode<JwtPayload>(token);
    }
    this.items = [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      },
      {
        separator: true,
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}
