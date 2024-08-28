import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { IonModal } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal2: IonModal | undefined;

  activate: boolean = false;

  activateVideo: boolean = false;
  private navigationSubscription: Subscription | undefined;
  users: any[] = [];
  usuarioActual: any;
  users2: any[] = [];
  presentingElement: any = null;
  esInvitado = false;
  modal3 = false;

  mn = true;
  im = false;
  vd = false;

  constructor(
    private afAuth: AngularFireAuth,
    private location: Location,
    private router: Router,
    private _user: UsersService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.activate = navigation.extras.state['activate'] || false;
      this.activateVideo = navigation.extras.state['activateVideo'] || false;

      if (this.activate) {
        this.images(); // Si activate es true, abrir la sección de imágenes
      } else if (this.activateVideo) {
        this.videos();
      } else {
        this.main(); // Si activate es false, abrir la sección principal
      }
    }
    this.getUsers();
  }
  getUsers() {
    this.users = [];
    this._user.getUsers().subscribe((user) => {
      user.forEach((element: any) => {
        this.users.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });

      // ID del administrador
      const adminId = 'QxwJYfG0c2MwfjnJR70AdmmKOIz2';
      const invitado = 'rm01jawdLvYSObMPDc8BTBasbJp2';

      // Excluir al administrador
      // Excluir tanto al administrador como al invitado
      const usuariosSinUsuarioActual = this.users.filter(
        (obj) => obj.idUser !== adminId && obj.idUser !== invitado
      );

      // Asignar la lista filtrada a users2
      this.users2 = usuariosSinUsuarioActual;
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  async verMas() {
    await this.afAuth.user.subscribe((data) => {
      const inv = 'rm01jawdLvYSObMPDc8BTBasbJp2';
      if (inv == data?.uid) {
        this.modal3 = true;
      } else {
        this.modal2?.present();
      }
    });
  }
  closeModal() {
    this.modal2?.dismiss();
  }
  cerrarModal() {
    this.modal3 = false;
  }

  goBack() {
    this.location.back();
  }

  main() {
    this.mn = true;
    this.im = false;
    this.vd = false;
  }

  images() {
    this.mn = false;
    this.im = true;
    this.vd = false;
  }

  videos() {
    this.mn = false;
    this.im = false;
    this.vd = true;
  }
  async verUsuario(u: any) {
    await this.afAuth.user.subscribe((data) => {
      if (data?.uid == u.idUser) {
        this.router.navigate(['/main'], { state: { activate: true } });
        this.modal2?.dismiss();
      } else {
        this.router.navigate(['/usuario/', u.idUser]);
        this.modal2?.dismiss();
      }
    });
  }
}
