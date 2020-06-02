import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUser: Usuario;

  constructor(
    private authService: AuthService,
    private userService: UsuarioService,
    private router: Router
  ) {
      let usuario = this.authService.getCurrentUser(); 
      console.log(usuario);    
      if (isNullOrUndefined(usuario)) {       
        this.router.navigateByUrl("/login");
      }
      console.log("current usuario obtenido",usuario)
      this.userService.getUserById(usuario.uid).then(userData => {
        this.currentUser = Object.assign(new Usuario, userData.data());
      })    
  }

  showAlert() {
    // Swal.fire('Oops...', 'Something went wrong!', 'error');
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


  ngOnInit() {
  }

}
