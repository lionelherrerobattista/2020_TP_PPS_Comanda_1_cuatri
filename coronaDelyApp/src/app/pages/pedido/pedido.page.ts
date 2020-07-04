import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Cliente } from 'src/app/clases/cliente';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public pedido: Pedido;
  public pedidoTomado: boolean = false;
  idCliente:string;
  cliente:Cliente;

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private usuarioService:UsuarioService,
  ) { 
    console.log("pedido-page")
  }

  ngOnInit() {
    this.idCliente = this.activatedRoute.snapshot.paramMap.get('idCliente');
    this.getUsuario();
  }

   ///Recupera el usuario actual de la base de datos
  async getUsuario(){
    this.usuarioService.getUser(this.idCliente)
      .subscribe(usuario => {
        this.cliente = <Cliente>usuario;
      }); 
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
