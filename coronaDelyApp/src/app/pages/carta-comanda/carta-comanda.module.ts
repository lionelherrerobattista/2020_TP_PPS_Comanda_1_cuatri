import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CartaComandaPage } from './carta-comanda.page';
import { CartaComponent } from 'src/app/componentes/carta/carta.component';

const routes: Routes = [
  {
    path: '',
    component: CartaComandaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CartaComandaPage, CartaComponent]
})
export class CartaComandaPageModule {}
