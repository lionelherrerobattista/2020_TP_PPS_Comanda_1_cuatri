import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Reserva } from 'src/app/clases/reserva';
import { NgForm } from '@angular/forms';

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

  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.reserva);

    this.reserva.clientId = this.authService.getCurrentUser().uid;
    this.reserva.fecha = new Date(this.reserva.fecha).valueOf();
    console.log(this.reserva);
    // agregar logica de guardado
    this.loadingService.showLoading("Guardando Reserva...");
    this.loadingService.closeLoading();
  }
}
