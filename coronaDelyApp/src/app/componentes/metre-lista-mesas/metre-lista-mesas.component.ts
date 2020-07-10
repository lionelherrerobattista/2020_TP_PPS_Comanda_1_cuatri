import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';
import { MesaService } from 'src/app/servicios/mesa.service';
import { ModalModifMesaPage } from 'src/app/pages/modal-modif-mesa/modal-modif-mesa.page';

@Component({
  selector: 'app-metre-lista-mesas',
  templateUrl: './metre-lista-mesas.component.html',
  styleUrls: ['./metre-lista-mesas.component.scss'],
})
export class MetreListaMesasComponent implements OnInit {
  listaMesas:Mesa[];
  filtro:string;

  constructor(
    private mesaService:MesaService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) { 
    this.listaMesas = [];
    this.filtro = 'mesas';
  }

  ngOnInit() {
    this.mesaService.getMesasFiltrados(this.filtro).subscribe( mesas => {
      this.listaMesas = mesas;
      console.log(this.listaMesas);
    })
  }

  filtrarLista() {
    this.mesaService.getMesasFiltrados(this.filtro).subscribe( mesasFiltrados => {
      console.log(mesasFiltrados)
      this.listaMesas = mesasFiltrados;
    })
  }

  modificarMesa(mesa) {
    this.mostrarModal(mesa);
  }

  async eliminarMesa(mesa:Mesa) {

    let resultado;

    const alert = await this.alertController.create({
      header: 'Eliminar Mesa',
      message: '¿Está seguro que desea eliminar a este mesa?',    
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
            this.mesaService.deleteDocument('mesa', mesa);
            resultado = 'eliminado';
          }
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();

    if(resultado == 'eliminada') {
      this.mostrarToast('Mesa eliminada')
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
    if (datos.estado!='ocupada'){
      const modal = await this.modalController.create({
        component: ModalModifMesaPage,
        componentProps: {
          mesa: datos,
        }
      });
      return await modal.present();
    }
  }

}
