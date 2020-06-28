import { Component, OnInit, Input } from '@angular/core';
import { Consulta } from 'src/app/clases/consulta';
import { ConsultaService } from 'src/app/servicios/consulta.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { Cliente } from 'src/app/clases/cliente';

@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.scss'],
})
export class ClienteConsultaComponent implements OnInit {

  @Input()usuario:Usuario;
  textoCliente:string;
  consulta:Consulta;
  consultaCreada:boolean;

  constructor(
    private consultaService:ConsultaService,
    private usuarioService:UsuarioService,
  ) { 
    this.consultaCreada = false;
  }

  ngOnInit() {
 
  }

  async crearConsulta(){
    let cliente = <Cliente>this.usuario;
    this.consulta = new Consulta();
    this.consulta.textoConsulta = this.textoCliente;
    let idConsulta = await this.consultaService.createConsulta(this.consulta);
    let indice:number;
    let encontroConsulta = false;
    
    //Suscribir a la consulta para recibir las actualizaciones
    this.consultaService.getConsultaById(idConsulta).subscribe( consulta => {
      this.consultaCreada = true;
      this.consulta = consulta;

      //Guardar consulta en cliente y guardar cliente
      if(cliente.consulta == undefined) {
        cliente.consulta = [];
        cliente.consulta.push(this.consulta);
      } else {
        for(let auxConsulta of cliente.consulta) {

          //Sobrescribir si la consulta ya existía
          if(auxConsulta.id == this.consulta.id) {
            encontroConsulta = true; 
            indice = cliente.consulta.indexOf(auxConsulta);
            cliente.consulta[indice] = this.consulta;
          }
        }
        
        if(!encontroConsulta) {
          cliente.consulta.push(this.consulta);
        }
      }

      this.usuarioService.updateUser('usuarios', cliente.id, cliente);
    });
  }

}
