import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalModifMesaPage } from './modal-modif-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: ModalModifMesaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalModifMesaPage]
})
export class ModalModifMesaPageModule {}
