import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map} from "rxjs/operators";
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Usuario } from '../clases/usuario';
import { Elementos } from '../clases/enums/elementos';
import { Encuesta } from '../clases/encuesta';


@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private dataService: DataService,
  ) { }


  saveEncuesta(encuesta) {    
    this.db.collection('encuestas').doc(encuesta.id).set(Object.assign({}, encuesta));
  }

  createEncuesta(encuesta:Encuesta) {
    
    return this.db.collection('encuestas').add({...encuesta});
  }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }

  getUserById(encuestaId) {
    return this.db.collection<Encuesta>('encuestas', (ref) =>  ref.where ('id', '==', encuestaId).limit(1)). valueChanges();   
  }

  getEncuesta(encuestaId) {
    return this.dataService.getOneEncuesta(Elementos.Encuestas, encuestaId);
  }

  getAllEncuestas(collection): Observable<Encuesta[]> {
    return this.dataService.getAll(collection);
  }

  updateEncuesta(collection: string, id: string, object: any) {
     //Paso clase a object de Javascript para que guarde en Firebase
    return this.dataService.update(collection, id, Object.assign({},object));
  }

  deleteDocument(collection:string, encuesta: any) {
    return this.dataService.deleteDocument(collection, encuesta.id);
  }
  
}
