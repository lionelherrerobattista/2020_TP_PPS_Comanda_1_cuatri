import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ProductoService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.page.html',
  styleUrls: ['./listas.page.scss'],
})
export class ListasPage implements OnInit {
 
  object;
  perfilEmpleado:string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService
    
    ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');

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

}
