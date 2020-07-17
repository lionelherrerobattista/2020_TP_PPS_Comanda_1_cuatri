import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalModifUsuarioPage } from 'src/app/pages/modal-modif-usuario/modal-modif-usuario.page';
import { Estados } from 'src/app/clases/enums/estados';
import { MesaService } from 'src/app/servicios/mesa.service';
import { Mesa } from 'src/app/clases/mesa';
import { EstadoReserva } from 'src/app/clases/reserva';
import { Elementos } from 'src/app/clases/enums/elementos';


@Component({
  selector: 'app-metre-lista-espera',
  templateUrl: './metre-lista-espera.component.html',
  styleUrls: ['./metre-lista-espera.component.scss'],
})
export class MetreListaEsperaComponent implements OnInit {

  listaClientes:Usuario[];
  listaMesas:Mesa[];
  filtro:string;
  filtroMesa:string;
  aceptacion: boolean;
  
  clienteEstadoAux:Estados;
  clienteIdAux:string;
  clienteAux:Usuario;

  constructor(
    private usuarioService:UsuarioService,
    private mesasService: MesaService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController
  ) { 
    this.listaClientes = [];
    this.listaMesas=[];
    this.aceptacion=false;
    this.filtro = 'clientes';
    
    
  }

  ngOnInit() {
    let horaActual;
    let mesaReservada:boolean;

    this.usuarioService.getUsuariosFiltrados(this.filtro).subscribe( usuarios => {
      this.listaClientes = usuarios.filter(cliente => cliente.estado == Estados.enEspera);
      
    });

    this.mesasService.getAllTables(Elementos.Mesas).subscribe(mesas => {     

      horaActual = Math.round(new Date().getTime()/1000) //en segundos Unix para comparar
      this.listaMesas = [];
      
      //Comprobar que la mesa no esté reservada
      //Si está reservada marcar "ocupada" 40 min antes
      for(let mesa of mesas){
        mesaReservada= false;
        
        if(mesa.estado == Estados.disponible) {
          for(let reserva of mesa.reservas) {
                     
            if(reserva.estado == EstadoReserva.confirmada &&
              ( horaActual >= ( reserva.fecha.seconds - 2400) //40 min antes de la reserva
               && horaActual <= (reserva.fecha.seconds + 2400))) { //y 40 min despues
              console.log("hay reserva");
              mesa.estado = Estados.ocupada;
              mesaReservada=true;
              break;
            }
          }
        }
        
        if(mesaReservada) {
          this.mesasService.updateTable(Elementos.Mesas, mesa.id, mesa);
        } else {
          this.listaMesas.push(mesa);
        }
      }
    });
    
  }

  ///Modifica el estado del cliente para que pueda tomar una mesa
  aceptarCliente(cliente:Usuario) {
    console.log("aceptar cliente")
    this.clienteAux=cliente;
    cliente.estado = Estados.puedeTomarMesa ;
    this.clienteAux.estado=cliente.estado;
    this.clienteAux.id=cliente.id;

    //Asignar mesa al cliente
    this.aceptacion=true;


  }
  asignarMesa(mesa:Mesa) {
    this.clienteAux.estado = Estados.puedeTomarMesa ;
    this.clienteAux.mesaAsignada = mesa.id;
    this.usuarioService.updateUser('usuarios', this.clienteAux.id, this.clienteAux);
    
    
    this.mesasService.updateTable('mesas',mesa.id,mesa);
    this.mostrarToast("El cliente puede tomar una mesa");
  }

  async rechazarCliente(cliente:Usuario) {

    let resultado;
    //Configurar el alert
    const alert = await this.alertController.create({
      header: 'Rechazar cliente',
      message: '¿Está seguro que desea rechazar a este cliente?',    
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirmar',
          cssClass: '.danger-alert-btn',
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();

    //Verificar el role del botón presionado
    if(resultado.role == 'confirmar') {
      cliente.estado = Estados.rechazado;
      this.usuarioService.updateUser('usuarios', cliente.id, cliente);
      this.mostrarToast('Cliente rechazado');
    } else {
      this.mostrarToast('El cliente continúa en la lista de espera');
    }
  }

  

  ///Funciones que llaman al toast y al modal
  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async mostrarModal(datos) {
    const modal = await this.modalController.create({
      component: ModalModifUsuarioPage,
      componentProps: {
        usuario: datos,
      }
    });

    return await modal.present();
  }

  

}
