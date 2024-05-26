import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ActionSheetController, AlertController, AlertInput } from '@ionic/angular';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;

  usuario: any;
  usuarioActual: any;
  esInvitado = false;
  adm = false;
  post: any[] = [];
  usuariosInfo: any[] = [];
  infoText: string = '';
  objetoUsuario: any;
  option: boolean = false;
  capIndex: any;
  currentUser: any | null;
  dataVideoId2: any;
  modalcom = false;
  modal = false;
  modalEditar = false;
  ocultarx = false;
  comentarioDel: any;
  esteComentario: any;
  modalDelete = false;
  comentario: any = '';

  presentingElement: any = null;

  alertButtons = ['OK'];
  alertInputs: AlertInput[] = [
    {
      type: 'textarea',
    },
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private _user: UsersService,
    private toastr: ToastrService,
    private router: Router,
    private _post: PostService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  @Input() name?: string;

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.currentUser = user;
      this.getUsers();
      this.obtPost();
      this.usuarioActual = user?.displayName;
      const comprobar = user?.uid;
      if (this.usuarioActual == 'Invitad@') {
        this.esInvitado = true;
      }
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2') {
        this.adm = true;
      }
    });
    this.presentingElement = document.querySelector('.ion-page');
  }
  async publicar() {
    if (this.infoText && this.infoText.trim()) {
      const user = await this.afAuth.currentUser;
      const uid = user?.uid;
      let foto = this.objetoUsuario?.foto;
      if (foto == undefined) {
        foto =
          'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
      }
      let nombre = this.objetoUsuario?.usuario ?? user?.displayName;
      if (!nombre) {
        console.error('Nombre de usuario no disponible');
        return;
      }
      const datos = {
        foto,
        usuario: nombre,
        post: this.infoText,
        uid,
        timestamp: new Date(),
      };
      this._post.addPost(datos).then(() => {
        this.infoText = '';
      });
    } else {
      console.log('El texto está vacío o solo contiene espacios en blanco.');
    }
  }
  obtPost() {
    this._post.getPost().subscribe((post) => {
      this.post = [];
      post.forEach((element: any) => {
        const postData = element.payload.doc.data();
        this.post.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
          likesCountImage: postData.likesCountImage || 0,
          likedByImage: postData.likedByImage || [],
          userImageLikes: postData.userImageLikes || [],
          commentsVideo: postData.commentsVideo || [],
        });
      });
    });
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
      });
    });
  }
  isUrl(str: string): boolean {
    // Expresión regular para verificar si la cadena es una URL
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // Protocolo
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Dominio
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // o dirección IP
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Puerto y ruta
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // Parámetros de consulta
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // Fragmento

    return !!pattern.test(str);
  }
  async verUsuario(id: any) {
    console.log(id);
    const adm = 'QxwJYfG0c2MwfjnJR70AdmmKOIz2';
    if (id == adm) {
    } else {
      const user = await this.afAuth.currentUser;
      const userId = user?.uid;
      if (userId === id) {
        this.router.navigate(['/perfil']);
      } else {
        this.router.navigate(['/usuario/', id]);
      }
    }
  }
  deletePost(p: any) {
    this._post.delete(p).then(() => {
      this.option = false;
      this.toastr.info('publicacion eliminada');
    });
  }

  async opciones(i: any, comentario: any) {
    const user = await this.afAuth.currentUser;

    if (
      user?.uid === comentario.uid ||
      user?.email == 'administrador.sistema@gmail.com'
    ) {
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
      const id = comentario?.id;

      const { data } = await actionSheet.onDidDismiss();

      if (data && data.action === 'delete') {
        this._post.delete(id).then(() => {
          this.toastr.info('publicacion eliminada');
        });
      }
    } else {
    }
  }
  openModal() {
    this.modal2?.present();
  }
  async abrirCom2(p: any) {
    this.dataVideoId2 = p;
    const user = await this.afAuth.currentUser;

    if (user && !this.esInvitado) {
      // this.modalcom = true;
      this.modal2?.present();
    } else {
      this.modal = true;
    }
  }
  closeModal() {
    this.modal2?.dismiss();
  }

  returnTrue(): boolean {
    return true;
  }
  async likeImage2(p: any) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      const userId = user.uid;

      const usuario = user.displayName;
      const correo = user.email;

      const index = p.likedByImage.indexOf(userId);

      if (index !== -1) {
        p.likedByImage.splice(index, 1);
        p.userImageLikes.splice(index, 1);
        p.likesCountImage--;
      } else {
        p.likedByImage.push(userId);
        p.likesCountImage++;
        p.userImageLikes.push({ usuario, correo });
      }

      const id = p.id;
      const imagex: any = {
        likesCountImage: p.likesCountImage,
        likedByImage: p.likedByImage,
        userImageLikes: p.userImageLikes,
      };
      await this._post.update(id, imagex);
    } else {
      this.modal = true;
    }
  }
  close() {
    this.modal = false;
    this.modalcom = false;
  }
  async likeComment2(comment: any) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      // Verificar si el comentario está definido
      if (!comment) {
        console.error('El comentario no está definido');
        return;
      }

      // Verificar si el comentario tiene la propiedad likedByComment
      if (!comment.likedByComment) {
        // Si no tiene la propiedad, crearla como un array vacío
        comment.likedByComment = [];
      }

      // Verificar si el usuario ya ha dado like
      const userId = user.uid;

      const index = comment.likedByComment.indexOf(userId);

      if (index !== -1) {
        // Si ya ha dado like, quitar el like
        comment.likedByComment.splice(index, 1);
        comment.likesCountComment = Math.max(0, comment.likesCountComment - 1); // Decrementar el contador
      } else {
        // Si no ha dado like, agregar el like
        comment.likedByComment.push(userId);
        comment.likesCountComment = (comment.likesCountComment || 0) + 1; // Incrementar el contador
      }

      // Actualizar los likes del comentario en Firestore
      const videoId = this.dataVideoId2.id;
      const commentIndex = this.dataVideoId2.commentsVideo.findIndex(
        (c: any) => c === comment
      );
      if (commentIndex !== -1) {
        const videox: any = {
          commentsVideo: this.dataVideoId2.commentsVideo,
        };
        await this._post.update(videoId, videox);
      }
    } else {
      this.modal = true;
    }
  }
  async abrirEditar(comentario: any) {
    const user = await this.afAuth.currentUser;
    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com'
    ) {
      this.modalEditar = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
    this.esteComentario = comentario.comentario;
  }
  async deleteModal(comentario: any) {
    const user = await this.afAuth.currentUser;

    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com'
    ) {
      this.modalDelete = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
  }
  async opciones2(i: any, p: any) {
    this.comentarioDel = p;
    this.esteComentario = p.comentario;
    const user = await this.afAuth.currentUser;

    if (
      user?.uid === p.idUser ||
      user?.email == 'administrador.sistema@gmail.com'
    ) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Acciones',
        buttons: [
          {
            text: 'Editar comentario',
            data: {
              action: 'editar',
            },
          },
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
        const index = this.dataVideoId2.commentsVideo.indexOf(
          this.comentarioDel
        );
        if (index !== -1) {
          // Elimina el comentario del array commentsVideo
          this.dataVideoId2.commentsVideo.splice(index, 1);

          // Actualiza los comentarios en Firestore
          const videoId = this.dataVideoId2.id;
          const videox: any = {
            commentsVideo: this.dataVideoId2.commentsVideo,
          };
          this._post
            .update(videoId, videox)
            .then(() => {
              this.modalDelete = false;
              this.ocultarx = true;
              this.option = false;
              console.log('Comentario eliminado correctamente');
            })
            .catch((error) => {
              console.error('Error al eliminar el comentario:', error);
            });
        } else {
          console.error('Índice de comentario no válido');
        }
      } else if (data.action == 'editar') {
        this.presentAlert();
      }
    }
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Comentario',
      inputs: [
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Escribe tu comentario',
          value: this.esteComentario, // Carga el comentario existente
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const comentarioModificado = data.comentario; // Obtiene el comentario modificado del formulario

            // Encuentra el índice del comentario en el array commentsVideo
            const index = this.dataVideoId2.commentsVideo.indexOf(
              this.comentarioDel
            );

            // Asegúrate de que el índice sea válido
            if (index !== -1) {
              // Actualiza el comentario en el array commentsVideo
              this.dataVideoId2.commentsVideo[index].comentario =
                comentarioModificado;

              // Actualiza los comentarios en Firestore
              const videoId = this.dataVideoId2.id;
              const videox: any = {
                commentsVideo: this.dataVideoId2.commentsVideo,
              };
              this._post
                .update(videoId, videox)
                .then(() => {
                  this.modalEditar = false;
                  this.ocultarx = true;
                  console.log('Comentario editado correctamente');
                })
                .catch((error) => {
                  console.error('Error al editar el comentario:', error);
                });
            } else {
              console.error('Índice de comentario no válido');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async addComment2(comentario: string) {
    // Obtener el usuario actual
    const user = await this.afAuth.currentUser;

    if (user) {
      const image = this.dataVideoId2;
      // Obtener el ID del video
      const imageId = this.dataVideoId2?.id;
      const usuario = user?.displayName;
      const correo = user?.email;
      const imagen = user?.photoURL;
      const idUser = user?.uid;
      // Crear el comentario
      image.commentsVideo.push({ usuario, correo, comentario, imagen, idUser });

      const imagex: any = {
        commentsVideo: image.commentsVideo,
      };
      // Actualizar los comentarios en Firestore
      await this._post.update(imageId, imagex);
      this.comentario = '';
    }
  }
}
