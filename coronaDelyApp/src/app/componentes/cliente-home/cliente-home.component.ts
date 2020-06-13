import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { QrScannerService } from 'src/app/servicios/qrscanner.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/clases/usuario';
import { Estados } from 'src/app/clases/enums/estados';
import { Mesa } from 'src/app/clases/mesa';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { MesaService } from 'src/app/servicios/mesa.service';
import { TipoDeNotificacion } from 'src/app/clases/enums/tipo-de-notificacion';
import { DataService } from 'src/app/servicios/data.service';
import { Elementos } from 'src/app/clases/enums/Elementos';
import { Perfiles } from 'src/app/clases/enums/perfiles';



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
    private notificacionService: NotificacionesService,
    private qrscannerService: QrScannerService,
    private mesaService: MesaService,
    private router: Router,
    private dataService: DataService,

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
    this.usuarioService.setDocument(Elementos.ListaDeEspera, this.usuario.id.toString(),
       { 'id': this.usuario.id, 'date' : Date.now(), 'name': this.usuario.nombre
        + " " + this.usuario.apellido, 'dni' : this.usuario.dni
       });
    this.dataService.setStatus(Elementos.Usuarios, this.usuario.id, Estados.enEspera)
      .then(() => {
      this.notificacionService.mostrarToast("Agregado a lista de espera", TipoDeNotificacion.warning, "top");
      this.usuarioService.getUserById(this.usuario.id)
         .subscribe(userData => { this.usuario=userData[0];
            console.log("El cliente " + this.usuario.nombre + 
            " " + this.usuario.apellido + " está esperando a ser atendido");
         })
      })
  }

  salirDeListaEspera() {
    this.usuarioService.deleteDocument('listaDeEspera', this.usuario.id.toString());
    this.usuarioService.updateUser('usuarios', this.usuario.id, { 'estado': 'sinAtender' }).then(() => {
    })
  }

  logout(){
    this.authService.logOut();
  }

  //QR para ir a lista de Espera
  scanQr() {
    console.log("dispositivo", this.qrscannerService.dispositivo)
    if(this.qrscannerService.dispositivo == "mobile"){
      this.qrscannerService.scanQr().then(response => {
        if (response == Elementos.ListaDeEspera) {
          this.irAListaEspera();
        }
      });
    }
    else{ // probando desde web siempre va a lista de espera
      console.log("para web, voy a lista de espera")
      this.irAListaEspera();
    }
  }
 //QR para seleccionar la mesa
  scanQRMesa(){
    if(this.usuario.estado == Estados.puedeTomarMesa){
      if(this.qrscannerService.dispositivo == "mobile"){
        this.qrscannerService.scanQr().then(tableId => {
          this.asignarMesa(tableId, this.usuario.id);
        });
      }
      else{
        // paso el id de la mesa 1 para probar en web
        this.asignarMesa("oZMjb6EkSIyZ9yXAEWXY", this.usuario.id);
      }
    }
    else {
      this.notificacionService.mostrarToast("Su solicitud aún no ha sido aprobada por el metre", TipoDeNotificacion.warning, "top");
    }
    
  }

  //asignar mesa a cliente
  asignarMesa(mesaId, usuarioId){
    this.mesaService.getTableById(mesaId).then(element => {
      let mesaActual = Object.assign(new Mesa, element.data());
      if (mesaActual.estado != Estados.disponible) {
        this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.numero} ${mesaActual.estado}`, "danger", "top");
      }
      else{
        this.dataService.setStatus(Elementos.Mesas, mesaId, Estados.ocupada);
        this.dataService.setStatus(Elementos.Usuarios, usuarioId, Estados.atendido);
        this.dataService.deleteDocument(Elementos.ListaDeEspera, usuarioId);
        var mesaService = { mesaId: mesaId, usuarioId: usuarioId };
        this.dataService.setData(Elementos.ServicioDeMesa, usuarioId, mesaService);
        this.notificacionService.mostrarToast(`Mesa N.° ${mesaActual.number} asignada`, "success", "top");
      }
    });
  }
}
