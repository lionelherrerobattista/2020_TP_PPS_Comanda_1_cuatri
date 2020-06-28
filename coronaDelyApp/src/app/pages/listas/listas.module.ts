import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListasPage } from './listas.page';
import { UsuarioListaComponent } from 'src/app/componentes/usuario-lista/usuario-lista.component';
import { SupervisorListaEsperaComponent } from 'src/app/componentes/supervisor-lista-espera/supervisor-lista-espera.component';
import { ProductoListaComponent } from 'src/app/componentes/producto-lista/producto-lista.component';
import { MetreListaEsperaComponent } from '../../componentes/metre-lista-espera/metre-lista-espera.component';

const routes: Routes = [
  {
    path: '',
    component: ListasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListasPage, UsuarioListaComponent, SupervisorListaEsperaComponent, ProductoListaComponent, MetreListaEsperaComponent]
})
export class ListasPageModule {}
