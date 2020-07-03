import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EncuestaPage } from './encuesta.page';
import { EncuestaEmpleadoComponent } from 'src/app/componentes/encuesta-empleado/encuesta-empleado.component';
import { EncuestaClienteComponent } from 'src/app/componentes/encuesta-cliente/encuesta-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: EncuestaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EncuestaPage, EncuestaEmpleadoComponent,EncuestaClienteComponent]
})
export class EncuestaPageModule {}
