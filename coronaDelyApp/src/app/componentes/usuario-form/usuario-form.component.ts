import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { CamaraService } from '../../servicios/camara.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  @Input() isClient:boolean;
  private usuario:Usuario;
  constructor(
    private router: Router,
    private userService: UsuarioService,
    private camaraService: CamaraService,
    private qrscannerService: QrscannerService

  ) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {}

  register(){ 
    if(this.isClient){
      this.usuario.perfil = "cliente";
      this.usuario.estado = "sinAtender";
    }
    this.userService.saveUserWithLogin(this.usuario).then(response =>{
      if(this.isClient){
        this.router.navigate(['/home']);
      }
      else{
        
        this.router.navigateByUrl('/listado/usuarios');
      }
    });
  }  

  tomarFoto(){
    this.camaraService.tomarFoto('clientes', Date.now());
  }

  scan(){
    let dniData = this.qrscannerService.scanDni();
    alert(dniData);
  }

}