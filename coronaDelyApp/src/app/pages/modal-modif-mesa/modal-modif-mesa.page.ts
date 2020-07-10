import { Component, OnInit, Input } from '@angular/core';
import { Mesa } from 'src/app/clases/mesa';
import { MesaService } from 'src/app/servicios/mesa.service';
import { ToastController, ModalController } from '@ionic/angular';
import { Estados } from 'src/app/clases/enums/estados';

@Component({
  selector: 'app-modal-modif-mesa',
  templateUrl: './modal-modif-mesa.page.html',
  styleUrls: ['./modal-modif-mesa.page.scss'],
})
export class ModalModifMesaPage implements OnInit {

  @Input() mesa:Mesa;

  constructor(
    private mesaService:MesaService,
    public modalController: ModalController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async actualizarMesa(mesa) {
    console.log("actualizar mesa")
    await this.mesaService.updateTable('mesas', this.mesa.id, this.mesa);

    this.cerrarModal();

  }

  async aprobarCliente(usuario) {

    this.mesa.estado = Estados.aprobado;

    //Revisar la modificación de la pass y del email
    await this.mesaService.updateTable('usuarios', this.mesa.id, this.mesa);
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
