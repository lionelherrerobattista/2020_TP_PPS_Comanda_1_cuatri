import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrScannerService } from '../../servicios/qrscanner.service';
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
  usuario:Usuario;

  constructor(
    private router: Router,
    private userService: UsuarioService,
    private camaraService: CamaraService,
    private qrscannerService: QrScannerService,
  ) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {}

  async registro(){ 

    if(this.esCliente){
      this.usuario.perfil = "cliente";
      this.usuario.estado = "sinAtender";
    }
    
    //Esto funciona y uso la función original:
    await this.userService.saveUserWithLogin(this.usuario);

    //Redireccionar
    if(this.esCliente){
      this.router.navigate(['/home']);
    }
    else{
      // this.router.navigateByUrl('/listado/usuarios');
      this.router.navigateByUrl('/home');
    }
    
    //Lionel: Con esto no me guarda los datos en la BD (la dejo por las dudas)
    
    // this.userService.saveUserWithLogin(this.usuario).then(response =>{
    //   if(this.esCliente){
    //     this.router.navigate(['/home']);
    //   }
    //   else{
    //     // this.router.navigateByUrl('/listado/usuarios');
    //     this.router.navigateByUrl('/home');
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