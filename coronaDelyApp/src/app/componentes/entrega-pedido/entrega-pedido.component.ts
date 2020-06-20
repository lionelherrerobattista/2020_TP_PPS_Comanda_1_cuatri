import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-entrega-pedido',
  templateUrl: './entrega-pedido.component.html',
  styleUrls: ['./entrega-pedido.component.scss'],
})
export class EntregaPedidoComponent implements OnInit {

  @Input() pedido: object;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private notificationService: NotificacionesService,
    private router: Router
  ) { }

  ngOnInit() {}

  guardarPedido(){
    this.pedidoService.saveOrder(this.authService.getCurrentUser().uid, this.pedido);
    this.notificationService.mostrarToast("Pedido realizado con éxito", "success", "top");
    this.router.navigateByUrl("/inicio")
  }

}