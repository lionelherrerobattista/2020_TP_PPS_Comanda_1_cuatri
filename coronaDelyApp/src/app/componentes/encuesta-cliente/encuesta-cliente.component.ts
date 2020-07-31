import { Component, OnInit, Input } from '@angular/core';
import { Pregunta, Encuesta, TipoEncuesta } from 'src/app/clases/encuesta';
import { EncuestaService } from 'src/app/servicios/encuesta.service';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.component.html',
  styleUrls: ['./encuesta-cliente.component.scss'],
})
export class EncuestaClienteComponent implements OnInit {

  @Input()usuario:Usuario;
  preguntas:Pregunta[];
  limpieza:number;
  predisposicion:string;
  orden:string;
  elementosDisponibles:boolean;
  comentariosAdicionales:string;


  constructor(
    private encuestaService:EncuestaService,
    private router:Router,

  ) { 
    this.preguntas = [];
    this.limpieza = 0;
    
  }

  ngOnInit() {

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
      pregunta: "Predisposición del mozo",
      respuesta: this.predisposicion,
    }
    preguntaTres = {
      pregunta: "¿Restaurante limpio?",
      respuesta: this.orden,
    }
    preguntaCuatro = {
      pregunta: "¿Atención rápida?",
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
    
    encuesta = new Encuesta(this.preguntas, TipoEncuesta.cliente);

    //Guardar encuesta en firebase
    this.encuestaService.createEncuesta(encuesta).then( referecia => {
      this.redirigirCliente();
    });
  }

  redirigirCliente(){
    this.router.navigate(['/home', this.usuario.id]);
  }

}
