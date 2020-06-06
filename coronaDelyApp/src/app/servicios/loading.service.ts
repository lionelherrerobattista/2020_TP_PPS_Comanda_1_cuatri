import { Injectable } from '@angular/core';
import Swal, { SweetAlertType } from 'sweetalert2'; //utilice el dt.s
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading;

  constructor(private loadingCtrl: LoadingController, private router: Router) { }

  ngOnInit() {
  }
  async showLoading(message: string) {

    this.loadingCtrl.create({
      message
    }).then((overlay) => {
      this.loading = overlay;
      this.loading.present();
    });
  }

  closeLoading(title?: string, message?: string, typeNotification?: SweetAlertType) {
    setTimeout(() => {
      this.loading.dismiss();
      
      if (message) {
        Swal.fire({
          type: typeNotification,
          title: title,
          text: message,
          backdrop: false
        });
      }
    }, 2000);
  }

  closeLoadingAndRedirect(route: string) {
    setTimeout(() => {
      this.loading.dismiss();
      this.router.navigate(['/home']);
    }, 2000);
  }
}
