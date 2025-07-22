import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  private firestore = inject(Firestore);

  userId: string = '';
  nombre = '';
  correo = '';
  telefono = '';
  mensaje = '';
  error = '';

  async ngOnInit() {
    this.userId = localStorage.getItem('userUid') || '';
    if (!this.userId) {
      window.location.href = '/login';
      return;
    }

    try {
      const userRef = doc(this.firestore, 'users', this.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as any;
        this.nombre = data.name || '';
        this.correo = data.email || '';
        this.telefono = data.phone || '';
      }
    } catch (err: any) {
      this.error = 'Error al cargar los datos: ' + (err.message || err);
    }
  }

  async guardar() {
    this.mensaje = '';
    this.error = '';
    try {
      const userRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userRef, {
        name: this.nombre,
        email: this.correo,
        phone: this.telefono
      });
      this.mensaje = '✅ Datos actualizados correctamente.';
    } catch (err: any) {
      this.error = 'Error al guardar: ' + (err.message || err);
    }
  }
}
