import { Component, OnInit, Input } from '@angular/core';
import { Consulta, EstadoConsulta } from 'src/app/clases/consulta';
import { ConsultaService } from 'src/app/servicios/consulta.service';
import { ModalController } from '@ionic/angular';
import { ModalConsultaPage } from 'src/app/pages/modal-consulta/modal-consulta.page';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-mozo-consulta',
  templateUrl: './mozo-consulta.component.html',
  styleUrls: ['./mozo-consulta.component.scss'],
})
export class MozoConsultaComponent implements OnInit {

  @Input()usuario;
  listaConsultas:Consulta[];
  
  constructor(
    private consultaService:ConsultaService,
    private modalController:ModalController,

  ) { }

  ngOnInit() {
    //Cargar la lista de consultas por responder
    this.consultaService.getConsultas()
      .subscribe(consultas  => {
      this.listaConsultas = consultas.filter(consulta => consulta.estado == EstadoConsulta.enviada);
    });

  }

  responderConsulta(consulta) {
    this.mostrarModal(consulta);
    //Abrir modal para responder consulta
  }

  async mostrarModal(datos) {
    const modal = await this.modalController.create({
      component: ModalConsultaPage,
      componentProps: {
        consulta: datos,
      }
    });
    return await modal.present();
  }

}
