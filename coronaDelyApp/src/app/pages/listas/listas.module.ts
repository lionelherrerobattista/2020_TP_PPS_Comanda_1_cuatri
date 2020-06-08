import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListasPage } from './listas.page';
import { UsuarioListaComponent } from 'src/app/componentes/usuario-lista/usuario-lista.component';

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
  declarations: [ListasPage, UsuarioListaComponent]
})
export class ListasPageModule {}
