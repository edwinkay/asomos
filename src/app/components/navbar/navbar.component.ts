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
      this.getUsers(); // Asegurarse de obtener los usuarios después de establecer la información del usuario actual
    });

    // Asegurarse de que el menú esté cerrado al iniciar
    this.menu.close();
  }

  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      usuarios.forEach((element: any) => {
        const data = element.payload.doc.data();
        this.usuariosInfo.push({
          id: element.payload.doc.id, // Corregir esto para obtener el ID correcto
          ...data,
        });
      });
      const userData = this.usuariosInfo.find(
        (obj) => obj.id === this.usuario?.uid
      );
      this.objetoUsuario = userData;
      this.foto = this.objetoUsuario?.foto;
    });
  }

  async salir() {
    console.log('click');
    await this.menu.close(); // Cerrar el menú
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
