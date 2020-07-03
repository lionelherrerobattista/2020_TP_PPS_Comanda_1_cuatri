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

  constructor(
    private usuarioService:UsuarioService,
    private mesasService: MesaService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController
  ) { 
    this.listaClientes = [];
<<<<<<< HEAD
    this.listaMesas=[];
    this.filtro = 'cliente';
    this.filtroMesa = 'mesas';
    this.aceptacion=false;
=======
    this.filtro = 'clientes';
>>>>>>> 639b422bc16fe5f908bb17c3e7392bdf3d048811
  }

  ngOnInit() {
    this.usuarioService.getUsuariosFiltrados(this.filtro).subscribe( usuarios => {
      this.listaClientes = usuarios.filter(cliente => cliente.estado == Estados.enEspera);
      console.log(this.listaClientes);
    })
    this.mesasService.getAllTables(this.filtroMesa).subscribe(elementos => {     
     this.listaMesas = elementos.filter(mesa => mesa.estado == Estados.disponible);
     console.log(this.listaMesas);
    });
    //this.mesasService.getAllTables()
  }

  ///Modifica el estado del cliente para que pueda tomar una mesa
  aceptarCliente(cliente:Usuario) {
    cliente.estado = Estados.puedeTomarMesa ;
    this.usuarioService.updateUser('usuarios', cliente.id, cliente);
    this.mostrarToast("El cliente puede tomar una mesa");
    //Asignar mesa al cliente
    this.aceptacion=true;

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
