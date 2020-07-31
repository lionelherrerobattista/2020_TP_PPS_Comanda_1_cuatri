import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { first } from 'rxjs/operators';
import { Perfiles } from 'src/app/clases/enums/perfiles';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  tipoUsuario;
  id;
  usuarioActual:Usuario;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private usuarioService:UsuarioService,
  ) { }

  ngOnInit() {
    this.tipoUsuario = this.activatedRoute.snapshot.paramMap.get('tipoUsuario');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUsuario();
  
  }

  ///Recupera el usuario actual de la base de datos
  async getUsuario(){
    this.usuarioService.getUserById(this.id).subscribe(usuario => {
      this.usuarioActual = usuario[0];
    });
    
  }

  inicio(){
    if(this.tipoUsuario != 'cliente anonimo') {
      this.router.navigate([`/home`]);      
    } else {
      this.router.navigate([`/home`, this.id]);
    }
    
  }
}
