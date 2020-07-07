import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from 'src/app/clases/pedido';
import { PedidoService } from 'src/app/servicios/pedido.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Estados } from 'src/app/clases/enums/estados';
import { Usuario } from 'src/app/clases/usuario';
import { Perfiles } from 'src/app/clases/enums/perfiles';
import { Producto } from 'src/app/clases/producto';
import { Sectores } from 'src/app/clases/enums/sectores';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Cliente } from 'src/app/clases/cliente';
import { first } from 'rxjs/operators';
import { Elementos } from 'src/app/clases/enums/elementos';

@Component({
  selector: 'app-empleado-preparar-pedido',
  templateUrl: './empleado-preparar-pedido.component.html',
  styleUrls: ['./empleado-preparar-pedido.component.scss'],
})
export class EmpleadoPrepararPedidoComponent implements OnInit {

  @Input()empleado:Usuario;
  tipoEmpleado:string;
  listaPedidos:Pedido[];
  productosParaPreparar:Producto[];
  filtro:Sectores;

  constructor(
    private pedidoService:PedidoService,
    public toastController: ToastController,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
  ) { 
    this.productosParaPreparar = [];
  }

  ngOnInit() {
    //Guardar la categoría de empleado
    this.tipoEmpleado = this.empleado.perfil;

    //Filtrar la lista que ve según su categoría
    this.pedidoService.getAllOrders().subscribe(pedidos => {
      this.productosParaPreparar = [];
      this.listaPedidos = pedidos.filter(pedido => pedido.estado == Estados.enPreparacion);
      
      //Mostrar la lista correspondiente a cada empleado
      switch(this.tipoEmpleado) {
        case Perfiles.cocinero:
          this.filtro = Sectores.cocina;
          break;
        case Perfiles.bartender:
          this.filtro = Sectores.bar;
          break;
      }

      //Cargar la lista
      for(let pedido of this.listaPedidos) {
        for(let producto of pedido.productos) {
          if(producto.sector == this.filtro && producto.estado == Estados.enPreparacion) {
            producto.idPedido = pedido.id;
            this.productosParaPreparar.push(producto);
          }
        }
      }
    });
  }

  async prepararProducto(producto:Producto){
    let pedidoActual:Pedido;
    let respuesta;

    respuesta = await this.mostrarAlert(producto);

    console.log(respuesta)

    if(respuesta.data == true) {
      pedidoActual = this.buscarPedido(producto.idPedido);

      //Cambiar el estado del producto
      for(let auxProducto of pedidoActual.productos) {
        if(auxProducto.id == producto.id) {
          auxProducto.estado = Estados.listoParaEntregar;    
          this.mostrarToast("Producto listo para entregar.");
          break;
        }
      }
  
      this.comprobarEstadoPedido(pedidoActual);
      this.pedidoService.updateOrder(pedidoActual.id, pedidoActual);
      
    } else {
      this.mostrarToast("Preparación cancelada.");
    }

  }

  ///Busca el pedido correspondiente al producto en preparación
  buscarPedido(idPedido:string):Pedido {
    let pedidoActual;

    for(let pedido of this.listaPedidos) {
      if(pedido.id == idPedido) {
        pedidoActual = pedido;
        break;
      }
    }

    return pedidoActual;
  }

  ///Comprueba el estado de los productos del pedido
  ///Si todos los productos están listos para servir,
  ///Cambia el estado del pedido
  async comprobarEstadoPedido(pedido:Pedido) {
    let estaListo = true;
    let cliente:Cliente;

    for(let producto of pedido.productos) {
      if(producto.estado == Estados.enPreparacion) {
        estaListo = false;
        break;
      }
    }

    if(estaListo){
      
      pedido.estado = Estados.listoParaEntregar;
      cliente = <Cliente> await this.usuarioService.getUser(pedido.idCliente).pipe(first()).toPromise();
      
      cliente.pedido = pedido;

      this.usuarioService.updateUser(Elementos.Usuarios, cliente.id, cliente);
      this.pedidoService.updateOrder(pedido.id, pedido);
      this.mostrarToast('El pedido está listo para entregar');
    }
  }

  ///Funciones que llaman al toast y al alert
  async mostrarToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  
  async mostrarAlert(producto: Producto) {   
    let message = "<div>" +
                    `<ion-label>${producto.descripcion}</ion-label>`;

    message += (producto.fotos.length > 0) ? 
                    `<img src="${producto.fotos[0]}" style="bmenu-radius: 2px">` : 
                      "" + 
                  "</div>"

    const alert = await this.alertController.create({
      header: producto.nombre,
      message: message,
      buttons: [
        {
          text: 'Preparar producto',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });
    alert.present();
    return alert.onDidDismiss().then((data) => {
      return data;
    })
  }

}
