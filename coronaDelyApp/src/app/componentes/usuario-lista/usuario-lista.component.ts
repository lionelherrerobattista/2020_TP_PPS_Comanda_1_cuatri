import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalModifUsuarioPage } from 'src/app/pages/modal-modif-usuario/modal-modif-usuario.page';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.scss'],
})
export class UsuarioListaComponent implements OnInit {

  listaUsuarios:Usuario[];
  filtro:string;

  constructor(
    private usuarioService:UsuarioService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) { 
    this.listaUsuarios = [];
    this.filtro = 'empleados';
  }

  ngOnInit() {
    this.usuarioService.getUsuariosFiltrados(this.filtro).subscribe( usuarios => {
      this.listaUsuarios = usuarios;
      console.log(usuarios);
    })
  }

  filtrarLista() {
    this.usuarioService.getUsuariosFiltrados(this.filtro).subscribe( empleadosFiltrados => {
      console.log(empleadosFiltrados)
      this.listaUsuarios = empleadosFiltrados;
    })
  }

  modificarUsuario(usuario) {
    this.mostrarModal(usuario);
  }

  async eliminarUsuario(usuario:Usuario) {

    let resultado;
    //Configurar el alert
    const alert = await this.alertController.create({
      header: 'Eliminar usuario',
      message: '¿Está seguro que desea eliminar a este usuario?',    
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
            this.usuarioService.deleteDocument('usuarios', usuario);
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
