import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalMenuDetallePage } from './modal-menu-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ModalMenuDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalMenuDetallePage]
})
export class ModalMenuDetallePageModule {}
