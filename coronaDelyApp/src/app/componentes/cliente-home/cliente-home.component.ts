import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { QrScannerService } from 'src/app/servicios/qrscanner.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/clases/usuario';
import { Estados } from 'src/app/clases/enums/estados';
import { Mesa } from 'src/app/clases/mesa';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { MesaService } from 'src/app/servicios/mesa.service';
import { TipoDeNotificacion } from 'src/app/clases/enums/tipo-de-notificacion';
import { DataService } from 'src/app/servicios/data.service';
import { Elementos } from 'src/app/clases/enums/elementos';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { first } from 'rxjs/operators';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Cliente } from 'src/app/clases/cliente';
import { ModalDetallePedidoPage } from 'src/app/pages/modal-detalle-pedido/modal-detalle-pedido.page';
import { ModalController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-cliente-home',
  templateUrl: './cliente-home.component.html',
  styleUrls: ['./cliente-home.component.scss'],
})
export class ClienteHomeComponent implements OnInit {

  @Input()usuario: Usuario;
  cliente:Cliente;
  tieneReserva:boolean;
  recepcionPedidoConfirmada:boolean;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionesService,
    private qrscannerService: QrScannerService,
    private mesaService: MesaService,
    private dataService: DataService,
    private pedidoService:PedidoService,
    private modalController:ModalController,
    public toastController: ToastController,
  ) {
    this.recepcionPedidoConfirmada = false;
    
  }

  ngOnInit(){
    console.log(this.usuario);
    this.cliente = <Cliente>this.usuario;
    console.log(this.cliente);
  }

  irAListaEspera() {
    this.usuarioService.setDocument(Elementos.ListaDeEspera, this.usuario.id.toString(),
       { 'id': this.usuario.id, 'date' : Date.now(), 'name': this.usuario.nombre
        + " " + this.usuario.apellido, 'dni' : this.usuario.dni? this.usuario.dni : '-'
       });
    this.dataService.setStatus(Elementos.Usuarios, this.usuario.id, Estados.enEspera)
      .then(() => {
      this.notificacionService.mostrarToast("Agregado a lista de espera", TipoDeNotificacion.warning, "top");
      this.usuarioService.getUserById(this.usuario.id)
         .subscribe(userData => { this.usuario=userData[0];
            console.log("El cliente " + this.usuario.nombre + 
            " " + this.usuario.apellido + " está esperando a ser atendido");
         })
      })
  }

  salirDeListaEspera() {
    this.usuarioService.deleteDocument('listaDeEspera', this.usuario.id.toString());
    this.usuarioService.updateUser('usuarios', this.usuario.id, { 'estado': 'sinAtender' }).then(() => {
    })
  }

  logout(){
    this.authService.logOut();
  }

  //QR para ir a lista de Espera
  scanQr() {
    console.log("dispositivo", this.qrscannerService.dispositivo)
    if(this.qrscannerService.dispositivo == "mobile"){
      this.qrscannerService.scanQr().then(response => {
        if (response == Elementos.ListaDeEspera) {
          this.irAListaEspera();
        }
      });
    }
    else{ // probando desde web siempre va a lista de espera
      console.log("para web, voy a lista de espera")
      this.irAListaEspera();
    }
  }
 //QR para seleccionar la mesa
  scanQRMesa(){
    // if(this.usuario.estado == Estados.puedeTomarMesa){
      if(this.qrscannerService.dispositivo == "mobile"){
        this.qrscannerService.scanQr().then(tableId => {
          
          //Diferentes respuestas segun el estado del cliente
          switch(this.usuario.estado) {
            case Estados.puedeTomarMesa:
              this.asignarMesa(tableId, this.usuario.id);
              break;
            case Estados.atendido:
              this.mostrarEstadoPedido();
              break;
          }
        });
      }
      else{
        switch(this.usuario.estado) {
          case Estados.puedeTomarMesa:
            this.asignarMesa("oZMjb6EkSIyZ9yXAEWXY", this.usuario.id);
            break;
          case Estados.atendido:
            this.mostrarEstadoPedido();
            break;
        }
        // paso el id de la mesa 1 para probar en web
        // this.asignarMesa("oZMjb6EkSIyZ9yXAEWXY", this.usuario.id);
      }
    // }
    // else {
    //   this.notificacionService.mostrarToast("Su solicitud aún no ha sido aprobada por el metre", TipoDeNotificacion.warning, "top");
    // } 
  }

  async asignarMesa(mesaId, usuarioId){
    
    //Recuperar la mesa escaneada
    let mesaActual = await this.mesaService.getTableById(mesaId).pipe(first()).toPromise();
    let cliente = <Cliente>this.usuario;
      
    //Comprobar el estado
    if (mesaActual.estado != Estados.disponible) {
      this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.numero} ${mesaActual.estado}`, "danger", "top");
    } else {
      this.dataService.setStatus(Elementos.Mesas, mesaId, Estados.ocupada);
      this.dataService.deleteDocument(Elementos.ListaDeEspera, usuarioId);
      var mesaService = { mesaId: mesaId, usuarioId: usuarioId };
      this.dataService.setData(Elementos.ServicioDeMesa, usuarioId, mesaService);

      //Guardar datos de mesa asignada en el cliente
      cliente.mesa = mesaActual;
      cliente.estado = Estados.atendido;
      this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
      
      this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.numero} asignada`, "success", "top");
    } 
  }

  ///El cliente confirma la recepción del pedido
  ///Cambia el estado del pedido
  confirmarRecepcion() {
     
    // Comprobar que el mozo indicó que el cliente recibió el pedido
    if(this.cliente.pedido.estado == Estados.entregado) {
      this.cliente.estado = Estados.atendido;
      this.cliente.pedido.estado = Estados.aceptadoPorCliente;
    
      //Actualizar el pedido en el cliente y en la lista pedidos
      this.usuarioService.updateUser('usuarios', this.cliente.id, this.cliente);
      this.pedidoService.updateOrder(this.cliente.pedido.id, this.cliente.pedido);
      
      this.recepcionPedidoConfirmada = true;
    }
    
  }

  mostrarEstadoPedido(){
    console.log('muestro el estado');
  }

  pedirCuenta(){ 
    this.mostrarModal(this.usuario);
  }

  async mostrarModal(cliente:Cliente) {
    const modal = await this.modalController.create({
      component: ModalDetallePedidoPage,
      componentProps: {
        pedido: cliente.pedido,
        perfil: cliente.perfil,
        cliente: cliente,
      }
    });
    return await modal.present();
  }

    ///Funciones que llaman al toast y al alert
    async mostrarToast(mensaje:string) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2000
      });
      toast.present();
    }
  
  
}
