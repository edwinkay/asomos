import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/services/users.service';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('modal') modal2: IonModal | undefined;
  constructor(
    private afAuth: AngularFireAuth,
    private _user: UsersService,
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  users: any[] = [];
  usuario: any;
  presentingElement: any = null;
  afusuario: any;

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._user.getUsers().subscribe((user) => {
      this.users = [];
      user.forEach((element: any) => {
        this.users.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }
  actualizarPerfil(): void {
    this.afAuth.currentUser.then((user) => {
      const userUid = user?.uid;
      const email = user?.email;

      const usuarioData = {
        idUser: userUid,
        usuario: this.usuario.usuario,
        email: email,
        foto: this.usuario.foto,
        telefono: this.usuario.telefono || null,
        Genero: this.usuario.Genero || null,
        cumpleanos: this.usuario.cumpleanos || null,
        about: this.usuario.about || null,
        ciudad: this.usuario.ciudad || null,
        estado: this.usuario.estado || null,
        rol: this.usuario.rol || 'usuario',
      };
      if (this.usuario.id) {
        this._user.updateUser(usuarioData, this.usuario.id).then(() => {
          this.modal2?.dismiss();
          this.toastr.info('Datos actualizados');
        });
      }
    });
  }
  admin(usuario: any) {
    this.modal2?.present();
    this.usuario = { ...usuario, id: usuario.id };
  }
  closeModal() {
    this.modal2?.dismiss();
  }
  goBack() {
    this.location.back();
  }

  subirFoto(): void {
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
                  const filePath = `profilePictures/${this.usuario?.idUser}/${file.name}`;
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
                                  .updateUser(dato, this.usuario.id)
                                  .then(() => {
                                    // Actualiza la URL de la foto en el modal
                                    this.usuario.foto = url;
                                    // Actualiza la URL de la foto en la lista de usuarios
                                    const index = this.users.findIndex(
                                      (u) => u.id === this.usuario.id
                                    );
                                    if (index !== -1) {
                                      this.users[index].foto = url;
                                    }
                                    console.log('perfil actualizado');
                                    this.toastr.info('Foto de perfil cambiada');
                                  });
                              })
                              .catch((error) => {
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
  }
}
