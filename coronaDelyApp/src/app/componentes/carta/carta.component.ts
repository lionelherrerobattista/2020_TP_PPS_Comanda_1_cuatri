import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/clases/producto';
import { ProductoService } from 'src/app/servicios/producto.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss'],
})
export class CartaComponent implements OnInit {

 
  productosMenu:Producto[];
  total:number;
  menu:Producto[];

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
      buttons: [
        {
          text: 'Volver',
          handler: () => {
            alert.dismiss(false);
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

}
