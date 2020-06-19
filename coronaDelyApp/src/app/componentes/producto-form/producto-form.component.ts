import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/clases/producto';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/servicios/camara.service';
import { QrScannerService } from 'src/app/servicios/qrscanner.service';
import { ProductoService } from 'src/app/servicios/producto.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { url } from 'inspector';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss'],
})
export class ProductoFormComponent implements OnInit {

  private dispositivo="web";

  @Input() idProducto: string = "";
  private producto:Producto;
  private imagenes: Array<any>;
  private esModificacion: boolean;

  constructor(
    private camaraService: CamaraService,
    private notificationService: NotificacionesService,
    private productoService: ProductoService,
    private qrscannerService: QrScannerService,
    private router: Router
  ) { 
    this.producto = new Producto();
    this.esModificacion = false;
    this.imagenes = new Array<object>();    

  }

  ngOnInit() {
    if (this.idProducto) {
      this.esModificacion = true;
      this.productoService.getProduct(this.idProducto).then(prod => {
        this.producto = prod.data() as Producto;
        this.producto.fotos.forEach(photo => {
          this.cargarFoto(photo);
        })
      });
    }
  }

  async cargarFoto(imgName) {
    if (this.dispositivo=="web"){
      let imgUrl = await this.camaraService.getImageByName('productos', 'pollo-arroz.jpg');
      this.imagenes.push({ "nombre": "pollo-arroz.jpg", "url": imgUrl });
                                                          
    }else // si es mobile
    { 
      let imgUrl = await this.camaraService.getImageByName('productos', imgName);
      this.imagenes.push({ "url": imgUrl, "nombre": imgName });
    }
    
  }

  eliminarFoto(imgName) {
    this.camaraService.deleteImage('productos', imgName).then(
      resp => {
        this.imagenes = this.imagenes.filter(x => x.nombre != imgName);
      },
      err => {
        this.notificationService.mostrarToast("Error al eliminar la foto.", "danger", "bottom");
      })
  }
  registro(){ 
    console.log("producto", this.producto)
    this.producto.fotos = this.imagenes;
    if (this.esModificacion) {
      this.productoService.modifyProduct(this.idProducto, this.producto).then(() => {
        this.notificationService.mostrarToast("Producto modificado", "success", "middle");
        this.router.navigateByUrl('/listado/productos');
      });
    }
    else { // Se da de alta el producto
      this.productoService.saveProduct(this.producto).then(item => {
        this.notificationService.mostrarToast("Producto creado", "success", "middle");
        this.router.navigateByUrl('/listado/productos');
      });
    }
  }  

  async tomarFoto(){   
    if (this.imagenes.length < 3) {
      let imgName = `${this.producto.nombre}-${Date.now()}`;
      await this.camaraService.tomarFoto('productos', imgName);
      this.cargarFoto(imgName);
    }
    else {
      this.notificationService.mostrarToast("Solo se pueden subir 3 fotos.", "danger", "middle");
    }
  }

  scannearQR(){
    let data = this.qrscannerService.scanQr();
    alert(data);
  }
}
