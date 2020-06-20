import { Injectable } from '@angular/core';
import { Elementos } from '../clases/enums/Elementos';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos = Elementos.Pedidos;

  constructor(
    private dataService: DataService
  ) { }

  saveOrder(id, pedido){
    return this.dataService.setData(this.pedidos, id, pedido);
  }

  getAllOrders(){
    return this.dataService.getAll(this.pedidos);
  }

  updateOrder(id, pedido){
    this.dataService.update(this.pedidos, id, pedido);
  }

  getOrderById(id){
    return this.dataService.getOnePedido(this.pedidos, id);
  }
}