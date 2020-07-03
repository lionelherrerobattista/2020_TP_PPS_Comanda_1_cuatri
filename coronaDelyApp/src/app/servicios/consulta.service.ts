import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Consulta } from '../clases/consulta';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(
    private dataService:DataService,
    private db: AngularFirestore,
  ) { }

  async createConsulta(consulta:Consulta){
    let id = this.db.createId();
    consulta.id = id;
    await this.db.collection<Consulta>('consultas').doc<Consulta>(id).set(Object.assign({}, consulta));

    return id;
  }


  updateConsulta(collection: string, id: string, object: any) {
    return this.dataService.update(collection, id, object);
  }

  getConsultas():Observable<Consulta[]>{
    return this.dataService.getAll('consultas');
  }

  getConsultaById(idConsulta) {
    return this.db.collection('consultas').doc<Consulta>(idConsulta).valueChanges();   
  }

  deleteconsulta(idConsulta){
    this.dataService.deleteDocument('consultas', idConsulta);
  }
}
