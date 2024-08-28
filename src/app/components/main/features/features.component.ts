import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';
import { PostService } from 'src/app/services/post.service';
import { GaleriaActivateService } from 'src/app/services/galeria-activate.service';
import { UsuariosImgService } from 'src/app/services/usuarios-img.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;

  mostrarBotonCargarMas: boolean = false;
  mostrarMensajeNoMasPublicaciones: boolean = false;

  usuario: any;
  usuarioActual: any;
  esInvitado = false;
  adm = false;
  post: any[] = [];
  images: any[] = [];
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
  showEmoticonSection: boolean = false;
  imageZ: any[] = [];
  abrirFoto = false;
  lafoto: any;
  lastVisible: any = null;
  limit = 30;
  hay = 0;
  modal3 = false;
  modal4 = false;
  modal5 = false;
  activateAdmin = false;

  presentingElement: any = null;
  feature = 1;
  idPost: any;
  idImg: any;
  idUsuario: any;

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
    private _imageUser: UsuariosImgService,
    private _image: GaleriaActivateService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.currentUser = user;

      this._user.getUsers().subscribe((usuarios) => {
        this.usuariosInfo = usuarios.map((element: any) => ({
          id: element.payload.doc.data(),
          ...element.payload.doc.data(),
        }));

        this.objetoUsuario = this.usuariosInfo.find(
          (obj) => obj.id.idUser === this.usuario?.uid
        );
        const rol = this.objetoUsuario?.rol;

        if (rol == 'administrador') {
          this.adm = true;
        } else if (rol == 'invitado') {
          this.esInvitado = true;
        }
      });
    });
    this.obtPost();
    this.getImages();
    this.getUserImages();
    this.obtainAll();

      setTimeout(() => {
        this.verificarUsuarioExistente();
      }, 4000);

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
  addEmoji(emoji: string) {
    this.comentario += emoji;
  }
  abrir(p: any) {
    this.lafoto = p;
    this.abrirFoto = true;
  }
  cerrar() {
    this.abrirFoto = false;
  }
  cerrarModal() {
    this.modal3 = false;
    this.modal4 = false;
    this.modal5 = false;
  }
  obtainAll() {
    this._post.getPost().subscribe((data) => {
      const datos = [];
      data.forEach((e: any) => {
        const postData = e.payload.doc.data();
        datos.push({
          id: e.payload.doc.id,
          ...postData,
        });
        this.hay = datos.length;
      });
    });
  }
  obtPost() {
    this._post.getPostByPage(this.limit, null).subscribe((post) => {
      this.post = [];
      let newLastVisible: any = null;

      post.forEach((element: any) => {
        const postData = element.payload.doc.data();
        const timestamp = postData.timestamp;
        const date = new Date(
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
        const now = new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - date.getTime()) / 1000
        );

        let timeAgo = '';

        if (diffInSeconds < 60) {
          timeAgo = `hace ${diffInSeconds} ${
            diffInSeconds === 1 ? 'segundo' : 'segundos'
          }`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          timeAgo = `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgo = `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgo = `hace ${days} ${days === 1 ? 'día' : 'días'}`;
        } else if (diffInSeconds < 2592000) {
          const weeks = Math.floor(diffInSeconds / 604800);
          timeAgo = `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
        } else if (diffInSeconds < 31536000) {
          const months = Math.floor(diffInSeconds / 2592000);
          timeAgo = `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
        } else {
          const years = Math.floor(diffInSeconds / 31536000);
          timeAgo = `hace ${years} ${years === 1 ? 'año' : 'años'}`;
        }

        this.post.push({
          id: element.payload.doc.id,
          ...postData,
          likesCountImage: postData.likesCountImage || 0,
          likedByImage: postData.likedByImage || [],
          userImageLikes: postData.userImageLikes || [],
          commentsVideo: postData.commentsVideo || [],
          date: timeAgo,
        });

        // Actualiza el último documento visible para la próxima página
        newLastVisible = element.payload.doc;
      });
      // Inicializa `lastVisible` para la próxima página
      this.lastVisible = newLastVisible;

      // Controla la visibilidad del botón y mensaje
      this.mostrarBotonCargarMas = post.length >= this.limit;
      this.mostrarMensajeNoMasPublicaciones =
        post.length < this.limit && this.post.length > 0;
    });
  }

  loadMore() {
    if (!this.lastVisible) {
      // Si lastVisible es null, no hay más publicaciones para cargar
      return;
    }

    this._post.getPostByPage(this.limit, this.lastVisible).subscribe((post) => {
      let newLastVisible: any = null;
      let newPosts: any[] = [];
      const existingPostIds = new Set(this.post.map((p) => p.id)); // Conjunto de IDs existentes

      post.forEach((element: any) => {
        const postData = element.payload.doc.data();
        const postId = element.payload.doc.id;
        const timestamp = postData.timestamp;
        const date = new Date(
          timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
        const now = new Date();
        const diffInSeconds = Math.floor(
          (now.getTime() - date.getTime()) / 1000
        );

        let timeAgo = '';

        if (diffInSeconds < 60) {
          timeAgo = `hace ${diffInSeconds} ${
            diffInSeconds === 1 ? 'segundo' : 'segundos'
          }`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          timeAgo = `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgo = `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgo = `hace ${days} ${days === 1 ? 'día' : 'días'}`;
        } else if (diffInSeconds < 2592000) {
          const weeks = Math.floor(diffInSeconds / 604800);
          timeAgo = `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
        } else if (diffInSeconds < 31536000) {
          const months = Math.floor(diffInSeconds / 2592000);
          timeAgo = `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
        } else {
          const years = Math.floor(diffInSeconds / 31536000);
          timeAgo = `hace ${years} ${years === 1 ? 'año' : 'años'}`;
        }
        if (!existingPostIds.has(postId)) {
          // Verifica si la publicación no existe
          newPosts.push({
            id: postId,
            ...postData,
            likesCountImage: postData.likesCountImage || 0,
            likedByImage: postData.likedByImage || [],
            userImageLikes: postData.userImageLikes || [],
            commentsVideo: postData.commentsVideo || [],
            date: timeAgo,
          });
        }

        // Actualiza el último documento visible para la próxima página
        newLastVisible = element.payload.doc;
      });

      // Agrega las nuevas publicaciones al final del arreglo existente
      this.post = [...this.post, ...newPosts];

      // Actualiza el `lastVisible` para la próxima página
      this.lastVisible = newLastVisible;
      if (this.post.length == this.hay) {
        this.mostrarBotonCargarMas = false;
        this.mostrarMensajeNoMasPublicaciones = true;
      } else {
        this.mostrarBotonCargarMas = true;
        this.mostrarMensajeNoMasPublicaciones = false;
      }
    });
  }

  getImages() {
    this._image.getim().subscribe((data) => {
      this.images = [];
      data.forEach((element: any) => {
        const imageData = element.payload.doc.data();
        this.images.push({
          id: element.payload.doc.id,
          ...imageData,
          likesCountImage: imageData.likesCountImage || 0,
          likedByImage: imageData.likedByImage || [],
          userImageLikes: imageData.userImageLikes || [],
          commentsVideo: imageData.commentsVideo || [],
        });
      });
    });
  }
  getUserImages() {
    this._imageUser.getUsuarioImagen().subscribe((imagen) => {
      this.imageZ = [];
      imagen.forEach((element: any) => {
        const imageData = element.payload.doc.data();
        this.imageZ.push({
          id: element.payload.doc.id,
          ...imageData,
          likesCountImage: imageData.likesCountImage || 0,
          likedByImage: imageData.likedByImage || [],
          userImageLikes: imageData.userImageLikes || [],
          commentsVideo: imageData.commentsVideo || [],
        });
      });
    });
  }
  verificarUsuarioExistente() {
    if (!this.objetoUsuario) {
      this.crearUsuario();
    } else {
      this.toastr.success('Hola ' + this.objetoUsuario.usuario);
    }
  }
  crearUsuario() {
    this.afAuth.currentUser.then((user) => {
      const datos = {
        idUser: user?.uid,
        usuario: user?.displayName,
        email: user?.email,
        foto: user?.photoURL,
        rol: 'usuario',
      };
      this._user.addIUserInfo(datos).then(() => {
        this.toastr.info('Bienvenido');
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
    const adm = 'QxwJYfG0c2MwfjnJR70AdmmKOIz2';
    const inv = 'rm01jawdLvYSObMPDc8BTBasbJp2';
    if (id == adm || id == inv) {
    } else {
      const user = await this.afAuth.currentUser;
      const userId = user?.uid;
      if (userId === id) {
        this.router.navigate(['/main']);
      } else if (id == 'activate') {
        this.router.navigate(['/activate'], { state: { activate: true } });
      } else {
        this.router.navigate(['/usuario/', id]);
      }
    }
  }
  abrirVideos(uid: any) {
    const dato = 'activate-videos';
    if (uid == dato) {
      this.router.navigate(['/activate'], { state: { activateVideo: true } });
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
      comentario.uid == 'activate' &&
      this.objetoUsuario.rol == 'adm-activate'
    ) {
      this.activateAdmin = true;
    }

    // Verificar si el usuario es invitado
    if (
      this.usuarioActual === 'Invitad@' ||
      this.objetoUsuario.rol == 'invitado'
    ) {
      this.modal5 = true; // Abre el modal5
      return; // Sale de la función si el usuario es invitado
    }

    // Si el usuario no es invitado, proceder con las opciones normales
    if (comentario.uid === 'activate') {
      const buttons = [
        {
          text: 'Descargar Imagen',
          data: { action: 'download' },
          handler: () => {
            this.descargarImagen(comentario.post);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          data: { action: 'cancel' },
        },
      ];

      // Añadir opción de eliminar solo si el usuario tiene permisos
      if (
        user?.uid === comentario.uid ||
        user?.email === 'administrador.sistema@gmail.com' ||
        this.objetoUsuario.rol == 'administrador' ||
        this.activateAdmin
      ) {
        buttons.unshift({
          text: 'Eliminar',
          role: 'destructive',
          data: { action: 'delete' },
        });
      }

      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Acciones',
        buttons,
      });

      await actionSheet.present();

      const { data } = await actionSheet.onDidDismiss();

      if (data && data.action === 'delete') {
        const id = comentario?.id;
        this._post.delete(id).then(() => {
          this.toastr.info('Publicación eliminada');
        });
      }
    } else {
      const buttons = [
        {
          text: 'Cancelar',
          role: 'cancel',
          data: { action: 'cancel' },
        },
      ];

      // Añadir opción de eliminar solo si el usuario tiene permisos
      if (
        user?.uid === comentario.uid ||
        user?.email === 'administrador.sistema@gmail.com' ||
        this.objetoUsuario.rol == 'administrador' ||
        this.activateAdmin
      ) {
        buttons.unshift({
          text: 'Eliminar',
          role: 'destructive',
          data: { action: 'delete' },
        });
      }

      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Acciones',
        buttons,
      });

      await actionSheet.present();

      const { data } = await actionSheet.onDidDismiss();

      if (data && data.action === 'delete') {
        const id = comentario?.id;
        this._post.delete(id).then(() => {
          this.toastr.info('Publicación eliminada');
        });
      }
    }
  }

  // descargarImagen(url: string) {
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.setAttribute('download', 'imagen.jpg');
  //   a.download = url.substring(url.lastIndexOf('/') + 1);
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }
  descargarImagen(url: string) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.setAttribute('download', 'imagen.jpg'); // Nombre del archivo descargado
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlBlob);
      })
      .catch(() => alert('No se pudo descargar la imagen.'));
  }

  openModal() {
    this.modal2?.present();
  }
  async abrirCom2(p: any) {
    this.idPost = p.id;
    const postUrl = p.post;
    const imgen = this.images.find((image: any) => image.url == postUrl);
    const usuario = this.imageZ.find((image: any) => image.url == postUrl);
    this.idImg = imgen?.id;
    this.idUsuario = usuario?.id;
    if (postUrl === imgen?.url) {
      this.dataVideoId2 = imgen;
      this.feature = 2;
    } else if (postUrl === usuario?.url) {
      this.dataVideoId2 = usuario;
      this.feature = 3;
    } else {
      this.dataVideoId2 = p;
      this.feature = 1;
    }

    const user = await this.afAuth.currentUser;

    if (user && !this.esInvitado) {
      this.modal2?.present();
    } else {
      this.modal3 = true;
    }
  }
  closeModal() {
    this.modal2?.dismiss();
  }

  returnTrue(): boolean {
    return true;
  }
  async likeImage2(p: any) {
    const postUrl = p.post;
    const imgen = this.images.find((image: any) => image.url == postUrl);
    const data = this.imageZ.find((image: any) => image.url == postUrl);

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

      const id3 = data?.id;
      const id2 = imgen?.id;
      const id = p.id;
      const imagex: any = {
        likesCountImage: p.likesCountImage,
        likedByImage: p.likedByImage,
        userImageLikes: p.userImageLikes,
      };
      this._post.update(id, imagex).then(() => {
        if (imgen != undefined) {
          this._image.updateImgAc(id2, imagex);
        } else if (data != undefined) {
          this._imageUser.updateImgUsuario(id3, imagex);
        }
      });
    } else {
      this.modal4 = true;
    }
  }
  toggleEmoticonSection() {
    this.showEmoticonSection = !this.showEmoticonSection;
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
        this._post.update(this.idPost, videox).then(() => {
          if (this.idImg != undefined) {
            this._image.updateImgAc(this.idImg, videox);
          } else if (this.idUsuario != undefined) {
            this._imageUser.updateImgUsuario(this.idUsuario, videox);
          }
        });
      }
    } else {
      this.modal = true;
    }
  }
  async abrirEditar(comentario: any) {
    const user = await this.afAuth.currentUser;
    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com' ||
      this.objetoUsuario.rol == 'administrador'
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
      user?.email == 'administrador.sistema@gmail.com' ||
      this.objetoUsuario.rol == 'administrador'
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

          const videox: any = {
            commentsVideo: this.dataVideoId2.commentsVideo,
          };
          this._post
            .update(this.idPost, videox)
            .then(() => {
              this.modalDelete = false;
              this.ocultarx = true;
              this.option = false;
              console.log('Comentario eliminado correctamente');
              if (this.idImg != undefined) {
                this._image.updateImgAc(this.idImg, videox);
              } else if (this.idUsuario != undefined) {
                this._imageUser.updateImgUsuario(this.idUsuario, videox);
              }
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
              const videox: any = {
                commentsVideo: this.dataVideoId2.commentsVideo,
              };
              this._post
                .update(this.idPost, videox)
                .then(() => {
                  this.modalEditar = false;
                  this.ocultarx = true;
                  console.log('Comentario editado correctamente');
                  if (this.idImg != undefined) {
                    this._image.updateImgAc(this.idImg, videox);
                  } else if (this.idUsuario != undefined) {
                    this._imageUser.updateImgUsuario(this.idUsuario, videox);
                  }
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
    this.showEmoticonSection = false;
    if (comentario.trim() === '') {
    } else {
      // Obtener el usuario actual
      const user = await this.afAuth.currentUser;

      if (user) {
        const image = this.dataVideoId2;
        // Obtener el ID del video
        const imageId = this.dataVideoId2?.id;
        const nuevoId = this.idPost;
        const idUsuario = this.idUsuario;
        const usuario = user?.displayName;
        const correo = user?.email;
        const imagen = user?.photoURL;
        const idUser = user?.uid;
        // Crear el comentario para post
        image.commentsVideo.push({
          usuario,
          correo,
          comentario,
          imagen,
          idUser,
        });

        const imagex: any = {
          commentsVideo: image.commentsVideo,
        };
        // Actualizar los comentarios en Firestore
        if (this.feature == 2) {
          await this._image.updateImgAc(imageId, imagex);
          await this._post.update(nuevoId, imagex);
        } else if (this.feature == 3) {
          await this._post.update(nuevoId, imagex);
          await this._imageUser.updateImgUsuario(idUsuario, imagex);
        } else {
          await this._post.update(imageId, imagex);
        }

        this.comentario = '';
      }
    }
  }
}
