import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { Mesa } from '../clases/mesa';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(
    private db: AngularFirestore,
    private dataService: DataService
  ) { }

  saveTable(table){
    return this.dataService.add('mesas', table);
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
