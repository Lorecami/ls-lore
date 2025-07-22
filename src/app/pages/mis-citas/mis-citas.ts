import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.scss']
})
export class MisCitasComponent implements OnInit {
  firestore = inject(Firestore);
  citas: any[] = [];
  doctores: any[] = [];

  async ngOnInit() {
    const pacienteId = localStorage.getItem('userUid');

    // 1. Obtener citas del paciente
    const citasRef = collection(this.firestore, 'appointments');
    const citasQuery = query(citasRef, where('pacienteId', '==', pacienteId));
    collectionData(citasQuery, { idField: 'id' }).subscribe((citasDocs) => {
      this.citas = citasDocs.map(cita => ({
        ...cita,
        doctorName: '' // inicializamos vacío
      }));

      // 2. Obtener doctores
      const usersRef = collection(this.firestore, 'users');
      const doctoresQuery = query(usersRef, where('role', '==', 'doctor'));
      collectionData(doctoresQuery, { idField: 'id' }).subscribe((docs) => {
        this.doctores = docs;

        // 3. Asociar doctorId con su nombre
        this.citas.forEach((cita) => {
          const doctor = this.doctores.find((d) => d.id === cita.doctorId);
          cita.doctorName = doctor ? doctor.name : 'Desconocido';
        });
      });
    });
  }
}
