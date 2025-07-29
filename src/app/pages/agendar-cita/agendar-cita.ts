import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, query, where, DocumentData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.scss']
})
export class AgendarCitaComponent implements OnInit {
  private firestore = inject(Firestore);
  doctores$: Observable<DocumentData[]> = of([]);
  doctorSeleccionado: any = null;
  fecha = '';
  hora = '';
  mensaje = '';

  horarios: string[] = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  ngOnInit(): void {
    const doctoresRef = collection(this.firestore, 'users');
    const q = query(doctoresRef, where('role', '==', 'doctor'));
    this.doctores$ = collectionData(q, { idField: 'id' });
  }

  async agendarCita() {
    this.mensaje = '';

    if (!this.doctorSeleccionado || !this.fecha || !this.hora) {
      this.mensaje = '❌ Todos los campos son obligatorios.';
      return;
    }

    try {
      const pacienteId = localStorage.getItem('userUid') || '';
      const pacienteNombre = localStorage.getItem('userName') || '';

      const cita = {
        doctorId: this.doctorSeleccionado.id,
        doctorNombre: this.doctorSeleccionado.name,
        pacienteId,
        pacienteNombre,
        fecha: this.fecha,
        hora: this.hora,
        estado: 'pendiente',
        createdAt: new Date()
      };

      const citasRef = collection(this.firestore, 'appointments');
      await addDoc(citasRef, cita);

      this.mensaje = '✅ Cita agendada correctamente.';
      this.doctorSeleccionado = null;
      this.fecha = '';
      this.hora = '';
    } catch (error) {
      this.mensaje = '❌ Error al agendar cita.';
    }
  }
}
