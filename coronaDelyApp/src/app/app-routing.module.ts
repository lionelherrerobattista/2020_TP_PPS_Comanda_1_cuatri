import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'registro', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
 // accesos admin  
  { path: 'registro/:object', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
  { path: 'listas', loadChildren: './pages/listas/listas.module#ListasPageModule' },



  // accesos cliente
  // { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
