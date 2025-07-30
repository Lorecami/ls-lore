import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-citas.html',
  styleUrls: ['./admin-citas.scss']
})
export class AdminCitasComponent implements OnInit {
  private firestore = inject(Firestore);
  citas$: Observable<any[]> = new Observable();
  citas: any[] = [];

  ngOnInit(): void {
    const citasRef = collection(this.firestore, 'appointments');
    this.citas$ = collectionData(citasRef, { idField: 'id' });

    this.citas$.subscribe(data => {
      this.citas = data;
    });
  }

  exportarPDF(citas: any[]) {
    const doc = new jsPDF();
    doc.text('Reporte de Citas Médicas', 14, 10);
    const data = citas.map(cita => [
      cita.doctorNombre || 'Sin nombre',
      cita.pacienteNombre || 'Sin nombre',
      cita.fecha,
      cita.hora,
      cita.estado
    ]);

    autoTable(doc, {
      head: [['Doctor', 'Paciente', 'Fecha', 'Hora', 'Estado']],
      body: data,
    });

    doc.save('reporte_citas.pdf');
  }

  exportarExcel(citas: any[]) {
    const worksheet = XLSX.utils.json_to_sheet(citas.map(cita => ({
      Doctor: cita.doctorNombre || 'Sin nombre',
      Paciente: cita.pacienteNombre || 'Sin nombre',
      Fecha: cita.fecha,
      Hora: cita.hora,
      Estado: cita.estado
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'reporte_citas.xlsx');
  }
}
