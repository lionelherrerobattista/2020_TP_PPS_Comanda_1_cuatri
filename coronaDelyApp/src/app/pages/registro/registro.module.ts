import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { UsuarioFormComponent } from 'src/app/componentes/usuario-form/usuario-form.component';
import { ProductoFormComponent } from 'src/app/componentes/producto-form/producto-form.component';
import { MesaFormComponent } from 'src/app/componentes/mesa-form/mesa-form.component';
import { AnonimoFormComponent } from 'src/app/componentes/anonimo-form/anonimo-form.component';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistroPage, UsuarioFormComponent, MesaFormComponent, ProductoFormComponent, AnonimoFormComponent,
] //--> aca agrego los 
  //componentes de los elementos que quiero dar de alta
})
export class RegistroPageModule {}
