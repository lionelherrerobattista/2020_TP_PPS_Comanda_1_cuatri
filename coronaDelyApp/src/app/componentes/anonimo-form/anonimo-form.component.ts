import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Router } from '@angular/router';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { Estados } from 'src/app/clases/enums/estados';

@Component({
  selector: 'app-anonimo-form',
  templateUrl: './anonimo-form.component.html',
  styleUrls: ['./anonimo-form.component.scss'],
})
export class AnonimoFormComponent implements OnInit {

  usuario:Usuario;

  constructor(
    private usuarioService:UsuarioService,
    private router:Router,
  ) {
    this.usuario = new Usuario();
    
   }

  ngOnInit() {
    
  }

  ///Crea un cliente anonimo con los datos ingresados
  ///Redirige al cliente a la home
  crearUsuarioAnonimo() {
    let idAnonimo;
    this.usuario.perfil = Perfiles.clienteAnonimo;
    this.usuario.estado = Estados.aprobado;
    this.usuarioService.createUsuario(this.usuario)
      .then( async credencialesUsuario => {
        this.usuario.id = credencialesUsuario.id;
        await this.usuarioService.updateUser('usuarios', credencialesUsuario.id, this.usuario);
        idAnonimo = credencialesUsuario.id;
        console.log(idAnonimo);
        this.router.navigate([`/home/${idAnonimo}`]);
      });
  }

}
