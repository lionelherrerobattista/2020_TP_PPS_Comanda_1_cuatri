import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/servicios/camara.service';
import { Mesa } from '../../clases/mesa';
import { MesaService } from '../../servicios/mesa.service';
import { QrScannerService } from '../../servicios/qrscanner.service';


@Component({
  selector: 'app-mesa-form',
  templateUrl: './mesa-form.component.html',
  styleUrls: ['./mesa-form.component.scss'],
})
export class MesaFormComponent implements OnInit {

  private mesa:Mesa;

  constructor(
    private cameraService: CamaraService,
    private mesaService: MesaService,
    private qrScannerService: QrScannerService,
    private router: Router
  ) { 
    this.mesa = new Mesa();
  }

  ngOnInit() {}

  registrar(){ 
    this.mesaService.saveTable(this.mesa).then(() => {
      this.router.navigateByUrl('/listado/mesas');
    });
  }  

  takePhoto(){
    //Cambiar nombre de la foto (segundo parametro)
    this.cameraService.tomarFoto('mesas', Date.now());
  }

  scannear(){
    let data = this.qrScannerService.scanDni();
    alert(data);
  }

}
