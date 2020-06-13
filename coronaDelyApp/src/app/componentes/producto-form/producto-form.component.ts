import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/clases/producto';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/servicios/camara.service';
import { QrScannerService } from 'src/app/servicios/qrscanner.service';
import { ProductoService } from 'src/app/servicios/producto.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss'],
})
export class ProductoFormComponent implements OnInit {
  private producto:Producto;

  constructor(
    private cameraService: CamaraService,
    private productoService: ProductoService,
    private qrscannerService: QrScannerService,
    private router: Router
  ) { 
    this.producto = new Producto();
  }

  ngOnInit() {}

  registro(){ 
    this.productoService.saveProduct(this.producto).then(() => {
      this.router.navigateByUrl('/listado/productos');
    });
  }  

  tomarFoto(){   
    this.cameraService.tomarFoto('productos', Date.now());
  }

  scan(){
    let data = this.qrscannerService.scanDni();
    alert(data);
  }
}
