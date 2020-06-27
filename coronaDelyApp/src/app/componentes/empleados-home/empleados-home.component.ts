import { Component, OnInit,Input } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-empleados-home',
  templateUrl: './empleados-home.component.html',
  styleUrls: ['./empleados-home.component.scss'],
})
export class EmpleadosHomeComponent implements OnInit {
  
  @Input()usuario;
  @Input() perfilEmpleado:string;  

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
