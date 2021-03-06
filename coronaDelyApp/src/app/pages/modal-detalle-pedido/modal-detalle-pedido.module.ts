import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalDetallePedidoPage } from './modal-detalle-pedido.page';
import { PedidoDetalleComponent } from 'src/app/componentes/pedido-detalle/pedido-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: ModalDetallePedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalDetallePedidoPage, PedidoDetalleComponent]
})
export class ModalDetallePedidoPageModule {}
