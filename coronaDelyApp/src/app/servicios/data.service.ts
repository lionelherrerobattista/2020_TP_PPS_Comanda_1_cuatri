import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map} from "rxjs/operators";
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore) { }

  getAll(collection):Observable<DocumentChangeAction<any>[]>{
    return this.db.collection(collection).snapshotChanges();
  }

  update(collection: string, id:string, objeto:any) {
    return this.db.doc<any>(`${collection}/${id}`).update(objeto);
  }

  deleteDocument(collection: string, id: string) {
    return this.db.doc<any>(`${collection}/${id}`).delete();
  }

  add(collection, object){
    return this.db.collection(collection).add(Object.assign({}, object));
  }


    getOne(collection,id){
    return this.db.collection(collection).doc(id).get().toPromise();   
    // return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
    //   return res.map(i => {
    //     let data = i.payload.doc.data() as Usuario;
    //     if (id==i.payload.doc.id){
    //        data.uid = i.payload.doc.id;
    //        console.log("data", data)
    //     }
    //     return data;
    //   })
    // })); 
  }
 
}
