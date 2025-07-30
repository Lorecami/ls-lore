import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  usuarios: any[] = [];
  editMode = false;
  currentUser: any = {};

  constructor() {
    const usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollection, { idField: 'id' });

    this.users$.subscribe(data => {
      this.usuarios = data;
    });
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

  exportarPDF(usuarios: any[]) {
    const doc = new jsPDF();
    doc.text('Reporte de Usuarios', 14, 10);
    const data = usuarios.map(user => [user.name, user.email, user.role]);

    autoTable(doc, {
      head: [['Nombre', 'Email', 'Rol']],
      body: data,
    });

    doc.save('usuarios.pdf');
  }

  exportarExcel(usuarios: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(usuarios.map(user => ({
      Nombre: user.name,
      Email: user.email,
      Rol: user.role,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'usuarios.xlsx');
  }
}
