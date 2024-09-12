import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideosActivateService {
  constructor(private firestore: AngularFirestore) {}

  getactvid(): Observable<any> {
    return this.firestore
      .collection('videos-activate', (ref) => ref.orderBy('nombre', 'asc'))
      .snapshotChanges();
  }
  addActVideo(video: any) {
    return this.firestore.collection('videos-activate').add(video);
  }
  updateActVideo(vd: string, data: any) {
    return this.firestore.collection('videos-activate').doc(vd).update(data);
  }
}
