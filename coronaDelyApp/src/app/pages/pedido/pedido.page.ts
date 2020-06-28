import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public pedido: Pedido;
  public pedidoTomado: boolean = false;

  constructor(
    private router:Router
  ) { 
    console.log("pedido-page")
  }

  ngOnInit() {
  }

  consultarMenu() {
    this.router
  }

  setMenuPedido(pedido) {
    this.pedido = pedido;
    this.pedidoTomado = true;
  }

  clearComponent() {
    this.pedido = undefined;
    this.pedidoTomado = false;
  }

}
