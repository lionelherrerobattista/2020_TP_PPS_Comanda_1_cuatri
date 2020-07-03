import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Estados } from 'src/app/clases/enums/estados';
import { ToastController, ModalController } from '@ionic/angular';
import { ModalMenuDetallePage } from 'src/app/pages/modal-menu-detalle/modal-menu-detalle.page';
import { ModalDetallePedidoPage } from 'src/app/pages/modal-detalle-pedido/modal-detalle-pedido.page';

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
      this.listaPedidos = pedidos.filter(pedido => pedido.estado == Estados.enPreparacion || pedido.estado == Estados.listoParaEntregar);
      this.listaParaMostrar = this.listaPedidos;
    });
  }

  filtrarPedidos(filtro) {
    if(this.filtro == "todos") {
      this.listaParaMostrar = this.listaPedidos;
    } else {
      this.listaParaMostrar = this.listaPedidos.filter(pedido => pedido.estado == this.filtro);
    }
    
  }

  servir(pedido:Pedido){

    if(pedido.estado == Estados.listoParaEntregar){
      this.mostrarModal(pedido);
    } else {
      this.mostrarToast('El pedido todavía no está listo.');
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
      }
    });
    return await modal.present();
  }
  
  
}
