import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
})
export class RegistrarComponent implements OnInit {
  registrarUsuario: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseError: FirebaseErrorService,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.registrarUsuario = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repetirPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const confirmarPassword = control.get('repetirPassword');
    if (!password || !confirmarPassword) return null;
    return password.value === confirmarPassword.value
      ? null
      : { mismatch: true };
  };

  registrar() {
    if (this.registrarUsuario.invalid) {
      return;
    }

    const { username, email, password } = this.registrarUsuario.value;

    this.loading = true;
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential.user?.updateProfile({
          displayName: username,
        });
      })
      .then(() => {
        this.router.navigate(['/login']);
        this.toastr.success(
          'El usuario fue registrado con exito!!',
          'Usuario Registrado'
        );
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
        this.firebaseError.errorFirebase(error.code);
      });
  }

  goBack() {
    this.location.back();
  }
}
