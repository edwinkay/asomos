import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario: any;
  usuarioActual: any;
  esInvitado = false;
  modal = false;
  usuariosInfo: any[] = [];
  objetoUsuario: any;
  foto: any;

  mn = true;
  im = false;
  vd = false;

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
      if (this.usuarioActual === 'Invitad@') {
        this.esInvitado = true;
      }
      this.getUsers();
    });

    this.menu.close();
  }

  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      usuarios.forEach((element: any) => {
        const data = element.payload.doc.data();
        this.usuariosInfo.push({
          id: element.payload.doc.id,
          ...data,
        });
      });
      const userData = this.usuariosInfo.find(
        (obj) => obj.idUser === this.usuario?.uid
      );
      this.objetoUsuario = userData;
      this.foto = this.objetoUsuario?.foto;
    });
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

  async salir() {
    await this.menu.close(); // Cerrar el menú
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
