import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/clases/producto';
import { ProductoService } from 'src/app/servicios/producto.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.scss'],
})
export class ProductoListaComponent implements OnInit {

  listaProductos:Producto[];
  filtro:string;

  constructor(
    private productoService: ProductoService,
    public alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
  ) { 
    this.listaProductos = [];
    this.filtro = 'productos';
  }

  ngOnInit() {
    // this.productoService.getProductosFiltrados(this.filtro).subscribe( prod => {
    //   this.listaProductos = prod;
    //   console.log(prod);
    // })
  }

  filtrarLista() {
    // this.productoService.getProductosFiltrados(this.filtro).subscribe( productosFiltrados => {
    //   console.log(productosFiltrados)
    //   this.listaProductos = productosFiltrados;
    // })
  }

  modificarProducto(producto) {
    this.mostrarModal(producto);
  }

  async eliminarProducto(producto:Producto) {

    let resultado;
    //Configurar el alert
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: '¿Está seguro que desea eliminar a este producto?',    
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            resultado = 'cancelado';
          }
        },
        {
          text: 'Confirmar',
          role: 'Confirmar',
          cssClass: '.danger-alert-btn',
          handler: () => {
            // this.productoService.deleteDocument('productos', producto);
            resultado = 'eliminado';
          }
        },
      ]
    });

    await alert.present();
    resultado = await alert.onDidDismiss();

    if(resultado == 'eliminado') {
      this.mostrarToast('Producto eliminado')
    } else {
      console.log('cancelado');
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

  async mostrarModal(datos) {
    // const modal = await this.modalController.create({
    //   component: ModalModifProductoPage,
    //   componentProps: {
    //     usuario: datos,
    //   }
    // });

    // return await modal.present();
  }



}