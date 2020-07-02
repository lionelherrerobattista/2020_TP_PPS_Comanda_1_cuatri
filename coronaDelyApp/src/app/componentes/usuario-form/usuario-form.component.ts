import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrScannerService } from '../../servicios/qrscanner.service';
import { CamaraService } from '../../servicios/camara.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Estados } from 'src/app/clases/enums/estados';
import { Perfiles } from 'src/app/clases/enums/perfiles';


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
    this.usuario.nombre = "";
    this.usuario.apellido = "";
  }

  ngOnInit() {}

  ///Guarda al cliente (pendiente de aprobación) o empleado en firebase
  ///y redirecciona al log in (cliente) o al home (empleado)
  async registro(){ 

    if(this.esCliente){
      this.usuario.perfil = Perfiles.cliente;
      this.usuario.estado = Estados.pendienteDeAprobacion;
    }
    
    await this.userService.saveUserWithLogin(this.usuario);

    //Redireccionar
    if(this.esCliente){
      this.router.navigate(['/login']);
    }
    else{
      this.router.navigate(['/home']);
    }
  }  

  tomarFoto(){
    this.camaraService.tomarFoto('clientes', Date.now()).then( urlFoto => {
      //Guardar la url en el objeto usuario
      this.usuario.foto = urlFoto;
    });   
  }

  ///Escanea el código QR del DNI y guarda los datos
  scan(){
    this.qrscannerService.scanDni().then(dniData => {     
      this.usuario.apellido = this.fromatearTitleCase(dniData[1].toLowerCase());
      this.usuario.nombre = this.fromatearTitleCase(dniData[2].toLowerCase());
      this.usuario.dni = Number.parseInt(dniData[4]);
    });
  }

  ///Convierte una string a titlecase
  fromatearTitleCase(dato:string)
  {
    let arrStr = dato.toLowerCase().split(' ');
    let titleCaseStr = arrStr.map((str) => (str.charAt(0).toUpperCase() + str.slice(1))).join(' ');

    return titleCaseStr;
  }

}