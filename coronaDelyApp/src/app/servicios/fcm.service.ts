import { Injectable } from '@angular/core';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { Platform } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class FcmService {

  dispositivo = 'mobile';//cambiar a web si se quiere probar en internet

  constructor(
    private firebase: FirebaseX,
    private platform: Platform,
  ) { }

  async getToken():Promise<string> {
    let token:string;

    if (this.dispositivo != 'web') {
      if(this.platform.is('android')) {
        token = await this.firebase.getToken();
      }

      // if(this.platform.is('ios')) {
      //   token = await this.firebase.getToken();
      //   verificar permisos
      // }

    } 

    return token;
  }

}
