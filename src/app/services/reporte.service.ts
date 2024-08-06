import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  constructor(private firestore: AngularFirestore) {}

  getReporte(): Observable<any> {
    return this.firestore.collection('reporte').snapshotChanges();
  }

  addReporte(imagen: any) {
    return this.firestore.collection('reporte').add(imagen);
  }
  delete(id: string): Promise<any> {
    return this.firestore.collection('reporte').doc(id).delete();
  }
}
