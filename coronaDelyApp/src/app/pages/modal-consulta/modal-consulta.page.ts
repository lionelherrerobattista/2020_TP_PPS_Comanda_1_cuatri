import { Component, OnInit, Input } from '@angular/core';
import { Consulta, EstadoConsulta } from 'src/app/clases/consulta';
import { ModalController } from '@ionic/angular';
import { ConsultaService } from 'src/app/servicios/consulta.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Cliente } from 'src/app/clases/cliente';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-modal-consulta',
  templateUrl: './modal-consulta.page.html',
  styleUrls: ['./modal-consulta.page.scss'],
})
export class ModalConsultaPage implements OnInit {

  @Input()consulta:Consulta;

  constructor(
    private modalController:ModalController,
    private consultaService:ConsultaService,
    private usuarioService:UsuarioService,
  ) { }

  ngOnInit() {
  }

  ///Actualiza la consulta con la respuesta
  async responderConsulta() {
    let cliente = <Cliente> await this.usuarioService.getUser(this.consulta.idCliente).pipe(first()).toPromise();
    let indice;

    this.consulta.estado = EstadoConsulta.respondida;

    //Actualizar la consulta en el objeto usuario
    for(let auxConsulta of cliente.consulta) {
      if(auxConsulta.id == this.consulta.id) {
        indice= cliente.consulta.indexOf(auxConsulta);

        if(indice > -1) {
          cliente.consulta[indice] = this.consulta;
        }
      }
    }

    ///Actualizar usuario y consulta
    await this.usuarioService.updateUser('usuarios', cliente.id, cliente);
    await this.consultaService.updateConsulta('consultas', this.consulta.id, this.consulta)
    
    this.cerrarModal();
  }


  async cerrarModal() {
    await this.modalController.dismiss();
  }

}
