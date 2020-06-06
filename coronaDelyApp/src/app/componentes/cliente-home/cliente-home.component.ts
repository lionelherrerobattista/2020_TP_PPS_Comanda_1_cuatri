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

  usuario: Usuario;

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
    this.usuarioService.getUserById(user.uid)
    .subscribe(userData => { this.usuario=userData[0];
    console.log(this.usuario)
      
    })
  }

  ngOnInit(){}

  irAListaEspera() {
    this.qrscannerService.scanQr().then(response => {
      if (response == 'listaDeEspera') {
        this.usuarioService.setDocument('listaDeEspera', this.usuario.id.toString(), 
        { 'fecha' : Date.now(), 'nombre': this.usuario.nombre + " "
         + this.usuario.apellido, 'dni' : this.usuario.dni });
        this.usuarioService.updateUser('usuarios', this.usuario.id, { 'estado': 'enEspera' }).then(() => {
          this.usuarioService.getUserById(this.usuario.id)
          .subscribe(userData => { this.usuario=userData[0];
                
          })
        });
      }
    });
  }

  salirDeListaEspera() {
    this.usuarioService.deleteDocument('listaDeEspera', this.usuario.id.toString());
    this.usuarioService.updateUser('usuarios', this.usuario.id, { 'estado': 'sinAtender' }).then(() => {
    })
  }

  logout(){
    this.authService.logOut();
  }

}
