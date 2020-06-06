import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private usuarioService: UsuarioService,
    
    ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');

    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      
    }
    this.usuarioService.getUserById(user.uid)
    .subscribe(userData => { this.perfilEmpleado=userData[0].perfil;
    
      
    })
    
  }

}
