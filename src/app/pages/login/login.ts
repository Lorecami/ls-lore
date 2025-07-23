import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

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

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  async login() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = '❌ Todos los campos son obligatorios.';
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = res.user;

      // Buscar usuario en Firestore por email (más confiable que por UID manual)
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        this.error = '❌ Usuario no registrado en base de datos.';
        return;
      }

      const userDoc = querySnapshot.docs[0].data() as any;

      if (!userDoc || !userDoc.role) {
        this.error = '❌ No se pudo recuperar el rol del usuario.';
        return;
      }

      localStorage.setItem('userUid', user.uid);
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('userRole', userDoc['role']);
      localStorage.setItem('userName', userDoc['name'] || '');

      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = '❌ Usuario o contraseña incorrectos.';
    }
  }
}
