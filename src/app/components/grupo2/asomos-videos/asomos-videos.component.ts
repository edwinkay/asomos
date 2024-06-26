import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { VideosActivateService } from 'src/app/services/videos-activate.service';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  AlertInput,
} from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { VideosAsomosService } from 'src/app/services/videos-asomos.service';

@Component({
  selector: 'app-asomos-videos',
  templateUrl: './asomos-videos.component.html',
  styleUrls: ['./asomos-videos.component.scss'],
})
export class AsomosVideosComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;
  @ViewChild('videoPlayer') videoPlayer: ElementRef | undefined;

  videos: any[] = [];
  currentUser: any | null;
  esInvitado = false;
  modal = false;
  modalcom = false;
  modalDelete = false;
  modalEditar = false;
  comentarioDel: any;
  comentario: string = '';
  esteComentario: string = '';
  dataVideoId: any = [];
  ocultarx = true;
  adm = false;

  filteredVideos: any[] = [];
  searchTerm: string = '';

  option: boolean = false;
  capIndex: any;

  presentingElement: any = null;
  showEmoticonSection: boolean = false;

  alertButtons = ['OK'];
  alertInputs: AlertInput[] = [
    {
      type: 'textarea',
    },
  ];

  constructor(
    private location: Location,
    private afAuth: AngularFireAuth,
    private _videosService: VideosAsomosService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.getVideos();
    this.afAuth.authState.subscribe((user) => {
      this.currentUser = user;
      const comprobar = user?.uid;
      if (comprobar == 'rm01jawdLvYSObMPDc8BTBasbJp2') {
        this.esInvitado = true;
      }
      if (comprobar == 'QxwJYfG0c2MwfjnJR70AdmmKOIz2') {
        this.adm = true;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getVideos() {
    this._videosService.getVideos().subscribe((data) => {
      this.videos = [];
      data.forEach((element: any) => {
        const videoData = element.payload.doc.data();
        this.videos.push({
          id: element.payload.doc.id,
          ...videoData,
          likesCountVideo: videoData.likesCountVideo || 0,
          likedByVideo: videoData.likedByVideo || [],
          userVideoLikes: videoData.userVideoLikes || [],
          commentsVideo: videoData.commentsVideo || [],
          playing: false,
        });
        // console.log(this.videos)
      });
      this.filteredVideos = this.videos;
      // console.log(this.filteredVideos)
    });
  }
  playVideo(video: any) {
    this.filteredVideos.forEach((v) => (v.playing = false)); // Detener cualquier video que se esté reproduciendo
    video.playing = true;
    this.videoPlayer?.nativeElement.play(); // Iniciar la reproducción del video
  }
  videoEnded(videoId: string) {
    const video = this.filteredVideos.find((v) => v.id === videoId);
    if (video) {
      video.playing = false;
    }
  }
  addEmoji(emoji: string) {
    this.comentario += emoji;
  }
  toggleEmoticonSection() {
    this.showEmoticonSection = !this.showEmoticonSection;
  }
  async likeVideo(video: any) {
    const user = await this.afAuth.currentUser;
    if (user && !this.esInvitado) {
      // Verificar si el usuario ya ha dado like
      const userId = user.uid;

      const usuario = user.displayName;
      const correo = user.email;

      const index = video.likedByVideo.indexOf(userId);

      if (index !== -1) {
        // Si ya ha dado like, quitar el like
        video.likedByVideo.splice(index, 1);
        video.userVideoLikes.splice(index, 1);
        video.likesCountVideo--;
      } else {
        // Si no ha dado like, agregar el like
        video.likedByVideo.push(userId);
        video.likesCountVideo++;
        video.userVideoLikes.push({ usuario, correo });
      }

      // Actualizar los likes en Firestore
      const id = video.id;
      const videox: any = {
        likesCountVideo: video.likesCountVideo,
        likedByVideo: video.likedByVideo,
        userVideoLikes: video.userVideoLikes,
      };
      await this._videosService.updateVideo(id, videox);
    } else {
      this.modal = true;
    }
  }
  openModal() {
    this.modal2?.present();
  }
  closeModal() {
    this.modal2?.dismiss();
  }
  async abrirCom(video: any) {
    this.dataVideoId = video;
    const user = await this.afAuth.currentUser;

    if (user && !this.esInvitado) {
      const username = user.displayName;
      // this.modalcom = true;
      this.modal2?.present();
    } else {
      this.modal = true;
    }
  }
  closeDelete() {
    this.modalDelete = false;
    this.modalEditar = false;
    this.ocultarx = true;
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
        await this._videosService.updateVideo(videoId, videox);
        console.log(videox);
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
    }
    // Obtener el usuario actual
    else {
      const user = await this.afAuth.currentUser;

      if (user) {
        const video = this.dataVideoId;
        // Obtener el ID del video
        const videoId = this.dataVideoId.id;
        const usuario = user.displayName;
        const correo = user.email;
        const imagen = user.photoURL;
        const idUser = user.uid;
        // Crear el comentario
        video.commentsVideo.push({
          usuario,
          correo,
          comentario,
          imagen,
          idUser,
        });

        const videox: any = {
          commentsVideo: video.commentsVideo,
        };
        // Actualizar los comentarios en Firestore
        await this._videosService.updateVideo(videoId, videox);
        this.comentario = '';
      }
    }
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
      this._videosService
        .updateVideo(videoId, videox)
        .then(() => {
          this.option = false;
          this.modalDelete = false;
          this.ocultarx = true;
          console.log('Comentario eliminado correctamente');
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
      this._videosService
        .updateVideo(videoId, videox)
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
  }
  salir() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  filterVideos() {
    this.filteredVideos = this.videos.filter((video) =>
      video.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
          this._videosService
            .updateVideo(videoId, videox)
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
              this._videosService
                .updateVideo(videoId, videox)
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
}
