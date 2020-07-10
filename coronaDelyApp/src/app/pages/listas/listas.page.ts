import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';


@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage implements OnInit {
 
  object;
  titulo:string;
  perfilEmpleado:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router:Router,
    private usuarioService: UsuarioService,    
    ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');

    switch(this.object) {
  
      case "listaEsperaMetre":
        this.titulo = "Lista de espera de clientes";
      case "mesas":
        this.titulo = "Lista de Mesas"
    }
    console.log(this.object);
    if(this. object != 'cliente') {
      let user = this.authService.getCurrentUser();
      this.usuarioService.getUserById(user.uid)
        .subscribe(userData => { 
          console.log(userData[0]);
          //Buscar el perfil para controlar a quién puede dar de alta
          this.perfilEmpleado=userData[0].perfil;
          
        })
    }      
  }

  inicio(){
    this.router.navigate([`/home`]);
  }
}
