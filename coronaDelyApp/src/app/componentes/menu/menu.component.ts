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

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  productosMenu:Producto[];
  total:number;
  menu:Producto[];
  idUsuario:string;
  @Input()idMesa:string;
  // @Output() menuEnvio: EventEmitter<object> = new EventEmitter<object>();

  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private productoService: ProductoService,
    private alertController: AlertController,
    // private camaraService: CamaraService
    private modalController:ModalController,
    private authService:AuthService,
  ) { 
    
    this.productosMenu = [];
    this.menu = [];  
    this.total = 0; 
  }


  ngOnInit() {

    this.idUsuario = this.authService.getCurrentUser().uid;
    this.productoService.getAllProductos('productos').subscribe(elementos => {     
      for (let i = 0; i < elementos.length; i++) {      
        this.productosMenu[i] = elementos[i] as Producto;
      }    
    });
  }

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

        // for(let i = 0; i < cantidad; i++){
        //   this.menu.push(producto);
        // }
        // let reducer = ( acumulador, currentProduct ) => acumulador + currentProduct.precio;
        // this.total = this.menu.reduce(reducer, 0)
      }
    });
  }

  //IMPORTANTE! las carpetas de las fotos deben coincidir con las entidades
  async showAlert(producto: Producto) {   
    let message = "<div>" +
                    `<ion-label>${producto.descripcion}</ion-label>`;

    message += (producto.fotos.length > 0) ? 
                    // `<img src="${await this.camaraService.getImageByName('productos', producto.fotos[0])}" style="bmenu-radius: 2px">` : 
                    `<img src="${producto.fotos[0]}" style="bmenu-radius: 2px">` : 
                      "" + 
                  "</div>"

    const alert = await this.alertController.create({
      header: producto.nombre,
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
          text: 'Agregar al pedido', // FALTA AGREGAR AL PEDIDO
          handler: (input) => {
            alert.dismiss(input);
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

  // sendMenu(){
  //   this.menuEnvio.emit({"menu":this.menu, "precio": this.total});
  // }

  visualizarPedido() {
    this.mostrarModal(this.menu);
  }

  async mostrarModal(datos) {
    const modal = await this.modalController.create({
      component: ModalMenuDetallePage,
      componentProps: {
        productos: datos,
        idCliente: this.idUsuario,
        idMesa: '1',
      }
    });
    return await modal.present();
  }

}