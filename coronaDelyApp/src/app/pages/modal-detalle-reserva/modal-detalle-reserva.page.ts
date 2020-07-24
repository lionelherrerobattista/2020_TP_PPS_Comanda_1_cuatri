import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Cliente } from 'src/app/clases/cliente';
import { EstadoReserva } from 'src/app/clases/reserva';
import { ReservaService } from 'src/app/servicios/reserva.service';

@Component({
  selector: 'app-modal-detalle-reserva',
  templateUrl: './modal-detalle-reserva.page.html',
  styleUrls: ['./modal-detalle-reserva.page.scss'],
})
export class ModalDetalleReservaPage implements OnInit {

  cliente:Cliente;

  constructor(
    private modalController:ModalController,
    private reservaService:ReservaService,
  ) { }

  ngOnInit() {
  }
  
  cancelarReserva(){
    this.cliente.reserva.estado = EstadoReserva.cancelada;

    this.reservaService.actualizarReserva(this.cliente.reserva);
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }


}
