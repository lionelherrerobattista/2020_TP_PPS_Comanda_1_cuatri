import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { ClienteHomeComponent } from 'src/app/componentes/cliente-home/cliente-home.component';
import { SupervisorHomeComponent } from 'src/app/componentes/supervisor-home/supervisor-home.component';
import { CocineroHomeComponent } from 'src/app/componentes/cocinero-home/cocinero-home.component';
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
  declarations: [HomePage, ClienteHomeComponent, SupervisorHomeComponent, CocineroHomeComponent ] // aca agrego las otras opciones
})
export class HomePageModule {}
