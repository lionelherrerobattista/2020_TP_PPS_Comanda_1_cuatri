import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Producto } from 'src/app/clases/producto';
import { Pedido } from 'src/app/clases/pedido';
import { Mesa } from 'src/app/clases/mesa';
import { Cliente } from 'src/app/clases/cliente';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Elementos } from 'src/app/clases/enums/elementos';

@Component({
  selector: 'app-modal-menu-detalle',
  templateUrl: './modal-menu-detalle.page.html',
  styleUrls: ['./modal-menu-detalle.page.scss'],
})
export class ModalMenuDetallePage implements OnInit {

  @Input()productos:Producto[];
  @Input()mesa: Mesa;
  @Input()cliente:Cliente;
  total:number;

  constructor(
    private toastController: ToastController,
    private modalController:ModalController,
    private pedidoService:PedidoService,
    private usuarioService:UsuarioService,
  ) {
    this.total = 0;
   }

  ngOnInit() {

    for(let auxProducto of this.productos) {

      this.total += (auxProducto.precio * auxProducto.cantidad);

    }
  }

  ///Guarda el pedido en Firebase
  async crearPedido() {

    let pedido:Pedido = new Pedido(this.productos, this.cliente.id, this.mesa);
    this.cliente.pedido = Object.assign({}, pedido);
    
    
    await this.pedidoService.createPedido(pedido);
    
    delete this.cliente.pedido.mesa;//Para no guardar dos veces el mismo dato
    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);

    this.mostrarToast('Se creó la orden del pedido');

    this.cerrarModal();

  }

  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }


}
