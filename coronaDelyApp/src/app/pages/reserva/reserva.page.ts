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
  mesesAbreviados:string[];
  fecha:string;
  hora:string;
  cantidadComensales:number;
  esMismoDia:boolean;
  horasReservaDiaCorriente:string[];

  constructor(
    private loadingService: LoadingService,
    private toastService:ToastService,
    private reservaService:ReservaService,
    private usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private mesaService:MesaService,

  ) { 
    this.horasReservaDiaCorriente = [];
    this.mesesAbreviados = ["ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic"];
    this.esMismoDia = false;
  }

  ngOnInit() {

    //Configurar el calendario
    this.diaMinimo = new Date();
    this.diaMaximo = new Date();
    this.diaMaximo.setDate(this.diaMinimo.getDate() + 15);
    
    //Obtener objeto usuario
    this.activatedRoute.paramMap.subscribe(params => {
      let userId = params.get('idCliente');
  
      if(userId != null) {
        this.usuarioService.getUser(userId)
          .subscribe(user => { 
            this.usuario=user;     
          });
      } 
    });
  }

  ///Calcula la hora que tiene que mostrar en el ion-datetime
  calcularHora() {
    let fechaActual:Date = new Date();
    let fechaSeleccionada:Date = new Date(this.fecha);
    
    fechaActual.setHours(0,0,0,0);
    fechaSeleccionada.setHours(0,0,0,0);

    //Calcular horarios disponibles para el mismo día
    if(fechaSeleccionada.getTime() === fechaActual.getTime()) {

      let horaActual = new Date();
      let hora = horaActual.getHours();

      if(hora < 8) {
        hora= 8;
      }

      while(hora <= 24){

        hora+=1
        this.horasReservaDiaCorriente.push(hora.toString())
      }
      this.esMismoDia = true;
    } else {
      this.esMismoDia = false;
    } 
  }

  ///Crea la reserva y la guarda en la BD
  async reservarMesa() {
    let mesa:Mesa;
    let reserva:Reserva;
    let fechaReservada;
    let listaMesas:Mesa[];
    let auxHora:Date;

    reserva = new Reserva();
    reserva.cliente = <Cliente>this.usuario;

    //Guardar fecha
    reserva.fecha = new Date(this.fecha);
    auxHora= new Date(this.hora);
    reserva.fecha.setHours(auxHora.getHours(),auxHora.getMinutes(), 0, 0);

    reserva.cantidadComensales = this.cantidadComensales;

    this.loadingService.showLoading("Guardando Reserva...");
  
    // verificar si hay mesas disponibles
    listaMesas = await this.mesaService.getAllTables(Elementos.Mesas).pipe(first()).toPromise();

    for(let auxMesa of listaMesas) {
      fechaReservada = false;

      if(auxMesa.nroComensales < this.cantidadComensales) {
        fechaReservada=true;

      } else if(auxMesa.reservas.length > 0) {
        //Verificar fecha disponible
        for(let auxReserva of auxMesa.reservas) {
          if( auxReserva.fecha == reserva.fecha) {
            fechaReservada=true;
            break;
          }
        }
      }

      if(!fechaReservada){
        mesa= auxMesa;
        break;
      }
    }

    if(fechaReservada) {
      this.toastService.mostrarToast("No hay mesas disponibles", "danger");
      this.loadingService.closeLoading();
    } else {
      reserva.mesa = mesa;
      this.reservaService.guardarReserva(reserva);
      this.loadingService.closeLoading();
      this.toastService.mostrarToast("Mesa reservada", "success");
    }
  }
}
