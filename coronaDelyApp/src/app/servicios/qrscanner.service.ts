import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {
  
  dispositivo = "mobile"; //cambiar a mobile para las pruebas en el celu, cualq. otro nombre para el navegador
  constructor(private scanner: BarcodeScanner) { }
  
  scanQr(options?){
    return this.scanner.scan(options).then(barcodeData => {
      return barcodeData.text;
    }).catch(err => { });
  }

  scanDni(){
    let options = { prompt: "Escaneá el DNI", formats: "PDF_417" };

    return this.scanQr(options).then((response: string) => {
      return response.split('@');
    });
  }
}

