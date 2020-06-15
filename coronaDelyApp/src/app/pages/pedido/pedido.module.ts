import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuxiliarModule } from '../../componentes/auxiliar/auxiliar.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PedidoPage } from './pedido.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    AuxiliarModule,
    FormsModule,
    IonicModule,
    AuxiliarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoPage]
})
export class PedidoPageModule {}
