import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  constructor(
    private toastController: ToastController,
    private router: Router) { }

  async mostrarToast(message, color, position, closeButton: boolean = false) {
    const toast = await this.toastController.create({
      message: message,
      duration: (closeButton) ? 0 : 3000,
      position: position,
      color: color,
      showCloseButton: closeButton,
      closeButtonText: "Ok"
    });

    if (closeButton == true) {
      toast.onDidDismiss().then(() => {
        //url acia donde iria
      });

    }
    toast.present();
  }
  }
