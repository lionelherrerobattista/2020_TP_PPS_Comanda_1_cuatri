import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FcmService } from 'src/app/servicios/fcm.service';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { Cliente } from 'src/app/clases/cliente';
import { Reserva, EstadoReserva } from 'src/app/clases/reserva';
import { Estados } from 'src/app/clases/enums/estados';
import { ReservaService } from 'src/app/servicios/reserva.service';
import { Elementos } from 'src/app/clases/enums/elementos';
import { ToastService } from 'src/app/servicios/toast.service';
import { Subscription } from 'rxjs';
import { MesaService } from 'src/app/servicios/mesa.service';
import { first } from 'rxjs/operators';
import { Mesa } from 'src/app/clases/mesa';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  usuario: Usuario;
  idAnonimo:string;
  suscripcion:Subscription;
  

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private reservaService: ReservaService,  
    private mesaService: MesaService,
    private toastService: ToastService,  
  ) { }

  ngOnInit() {

    let cliente:Cliente;
    let userId;
    let mesa:Mesa;

    this.activatedRoute.paramMap.subscribe(params => {

      userId = params.get('usuarioAnonimo');

      if(userId == null) {
        userId = this.authService.getCurrentUser().uid;
      }   

      this.suscripcion = this.usuarioService.getUser(userId)
          .subscribe( async userData => {       
            this.usuario=userData;

            if(this.usuario.perfil == Perfiles.cliente) {

              cliente = <Cliente>this.usuario;

              //Asignar mesa si tiene reserva o cancelar si excedió el tiempo
              if(cliente.reserva != undefined) {
                if(Reserva.verificarHorarioReserva(cliente.reserva) && cliente.estado == Estados.aprobado) {
                  cliente.mesaAsignada = cliente.reserva.mesa.id;
                  cliente.estado = Estados.puedeTomarMesa;
                  cliente.reserva.estado = EstadoReserva.utilizada;

                  cliente.reserva.mesa.estado = Estados.reservada;

                  
                  this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
                  await this.mesaService.updateTable(Elementos.Mesas, cliente.reserva.mesa.id, cliente.reserva.mesa);
                  this.reservaService.actualizarReserva(cliente.reserva);
                  
                } else if(Reserva.verificarReservaVencida(cliente.reserva) && cliente.estado == Estados.aprobado) {
                  
                  cliente.reserva.estado = EstadoReserva.cancelada;
                  cliente.reserva.mesa.estado = Estados.disponible;
                  this.toastService.mostrarToast('Se excedió del tiempo de reserva', 'danger');
  
                  this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
                  await this.mesaService.updateTable(Elementos.Mesas, cliente.reserva.mesa.id, cliente.reserva.mesa);          
                  this.reservaService.actualizarReserva(cliente.reserva);   
                }
              }
            } 
          });
    });
  }



  showAlert() {
    Swal.fire({
      title: 'Custom width, padding, background.',
      width: 600,
      padding: '3em',
      backdrop: false
    })
  }

  logout(){
    // Borrar token
    if(this.usuario.token != undefined) {
      this.usuario.token = '';
      console.log('borro token');
    }

    this.suscripcion.unsubscribe();
    
    this.usuarioService.updateUser(Elementos.Usuarios, this.usuario.id, this.usuario);
    this.authService.logOut();
  }



}
