import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalDetalleReservaPage } from './modal-detalle-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetalleReservaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalDetalleReservaPage]
})
export class ModalDetalleReservaPageModule {}
