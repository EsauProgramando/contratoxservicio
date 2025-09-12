import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router) {}
  login() {
    if (this.username === 'admin' && this.password === '1234') {
      localStorage.setItem('loggedIn', 'true'); // Guardamos login
      this.router.navigate(['/home']); // Redirige a home
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
      });
    }
  }
}
