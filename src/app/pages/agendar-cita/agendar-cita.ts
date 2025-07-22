import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, query, where } from '@angular/fire/firestore';
import { Observable, firstValueFrom, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.scss']
})
export class AgendarCitaComponent implements OnInit {
  doctores$: Observable<any[]>;
  private firestore = inject(Firestore);

  doctorSeleccionado: any = null;
  fecha = '';
  hora = '';
  mensaje = '';
  error = '';
  horarios = [
    '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30'
  ];

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('role', '==', 'doctor'));
    this.doctores$ = collectionData(q, { idField: 'id' });
  }

  ngOnInit() {
    if (!localStorage.getItem('userUid')) {
      window.location.href = '/login';
    }
  }

  cancelar() {
    this.doctorSeleccionado = null;
    this.fecha = '';
    this.hora = '';
    this.error = '';
    this.mensaje = '';
  }

  async agendarTurno() {
    this.error = '';
    this.mensaje = '';

    if (!this.doctorSeleccionado || !this.fecha || !this.hora) {
      this.error = '❌ Todos los campos son obligatorios.';
      return;
    }

    try {
      const citasRef = collection(this.firestore, 'appointments');
      const q = query(
        citasRef,
        where('doctorId', '==', this.doctorSeleccionado.id),
        where('fecha', '==', this.fecha),
        where('hora', '==', this.hora),
        where('estado', 'in', ['pendiente', 'confirmada'])
      );

      const existentes = await firstValueFrom(
        collectionData(q).pipe(
          timeout(5000),
          catchError(() => {
            this.error = 'Error consultando disponibilidad.';
            return of([]);
          })
        )
      );

      if (existentes.length > 0) {
        this.error = '⛔ Ese horario ya está reservado.';
        return;
      }

      const pacienteId = localStorage.getItem('userUid') || '';
      await addDoc(citasRef, {
        doctorId: this.doctorSeleccionado.id,
        pacienteId,
        fecha: this.fecha,
        hora: this.hora,
        estado: 'pendiente',
        createdAt: new Date()
      });

      this.mensaje = '✅ Cita agendada con éxito.';
      this.cancelar();
    } catch (err: any) {
      this.error = 'Error al guardar la cita: ' + (err.message || err);
    }
  }
}
