import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent implements OnInit {
  firestore = inject(Firestore);
  users$: Observable<any[]>;
  editMode = false;
  currentUser: any = {};

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });
  }

  ngOnInit(): void {}

  editar(user: any) {
    this.editMode = true;
    this.currentUser = { ...user };
  }

  cancelar() {
    this.editMode = false;
    this.currentUser = {};
  }

  async guardarCambios() {
    const userRef = doc(this.firestore, 'users', this.currentUser.id);
    await updateDoc(userRef, { role: this.currentUser.role });
    this.cancelar();
  }

  async eliminar(userId: string) {
    await deleteDoc(doc(this.firestore, 'users', userId));
  }
}
