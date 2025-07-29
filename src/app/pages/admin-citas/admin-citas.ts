import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  ngOnInit(): void {
    const citasRef = collection(this.firestore, 'appointments');
    this.citas$ = collectionData(citasRef, { idField: 'id' });
  }
}
