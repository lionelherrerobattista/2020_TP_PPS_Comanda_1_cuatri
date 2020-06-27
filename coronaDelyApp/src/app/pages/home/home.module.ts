import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { ClienteHomeComponent } from 'src/app/componentes/cliente-home/cliente-home.component';
import { SupervisorHomeComponent } from 'src/app/componentes/supervisor-home/supervisor-home.component';

import { EmpleadosHomeComponent } from '../../componentes/empleados-home/empleados-home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ClienteHomeComponent, SupervisorHomeComponent, EmpleadosHomeComponent ] // aca agrego las otras opciones
})
export class HomePageModule {}
