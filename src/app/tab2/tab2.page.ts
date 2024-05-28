import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  usuario: any;
  usuarioActual: any;
  esInvitado = false;
  modal = false;
  usuariosInfo: any[] = [];
  objetoUsuario: any;
  foto: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private menu: MenuController,
    private _user: UsersService
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.usuarioActual = user?.displayName;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
    });

    // Asegurarse de que el menú esté cerrado al iniciar
    this.menu.close();
    this.getUsers();
  }

  ionViewWillEnter() {
    this.getUsers();
  }

  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      usuarios.forEach((element: any) => {
        const data = element.payload.doc.data();
        this.usuariosInfo.push({
          id: element.payload.doc.data(),
          ...element.payload.doc.data(),
        });
        const userData = this.usuariosInfo.find(
          (obj) => obj.id.idUser === this.usuario?.uid
        );
        this.objetoUsuario = userData;
        this.foto = this.objetoUsuario?.foto;
      });
    });
  }

  openMenu() {
    this.menu.open();
  }

  async salir() {
    await this.menu.close(); // Cierra el menú antes de salir
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
