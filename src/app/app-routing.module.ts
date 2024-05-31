import { ActivateComponent } from './components/grupos/activate/activate.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/initial/login/login.component';
import { RegistrarComponent } from './components/initial/registrar/registrar.component';
import { RecuperarComponent } from './components/initial/recuperar/recuperar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PerfilEditarComponent } from './components/main/perfil-editar/perfil-editar.component';

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
  },
  {
    path: 'activate',
    component: ActivateComponent,
  },
  {
    path: 'perfil-editar',
    component: PerfilEditarComponent,
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
