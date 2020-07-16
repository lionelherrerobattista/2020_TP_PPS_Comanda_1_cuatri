import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { UsuarioService } from './usuario.service';
import { MesaService } from './mesa.service';
import { Elementos } from '../clases/enums/elementos';
import { Reserva } from '../clases/reserva';
import { Usuario } from '../clases/usuario';
import { Mesa } from '../clases/mesa';
import { first } from 'rxjs/operators';
import { Cliente } from '../clases/cliente';


@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    private db: AngularFirestore,
    private usuarioService:UsuarioService,
    private mesaService:MesaService,
  ) { }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }

  async guardarReserva(reserva:Reserva){
    let cliente:Cliente;
    let mesa:Mesa;
    
    //Guardar en reservas
    reserva.id = this.db.createId();
    delete reserva.mesa.reservas;
    delete reserva.cliente.reserva;
    this.db.collection(Elementos.Reserva).doc(reserva.id).set(Object.assign({}, reserva))

    //Guardar en cliente
    cliente = <Cliente>await this.usuarioService.getUser(reserva.cliente.id).pipe(first()).toPromise();
    cliente.reserva = Object.assign({}, reserva);
    delete cliente.reserva.cliente
    this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
    
    //Guardar en mesa
    mesa = await this.mesaService.getTableById(reserva.mesa.id).pipe(first()).toPromise();
    delete reserva.mesa
    mesa.reservas.push(Object.assign({}, reserva));
    this.mesaService.updateTable(Elementos.Mesas, mesa.id, mesa);

  }
}
