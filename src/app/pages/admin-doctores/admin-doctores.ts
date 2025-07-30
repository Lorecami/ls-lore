import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  doctores: any[] = [];
  editMode = false;
  currentDoctor: any = {};

  constructor() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role', '==', 'doctor'));
    this.doctores$ = collectionData(q, { idField: 'id' });

    this.doctores$.subscribe(data => {
      this.doctores = data;
    });
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

  exportarPDF(doctores: any[]) {
    const doc = new jsPDF();
    doc.text('Reporte de Doctores', 14, 10);
    const data = doctores.map(doc => [doc.name, doc.email]);

    autoTable(doc, {
      head: [['Nombre', 'Email']],
      body: data,
    });

    doc.save('doctores.pdf');
  }

  exportarExcel(doctores: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(doctores.map(doc => ({
      Nombre: doc.name,
      Email: doc.email
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Doctores');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'doctores.xlsx');
  }
}
