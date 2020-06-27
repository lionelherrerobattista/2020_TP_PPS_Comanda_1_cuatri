import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsultaPage } from './consulta.page';
import { ClienteConsultaComponent } from 'src/app/componentes/cliente-consulta/cliente-consulta.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsultaPage, ClienteConsultaComponent]
})
export class ConsultaPageModule {}
