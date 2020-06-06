import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { CamaraService } from '../../servicios/camara.service';
// import { AuthService } from 'src/app/servicios/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private qrscannerService: QrscannerService,
    private auth: AngularFireAuth,

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
    this.userService.createUsuario(this.usuario).then(referencia => {
        
      console.log(referencia.id); //referencia del doc de firebase

      this.auth.auth.createUserWithEmailAndPassword(this.usuario.email, this.usuario.password)
        .then(credenciales => {
          this.usuario.id = credenciales.user.uid;
          //Si la función devuelve Promise<void> no usar el then
          // sino se queda ahí colgado
          this.userService.updateUser('usuarios', referencia.id, this.usuario);

          this.router.navigate(['/home']);
        });

    }, error => console.log(error));  
    
    //Lionel: Con esto no me guarda los datos en la BD
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