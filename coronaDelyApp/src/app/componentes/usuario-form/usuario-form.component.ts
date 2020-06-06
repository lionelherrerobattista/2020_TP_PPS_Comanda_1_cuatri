import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { CamaraService } from '../../servicios/camara.service';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  @Input() esCliente:boolean;
  @Input() perfilEmpleado:string;
  
  private usuario:Usuario;
  constructor(
    private router: Router,
    private userService: UsuarioService,
    private camaraService: CamaraService,
    private qrscannerService: QrscannerService,
    private authService:AuthService,

  ) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {}

  registro(){ 

    if(this.esCliente){
      this.usuario.perfil = "cliente";
      this.usuario.estado = "sinAtender";
    }

    //Lionel:Si dejo esto así me guarda en la BD
    this.userService.createUsuario(this.usuario).then(resultado => {
          
      // this.router.navigateByUrl('/listado/usuarios');
      this.router.navigateByUrl('/home');

    }, error => console.log(error));  

    
    //Lionel: Con esto no me guarda los datos en la BD
    // this.userService.saveUserWithLogin(this.usuario).then(response =>{
    //   if(this.esCliente){
    //     this.router.navigate(['/home']);
    //   }
    //   else{
    //     this.userService.createUsuario(this.usuario).then(resultado => {
          
    //       // this.router.navigateByUrl('/listado/usuarios');
    //       this.router.navigateByUrl('/home');

    //     }, error => console.log(error));  
    //   }
    // });
  }  

  tomarFoto(){
    this.camaraService.tomarFoto('clientes', Date.now());
  }

  scan(){
    let dniData = this.qrscannerService.scanDni();
    alert(dniData);
  }

}