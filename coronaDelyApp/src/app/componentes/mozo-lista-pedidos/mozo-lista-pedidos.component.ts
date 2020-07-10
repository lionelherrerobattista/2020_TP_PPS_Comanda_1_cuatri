import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Estados } from 'src/app/clases/enums/estados';
import { ToastController, ModalController } from '@ionic/angular';
import { ModalMenuDetallePage } from 'src/app/pages/modal-menu-detalle/modal-menu-detalle.page';
import { ModalDetallePedidoPage } from 'src/app/pages/modal-detalle-pedido/modal-detalle-pedido.page';
import { Perfiles } from 'src/app/clases/enums/perfiles';

@Component({
  selector: 'app-mozo-lista-pedidos',
  templateUrl: './mozo-lista-pedidos.component.html',
  styleUrls: ['./mozo-lista-pedidos.component.scss'],
})
export class MozoListaPedidosComponent implements OnInit {

  listaPedidos:Pedido[];
  listaParaMostrar:Pedido[];
  filtro:string;

  constructor(
    private pedidoService:PedidoService,
    public toastController: ToastController,
    private modalController:ModalController,
  ) { 
    this.listaParaMostrar = [];
  }

  ngOnInit() {
    this.pedidoService.getAllOrders().subscribe(pedidos => {
      this.listaPedidos = pedidos;
      this.listaParaMostrar = this.listaPedidos;
      this.listaParaMostrar.sort(this.comparar);
    });
  }

  
  comparar(a, b) {
    //ordeno de mayor a menor
    if (a.horaPedido > b.horaPedido) return -1; 
    if (b.horaPedido > a.horaPedido) return 1; //Cambio de lugar
  
    return 0;
  }

  filtrarPedidos(filtro) {
    console.log(this.filtro);
    if(this.filtro == "todos") {
      this.listaParaMostrar = this.listaPedidos;
    } else {
      this.listaParaMostrar = this.listaPedidos.filter(pedido => pedido.estado == this.filtro);
    }   
    this.listaParaMostrar.sort(this.comparar);
  }

  servir(pedido:Pedido){

    if(pedido.estado == Estados.enPreparacion){
      this.mostrarToast('El pedido todavía no está listo.');      
    } else {
      this.mostrarModal(pedido);
    }
  }

  ///Funciones que llaman al toast y al alert
  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async mostrarModal(pedido) {
    const modal = await this.modalController.create({
      component: ModalDetallePedidoPage,
      componentProps: {
        pedido: pedido,
        perfil: Perfiles.mozo,
      }
    });
    return await modal.present();
  }
  
  
}
