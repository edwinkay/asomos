import { ActivateComponent } from './components/grupos/activate/activate.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/initial/login/login.component';
import { RegistrarComponent } from './components/initial/registrar/registrar.component';
import { RecuperarComponent } from './components/initial/recuperar/recuperar.component';
import { ActivateMusicaComponent } from './components/grupos/activate-musica/activate-musica.component';
import { ActivateVideoComponent } from './components/grupos/activate-video/activate-video.component';

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
    path: 'activate',
    component: ActivateComponent,
  },
  {
    path: 'imagenes-activate',
    component: ActivateMusicaComponent,
  },
  {
    path: 'videos-activate',
    component: ActivateVideoComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
