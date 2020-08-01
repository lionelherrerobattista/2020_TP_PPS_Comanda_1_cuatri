import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';
import { MesaService } from 'src/app/servicios/mesa.service';
import { ModalModifMesaPage } from 'src/app/pages/modal-modif-mesa/modal-modif-mesa.page';
import { Estados } from 'src/app/clases/enums/estados';
import { Elementos } from 'src/app/clases/enums/elementos';

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
    this.mesaService.getAllTables('mesas').subscribe(mesas => {
      this.comprobarEstadosDeMesas(mesas);
      this.listaMesas = mesas;
      console.log(this.listaMesas);
    });
  }

  filtrarLista() {

    if(this.filtro == 'mesas') {
      this.mesaService.getAllTables('mesas').subscribe(mesas => {
        this.comprobarEstadosDeMesas(mesas);
        this.listaMesas = mesas;
        console.log(this.listaMesas);
      });
    } else {
      this.mesaService.getMesasFiltrados(this.filtro).subscribe( mesasFiltrados => {
        this.comprobarEstadosDeMesas(mesasFiltrados);
        console.log(mesasFiltrados)
        this.listaMesas = mesasFiltrados;
      });
    }
    
  }

  modificarMesa(mesa) {
    this.mostrarModal(mesa);
  }

  comprobarEstadosDeMesas(mesas:Mesa[]) {

    let mesaReservada;

    for(let mesa of mesas){
      mesaReservada = false;
      
      //Comprobar que la mesa no esté reservada
      if(mesa.estado != Estados.ocupada){
        mesaReservada = Mesa.verificarReserva(mesa);
      }
      
      if(mesaReservada) {
        mesa.estado = Estados.reservada;
        this.mesaService.updateTable(Elementos.Mesas, mesa.id, mesa);
      } else if (mesa.estado != Estados.ocupada){
        
        if(mesa.estado == Estados.reservada)
        {
          //Pasó el tiempo de la reserva, libero la mesa
          mesa.estado = Estados.disponible;
          this.mesaService.updateTable(Elementos.Mesas, mesa.id, mesa);
        }
      }
    }
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
