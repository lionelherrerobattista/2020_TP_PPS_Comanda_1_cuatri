import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalModifUsuarioPage } from './modal-modif-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ModalModifUsuarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalModifUsuarioPage]
})
export class ModalModifUsuarioPageModule {}
