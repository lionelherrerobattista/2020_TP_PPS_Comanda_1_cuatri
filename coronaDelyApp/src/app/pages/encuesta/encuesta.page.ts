import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/clases/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  object;
  usuario:Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router:Router,
  ) { }

  ngOnInit() {
    // this.object = this.activatedRoute.snapshot.paramMap.get('object');

    this.activatedRoute.paramMap.subscribe(params => {

      let userId = params.get('idUsuario');
      console.log(userId);

      this.usuarioService.getUser(userId).subscribe(user => {
        this.usuario = user;
        console.log(user);
      })

    });
  }

  inicio(){
    this.router.navigate([`/home`]);
  }
}
