import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection, query, where, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor.html',
  styleUrls: ['./doctor.scss']
})
export class DoctorComponent implements OnInit {
  private firestore = inject(Firestore);
  citas$: Observable<any[]> = new Observable();

  userUid: string = localStorage.getItem('userUid') || '';

  ngOnInit(): void {
    const citasRef = collection(this.firestore, 'appointments');
    const q = query(citasRef, where('doctorId', '==', this.userUid));
    this.citas$ = collectionData(q, { idField: 'id' });
  }

  async cambiarEstado(cita: any, nuevoEstado: string) {
    try {
      const citaRef = doc(this.firestore, 'appointments', cita.id);
      await updateDoc(citaRef, { estado: nuevoEstado });
      alert('✅ Estado actualizado.');
    } catch (err) {
      alert('❌ Error al actualizar: ' + (err as any).message);
    }
  }
}
