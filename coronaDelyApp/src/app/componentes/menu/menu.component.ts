import { Component,EventEmitter , OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto';
import { CamaraService } from 'src/app/servicios/camara.service';
import { ProductoService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public  productos: Array<Producto>  = new Array<Producto>();
  private total: number = 0;
  private menu: Array<Producto> = new Array<Producto>();
  @Output() menuEnvio: EventEmitter<object> = new EventEmitter<object>();

  slideOpts = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true
  };

  constructor(
    private productoService: ProductoService,
    private alertController: AlertController,
    private camaraService: CamaraService
  ) { 
    this.productoService.getAllProductos('productos').subscribe(elementos => {
      console.log("elementos ",elementos )
      for (let i = 0; i < elementos.length; i++) {
        console.log("elementos[i],i ",elementos[i],i )
          this.productos[i] = elementos[i] as Producto;
      }
      console.log("this.productos",this.productos)
    });
  }


  ngOnInit() {
  }

  verDetalles(producto: Producto){
    console.log("verDetalles")
    this.showAlert(producto).then(response => {
      console.log("response", response)
      var cantidad = (response.data) ? response.data.cantidad : "";
      if(cantidad){
        console.log("cantidad", cantidad)
        for(let i = 0; i < cantidad; i++){
          this.menu.push(producto);
        }
        let reducer = ( acumulador, currentProduct ) => acumulador + currentProduct.precio;

        this.total = this.menu.reduce(reducer, 0)
      }
    });
  }

  async showAlert(producto: Producto) {
    console.log(producto,"producto y foto")
    console.log(producto.descripcion)
    console.log(producto.fotos.length)
    let message = "<div>" +
                    `<ion-label>${producto.descripcion}</ion-label>`;

    message += (producto.fotos.length > 0) ? 
                    `<img src="${await this.camaraService.getImageByName('productos', producto.fotos[0])}" style="bmenu-radius: 2px">` : 
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
          text: 'Agregar al pedido',
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

  sendMenu(){
    this.menuEnvio.emit({"menu":this.menu, "precio": this.total});
  }

}