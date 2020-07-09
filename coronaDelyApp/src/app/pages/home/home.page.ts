import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  usuario: Usuario;
  idAnonimo:string;
  

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
  ) {

    
    
    }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {

    let userId = params.get('usuarioAnonimo');

    if(userId != null) {
      console.log(userId);
    } else {
      userId = this.authService.getCurrentUser().uid;
    }

    this.usuarioService.getUserById(userId)
      .subscribe(userData => { 
        
        this.usuario=userData[0];
        console.log(this.usuario)
        
      });
    });
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
