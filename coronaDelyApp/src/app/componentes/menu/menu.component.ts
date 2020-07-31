import { Component,EventEmitter , OnInit, Output, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto';
import { CamaraService } from 'src/app/servicios/camara.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { ModalMenuDetallePageModule } from 'src/app/pages/modal-menu-detalle/modal-menu-detalle.module';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { TagPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';
import { ModalMenuDetallePage } from 'src/app/pages/modal-menu-detalle/modal-menu-detalle.page';
import { Cliente } from 'src/app/clases/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  productosMenu:Producto[];
  total:number;
  menu:Producto[];
  @Input()cliente:Cliente;

  // slideOpts = {
  //   slidesPerView: 1,
  //   spaceBetween: 10,
  //   centeredSlides: true
  // };

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
    private productoService: ProductoService,
    private alertController: AlertController,
    private modalController:ModalController,
    private router:Router,
  ) { 
    
    this.productosMenu = [];
    this.menu = [];  
    this.total = 0; 
  }


  ngOnInit() {}

  ///Filtra la lista de productos según la categoría seleccionada
  filtrarLista(event) {
    let filtro = event.target.value;

    this.productoService.getProductosFiltrados(filtro).subscribe( productosFiltrados => {    
      this.productosMenu = productosFiltrados;
    })
  }


  verDetalles(producto: Producto){  
    this.showAlert(producto).then(response => {   
      var cantidad = (response.data) ? response.data.cantidad : "";
      //Agregar el producto a la lista del cliente
      if(cantidad){
        producto.cantidad = Number.parseInt(cantidad);       
        this.menu.push(producto);
        //Calcular total
        this.total += (producto.precio * producto.cantidad);
      }
    });
  }

  //IMPORTANTE! las carpetas de las fotos deben coincidir con las entidades
  async showAlert(producto: Producto) {   
    let message = "<div>" +
                    `<ion-label>${producto.descripcion}</ion-label>`;

    message += (producto.fotos.length > 0) ? 
                    // `<img src="${await this.camaraService.getImageByName('productos', producto.fotos[0])}" style="bmenu-radius: 2px">` : 
                    // `<img src="${producto.fotos[0]}" style="bmenu-radius: 2px">` : 
                      
                      `
                      <ion-slides pager="true" [options]="slideOpts" *ngFor="let foto of producto">
                        <ion-slide>
                        <img src="${producto.fotos[0]}">
                        </ion-slide>
                        <ion-slide>
                        <img src="${producto.fotos[1]}">
                        </ion-slide>
                        <ion-slide>
                        <img src="${producto.fotos[2]}"> 
                        </ion-slide>
                      </ion-slides>
                        
                      ` : + ''
                      +
                  "</div>"

    const alert = await this.alertController.create({
      header: producto.nombre[0].toUpperCase() + producto.nombre.substring(1),
      subHeader: `$${producto.precio}`,
      message: message,
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Cantidad de unidades'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Agregar al pedido', // FALTA AGREGAR AL PEDIDO
          handler: (input) => {
            alert.dismiss(input);
            return false;
          }
        },
      ]
    });
    alert.present();
    return alert.onDidDismiss().then((data) => {
      return data;
    })
  }

  visualizarPedido() {
    this.mostrarModal(this.menu);
    this.router.navigate(['/home', this.cliente.id]);
  }

  async mostrarModal(datos) {
    const modal = await this.modalController.create({
      component: ModalMenuDetallePage,
      componentProps: {
        productos: datos,
        cliente: this.cliente,
        mesa: this.cliente.mesa,
      }
    });
    return await modal.present();
  }

}