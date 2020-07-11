import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalPedidoClientePage } from './modal-pedido-cliente.page';
import { PedidoDetalleComponent } from 'src/app/componentes/pedido-detalle/pedido-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: ModalPedidoClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalPedidoClientePage]
})
export class ModalPedidoClientePageModule {}
