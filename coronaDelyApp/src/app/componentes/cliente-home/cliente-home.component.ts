import { Component, OnInit, Input } from '@angular/core';
import { QrScannerService } from 'src/app/servicios/qrscanner.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Estados } from 'src/app/clases/enums/estados';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { MesaService } from 'src/app/servicios/mesa.service';
import { TipoDeNotificacion } from 'src/app/clases/enums/tipo-de-notificacion';
import { DataService } from 'src/app/servicios/data.service';
import { Elementos } from 'src/app/clases/enums/elementos';
import { first } from 'rxjs/operators';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { Cliente } from 'src/app/clases/cliente';
import { ModalDetallePedidoPage } from 'src/app/pages/modal-detalle-pedido/modal-detalle-pedido.page';
import { ModalController, ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/clases/pedido';
import { ServicioDeMesaService } from 'src/app/servicios/servicio-de-mesa.service';
import { Router } from '@angular/router';
import { ModalDetalleReservaPage } from 'src/app/pages/modal-detalle-reserva/modal-detalle-reserva.page';
import { ToastService } from 'src/app/servicios/toast.service';



@Component({
  selector: 'app-cliente-home',
  templateUrl: './cliente-home.component.html',
  styleUrls: ['./cliente-home.component.scss'],
})
export class ClienteHomeComponent implements OnInit {

  @Input()usuario;
  cliente:Cliente;
  tieneReserva:boolean;
  
  listaPedidos:Pedido[];
  listaParaMostrar:Pedido[];
  filtro:string;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionesService,
    private qrscannerService: QrScannerService,
    private mesaService: MesaService,
    private dataService: DataService,
    private servicioDeMesaService: ServicioDeMesaService,
    private pedidoService:PedidoService,
    private modalController:ModalController,
    public toastController: ToastController,
    private toastService: ToastService,
  ) {

  }

  ngOnInit(){
    this.pedidoService.getAllOrders().subscribe(pedidos => {
      this.listaPedidos = pedidos;      
    });

    //A ver si funciona
    this.usuarioService.getUser(this.usuario.id).subscribe( usuario => {
      this.cliente = <Cliente>usuario;
    })   
  }

  filtrarPedidos(tableId,clienteId) {
      
      this.listaParaMostrar = this.listaPedidos.filter(pedido => (pedido.idCliente == clienteId) && (pedido.mesa.id==tableId));
      if (this.listaParaMostrar.length>0){
          
          this.mostrarModal(this.cliente);
      }
      else {
        
      }
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
    if(this.qrscannerService.dispositivo == "mobile"){
      this.qrscannerService.scanQr().then(response => {
        if (response == Elementos.ListaDeEspera) {
          this.irAListaEspera();
          this.toastService.mostrarToast('En lista de espera. Se le asignará una mesa pronto', 'success');
        } else {
          this.toastService.mostrarToast('Código QR incorrecto', 'danger');
        }
      });
    }
    else{ // probando desde web siempre va a lista de espera
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
              this.mostrarEstadoPedido(tableId,this.usuario.id);
              break;            
          }
        });
      }
      else{
        let tableId="CDbZryvuVqHpiHm3EzgB"; //MESA1
        let clienteId="7jZ8daCBSgVDPxMSdZdDezHqaMZ2";
        switch(this.usuario.estado) {
          case Estados.puedeTomarMesa:
            this.asignarMesa(tableId, this.usuario.id);
            break;
          case Estados.atendido: //usuario ptorrealba.utn@gmail.com
            this.mostrarEstadoPedido(tableId,clienteId );
            break;
        }
      }
  }

  async asignarMesa(mesaId, usuarioId){
    
    //Recuperar la mesa escaneada
    let mesaActual = await this.mesaService.getTableById(mesaId).pipe(first()).toPromise();
    let cliente = <Cliente>this.usuario;
      
    //Comprobar el estado
    if (mesaActual.estado != Estados.disponible || mesaActual.id != cliente.mesaAsignada) {
      if(mesaActual.id != cliente.mesaAsignada){
        this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.numero} no es su mesa asignada`, "danger", "top");
      } else {
        this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.numero} ${mesaActual.estado}`, "danger", "top");
      }
      
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

    let cliente = <Cliente>this.usuario;
     
    // Comprobar que el mozo indicó que el cliente recibió el pedido
    if(cliente.pedido.estado == Estados.entregado) {
      cliente.estado = Estados.atendido;
      cliente.pedido.estado = Estados.aceptadoPorCliente;
    
      //Actualizar el pedido en el cliente y en la lista pedidos
      this.usuarioService.updateUser('usuarios', cliente.id, cliente);
      this.pedidoService.updateOrder(cliente.pedido.id, cliente.pedido);

      this.mostrarToast("Pedido confirmado");
    }
    
  }

  mostrarEstadoPedido(tableId,clienteId){

    this.mostrarModal(this.usuario);
<<<<<<< HEAD
=======
    
>>>>>>> f26873462243ab2b37ca4c781ea622856865a68e
  }

  async verificarMesa(tableId,clienteId){
      let mesaCliente= await this.servicioDeMesaService.getServicioDeMesaById(clienteId).pipe(first()).toPromise();
      if (mesaCliente != undefined && mesaCliente.mesaId==tableId){
        this.filtrarPedidos(tableId,clienteId);
      }
      else {
        let mesa = await this.mesaService.getTableById(tableId).pipe(first()).toPromise();
        this.mostrarToast(`Mesa N.° ${mesa.numero} no corresponde al cliente`);
      }
   
  }

  pedirCuenta(){ 
    this.mostrarModal(this.usuario);
  }

  consultarReserva(){
    let cliente = <Cliente>this.usuario;

    this.mostrarModalReserva(cliente);
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

  async mostrarModalReserva(cliente:Cliente) {
    const modal = await this.modalController.create({
      component: ModalDetalleReservaPage,
      componentProps: {
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
