import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'home/:usuarioAnonimo', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'registro', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
 // accesos admin  
  { path: 'registro/:object', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
  { path: 'listas/:object', loadChildren: './pages/listas/listas.module#ListasPageModule' },
  { path: 'reservar', loadChildren: './pages/reserva/reserva.module#ReservaPageModule' },
  // { path: 'reserva', loadChildren: './pages/reserva/reserva.module#ReservaPageModule' },
  { path: 'pedido', loadChildren: './pages/pedido/pedido.module#PedidoPageModule' },

  { path: 'inicio', loadChildren: './pages/home/home.module#HomePageModule' },
  // { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' }

  
 
  // accesos cliente
  { path: 'delivery', loadChildren: './pages/delivery/delivery.module#DeliveryPageModule' },
  { path: 'juego', loadChildren: './pages/juego/juego.module#JuegoPageModule' },
  // { path: 'encuesta/:object', loadChildren: './pages/encuesta/encuesta.module#EncuestaPageModule'},
  { path: 'encuesta/:idUsuario', loadChildren: './pages/encuesta/encuesta.module#EncuestaPageModule'},
  { path: 'pedido/:idUsuario', loadChildren: './pages/pedido/pedido.module#PedidoPageModule' },
  { path: 'modal-menu-detalle', loadChildren: './pages/modal-menu-detalle/modal-menu-detalle.module#ModalMenuDetallePageModule' },
  { path: 'consulta/:object', loadChildren: './pages/consulta/consulta.module#ConsultaPageModule'},
  { path: 'consulta/:tipoUsuario/:id', loadChildren: './pages/consulta/consulta.module#ConsultaPageModule'},
  { path: 'modal-consulta', loadChildren: './pages/modal-consulta/modal-consulta.module#ModalConsultaPageModule' },
  { path: 'modal-detalle-pedido', loadChildren: './pages/modal-detalle-pedido/modal-detalle-pedido.module#ModalDetallePedidoPageModule' },
  { path: 'modal-modif-mesa', loadChildren: './pages/modal-modif-mesa/modal-modif-mesa.module#ModalModifMesaPageModule' },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
