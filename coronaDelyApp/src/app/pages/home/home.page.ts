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


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  usuario: Usuario;
  idAnonimo:string;
  

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private reservaService: ReservaService,    
  ) { }

  ngOnInit() {

    let cliente:Cliente;
    let userId;

    this.activatedRoute.paramMap.subscribe(params => {

      userId = params.get('usuarioAnonimo');

      if(userId == null) {
        userId = this.authService.getCurrentUser().uid;
      }   

      this.usuarioService.getUser(userId)
          .subscribe(userData => {       
            this.usuario=userData;

            if(this.usuario.perfil == Perfiles.cliente) {

              cliente = <Cliente>this.usuario;

              //Asignar mesa si tiene reserva
              if(Reserva.verificarHorarioReserva(cliente.reserva) && cliente.estado == Estados.aprobado) {
                cliente.mesaAsignada = cliente.reserva.mesa.id;
                cliente.estado = Estados.puedeTomarMesa;
                cliente.reserva.estado = EstadoReserva.utilizada;

                this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
                this.reservaService.actualizarReserva(cliente.reserva);             
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
    this.authService.logOut();
  }



}
