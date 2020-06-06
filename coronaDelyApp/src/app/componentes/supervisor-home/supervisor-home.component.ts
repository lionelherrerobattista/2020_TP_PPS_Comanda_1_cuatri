import { Component, OnInit, Input} from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-supervisor-home',
  templateUrl: './supervisor-home.component.html',
  styleUrls: ['./supervisor-home.component.scss'],
})
export class SupervisorHomeComponent implements OnInit {

  @Input()usuario;

  constructor(
    private authService: AuthService,
    private menu: MenuController,

  ) { }

  ngOnInit() {}

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  logout(){
    this.authService.logOut();
  }

}
