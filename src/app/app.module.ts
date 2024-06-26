import { VerUsuarioComponent } from './components/main/ver-usuario/ver-usuario.component';
import { AsomosMusicaComponent } from './components/grupo2/asomos-musica/asomos-musica.component';
import { AsomosVideosComponent } from './components/grupo2/asomos-videos/asomos-videos.component';
import { AsomosImagenesComponent } from './components/grupo2/asomos-imagenes/asomos-imagenes.component';
import { AsomosMainComponent } from './components/grupo2/asomos-main/asomos-main.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

//toastr
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './components/initial/login/login.component';
import { RegistrarComponent } from './components/initial/registrar/registrar.component';
import { RecuperarComponent } from './components/initial/recuperar/recuperar.component';
import { ActivateComponent } from './components/grupos/activate/activate.component';
import { ActivateMusicaComponent } from './components/grupos/activate-musica/activate-musica.component';
import { ActivateVideoComponent } from './components/grupos/activate-video/activate-video.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FeaturesComponent } from './components/main/features/features.component';
import { GruposComponent } from './components/main/grupos/grupos.component';
import { PerfilComponent } from './components/main/perfil/perfil.component';
import { PerfilEditarComponent } from './components/main/perfil-editar/perfil-editar.component';
import { BandejaComponent } from './components/mensajes/bandeja/bandeja.component';
import { SendingComponent } from './components/mensajes/sending/sending.component';
import { EmoticonsComponent } from './shared/emoticons/emoticons.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrarComponent,
    RecuperarComponent,
    ActivateComponent,
    ActivateMusicaComponent,
    ActivateVideoComponent,
    NavbarComponent,
    FeaturesComponent,
    GruposComponent,
    PerfilComponent,
    PerfilEditarComponent,
    BandejaComponent,
    SendingComponent,
    EmoticonsComponent,
    AsomosMainComponent,
    AsomosImagenesComponent,
    AsomosVideosComponent,
    AsomosMusicaComponent,
    VerUsuarioComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => {
      return initializeApp(environment.firebase);
    }),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
