import { Component, OnInit, Input } from '@angular/core';
import { Pregunta, Encuesta, TipoEncuesta } from 'src/app/clases/encuesta';
import { EncuestaService } from 'src/app/servicios/encuesta.service';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';


@Component({
  selector: 'app-encuesta-empleado',
  templateUrl: './encuesta-empleado.component.html',
  styleUrls: ['./encuesta-empleado.component.scss'],
})
export class EncuestaEmpleadoComponent implements OnInit {

  
  preguntas:Pregunta[];
  limpieza:number;
  predisposicion:string;
  orden:string;
  elementosDisponibles:boolean;
  comentariosAdicionales:string;
  @Input()empleado:Usuario;

  constructor(
    private encuestaService:EncuestaService,
    private usuarioService:UsuarioService,
    private authService:AuthService,
  ) { 
    this.preguntas = [];
  }

  ngOnInit() {
    let usuario = this.authService.getCurrentUser();

    if(usuario != null) {
      this.usuarioService.getUserById(usuario.uid).subscribe(usuario => {

        this.empleado = usuario[0];

      });
    }
  }

  guardarEncuesta() {
    
    let preguntaUno:Pregunta;
    let preguntaDos:Pregunta;
    let preguntaTres:Pregunta;
    let preguntaCuatro:Pregunta;
    let respuestaCuatro:string;
    let preguntaCinco:Pregunta;
    let encuesta:Encuesta;
    
    //Revisar el boolean y escribir la respuesta
    if(this.elementosDisponibles) {
      respuestaCuatro = "sí";
    } else {
      respuestaCuatro = "no";
    }

    if(this.comentariosAdicionales == undefined){
      this.comentariosAdicionales = '';
    }

    //Cargar las preguntas
    preguntaUno = {
      pregunta: "Nivel de limpieza",
      respuesta: this.limpieza.toString(),
    }
    preguntaDos = {
      pregunta: "Predisposición del supervisor",
      respuesta: this.predisposicion,
    }
    preguntaTres = {
      pregunta: "¿El lugar de trabajo estaba ordenado?",
      respuesta: this.orden,
    }
    preguntaCuatro = {
      pregunta: "¿Tiene disponible todos los elementos de trabajo?",
      respuesta: respuestaCuatro,
    }
    preguntaCinco = {
      pregunta: "Comentarios adicionales",
      respuesta: this.comentariosAdicionales,
    }

    //Cargar el array
    this.preguntas.push(preguntaUno);
    this.preguntas.push(preguntaDos);
    this.preguntas.push(preguntaTres);
    this.preguntas.push(preguntaCuatro);
    this.preguntas.push(preguntaCinco);
    
    encuesta = new Encuesta(this.preguntas, TipoEncuesta.empleado,  this.empleado);

    //Guardar encuesta en firebase
    this.encuestaService.createEncuesta(encuesta).then( referecia => {
      this.cerrarSesion();
    });
  }

  cerrarSesion(){
    this.authService.logOut();
  }

}
