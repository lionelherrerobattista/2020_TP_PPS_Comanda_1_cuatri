import { Injectable } from '@angular/core';
import { Elementos } from '../clases/enums/elementos';
import { DataService } from './data.service';
import { Pedido } from '../clases/pedido';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos = Elementos.Pedidos;

  constructor(
    private dataService: DataService
  ) { }

  createPedido(pedido:Pedido) {
    this.dataService.add('pedidos', pedido);
  }

  saveOrder(id, pedido){
    return this.dataService.setData(this.pedidos, id, pedido);
  }

  getAllOrders():Observable<Pedido[]>{
    return this.dataService.getAll(this.pedidos);
  }

  updateOrder(id, pedido){
    this.dataService.update(this.pedidos, id, pedido);
  }

  getOrderById(id){
    return this.dataService.getOnePedido(this.pedidos, id);
  }
}