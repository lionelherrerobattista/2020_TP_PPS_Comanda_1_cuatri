import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Cliente } from 'src/app/clases/cliente';
import { Usuario } from 'src/app/clases/usuario';
import { Estados } from 'src/app/clases/enums/estados';
import { Perfiles } from 'src/app/clases/enums/perfiles';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  public pedido: Pedido;
  public pedidoTomado: boolean = false;
  idUsuario:string;
  usuario:Usuario;

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private usuarioService:UsuarioService,
  ) { 
    console.log("pedido-page")
  }

  ngOnInit() {
    this.idUsuario = this.activatedRoute.snapshot.paramMap.get('idUsuario');
    this.getUsuario();
  }

   ///Recupera el usuario actual de la base de datos
  async getUsuario(){
    this.usuarioService.getUser(this.idUsuario)
      .subscribe(usuario => {
        this.usuario = usuario;
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
  inicio(){
    if(this.usuario.perfil == Perfiles.clienteAnonimo) {
      this.router.navigate([`/home`, this.usuario.id]);  
    } else {
      this.router.navigate([`/home`]);
    }
    
  }

}
