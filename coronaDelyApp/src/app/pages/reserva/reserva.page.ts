import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Reserva } from 'src/app/clases/reserva';
import { NgForm } from '@angular/forms';
import { ReservaService } from 'src/app/servicios/reserva.service';
import { Elementos } from 'src/app/clases/enums/elementos';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  reserva: Reserva = new Reserva();
  form: NgForm;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private reservaService:ReservaService

  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.reserva.clientId = this.authService.getCurrentUser().uid;
    this.reserva.fecha = new Date(this.reserva.fecha).valueOf();
    this.loadingService.showLoading("Guardando Reserva...");
    // AGREGAR DATOS DEL CLIENTE: NOMBRE, CLIENTEID
    // verificar si hay mesas disponibles en la fecha y hora seleccionadas
    this.reservaService.setDocument(Elementos.Reserva, this.reserva.clientId.toString(),
    { 'id': this.reserva.clientId, 'fecha' : this.reserva.fecha   });
    this.loadingService.closeLoading();
  }
}
