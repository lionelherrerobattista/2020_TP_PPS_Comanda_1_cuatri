import { Component, OnInit,Input } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { MenuController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { PedidoService } from 'src/app/servicios/pedido.service';

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
    private pedidoService:PedidoService,
    private menu: MenuController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    // if(this.usuario.perfil == 'bartender' || this.usuario.perfil == 'cocinero') {
    //     this.pedidoService.getAllOrders().subscribe(pedidos => {
    //       this.mostrarToast('Se ha añadido un nuevo pedido');
    //     });
    // } 
  }


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  logout(){
    this.authService.logOut();
  }

  ///Funciones que llaman al toast y al alert
  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
}
