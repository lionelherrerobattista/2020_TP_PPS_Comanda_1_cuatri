import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../clases/usuario';
import { QrScannerService } from '../../servicios/qrscanner.service';
import { CamaraService } from '../../servicios/camara.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Estados } from 'src/app/clases/enums/estados';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { FormControl,ValidatorFn, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { FcmService } from 'src/app/servicios/fcm.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  
  @Input() esCliente:boolean;
  @Input() perfilEmpleado:string;  

  public usuario:Usuario;
  public image: any;
  public form: FormGroup;
  public modification: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsuarioService,
    private camaraService: CamaraService,
    private qrscannerService: QrScannerService,
    private fcm:FcmService,
  ) { 
    this.usuario = new Usuario();
    this.limpiarInputs();
  }

  ngOnInit() {  
    //falta agregar aca la modificacion 

    this.form = this.formBuilder.group({      
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$')
      ])),
      passConfirmada: new FormControl(''),
      nombre: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      apellido: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z\\s]+$')
      ])),
      dni: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]{8}$'),
        Validators.required
      ])),
      cuil: new FormControl(''),
      perfil: new FormControl('')
    });
    this.form.controls["passConfirmada"].setValidators([this.confirmarPassword(), Validators.required])
    if (!this.esCliente) {
      this.form.controls["cuil"].setValidators([Validators.pattern('^[0-9]{11}$'), Validators.required])
      this.form.controls["perfil"].setValidators([Validators.required])
    }
  }

  limpiarInputs(){
    console.log("usu", this.usuario)
    this.usuario.nombre = "";
    this.usuario.apellido = "";
    this.usuario.email = "";
    // this.usuario.cuil = 0;
    // this.usuario.dni = 0;
  }

  confirmarPassword(): ValidatorFn {
    const passwordChequeada = () => {
      const pass = this.form.get('password').value;
      const okPass = this.form.get('passConfirmada').value;
      const isValidPassword = pass === okPass
      if (isValidPassword || okPass == "") return null;

      return { "passwordError": true }

    }
    return passwordChequeada;
  }
  ///Guarda al cliente (pendiente de aprobación) o empleado en firebase
  ///y redirecciona al log in (cliente) o al home (empleado)
  async registro(formValues){ 
    let token;
    console.log("registro", formValues)
    this.formUsuario(formValues);

    if(this.esCliente){
      this.usuario.perfil = Perfiles.cliente;
      this.usuario.estado = Estados.pendienteDeAprobacion;
    }

    //Guardo el token del dispositivo
    token = await this.fcm.getToken();

    if(token != undefined) {
      console.log(token)
      this.usuario.token = token;
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
  formUsuario(formValues) {
    console.log("formValues",formValues)
    this.usuario.nombre = formValues.nombre.trim();
    this.usuario.apellido = formValues.apellido.trim();
    this.usuario.email = formValues.email;
    this.usuario.password = formValues.password;
    this.usuario.dni = formValues.dni;

    if (!this.esCliente) {
      this.usuario.cuil = formValues.cuil;
      this.usuario.perfil = formValues.perfil;
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

  // mensajes de validacion por inputs
  mensajesValidacion = {
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingrese un correo electrónico válido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La password debe contener al menos 6 catacteres.' }
    ],
    'passConfirmada': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'passwordError', message: 'Las contraseñas ingresadas no coinciden' }
    ],
    'nombre': [
      { type: 'required', message: 'El nombre es requerido.' },
      { type: 'pattern', message: 'Ingrese un nombre válido.' }
    ],
    'apellido': [
      { type: 'required', message: 'La apellido es requerido.' },
      { type: 'pattern', message: 'Ingrese un apellido válido.' }
    ],
    'dni': [
      { type: 'pattern', message: 'El DNI debe contener 8 carácteres númericos.' },
      { type: 'required', message: 'El DNI es requerido.' },
    ],
    'cuil': [
      { type: 'pattern', message: 'El CUIL debe contener 11 carácteres númericos.' },
      { type: 'required', message: 'El CUIL es requerido.' },
    ],
    'perfil': [
      { type: 'required', message: 'El perfil es requerido.' },
    ]
  };

  ///Convierte una string a titlecase
  fromatearTitleCase(dato:string)
  {
    let arrStr = dato.toLowerCase().split(' ');
    let titleCaseStr = arrStr.map((str) => (str.charAt(0).toUpperCase() + str.slice(1))).join(' ');

    return titleCaseStr;
  }

}