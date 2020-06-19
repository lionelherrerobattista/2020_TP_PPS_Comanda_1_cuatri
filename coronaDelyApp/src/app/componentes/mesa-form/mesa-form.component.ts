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
    private camaraService: CamaraService,
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
    this.camaraService.tomarFoto('mesas', Date.now());
  }

  scannear(){
    let data = this.qrScannerService.scanQr();
    alert(data);
  }

}
