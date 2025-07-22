import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-doctores',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './admin-doctores.html',
  styleUrls: ['./admin-doctores.scss']
})
export class AdminDoctoresComponent implements OnInit {
  private firestore = inject(Firestore);
  doctores$: Observable<any[]>;
  editMode = false;
  currentDoctor: any = {};

  constructor() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role', '==', 'doctor'));
    this.doctores$ = collectionData(q, { idField: 'id' });
  }

  ngOnInit() {}

  editar(doctor: any) {
    this.currentDoctor = { ...doctor };
    this.editMode = true;
  }

  cancelarEdicion() {
    this.currentDoctor = {};
    this.editMode = false;
  }

  async guardarCambios() {
    const docRef = doc(this.firestore, 'users', this.currentDoctor.id);
    await updateDoc(docRef, {
      name: this.currentDoctor.name,
      email: this.currentDoctor.email
    });
    this.cancelarEdicion();
  }

  async eliminar(doctorId: string) {
    if (confirm('¿Seguro que deseas eliminar este doctor?')) {
      await deleteDoc(doc(this.firestore, 'users', doctorId));
    }
  }
}
