import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'registro', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
 // accesos admin
  // { path: 'listado', loadChildren: './pages/listas/listas.module#ListasPageModule' },
  { path: 'registro/:object', loadChildren: './pages/registro/registro.module#RegistroPageModule' },
  // { path: 'modificar/:object/:id', loadChildren: './pages/modify/modify.module#ModifyPageModule' },
    // path: 'home',
    // loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  // },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
