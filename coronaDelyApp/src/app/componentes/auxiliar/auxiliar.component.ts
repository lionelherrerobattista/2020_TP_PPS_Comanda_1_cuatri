import { Component, OnInit, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EntregaPedidoComponent } from '../entrega-pedido/entrega-pedido.component';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MenuComponent, EntregaPedidoComponent],
  exports: [MenuComponent, EntregaPedidoComponent],
  imports: [IonicModule, CommonModule]
})
export class AuxiliarModule {}
