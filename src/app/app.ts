import { Component, OnInit, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  userRole: string | null = null;
  userUid: string | null = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.cargarUsuario();

    // Opción 1: si otro tab modifica el localStorage
    window.addEventListener('storage', () => {
      this.zone.run(() => this.cargarUsuario());
    });

    // Opción 2: detectar cambios en este mismo contexto cada segundo
    setInterval(() => {
      this.zone.run(() => this.cargarUsuario());
    }, 1000);
  }

  cargarUsuario() {
    this.userRole = localStorage.getItem('userRole');
    this.userUid = localStorage.getItem('userUid');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
