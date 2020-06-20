import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {
   
  public pedido: any = {};
  public pedidoTomado: boolean = false;
  public rutaSeleccionada: boolean = false;

  constructor() {
    console.log("constructor1")
  }

  ngOnInit() {
  }

  setMenuPedido(pedido){
    console.log("setMenuPedido")
    this.pedido.precio = pedido.precio;
    this.pedido.menu = pedido.menu;
    this.pedidoTomado = true;
  }

  setTiempoPedido(ruta){
    console.log("setTiempoPedido")
    this.pedido.tiempo = ruta.tiempo;
    this.pedido.destino = ruta.destino;
    this.rutaSeleccionada = true;
    console.log(this.pedido);
  }
}