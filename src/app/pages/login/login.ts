import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {UsuariosServices} from '../../auth/usuarios-services';
import {loginUser} from '../../model/auth/usuariosModel';
import { jwtDecode } from 'jwt-decode';
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
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {
  username = '';
  password = '';


  constructor(private router: Router,private usuariosService:UsuariosServices) {}
  login() {
    let acceso:loginUser=new loginUser()
    acceso.username=this.username
    acceso.password=this.password
    this.usuariosService.loginuser(acceso).subscribe({
      next:(data)=>{
        sessionStorage.setItem('token',data.token)
        sessionStorage.setItem('tipotoken',data.type)
        const decoded = jwtDecode<JwtPayload>(data.token);

        // Guardamos datos del usuario en sessionStorage
        sessionStorage.setItem('iduser', decoded.iduser.toString());
        sessionStorage.setItem('nombres', decoded.nombres);
        sessionStorage.setItem('apellidos', decoded.apellidos);
        sessionStorage.setItem('dni', decoded.dni);
        sessionStorage.setItem('rol', decoded.rol);
        this.router.navigate(['/home']);
      },
      error:(err)=>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos',
          });
      }
    })
    // if (this.username === 'admin' && this.password === '1234') {
    //   localStorage.setItem('loggedIn', 'true'); // Guardamos login
    //   this.router.navigate(['/home']); // Redirige a home
    // } else {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Usuario o contraseña incorrectos',
    //   });
    // }
  }
}
