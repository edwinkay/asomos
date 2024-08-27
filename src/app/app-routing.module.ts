import { AsomosMainComponent } from './components/grupo2/asomos-main/asomos-main.component';
import { ActivateComponent } from './components/grupos/activate/activate.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/initial/login/login.component';
import { RegistrarComponent } from './components/initial/registrar/registrar.component';
import { RecuperarComponent } from './components/initial/recuperar/recuperar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PerfilEditarComponent } from './components/main/perfil-editar/perfil-editar.component';
import { BandejaComponent } from './components/mensajes/bandeja/bandeja.component';
import { SendingComponent } from './components/mensajes/sending/sending.component';
import { VerUsuarioComponent } from './components/main/ver-usuario/ver-usuario.component';
import { BoardComponent } from './components/board/board/board.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'registrar',
    component: RegistrarComponent,
  },
  {
    path: 'recuperar',
    component: RecuperarComponent,
  },
  {
    path: 'main',
    component: NavbarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bandeja',
    component: BandejaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'enviar-mensaje/:id',
    component: SendingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activate',
    component: ActivateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'asomos',
    component: AsomosMainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'administrar',
    component: BoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil-editar',
    component: PerfilEditarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'usuario/:id',
    component: VerUsuarioComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
