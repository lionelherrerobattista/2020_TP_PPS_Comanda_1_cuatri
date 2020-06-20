import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";


@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }
}
