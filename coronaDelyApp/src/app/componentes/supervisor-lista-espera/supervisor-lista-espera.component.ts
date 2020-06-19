import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalModifUsuarioPage } from 'src/app/pages/modal-modif-usuario/modal-modif-usuario.page';
import { Estados } from 'src/app/clases/enums/estados';

@Component({
  selector: 'app-supervisor-lista-espera',
  templateUrl: './supervisor-lista-espera.component.html',
  styleUrls: ['./supervisor-lista-espera.component.scss'],
})
export class SupervisorListaEsperaComponent implements OnInit {

  listaClientes:Usuario[];
  filtro:string;

  constructor(
    private usuarioService:UsuarioService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) { 
    this.listaClientes = [];
    this.filtro = 'cliente';
  }

  ngOnInit() {
    this.usuarioService.getUsuariosFiltrados(this.filtro).subscribe( usuarios => {
      this.listaClientes = usuarios.filter(cliente => cliente.estado == Estados.enEspera);
      console.log(this.listaClientes);
    })
  }

  aceptarCliente(cliente) {
    this.mostrarModal(cliente);
  }

  async rechazarCliente(cliente:Usuario) {

    let resultado;
    //Configurar el alert
    const alert = await this.alertController.create({
      header: 'Eliminar usuario',
      message: '¿Está seguro que desea rechazar a este cliente?',    
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            resultado = 'cancelado';
          }
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          cssClass: '.danger-alert-btn',
          handler: () => {
            this.usuarioService.deleteDocument('usuarios', cliente);
            resultado = 'eliminado';
          }
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();

    if(resultado == 'eliminado') {
      this.mostrarToast('Empleado eliminado')
    } else {
      console.log('cancelado');
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
