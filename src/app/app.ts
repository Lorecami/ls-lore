import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.userUid = localStorage.getItem('userUid');
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
