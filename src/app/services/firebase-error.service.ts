import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseErrorService {
  constructor() {}


  errorFirebase(code: string) {
    switch (code) {
      //login
      case 'auth/user-not-found':

        break;
      case 'auth/wrong-password':

        break;
      case 'auth/invalid-email':


        break;
      case 'auth/invalid-login-credentials':

        break;
      case 'auth/missing-password':

        break;

      //registarse
      case 'auth/email-already-in-use':

        break;
      case 'auth/weak-password':

        break;
      case 'auth/internal-error':

        break;

      default:
        'error desconocido';
        break;
    }
  }
}
