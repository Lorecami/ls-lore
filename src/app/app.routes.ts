import { Routes } from '@angular/router';

// Componentes importados
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PerfilComponent } from './pages/perfil/perfil';
import { AdminComponent } from './pages/admin/admin';
import { AdminCitasComponent } from './pages/admin-citas/admin-citas';
import { AdminDoctoresComponent } from './pages/admin-doctores/admin-doctores';
import { DoctorComponent } from './pages/doctor/doctor';
import { AgendarCitaComponent } from './pages/agendar-cita/agendar-cita';
import { MisCitasComponent } from './pages/mis-citas/mis-citas';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin-citas', component: AdminCitasComponent },
  { path: 'admin-doctores', component: AdminDoctoresComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'agendar-cita', component: AgendarCitaComponent },
  { path: 'mis-citas', component: MisCitasComponent },
  { path: '**', redirectTo: '' }
];
