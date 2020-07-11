import { Injectable } from '@angular/core';
import { Elementos } from '../clases/enums/elementos';
import { DataService } from './data.service';
import { ServicioDeMesa } from '../clases/servicio-de-mesa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeMesaService {
  private servicioDeMesa = Elementos.ServicioDeMesa;

  constructor(
    private dataService: DataService
  ) { }

  createServicioDeMesa(servicioDeMesa:ServicioDeMesa) {
    this.dataService.add('servicioDeMesa', Object.assign({},servicioDeMesa));
  }

  saveServicioDeMesa(id, servicioDeMesa){
    return this.dataService.setData(this.servicioDeMesa, id, servicioDeMesa);
  }

  getAllServicioDeMesa():Observable<ServicioDeMesa[]>{
    return this.dataService.getAll(this.servicioDeMesa);
  }

  updateServicioDeMesa(id, object:ServicioDeMesa){
    this.dataService.update(this.servicioDeMesa, id, Object.assign({},object));
  }

  // EL ID ES EL ID DEL USUARIO/CLIENTE
  getServicioDeMesaById(id){
    return this.dataService.getOne(this.servicioDeMesa, id);
  }
}