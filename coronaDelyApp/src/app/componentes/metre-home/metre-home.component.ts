import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-metre-home',
  templateUrl: './metre-home.component.html',
  styleUrls: ['./metre-home.component.scss'],
})
export class MetreHomeComponent implements OnInit {
  @Input()usuario;

  constructor(
    private authService: AuthService,
    private menu: MenuController) { }

  ngOnInit() {}

}
