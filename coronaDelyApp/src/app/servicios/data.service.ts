import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take} from "rxjs/operators";
import { Usuario } from '../clases/usuario';
import { Mesa } from '../clases/mesa';
import { Producto } from '../clases/producto';
import { Pedido } from '../clases/pedido';
import { Encuesta } from '../clases/encuesta';
import { Consulta } from '../clases/consulta';
import { Dispositivo } from '../clases/dispositivo';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore) { }

  getAll(collection):Observable<any[]>{
    return this.db.collection(collection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          
          const id = a.payload.doc.id;
          
          return { id, ...(data as any) } ;
        });
      })
    );
  }
  setStatus(collection, id, status){
    return this.update(collection, id, { 'estado': status });
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

  getOne(collection:string, id:string): Observable<any> {
    return this.db.collection(collection).doc<any>(id).valueChanges().pipe(
      take(1),
      map(element => {
        element.id = id;
        return element
      })
    );
  }

  //Traer un usuario
  getOneUsuario(collection, id){
      return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
        return res.map(i => {
          let data = i.payload.doc.data() as Usuario;
          if (id==i.payload.doc.id){
            data.id = i.payload.doc.id;
            console.log("data", data)
          }
          return data;
        })
      })); 
    
  }

  //Traer una mesa
  getOneMesa(collection, id){
        return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
          return res.map(i => {
            let data = i.payload.doc.data() as Mesa;
            if (id==i.payload.doc.id){
              data.id = i.payload.doc.id;
              console.log("data", data)
            }
            return data;
          })
        })); 

    }

    //Traer un producto
  getOneProducto(collection, id){
    return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
      return res.map(i => {
        let data = i.payload.doc.data() as Producto;
        if (id==i.payload.doc.id){
          data.id = i.payload.doc.id;
          console.log("data", data)
        }
        return data;
      })
    })); 

  }


  //Traer un pedido
  getOnePedido(collection, id){
    return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
      return res.map(i => {
        let data = i.payload.doc.data() as Pedido;
        if (id==i.payload.doc.id){
          data.id = i.payload.doc.id;
          console.log("data", data)
        }
        return data;
      })
    })); 
  }

  //Traer una encuesta
  getOneEncuesta(collection, id){
    return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
      return res.map(i => {
        let data = i.payload.doc.data() as Encuesta;
        if (id==i.payload.doc.id){
          data.id = i.payload.doc.id;
          console.log("data", data)
        }
        return data;
      })
    })); 
  }
  getOneDispositivo(collection, id){
    return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
      return res.map(i => {
        let data = i.payload.doc.data() as Dispositivo;
        if (id==i.payload.doc.id){
          data.id = i.payload.doc.id;
          console.log("data", data)
        }
        return data;
      })
    })); 
  }

  getOneConsulta(collection, id){
    return this.db.collection(collection).snapshotChanges().pipe(map(res =>{
      return res.map(i => {
        let data = i.payload.doc.data() as Consulta;
        if (id==i.payload.doc.id){
          data.id = i.payload.doc.id;
          console.log("data", data)
        }
        return data;
      })
    })); 
  }

  setData(collection, id, data){
    return this.db.collection(collection).doc(id).set(Object.assign({}, data));
  }
 
}
