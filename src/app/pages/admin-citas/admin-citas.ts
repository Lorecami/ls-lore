import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './admin-citas.html',
  styleUrls: ['./admin-citas.scss']
})
export class AdminCitasComponent {
  private firestore = inject(Firestore);
  mensaje = '';
  error = '';

  async generarCitaPrueba() {
    this.error = '';
    this.mensaje = '';
    try {
      const cita = {
        doctorId: 'QWErTY123doctor',
        userId: 'ASDF123cliente',
        userName: 'Carlos Pérez',
        date: '2025-07-25',
        time: '10:30',
        estado: 'pendiente',
        createdAt: new Date()
      };

      await addDoc(collection(this.firestore, 'appointments'), cita);
      this.mensaje = '✅ Cita de prueba creada correctamente.';
    } catch (err: any) {
      this.error = '❌ Error al crear cita: ' + (err.message || err);
    }
  }
}
