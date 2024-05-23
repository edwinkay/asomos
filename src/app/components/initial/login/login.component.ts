import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;
  loading: boolean = false;
  verificar: boolean = false;
  message: any;

  constructor(
    private fb: FormBuilder,
    private firebaseError: FirebaseErrorService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    this.loading = true;

    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.router.navigate(['/tabs/tab1']);
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this.verificar = true;
        this.firebaseError.errorFirebase(error.code);
        this.message = this.firebaseError.errorFirebase(error.code);
        setTimeout(() => {
          this.message = '';
        }, 2000);
      });
  }
  loginAsGuest() {
    const email = 'soyinvitado@gmail.com';
    const password = '123456';
    this.loading = true;

    // Autenticar al usuario con las credenciales proporcionadas
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.loading = false;
        this.router.navigate(['/tabs/tab2']);
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error al iniciar sesión con invitado:', error);
      });
  }
}
