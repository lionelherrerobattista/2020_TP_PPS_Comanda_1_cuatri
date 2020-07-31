import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';
import { timer, Subscription } from 'rxjs';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { Estados } from 'src/app/clases/enums/estados';
import { FcmService } from 'src/app/servicios/fcm.service';
import { take, first } from 'rxjs/operators';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  public email: string;
  public password: string;
  form: FormGroup;
  defaultUsers: Array<any> = [];
  usuario: Usuario;
  suscripcion:Subscription;

  splash = true;
  audioSplash = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UsuarioService,
    private loadingService: LoadingService,
    private fcm: FcmService,
   
  ) { }

  ngOnInit() {
    this.addDefaultUser();
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  ionViewDidEnter() {
    if (this.audioSplash === true) {
      let audio = new Audio();
      audio.src = 'assets/audio/splash.mp3';
      audio.play();
      this.audioSplash = false;
    }
    setTimeout(() => this.splash = false, 4000);
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'El email es requerido.' },
      { type: 'pattern', message: 'Ingrese un email válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La password debe contener al menos 6 catacteres.' }
    ]
  };

  addDefaultUser() {
    this.defaultUsers.push({ "email": "supervisor@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "cliente@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "mozo@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "bartender@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "cocinero@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "anonimo@coronadely.com", "password": "123456" });
    this.defaultUsers.push({ "email": "metre@coronadely.com", "password": "123456" });
  }

  setDefaultUser() {
    this.onSubmitLogin(this.usuario);
  }

  async onSubmitLogin(form) {   

    let token:string;
    let respuesta;


    this.loadingService.showLoading("Espere..");
    
    try {
      respuesta = await this.authService.logIn(form.email, form.password);

      this.suscripcion = this.userService.getUser(respuesta.user.uid).subscribe(async usuario => {

        if (usuario != undefined) {
          //Dejo solo la verificación del email para el cliente
          if(usuario.perfil == Perfiles.cliente && respuesta.user.emailVerified != true) {
            respuesta.user.sendEmailVerification();
            this.loadingService.closeLoading("Error", "Debe verificar su email", 'error');     
          } else {
            if(usuario.perfil == Perfiles.cliente && usuario.estado == Estados.pendienteDeAprobacion) {
              this.loadingService.closeLoading("Error", "Todavía no se aprobó su cuenta", 'error');     
            } else {
              //Guardo el token del dispositivo cuando inicia sesión
              token = await this.fcm.getToken();
                            
              if(token != undefined) {
                usuario.token = token;
                this.userService.updateUser('usuarios',usuario.id, usuario);
              }
              this.loadingService.closeLoadingAndRedirect("/home");
              this.suscripcion.unsubscribe();
            }
          }   
        }
      });    
    } catch (error) {
      console.log("error", error);
      this.loadingService.closeLoading("Error", "Verifique usuario y contraseña", 'error');
    } 
    

    
  }

  // onSubmitLogin(form) {   

  //   let token:string;

  //   this.loadingService.showLoading("Espere..");
    
  //   this.authService.logIn(form.email, form.password)
  //     .then(res => {
  //       this.userService.getUserById(res.user.uid).pipe(take(1))
  //         .subscribe(async usuario => { 
  //           if (usuario[0] != undefined) {
  //             //Dejo solo la verificación del email para el cliente
  //             if(usuario[0].perfil == Perfiles.cliente && res.user.emailVerified != true) {
  //               res.user.sendEmailVerification();
  //               this.loadingService.closeLoading("Error", "Debe verificar su email", 'error');     
  //             } else {
  //               if(usuario[0].perfil == Perfiles.cliente && usuario[0].estado == Estados.pendienteDeAprobacion) {
  //                 this.loadingService.closeLoading("Error", "Todavía no se aprobó su cuenta", 'error');     
  //               } else {
  //                 //Guardo el token del dispositivo cuando inicia sesión
  //                 token = await this.fcm.getToken();
                                
  //                 if(token != undefined) {
                    
  //                   usuario[0].token = token;
  //                   this.userService.updateUser('usuarios',usuario[0].id, usuario[0]);
  //                 }
    
  //                 this.loadingService.closeLoadingAndRedirect("/home");

  //               }
  //             }   
  //           }
  //       });
  //     })
  //     .catch(err => {
  //       console.log("error",err)
  //       this.loadingService.closeLoading("Error", "Verifique usuario y contraseña", 'error');
  //     });
  // }
 
 

}
