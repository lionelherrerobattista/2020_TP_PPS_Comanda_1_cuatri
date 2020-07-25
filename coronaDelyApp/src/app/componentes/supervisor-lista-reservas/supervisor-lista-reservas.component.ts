import { Component, OnInit } from '@angular/core';
import { Reserva, EstadoReserva } from 'src/app/clases/reserva';
import { ReservaService } from 'src/app/servicios/reserva.service';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-supervisor-lista-reservas',
  templateUrl: './supervisor-lista-reservas.component.html',
  styleUrls: ['./supervisor-lista-reservas.component.scss'],
})
export class SupervisorListaReservasComponent implements OnInit {

  listaReservas:Reserva[];

  constructor(
    private reservaService:ReservaService,
    private toastService:ToastService,
    public alertController: AlertController,
    
  ) { }

  ngOnInit() {
    this.reservaService.getReservas().subscribe(reservas => {
      //Mostrar solo reservas a confirmar
      this.listaReservas = reservas.filter(reserva => reserva.estado == EstadoReserva.aConfirmar);
    })
  }

  async aceptarReserva(reserva:Reserva){

    let resultado; 

    const alert = await this.alertController.create({
      header: 'Aceptar reserva',
      message: '¿Desea aceptar la reserva?',    
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
            reserva.estado = EstadoReserva.confirmada;
            this.reservaService.actualizarReserva(reserva);
            this.toastService.mostrarToast('Reserva aceptada', 'success');
          }
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();
    console.log(resultado);
  }

  async cancelarReserva(reserva){

    let resultado;
    //Configurar el alert
    const alert = await this.alertController.create({
      header: 'Eliminar reserva',
      message: '¿Está seguro que desea cancelar a esta reserva?',    
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
            reserva.estado = EstadoReserva.cancelada;
            this.reservaService.actualizarReserva(reserva);
            this.toastService.mostrarToast('Reserva cancelada', 'danger');
          }
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();

  }

}
