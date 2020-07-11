import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Estados } from 'src/app/clases/enums/estados';
import { AuthService } from 'src/app/servicios/auth.service';


@Component({
  selector: 'app-modal-modif-usuario',
  templateUrl: './modal-modif-usuario.page.html',
  styleUrls: ['./modal-modif-usuario.page.scss'],
})
export class ModalModifUsuarioPage implements OnInit {

  @Input() usuario:Usuario;

  constructor(
    private usuarioService:UsuarioService,
    public modalController: ModalController,
    public toastController: ToastController,
    private authServie: AuthService,
  ) { }

  ngOnInit() {
  }

  async actualizarUsuario(usuario) {

    //Revisar la modificación de la pass y del email
    await this.usuarioService.updateUser('usuarios', this.usuario.id, this.usuario);

    this.cerrarModal();

  }

  async aprobarCliente(usuario) {

    this.usuario.estado = Estados.aprobado;

    //Revisar la modificación de la pass y del email
    await this.usuarioService.updateUser('usuarios', this.usuario.id, this.usuario);
    this.mostrarToast('Cliente aprobado');

    this.cerrarModal();

  }

  async cerrarModal() {
    await this.modalController.dismiss();
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
