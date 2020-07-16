import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Reserva } from 'src/app/clases/reserva';
import { NgForm } from '@angular/forms';
import { ReservaService } from 'src/app/servicios/reserva.service';
import { Elementos } from 'src/app/clases/enums/elementos';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { Mesa } from 'src/app/clases/mesa';
import { MesaService } from 'src/app/servicios/mesa.service';
import { first } from 'rxjs/operators';
import { ToastService } from 'src/app/servicios/toast.service';
import { Cliente } from 'src/app/clases/cliente';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  usuario:Usuario;
  form: NgForm;
  diaMinimo:Date;
  diaMaximo:Date;
  fecha:string;
  cantidadComensales:number;

  constructor(
    private loadingService: LoadingService,
    private toastService:ToastService,
    private reservaService:ReservaService,
    private usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private mesaService:MesaService,

  ) { }

  ngOnInit() {

    //Configurar el calendario
    this.diaMinimo = new Date();
    this.diaMaximo = new Date();
    this.diaMaximo.setDate(this.diaMinimo.getDate() + 15);
    
    //Obtener objeto usuario
    this.activatedRoute.paramMap.subscribe(params => {
      let userId = params.get('idCliente');
  
      if(userId != null) {
        console.log(userId);
        this.usuarioService.getUser(userId)
          .subscribe(user => { 
            this.usuario=user;     
          });
      } 
    });
  }

  async reservarMesa() {
    let mesa:Mesa;
    let reserva:Reserva;
    let fechaReservada;
    let listaMesas:Mesa[];

    reserva = new Reserva();
    reserva.cliente = <Cliente>this.usuario;
    reserva.fecha = new Date(this.fecha).valueOf();
    reserva.cantidadComensales;
    this.loadingService.showLoading("Guardando Reserva...");
  
    // verificar si hay mesas disponibles en la fecha y hora seleccionadas
    listaMesas = await this.mesaService.getAllTables(Elementos.Mesas).pipe(first()).toPromise();

    for(let auxMesa of listaMesas) {
      fechaReservada = false;

      if(auxMesa.reservas.length > 0) {
        for(let auxReserva of auxMesa.reservas) {
          if( auxReserva.fecha == reserva.fecha) {
            fechaReservada=true;
            break;
          }
        }
      } else if(auxMesa.nroComensales < this.cantidadComensales) {
        fechaReservada=true;
      }

      if(!fechaReservada){
        mesa= auxMesa;
        break;
      }
    }

    if(fechaReservada) {
      this.toastService.mostrarToast("No hay mesas disponibles", "danger");
      console.error('No encontró mesa');
      this.loadingService.closeLoading();
    } else {
      reserva.mesa = mesa;
      this.reservaService.guardarReserva(reserva);
      this.loadingService.closeLoading();
      this.toastService.mostrarToast("Mesa reservada", "success");
    }
  }
}
