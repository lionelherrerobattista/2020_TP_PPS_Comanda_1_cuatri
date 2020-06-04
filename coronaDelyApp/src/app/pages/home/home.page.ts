import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ClienteHomeComponent } from 'src/app/componentes/cliente-home/cliente-home.component';
import { LoadingService } from 'src/app/servicios/loading.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  currentUser: Usuario;
  

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.usuarioService.getUserById(user.uid).then(userData => {
      this.currentUser = Object.assign(new Usuario, userData.data());
    })

    
  }


  showAlert() {
    Swal.fire({
      title: 'Custom width, padding, background.',
      width: 600,
      padding: '3em',
      backdrop: false
    })
  }

  logout(){
    this.authService.logOut();
  }



}
