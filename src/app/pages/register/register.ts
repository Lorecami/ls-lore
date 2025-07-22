import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  auth = inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);

  email = '';
  password = '';
  name = '';
  error = '';
  success = '';

  async register() {
    this.error = '';
    this.success = '';

    if (!this.name || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      await addDoc(collection(this.firestore, 'users'), {
        uid: user.uid,
        name: this.name,
        email: this.email,
        role: 'paciente', // Asignación automática
        createdAt: new Date()
      });

      this.success = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
      this.name = '';
      this.email = '';
      this.password = '';
    } catch (err: any) {
      this.error = 'Error al registrar: ' + (err.message || err);
    }
  }
}
