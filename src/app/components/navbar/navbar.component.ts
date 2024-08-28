import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { IonModal } from '@ionic/angular';
import { ReporteService } from 'src/app/services/reporte.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal2: IonModal | undefined;
  @ViewChild('viewModal') viewModal: IonModal | undefined;

  activate: boolean = false;
  private navigationSubscription: Subscription | undefined;

  report = {
    name: '',
    email: '',
    subject: '',
  };

  usuario: any;
  usuarioActual: any;
  esInvitado = false;
  modal = false;
  usuariosInfo: any[] = [];
  objetoUsuario: any;
  foto: any;
  presentingElement: any = null;
  reportes: any[] = [];
  soloAdm = false;
  email: any;

  mn = true;
  im = false;
  vd = false;

  private adminIds = [
    'QxwJYfG0c2MwfjnJR70AdmmKOIz2',
    'cfg4EqTUsyaeHUBfQA96izlfnw82',
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private menu: MenuController,
    private _user: UsersService,
    private _rep: ReporteService,
    private toastr: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.activate = navigation.extras.state['activate'] || false;

      if (this.activate) {
        this.abrirPerfil();
      } else {
        this.main();
      }
    }
  }

  ngOnInit(): void {
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state) {
          this.activate = navigation.extras.state['activate'] || false;

          if (this.activate) {
            this.abrirPerfil();
          } else {
            this.main();
          }
        }
      }
    });

    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.usuarioActual = user?.displayName;
      this.email = user?.email;
      const comprobar = user?.uid;

      if (this.usuarioActual === 'Invitad@') {
        this.esInvitado = true;
      } else if (comprobar && this.adminIds.includes(comprobar)) {
        this.soloAdm = true;
      }
      this.getUsers();
    });

    this.menu.close();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
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

  abrirPerfil() {
    console.log('Abriendo perfil');

    this.mn = false;
    this.im = false;
    this.vd = true; // Mostrar el perfil
  }

  main() {
    console.log('Mostrando main');
    this.mn = true;
    this.im = false;
    this.vd = false;
  }

  images() {
    this.mn = false;
    this.im = true;
    this.vd = false;
  }

  enviar() {
    this.modal2?.present();
  }

  abrir() {
    if (this.soloAdm) {
      this.loadReportes();
      this.viewModal?.present();
    } else {
      this.toastr.warning('No tienes permiso para ver los informes');
    }
  }

  closeModal() {
    this.modal2?.dismiss();
  }

  closeViewModal() {
    this.viewModal?.dismiss();
  }

  loadReportes() {
    this._rep.getReporte().subscribe((data) => {
      this.reportes = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        };
      });
    });
  }

  sendReport() {
    // Rellenar los campos con los datos del usuario si están vacíos
    if (!this.report.name.trim()) {
      this.report.name = this.usuarioActual || 'Nombre no disponible';
    }
    if (!this.report.email.trim()) {
      this.report.email = this.email || 'Email no disponible';
    }

    if (!this.report.subject.trim()) {
      this.toastr.warning('El asunto no puede estar vacío');
      return;
    }

    this._rep
      .addReporte(this.report)
      .then(() => {
        this.report = {
          name: '',
          email: '',
          subject: '',
        };
        this.toastr.info('Tu reporte fue enviado satisfactoriamente');
      })
      .catch((error) => {
        this.toastr.error('Error al enviar el reporte');
        console.error('Error al enviar el reporte:', error);
      });

    this.closeModal();
  }

  deleteReport(id: string) {
    this._rep.delete(id).then(() => {
      this.toastr.success('Reporte eliminado');
      this.loadReportes(); // Recargar la lista de reportes después de la eliminación
    });
  }

  async salir() {
    await this.menu.close(); // Cerrar el menú
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
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
