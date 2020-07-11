import { Component, OnInit } from '@angular/core';
import { Elementos } from 'src/app/clases/enums/elementos';
import { Estados } from 'src/app/clases/enums/estados';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { ModalController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { MesaService } from 'src/app/servicios/mesa.service';
import { Cliente } from 'src/app/clases/cliente';
import { Pedido } from 'src/app/clases/pedido';

@Component({
  selector: 'app-modal-pedido-cliente',
  templateUrl: './modal-pedido-cliente.page.html',
  styleUrls: ['./modal-pedido-cliente.page.scss'],
})
export class ModalPedidoClientePage implements OnInit {

  perfil:string;
  cliente:Cliente;
  pedido:Pedido;
  total:number;
  gradoSatisfaccion:number;
  mostrarTotal:boolean;

  constructor(
    private modalController:ModalController,
    private pedidoService:PedidoService,
    private usuarioService:UsuarioService,
    private toastController: ToastController,
  ) {
    this.gradoSatisfaccion = 0;
    this.mostrarTotal = false;
    
   }

  ngOnInit() {
    this.total = this.pedido.precioTotal;
  }
  

  async pagarPedido() {
    this.cliente.estado = Estados.pagando;
    this.cliente.pedido.estado = Estados.confirmarPago;

    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);
    await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);

    this.mostrarToast('Pagando... Esperando la confirmación del mozo.');

    this.cerrarModal();
  }

 
  async cerrarModal() {
    await this.modalController.dismiss();
  }

  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  calcularTotal() {

    this.mostrarTotal = true;
    this.total = this.pedido.precioTotal + this.gradoSatisfaccion;

    this.cliente.pedido.propina = this.gradoSatisfaccion;
    this.cliente.pedido.precioTotal = this.total;

  }

}
