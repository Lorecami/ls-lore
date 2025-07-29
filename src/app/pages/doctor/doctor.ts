import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where, doc, updateDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor.html',
  styleUrls: ['./doctor.scss']
})
export class DoctorComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  citas$ = signal<any[]>([]);
  mensaje = signal('');
  error = signal('');
  loading = signal(true);
  doctorDocId = '';

  async ngOnInit() {
    try {
      const user = await firstValueFrom(authState(this.auth));
      if (!user || !user.email) {
        this.error.set('No hay sesión activa.');
        this.loading.set(false);
        return;
      }

      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const data = await firstValueFrom(collectionData(q, { idField: 'id' }));

      if (!data || data.length === 0) {
        this.error.set('No se encontró el perfil del doctor.');
        this.loading.set(false);
        return;
      }

      this.doctorDocId = data[0]['id'];

      const citasRef = collection(this.firestore, 'appointments');
      const citasQuery = query(citasRef, where('doctorId', '==', this.doctorDocId));

      collectionData(citasQuery, { idField: 'id' }).subscribe({
        next: (citas) => {
          this.citas$.set(citas);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error al obtener citas: ' + err.message);
          this.loading.set(false);
        }
      });

    } catch (err: any) {
      this.error.set('Error al inicializar: ' + err.message);
      this.loading.set(false);
    }
  }

  async cambiarEstado(citaId: string, nuevoEstado: string) {
    try {
      const citaRef = doc(this.firestore, 'appointments', citaId);
      await updateDoc(citaRef, { estado: nuevoEstado });
      this.mensaje.set('✅ Estado actualizado.');
    } catch (err: any) {
      this.error.set('❌ Error al actualizar estado: ' + err.message);
    }
  }
}
