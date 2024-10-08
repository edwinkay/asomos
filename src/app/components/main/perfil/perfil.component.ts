import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UsuariosImgService } from 'src/app/services/usuarios-img.service';
import { PostService } from 'src/app/services/post.service';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;

  usuario: any | null;
  currentUser: any | null;
  usuarioActual: any;
  usuarioActual2: any;
  esInvitado = false;
  adm = false;
  usuariosInfo: any[] = [];
  idInfo: any[] = [];
  objetoUsuario: any;
  id: any;
  phoneNumberValue: any;
  genderValue: any;
  birthdayValue: any;
  aboutMeValue: any;
  urlPortada: any;
  showMask = false;
  previewImage = false;
  currentIndex = 0;
  showCount = false;
  imageX: any[] = [];
  currentLightboxImage = this.imageX[0];
  totalImageCount = 0;
  imageZ: any[] = [];
  post: any[] = [];
  modalDeleteImage = false;
  dataVideoId: any = [];
  modalcom = false;
  modal = false;
  idDelete: string = '';
  ocultarx = true;
  controls = true;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  presentingElement: any = null;
  modalDelete = false;
  modalEditar = false;
  option: boolean = false;
  mensajes: any[] = [];
  mensajes2: any[] = [];
  mensajes3: any[] = [];
  alertButtons = ['OK'];
  mensajesNoVistos: any;
  nohaymensaje = false;
  idPost: any;
  cerrarFoto = false;
  cerrarPortada = false;
  aumentar = false;
  alertInputs: AlertInput[] = [
    {
      type: 'textarea',
    },
  ];

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private _user: UsersService,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private _imageUser: UsuariosImgService,
    private _post: PostService,
    private el: ElementRef,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private _msj: ComunicationService
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe((user) => {
      this.usuario = user;
      this.currentUser = user;
      this.getUsers();
      this.usuarioActual = user?.displayName;
      this.usuarioActual2 = user?.uid;
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
    this.getUserImages();
    this.obtPost();
    this.getMessages();
  }
  zoom() {
    this.aumentar = !this.aumentar;
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
          (obj) => obj.idReceptor == this.usuarioActual2
        );
        const misMsjs2 = this.mensajes2.filter(
          (obj) => obj.idEmisor == this.usuarioActual2
        );
        this.mensajes = misMsjs;
        this.mensajes3 = misMsjs2;
        const mensajesNoVistos = misMsjs2.filter(
          (mensaje) => !mensaje.vioelmsj
        );
        this.mensajesNoVistos = mensajesNoVistos.length;
        if (mensajesNoVistos.length <= 0) {
          this.nohaymensaje = true;
        }
      });
    });
  }
  abrirBandeja() {
    this.crearUsuario();
    this.router.navigate(['/bandeja']);
  }
  showEmoticonSection: boolean = false;
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
        this.idInfo.push(userData2);
        const id = this.idInfo.find(
          (obj) => obj.idUser === this.usuario?.uid
        )?.id;
        this.id = id;
        this.phoneNumberValue = userData?.telefono;
        this.genderValue = userData?.Genero;
        this.birthdayValue = userData?.cumpleanos;
        this.aboutMeValue = userData?.about;
        this.urlPortada = userData?.portada;
      });
    });
  }
  crearUsuario() {
    if (this.id == undefined) {
      this.afAuth.currentUser.then((user) => {
        const datos = {
          idUser: user?.uid,
          usuario: user?.displayName,
          email: user?.email,
          foto: user?.photoURL,
        };
        this._user.addIUserInfo(datos).then(() => {
          console.log('usuario actualizado');
        });
      });
    } else console.log('el usuario ya esta registrado');
  }
  toggleEmoticonSection() {
    this.showEmoticonSection = !this.showEmoticonSection;
  }
  addEmoji(emoji: string) {
    this.comentario += emoji;
  }
  changeProfilePicture(): void {
    if (!this.esInvitado) {
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
                    const filePath = `profilePictures/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

                    task
                      .snapshotChanges()
                      .pipe(
                        finalize(() => {
                          fileRef.getDownloadURL().subscribe((url) => {
                            this.afAuth.currentUser.then((user) => {
                              user
                                ?.updateProfile({
                                  photoURL: url,
                                })
                                .then(() => {
                                  const dato = {
                                    foto: url,
                                  };
                                  this._user
                                    .updateUser(dato, this.id)
                                    .then(() => {
                                      console.log('perfil actualizado');
                                    });
                                  this.toastr.info('Foto de perfil cambiada');
                                })
                                .catch((error) => {
                                  // Error al actualizar la foto de perfil
                                  console.error(
                                    'Error al actualizar la foto de perfil:',
                                    error
                                  );
                                });
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
    } else {
      // Código para usuarios invitados
    }
  }
  editarPerfil() {
    this.crearUsuario();
    this.router.navigate(['/perfil-editar']);
  }
  changePortada(): void {
    if (!this.esInvitado) {
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
                    const filePath = `portada/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

                    task
                      .snapshotChanges()
                      .pipe(
                        finalize(() => {
                          fileRef.getDownloadURL().subscribe((url) => {
                            const dato: any = {
                              portada: url,
                            };
                            this._user.updateUser(dato, this.id).then(() => {
                              console.log('actualizando');
                              this.toastr.info('Foto de portada cambiada');
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
    } else {
      // Código para usuarios invitados
    }
  }

  misImages(): void {
    if (!this.esInvitado) {
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
                    const filePath = `usuarios/${this.usuario?.uid}/${file.name}`;
                    const fileRef = this.storage.ref(filePath);
                    const task = this.storage.upload(filePath, blob, {
                      contentType: blob.type,
                    });

                    task
                      .snapshotChanges()
                      .pipe(
                        finalize(() => {
                          fileRef.getDownloadURL().subscribe((url) => {
                            const idUser = this.usuario?.uid;
                            const dato: any = {
                              url: url,
                              idUser: idUser,
                            };
                            this._imageUser.addImagenUsuario(dato).then(() => {
                              let foto = this.objetoUsuario?.foto;
                              if (foto == undefined) {
                                foto =
                                  'https://forma-architecture.com/wp-content/uploads/2021/04/Foto-de-perfil-vacia-thegem-person.jpg';
                              }
                              let nombre =
                                this.objetoUsuario?.usuario ??
                                this.usuarioActual?.displayName;
                              if (!nombre) {
                                console.error(
                                  'Nombre de usuario no disponible'
                                );
                                return;
                              }
                              const data = {
                                foto,
                                usuario: nombre,
                                post: url,
                                uid: idUser,
                                timestamp: new Date(),
                              };
                              this._post.addPost(data).then(() => {});
                              this.toastr.info(
                                'Actualizando lista de Imagenes'
                              );
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
    } else {
      // Código para usuarios invitados
    }
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
  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.showCount = true;
    this.currentLightboxImage = this.imageX[index];
    this.totalImageCount = this.imageX.length;
    document.body.style.overflow = 'hidden';
  }
  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.imageX.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.imageX[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.imageX.length - 1;
    }
    this.currentLightboxImage = this.imageX[this.currentIndex]; // Mantén currentLightboxImage como un objeto Images
  }
  getUserImages() {
    this._imageUser.getUsuarioImagen().subscribe((imagen) => {
      this.imageZ = [];
      this.imageX = [];
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
        const imagenFiltrada = this.imageZ.filter(
          (item) => item.idUser === this.usuario?.uid
        );
        this.imageX = imagenFiltrada;
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
  onClosePreview() {
    this.previewImage = false;
    this.showMask = false;
    this.modalDeleteImage = false;
    document.body.style.overflow = '';
  }
  openModal() {
    this.modal2?.present();
  }
  async abrirCom(image: any) {
    this.dataVideoId = image;
    const user = await this.afAuth.currentUser;

    const imgUrl = image?.url;
    const post = this.post.find((post: any) => post.post == imgUrl);
    this.idPost = post?.id;

    if (user && !this.esInvitado) {
      // this.modalcom = true;
      this.modal2?.present();
    } else {
      this.modal = true;
    }
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
      await this._imageUser.updateImgUsuario(id, imagex);
      await this._post.update(post.id, imagex);
    } else {
      this.modal = true;
    }
  }
  async deleteImgModal(id: string, com: any) {
    const imgUrl = com.url;
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
      this._imageUser.delete(id).then(() => {
        this.modalDeleteImage = true;
        this.ocultarx = true;
        this.toastr.error('Imagen eliminida');
        this.onClosePreview();
        this._post.delete(post?.id);
      });
    }
  }
  closeModal() {
    this.modal2?.dismiss();
  }
  close() {
    this.modal = false;
    this.modalcom = false;
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
        await this._imageUser.updateImgUsuario(videoId, videox);
        await this._post.update(this.idPost, videox);
      }
    } else {
      this.modal = true;
    }
  }
  async opcionesPortada() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Ver portada',
          data: {
            action: 'ver',
          },
        },
        {
          text: 'Cambiar portada',
          data: {
            action: 'cambiar',
          },
        },
      ],
    });

    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    if (data && data.action === 'cambiar') {
      this.changePortada();
    } else if (data && data.action === 'ver') {
      this.cerrarPortada = true;
    }
  }
  async opcionesProfile() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Ver foto de perfil',
          data: {
            action: 'ver',
          },
        },
        {
          text: 'Cambiar foto',
          data: {
            action: 'cambiar',
          },
        },
      ],
    });

    await actionSheet.present();

    const { data } = await actionSheet.onDidDismiss();
    if (data && data.action === 'cambiar') {
      this.changeProfilePicture();
    } else if (data && data.action === 'ver') {
      this.cerrarFoto = true;
    }
  }
  cerrar() {
    this.cerrarFoto = false;
    this.cerrarPortada = false;
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
          this._imageUser
            .updateImgUsuario(videoId, videox)
            .then(() => {
              this.modalDelete = false;
              this.ocultarx = true;
              this.option = false;
              console.log('Comentario eliminado correctamente');
              this._post.update(this.idPost, videox);
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
              this._imageUser
                .updateImgUsuario(videoId, videox)
                .then(() => {
                  this.modalEditar = false;
                  this.ocultarx = true;
                  console.log('Comentario editado correctamente');
                  this._post.update(this.idPost, videox);
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
  async addComment(comentario: string) {
    this.showEmoticonSection = false;
    if (comentario.trim() === '') {
    }
    // Obtener el usuario actual
    else {
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
        await this._imageUser.updateImgUsuario(imageId, imagex);
        await this._post.update(this.idPost, imagex);
        this.comentario = '';
      }
    }
  }
}
