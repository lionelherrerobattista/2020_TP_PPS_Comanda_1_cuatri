import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { QrscannerService } from 'src/app/servicios/qrscanner.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/clases/usuario';


@Component({
  selector: 'app-cliente-home',
  templateUrl: './cliente-home.component.html',
  styleUrls: ['./cliente-home.component.scss'],
})
export class ClienteHomeComponent implements OnInit {

  currentUser: Usuario;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private qrscannerService: QrscannerService,
    private router: Router,

  ) {
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.usuarioService.getUserById(user.uid).then(userData => {
      this.currentUser = Object.assign(new Usuario, userData.data());
    })
  }

  ngOnInit(){}

  agegarAListaEspera() {
    this.qrscannerService.scanQr().then(response => {
      if (response == 'listaDeEspera') {
        this.usuarioService.setDocument('listaDeEspera', this.currentUser.uid.toString(), { 'date' : Date.now(), 'name': this.currentUser.nombre + " " + this.currentUser.apellido, 'dni' : this.currentUser.dni });
        this.usuarioService.updateUser('usuarios', this.currentUser.uid, { 'status': 'enEspera' }).then(() => {
          // this.usuarioService.getUserById(this.currentUser.uid.toString()).then(user => {
          //   this.currentUser = Object.assign(new Usuario, user.data());
          // })
        });
      }
    });
  }

  quitarDeListaEspera() {
    this.usuarioService.deleteDocument('listaDeEspera', this.currentUser.uid.toString());
    this.usuarioService.updateUser('usuarios', this.currentUser.uid, { 'status': 'sinAtender' }).then(() => {
    })
  }

  logout(){
    this.authService.logOut();
  }

}
