import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController,
  ) { }

  ///Funciones que llaman al toast y al modal
  async mostrarToast(mensaje:string, color:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000
    });
    toast.present();
  }
}
