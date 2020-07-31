import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { Mesa } from '../clases/mesa';
import { map } from 'rxjs/operators';
import { Elementos } from '../clases/enums/elementos';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(
    private db: AngularFirestore,
    private dataService: DataService
  ) { }

  async saveTable(mesa){
    mesa.id=this.db.createId();   
    this.db.collection(Elementos.Mesas).doc(mesa.id).set(Object.assign({}, mesa))
  
  // saveTable(table){
  //   this.db.collection('mesas').doc(table.id).set(Object.assign({}, table));
    // return this.dataService.add('mesas', table);
    // return this.dataService.collection(tipo).add(Object.assign({}, item));
  }

  deleteDocument(collection:string, mesa: any) {
    return this.dataService.deleteDocument(collection, mesa.id);
  }

  ///Filtra la lista de usuarios de firebase
  getMesasFiltrados(filtro): Observable<Mesa[]> {
    return this.dataService.getAll('mesas')
      .pipe(
        map( mesas => mesas.filter(mesas => {
          
          let filtrar = false;         
          filtrar = mesas.estado == filtro; 
          return filtrar
        })
      )
    );
  }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }
  
  getAllTables(collection):Observable<Mesa[]>{
    return this.dataService.getAll(collection);
  }
  
  updateTable(collection: string, id: string, object: Mesa) {
    return this.dataService.update(collection, id, Object.assign({},object));
  }


  deleteTable(tableId){
    this.dataService.deleteDocument('mesas', tableId);
  }

  
  // getTableById(tableId){
  //   return this.dataService.getOneMesa('mesas', tableId);
  // }

  getTableById(tableId):Observable<Mesa>{
    return this.dataService.getOne('mesas', tableId);
  }
  
}
