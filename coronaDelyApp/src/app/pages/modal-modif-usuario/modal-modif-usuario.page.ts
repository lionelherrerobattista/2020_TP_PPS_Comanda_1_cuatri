import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ModalController } from '@ionic/angular';


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
  ) { }

  ngOnInit() {
  }

  async actualizarUsuario(usuario) {

    //Revisar la modificación de la pass y del email
    await this.usuarioService.updateUser('usuarios', this.usuario.id, this.usuario);

    this.cerrarModal();

  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }


}
