import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {UsuariosServices} from '../../auth/usuarios-services';
import {loginUser} from '../../model/auth/usuariosModel';
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
