import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ComunicationService } from 'src/app/services/comunication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss'],
})
export class BandejaComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;

  mensajes: any[] = [];
  mensajes2: any[] = [];
  mensajes3: any[] = [];
  misMensajes: any[] = [];
  misMensajes2: any[] = [];
  users: any[] = [];
  users2: any[] = [];
  usuario: any;
  usuarioActual: any;
  optionDelete = false;
  deleteId: any;
  capIndex: any;
  close = false;

  constructor(
    private location: Location,
    private _msj: ComunicationService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private _user: UsersService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.usuarioActual = this.usuario?.uid;
      this.getMessages();
      this.getUsers();
    });
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

      // Excluir al usuario actual
      const usuariosSinUsuarioActual = this.users.filter(
        (obj) => obj.idUser !== this.usuarioActual
      );

      // ID del administrador
      const adminId = 'QxwJYfG0c2MwfjnJR70AdmmKOIz2';

      // Excluir al administrador
      const usuariosSinAdmin = usuariosSinUsuarioActual.filter(
        (obj) => obj.idUser !== adminId
      );

      // Asignar la lista filtrada a users2
      this.users2 = usuariosSinAdmin;
    });
  }

  getMessages() {
    this._msj.getUMessage().subscribe((msj) => {
      this.mensajes2 = [];
      msj.forEach((element: any) => {
        const soloData = {
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        };
        this.mensajes2.push(soloData);
        const misMsjs = this.mensajes2.filter(
          (obj) => obj.idReceptor == this.usuarioActual
        );
        const misMsjs2 = this.mensajes2.filter(
          (obj) => obj.idEmisor == this.usuarioActual
        );
        this.mensajes = misMsjs;
        this.mensajes3 = misMsjs2;
        // const mensajesNoVistos = misMsjs.filter(mensaje => !mensaje.vioelmsj)
      });
    });
  }
  abrirMensaje(id: string) {
    console.log('msj 1')
    this.router.navigate(['enviar-mensaje', id]);
  }
  abrirMensaje3(id: string, idObj:any) {
    const vioelmsj = true
    const datos = {
      vioelmsj
    }
    this._msj.update(idObj, datos).then(()=>{
    })
    this.router.navigate(['enviar-mensaje', id]);
  }
  volver() {
    this.location.back();
  }
  async abrirEliminar(id: any, i: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
    const { data } = await actionSheet.onDidDismiss();

    if (data && data.action === 'delete') {
      this._msj.delete(id).then(() => {});
    }
  }
  openModal() {
    this.modal2?.present();
  }
  // eliminar() {
  //   this.optionDelete = false;
  //   this._msj.delete(this.deleteId).then(() => {});
  // }
  cerrar() {
    this.optionDelete = false;
    this.close = true;
  }
}
