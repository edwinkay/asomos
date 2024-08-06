import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GaleriaActivateService } from 'src/app/services/galeria-activate.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-activate-musica',
  templateUrl: './activate-musica.component.html',
  styleUrls: ['./activate-musica.component.scss'],
})
export class ActivateMusicaComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;

  usuario: any | null;
  usuariosInfo: any[] = [];
  idInfo: any[] = [];
  objetoUsuario: any;
  images: any[] = [];
  post: any[] = [];
  currentIndex = 0;
  currentUser: any | null;
  showCount = false;
  modal = false;
  modalcom = false;
  modalDelete = false;
  modalEditar = false;
  previewImage = false;
  showMask = false;
  currentLightboxImage = this.images[0];
  controls = true;
  totalImageCount = 0;
  reset = 0;
  adm = false;
  esInvitado = false;
  ocultarx = true;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  dataVideoId: any = [];
  modalDeleteImage = false;
  idDelete: string = '';
  option: boolean = false;
  capIndex: any;
  usuarioActual: any;

  presentingElement: any = null;
  showEmoticonSection: boolean = false;
  idPost:any

  alertButtons = ['OK'];
  alertInputs: AlertInput[] = [
    {
      type: 'textarea',
    },
  ];

  constructor(
    private location: Location,
    private el: ElementRef,
    private afAuth: AngularFireAuth,
    private _image: GaleriaActivateService,
    private toastr: ToastrService,
    private router: Router,
    private _user: UsersService,
    private storagex: AngularFireStorage,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private _post: PostService
  ) {}

  ngOnInit() {
    this.getImages();
    this.obtPost()
    this.afAuth.authState.subscribe((user) => {
      this.usuario = user;
      this.currentUser = user;
      this.usuarioActual = user?.displayName;
      const comprobar = user?.uid;
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (
        comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2' ||
        comprobar == 'AO7bYMNMPuSUMl5vH8tOqzavTrt2'
      ) {
        this.adm = true;
      }
    });
  }
  getUsers() {
    this._user.getUsers().subscribe((usuarios) => {
      this.usuariosInfo = [];
      this.idInfo = [];
      usuarios.forEach((element: any) => {
        const data = element.payload.doc.data();
        this.usuariosInfo.push({
          id: element.payload.doc.data(),
          ...element.payload.doc.data(),
          // likesCountImage: data.likesCountImage || 0,
          // likedByImage: data.likedByImage || [],
        });
        const userData = this.usuariosInfo.find(
          (obj) => obj.id.idUser === this.usuario?.uid
        );
        this.objetoUsuario = userData;
        const userData2 = {
          id: element.payload.doc.id, // Aquí obtenemos el ID del documento
          ...element.payload.doc.data(),
        };
      });
    });
  }

  goBack() {
    this.location.back();
  }
  openModal() {
    this.modal2?.present();
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
        // console.log(this.images);
      });
    });
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
  toggleEmoticonSection() {
    this.showEmoticonSection = !this.showEmoticonSection;
  }
  addEmoji(emoji: string) {
    this.comentario += emoji;
  }
  subirArchivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', (event) => {
      const file = (event?.target as HTMLInputElement)?.files?.[0];

      if (file) {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (e: any) => {
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800; // Ancho máximo permitido
            const maxHeight = 600; // Altura máxima permitida
            let width = image.width;
            let height = image.height;

            // Redimensionar la imagen si es necesario
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height *= maxWidth / width;
                width = maxWidth;
              } else {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            if (ctx) {
              ctx.drawImage(image, 0, 0, width, height);

              canvas.toBlob((blob) => {
                if (blob) {
                  const filePath = `images/${file.name}`;
                  const fileRef = this.storagex.ref(filePath);
                  const task = this.storagex.upload(filePath, blob, {
                    contentType: blob.type,
                  });

                  task
                    .snapshotChanges()
                    .pipe(
                      finalize(() => {
                        fileRef.getDownloadURL().subscribe((url) => {
                          const dato: any = {
                            url: url,
                          };
                          this._image.addImagenInfo(dato).then(() => {
                            console.log('actualizando');
                            this.toastr.info('Actualizando lista de Imagenes');

                            //compartir mensaje en features

                            const idUser = this.usuario?.uid;
                            let foto = this.objetoUsuario?.foto;
                            if (foto == undefined) {
                              foto =
                                'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
                            }
                            let nombre =
                              this.objetoUsuario?.usuario ??
                              this.usuario?.displayName;
                            if (!nombre) {
                              console.error('Nombre de usuario no disponible');
                              return;
                            }
                            const data = {
                              foto: 'https://firebasestorage.googleapis.com/v0/b/fitpal-horario.appspot.com/o/chatsImg%2Fcfg4EqTUsyaeHUBfQA96izlfnw82%2Factivate-logo.jpeg?alt=media&token=c11df322-a0ce-4a4c-982b-d79761e1d57e',
                              usuario: 'Activate agrego una imagen',
                              post: url,
                              uid: 'activate',
                              timestamp: new Date(),
                            };
                            this._post.addPost(data).then(() => {});
                          });
                        });
                      })
                    )
                    .subscribe();
                }
              }, file.type);
            } else {
              console.error(
                'Error: No se pudo obtener el contexto 2D del canvas.'
              );
            }
          };

          image.src = e.target.result;
        };

        reader.readAsDataURL(file);
      }
    });

    input.click();
  }
  async likeImage(image: any) {
    const imgUrl = image?.url;
    const post = this.post.find((post: any) => post.post == imgUrl);

    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      const userId = user.uid;

      const usuario = user.displayName;
      const correo = user.email;

      const index = image.likedByImage.indexOf(userId);

      if (index !== -1) {
        image.likedByImage.splice(index, 1);
        image.userImageLikes.splice(index, 1);
        image.likesCountImage--;
      } else {
        image.likedByImage.push(userId);
        image.likesCountImage++;
        image.userImageLikes.push({ usuario, correo });
      }

      const id = image.id;
      const imagex: any = {
        likesCountImage: image.likesCountImage,
        likedByImage: image.likedByImage,
        userImageLikes: image.userImageLikes,
      };
      await this._image.updateImgAc(id, imagex);
      await this._post.update(post.id, imagex)
    } else {
      this.modal = true;
    }
  }
  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.showCount = true;
    this.currentLightboxImage = this.images[index];
    this.totalImageCount = this.images.length;
    document.body.style.overflow = 'hidden';
  }
  onClosePreview() {
    this.previewImage = false;
    this.showMask = false;
    this.modalDeleteImage = false;
    document.body.style.overflow = '';
  }
  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.images.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.images[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.images.length - 1;
    }
    this.currentLightboxImage = this.images[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  onMouseEnter(index: number) {
    const imageElement =
      this.el.nativeElement.querySelectorAll('.zoomable-image')[index];
    imageElement.style.transform = 'scale(1.1)';
  }

  onMouseLeave(index: number) {
    const imageElement =
      this.el.nativeElement.querySelectorAll('.zoomable-image')[index];
    imageElement.style.transform = 'scale(1)';
  }
  salir() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  close() {
    this.modal = false;
    this.modalcom = false;
  }
  async abrirEditar(comentario: any) {
    const user = await this.afAuth.currentUser;
    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
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
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
    ) {
      this.modalDelete = true;
      this.ocultarx = false;
    }
    this.comentarioDel = comentario;
  }
  async addComment(comentario: string) {
    this.showEmoticonSection = false;
    if (comentario.trim() === '') {
    } else {
      // Obtener el usuario actual
      const user = await this.afAuth.currentUser;

      if (user) {
        const image = this.dataVideoId;
        // Obtener el ID del video
        const imageId = this.dataVideoId.id;
        const usuario = user.displayName;
        const correo = user.email;
        const imagen = user.photoURL;
        const idUser = user.uid;
        // Crear el comentario
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
        await this._image.updateImgAc(imageId, imagex);
        await this._post.update(this.idPost, imagex)
        this.comentario = '';
      }
    }
  }
  async abrirCom(image: any) {
    this.dataVideoId = image;
    const user = await this.afAuth.currentUser;

    const imgUrl = image?.url
    const post = this.post.find((post:any)=> post.post == imgUrl)
    this.idPost = post?.id

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
  borrarComentario() {
    // Encuentra el índice del comentario en el array commentsVideo
    const index = this.dataVideoId.commentsVideo.indexOf(this.comentarioDel);

    // Asegúrate de que el índice sea válido
    if (index !== -1) {
      // Elimina el comentario del array commentsVideo
      this.dataVideoId.commentsVideo.splice(index, 1);

      // Actualiza los comentarios en Firestore
      const videoId = this.dataVideoId.id;
      const videox: any = {
        commentsVideo: this.dataVideoId.commentsVideo,
      };
      this._image
        .updateImgAc(videoId, videox)
        .then(() => {
          this.option = false;
          this.modalDelete = false;
          this.ocultarx = true;
          console.log('Comentario eliminado correctamente');
          this._post.update(this.idPost, videox)
        })
        .catch((error) => {
          console.error('Error al eliminar el comentario:', error);
        });
    } else {
      console.error('Índice de comentario no válido');
    }
  }
  editarComentario() {
    // Obtén el comentario modificado desde el formulario
    const comentarioModificado = this.esteComentario;

    // Encuentra el índice del comentario en el array commentsVideo
    const index = this.dataVideoId.commentsVideo.indexOf(this.comentarioDel);

    // Asegúrate de que el índice sea válido
    if (index !== -1) {
      // Actualiza el comentario en el array commentsVideo
      this.dataVideoId.commentsVideo[index].comentario = comentarioModificado;

      // Actualiza los comentarios en Firestore
      const videoId = this.dataVideoId.id;
      const videox: any = {
        commentsVideo: this.dataVideoId.commentsVideo,
      };
      this._image
        .updateImgAc(videoId, videox)
        .then(() => {
          this.modalEditar = false;
          this.ocultarx = true;
          console.log('Comentario editado correctamente');
          this._post.update(this.idPost, videox)
        })
        .catch((error) => {
          console.error('Error al editar el comentario:', error);
        });
    } else {
      console.error('Índice de comentario no válido');
    }
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
  async likeComment(comment: any) {
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
      const videoId = this.dataVideoId.id;
      const commentIndex = this.dataVideoId.commentsVideo.findIndex(
        (c: any) => c === comment
      );
      if (commentIndex !== -1) {
        const videox: any = {
          commentsVideo: this.dataVideoId.commentsVideo,
        };
        await this._image.updateImgAc(videoId, videox);
        await this._post.update(this.idPost, videox);
      }
    } else {
      this.modal = true;
    }
  }
  closeDelete() {
    this.modalDelete = false;
    this.modalEditar = false;
    this.ocultarx = true;
    this.modalDeleteImage = false;
  }
  async ir(id: any) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;
    if (userId === id) {
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/usuario/', id]);
    }
  }
  async deleteImgModal(id: string, com:any) {
    const imgUrl = com.url
    const post = this.post.find((post: any) => post.post == imgUrl);

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
      this._image.delete(id).then(() => {
        this.images = this.images.filter((image) => image.id !== this.idDelete);
        this.toastr.error('Imagen eliminida');
        this.modalDeleteImage = false;
        this.previewImage = false;
        this._post.delete(post?.id)
      });
    }
  }
  async opciones(i: any, comentario: any) {
    this.comentarioDel = comentario;
    this.esteComentario = comentario.comentario;
    const user = await this.afAuth.currentUser;

    if (
      user?.email === comentario.correo ||
      user?.email == 'administrador.sistema@gmail.com' ||
      user?.email == 'jeestrada377@gmail.com'
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
        const index = this.dataVideoId.commentsVideo.indexOf(
          this.comentarioDel
        );
        if (index !== -1) {
          // Elimina el comentario del array commentsVideo
          this.dataVideoId.commentsVideo.splice(index, 1);

          // Actualiza los comentarios en Firestore
          const videoId = this.dataVideoId.id;
          const videox: any = {
            commentsVideo: this.dataVideoId.commentsVideo,
          };
          this._image
            .updateImgAc(videoId, videox)
            .then(() => {
              this.modalDelete = false;
              this.ocultarx = true;
              this.option = false;
              console.log('Comentario eliminado correctamente');
              this._post.update(this.idPost, videox)
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
            const index = this.dataVideoId.commentsVideo.indexOf(
              this.comentarioDel
            );

            // Asegúrate de que el índice sea válido
            if (index !== -1) {
              // Actualiza el comentario en el array commentsVideo
              this.dataVideoId.commentsVideo[index].comentario =
                comentarioModificado;

              // Actualiza los comentarios en Firestore
              const videoId = this.dataVideoId.id;
              const videox: any = {
                commentsVideo: this.dataVideoId.commentsVideo,
              };
              this._image
                .updateImgAc(videoId, videox)
                .then(() => {
                  this.modalEditar = false;
                  this.ocultarx = true;
                  console.log('Comentario editado correctamente');
                  this._post.update(this.idPost, videox)
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
}
