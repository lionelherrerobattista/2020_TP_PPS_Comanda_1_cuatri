import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { Usuario } from 'src/app/clases/usuario';
import { LoadingService } from 'src/app/servicios/loading.service';
import { timer } from 'rxjs';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { Estados } from 'src/app/clases/enums/estados';

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

  splash = true;
  audioSplash = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UsuarioService,
    private loadingService: LoadingService
   
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

  onSubmitLogin(form) {   
    this.loadingService.showLoading("Espere..");
    console.log(form.email, form.password)
    this.authService.logIn(form.email, form.password)
      .then(res => {
        this.userService.getUserById(res.user.uid)
          .subscribe(usuario => { 
            if (usuario[0] != undefined) {
              console.log(usuario[0].estado);
              if(usuario[0].perfil == Perfiles.cliente && usuario[0].estado == Estados.pendienteDeAprobacion) {
                this.loadingService.closeLoading("Error", "Todavía no se aprobó su cuenta", 'error');     
              } else {
                this.loadingService.closeLoadingAndRedirect("/home");
              }
            }
          });
        
      })
      .catch(err => {
        console.log("error",err)
        this.loadingService.closeLoading("Error", "Verifique usuario y contraseña", 'error');
      });
  }
 
 

}
