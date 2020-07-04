import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { Mesa } from '../clases/mesa';

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

  
  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }
  
  getAllTables(collection){
    return this.dataService.getAll(collection);
  }
  
  updateTable(collection: string, id: string, tipo: string) {
    return this.dataService.update(collection, id, tipo);
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
