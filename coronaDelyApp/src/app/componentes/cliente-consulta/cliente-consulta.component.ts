import { Component, OnInit, Input } from '@angular/core';
import { Consulta, EstadoConsulta } from 'src/app/clases/consulta';
import { ConsultaService } from 'src/app/servicios/consulta.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { Cliente } from 'src/app/clases/cliente';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.scss'],
})
export class ClienteConsultaComponent implements OnInit {

  @Input()usuario:Usuario;
  cliente:Cliente;
  textoCliente:string;
  consulta:Consulta;
  consultaCreada:boolean;

  constructor(
    private consultaService:ConsultaService,
    private usuarioService:UsuarioService,
    public toastController: ToastController,
  ) { 
    this.consultaCreada = false;
    
  }

  ngOnInit() {
    // let cliente = <Cliente>this.usuario;
    let consulta:Consulta;
    this.cliente = <Cliente>this.usuario;
    //Comprobar si consulto antes
    if(this.cliente.consulta != undefined && this.cliente.consulta.length > 0) {
      let indiceUltimaConsulta = this.cliente.consulta.length - 1;
      consulta = this.cliente.consulta[indiceUltimaConsulta];
      this.consulta = consulta
      this.consultaCreada = true;
    } else {
      this.consultaCreada = false;
      this.consulta = new Consulta();
    }
 
  }

  async crearConsulta(){
    let cliente = <Cliente>this.usuario;
    this.consulta.textoConsulta = this.textoCliente;
    this.consulta.nroMesa = this.cliente.mesa.numero;
    this.consulta.idCliente = this.usuario.id;
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

      this.mostrarToast("Consulta enviada. La responderán pronto");

      this.usuarioService.updateUser('usuarios', cliente.id, cliente);
    });
  }

  nuevaConsulta() {

    this.consultaCreada = false;
    this.textoCliente = '';
    this.consulta = new Consulta();

    this.mostrarToast("Puede escribir su nueva consulta");

  }

  ///Funciones que llaman al toast y al alert
  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });

    toast.present();
  }

}
