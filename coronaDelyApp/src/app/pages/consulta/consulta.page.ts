import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  object;
  usuarioActual:Usuario;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService:AuthService,
    private usuarioService:UsuarioService,
  ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');
    this.getUsuario();
    
  }

  ///Recupera el usuario actual de la base de datos
  async getUsuario(){
    let usuarioAuth = this.authService.getCurrentUser();
    this.usuarioService.getUserById(usuarioAuth.uid).subscribe(usuario => {
      this.usuarioActual = usuario[0];
    });
    
  }

}
