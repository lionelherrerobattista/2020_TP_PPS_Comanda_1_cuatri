import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/clases/usuario';
import { Perfiles } from 'src/app/clases/enums/perfiles';

@Component({
  selector: 'app-carta-comanda',
  templateUrl: './carta-comanda.page.html',
  styleUrls: ['./carta-comanda.page.scss'],
})
export class CartaComandaPage implements OnInit {

  idUsuario:string;
  usuario:Usuario;


  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private usuarioService:UsuarioService,
  ) { 
    console.log("pedido-page")
  }

  ngOnInit() {
    this.idUsuario = this.activatedRoute.snapshot.paramMap.get('idUsuario');
    this.getUsuario();
  }

   ///Recupera el usuario actual de la base de datos
  async getUsuario(){
    this.usuarioService.getUser(this.idUsuario)
      .subscribe(usuario => {
        this.usuario = usuario;
      }); 
  }


  inicio(){
    if(this.usuario.perfil == Perfiles.clienteAnonimo) {
      this.router.navigate([`/home`, this.usuario.id]);  
    } else {
      this.router.navigate([`/home`]);
    }
    
  }
}
