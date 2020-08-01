import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/servicios/camara.service';
import { Mesa } from '../../clases/mesa';
import { MesaService } from '../../servicios/mesa.service';
import { QrScannerService } from '../../servicios/qrscanner.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { LoadingController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-mesa-form',
  templateUrl: './mesa-form.component.html',
  styleUrls: ['./mesa-form.component.scss'],
})
export class MesaFormComponent implements OnInit {

  private mesa:Mesa;
  listaMesas:Mesa[];
  private imagenes: Array<any>;

  constructor(
    private camaraService: CamaraService,
    private mesaService: MesaService,
    private qrScannerService: QrScannerService,
    private notificationService: NotificacionesService,
    private router: Router,
    private toastService:ToastService,
    private loadingController: LoadingController,
  ) { 
    this.mesa = new Mesa();
  }

  ngOnInit() {
    this.traerMesas();
  
  }
 traerMesas(){
  this.mesaService.getAllTables('mesas').subscribe(mesas => {
    this.listaMesas = mesas;
    this.mesa.numero=this.listaMesas.length+1;
    
  });
 }
  registrar(){ 
     
     this.mesa.estado="disponible";
     this.mesaService.saveTable(this.mesa);
     this.presentLoading();
     this.toastService.mostrarToast('Mesa Registrada correctamente', 'success')

     this.router.navigateByUrl('/home');    
  }  


  async cargarFoto(imgName) { 
    
      let imgUrl = await this.camaraService.getImageByName('mesas', imgName);
      this.imagenes.push({ "url": imgUrl, "nombre": imgName });  
    
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
  tomarFoto(){   
    // this.camaraService.tomarFoto('mesas', Date.now());
    this.camaraService.tomarFoto('mesas', Date.now()).then( urlFoto => {
         this.mesa.foto = urlFoto;
         this.presentLoading();
    });   
 
    // alert( this.mesa.foto);
  }

  scannear(){
    let data = this.qrScannerService.scanQr();
    alert(data);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
      message: "Espere un momento..."
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
}
