import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  object;
  perfilEmpleado:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router:Router,
    private usuarioService: UsuarioService,
    
    ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');

    if(this. object != 'cliente' && this. object != 'clienteAnonimo') {
      let user = this.authService.getCurrentUser();
      this.usuarioService.getUserById(user.uid)
        .subscribe(userData => {          
          //Buscar el perfil para controlar a quién puede dar de alta
          this.perfilEmpleado=userData[0].perfil;         
        })
    }
  }

  inicio(){
    this.router.navigate([`/home`]);
  }

}
