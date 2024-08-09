import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private firestore: AngularFirestore) {}

  getPost(): Observable<any> {
    return this.firestore
      .collection('publicar', (ref) => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges();
  }
  getPostByPage(limit: number, offset: any): Observable<any> {
    let query: QueryFn = (ref) => ref.orderBy('timestamp', 'desc').limit(limit);

    if (offset) {
      query = (ref) =>
        ref.orderBy('timestamp', 'desc').startAfter(offset).limit(limit);
    }

    return this.firestore.collection('publicar', query).snapshotChanges();
  }

  update(videoId: string, data: any) {
    return this.firestore.collection('publicar').doc(videoId).update(data);
  }
  addPost(imagen: any) {
    return this.firestore.collection('publicar').add(imagen);
  }
  delete(id: string): Promise<any> {
    return this.firestore.collection('publicar').doc(id).delete();
  }
}
