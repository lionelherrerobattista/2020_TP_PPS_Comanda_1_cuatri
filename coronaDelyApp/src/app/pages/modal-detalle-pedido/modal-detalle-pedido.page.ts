import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/clases/pedido';
import { Estados } from 'src/app/clases/enums/estados';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Usuario } from 'src/app/clases/usuario';
import { Cliente } from 'src/app/clases/cliente';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Elementos } from 'src/app/clases/enums/elementos';
import { first } from 'rxjs/operators';
import { MesaService } from 'src/app/servicios/mesa.service';

@Component({
  selector: 'app-modal-detalle-pedido',
  templateUrl: './modal-detalle-pedido.page.html',
  styleUrls: ['./modal-detalle-pedido.page.scss'],
})
export class ModalDetallePedidoPage implements OnInit {

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
    private mesaService: MesaService,
  ) {
    this.gradoSatisfaccion = 0;
    this.mostrarTotal = false;
    
   }

  ngOnInit() {
    this.total = this.pedido.precioTotal;
  }

  async entregarPedido() {
    this.cliente = await this.usuarioService.getUser(this.pedido.idCliente).pipe(first()).toPromise();
    this.cliente.pedido.estado = Estados.entregado;
    this.cliente.estado = Estados.paraConfirmarPedido;

    await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);
    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);

    this.mostrarToast('Pedido entregado. Esperando que el cliente lo acepte...');

    this.cerrarModal();
  }

  async pagarPedido() {
    this.cliente.estado = Estados.pagando;
    this.cliente.pedido.estado = Estados.confirmarPago;

    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);
    await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);

    this.mostrarToast('Pagando... Esperando la confirmación del mozo.');

    this.cerrarModal();
  }

  async confirmarPago() {
    this.cliente = await this.usuarioService.getUser(this.pedido.idCliente).pipe(first()).toPromise();
    this.cliente.estado = Estados.finalizado;
    this.cliente.mesa.estado = Estados.disponible;
    this.cliente.pedido.estado = Estados.abonado;

    await this.mesaService.updateTable(Elementos.Mesas, this.cliente.mesa.id, this.cliente.mesa);
    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);
    await this.pedidoService.updateOrder(this.pedido.id, this.cliente.pedido);

    this.mostrarToast('Confirmó el pago');

    this.cerrarModal();

  }

  async confirmarPedido(){

    console.log(this.cliente.pedido.estado);
      
    // Comprobar que el mozo indicó que el cliente recibió el pedido
    if(this.cliente.pedido.estado == Estados.entregado) {
      this.cliente.estado = Estados.atendido;
      this.cliente.pedido.estado = Estados.aceptadoPorCliente;
    
      //Actualizar el pedido en el cliente y en la lista pedidos
      await this.usuarioService.updateUser('usuarios', this.cliente.id, this.cliente);
      await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);

      this.mostrarToast('Confirmó el pedido');
    }

    
    
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

<<<<<<< HEAD
  async enviarAPreparacion(){
    this.cliente = await this.usuarioService.getUser(this.pedido.idCliente).pipe(first()).toPromise();
    this.cliente.pedido.estado = Estados.enPreparacion;

    await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);
    await this.usuarioService.updateUser(Elementos.Usuarios, this.cliente.id, this.cliente);

    this.mostrarToast('Pedido en preparación');
=======
  async confirmarPedido(){

    console.log(this.cliente.pedido.estado);

    // Comprobar que el mozo indicó que el cliente recibió el pedido
    if(this.cliente.pedido.estado == Estados.entregado) {
      this.cliente.estado = Estados.atendido;
      this.cliente.pedido.estado = Estados.aceptadoPorCliente;

      //Actualizar el pedido en el cliente y en la lista pedidos
      await this.usuarioService.updateUser('usuarios', this.cliente.id, this.cliente);
      await this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);

      this.mostrarToast('Confirmó el pedido');
    }


>>>>>>> f26873462243ab2b37ca4c781ea622856865a68e

    this.cerrarModal();
  }

}
