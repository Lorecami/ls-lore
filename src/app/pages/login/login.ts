import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  async login() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = '❌ Todos los campos son obligatorios.';
      return;
    }

    try {
      const auth = getAuth();
      const res = await signInWithEmailAndPassword(auth, this.email, this.password);
      const user = res.user;

      localStorage.setItem('userUid', user.uid);
      localStorage.setItem('userEmail', user.email || '');
      // Aquí deberías obtener el rol desde Firestore
      // Ejemplo rápido: rol predeterminado para pruebas
      localStorage.setItem('userRole', 'paciente');

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = '❌ Usuario o contraseña incorrectos.';
    }
  }
}
