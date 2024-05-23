import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular'; // Importar MenuController

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  usuarioActual: any;
  esInvitado = false;
  modal = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private menu: MenuController // Agregar MenuController al constructor
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuarioActual = user?.displayName;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
    });

    // Asegurarse de que el menú esté cerrado al iniciar
    this.menu.close();
  }

  async salir() {
    console.log('click');
    await this.menu.close(); // Cerrar el menú
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
