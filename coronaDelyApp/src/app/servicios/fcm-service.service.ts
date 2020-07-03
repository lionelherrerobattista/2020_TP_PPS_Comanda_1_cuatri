import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FCM } from '@ionic-native/fcm/ngx';
import { DataService } from './data.service';
import { NotificacionesService } from './notificaciones.service';
import { Elementos } from '../clases/enums/elementos';
import { Usuario } from '../clases/usuario';
import { Dispositivo } from '../clases/dispositivo';

@Injectable({
  providedIn: 'root'
})
export class FcmServiceService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'key=algo' //ver token a utilizar
  })

  constructor(private dataService: DataService,
              private authService: AuthService,
              private notificacionService: NotificacionesService,
              private http: HttpClient,
              private fcm: FCM) {}

  //obtiene un token desde la funcion
  obtenerToken() {
    this.fcm.getToken().then(token => {
      console.log(token);
      this.guardarToken(token);
    }).catch(error => {
      console.log("Error al obtener el token: " + error);
    });
  }

  //guarda el token en Firebase en Dispositivos
  private guardarToken(token) {
    if (!token) return;
    const data = {
      token,
      userId: this.authService.getCurrentUser().uid
    };
    return this.dataService.setData('dispositivos', data, data.userId);
  }

  notificationSetup() {
      this.fcm.onNotification().subscribe(data => {
        if(!data.wasTapped){        
          this.notificacionService.mostrarToast(data.body,"primary","top", true);
        }
      }, error => {
        console.log("Error: " + error);
      })
  }

  //obtiene un token por perfil
  getTokensByPerfil(userProfile){
      return new Promise((resolve) => { 
        this.dataService.getAll(Elementos.Usuarios).subscribe(usuarios => {
          new Promise((resolve) => resolve(usuarios.map(usuario => usuario.payload.doc.data() as Usuario).filter(usuario => usuario.perfil == userProfile)))
          .then((usersByProfile: any[]) => {
            this.dataService.getAll(Elementos.Dispositivos).subscribe(dispositivos => {
              let devicesByProfile = dispositivos.map(device => device.payload.doc.data() as any)
                                            .filter(dispositivo => usersByProfile.some(usuario => usuario.id == dispositivo.userId))
                                            .map(dispositivo => dispositivo.token);
              if(usersByProfile.length > 0)
                resolve(devicesByProfile);
            });
          });
        });
    });
  }

  //obtiene un token por id
  getTokensById(id){
    return new Promise((resolve) => { 
      this.dataService.getOneDispositivo(Elementos.Dispositivos, id).then(dispositivo => {
        console.log(dispositivo.data());
        let dispositivoById = dispositivo.data().token;
        resolve(dispositivoById);
      });
    });
  }

  enviarNotification(title: string, message: string, to: unknown, redirectTo?: string) {
    console.log(to);
    let body = {
      "notification":{
        "title": title,
        "body": message,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "redirectTo": redirectTo
      },
        "registration_ids": to,
        "priority":"high"
    }

    return this.http.post("https://fcm.googleapis.com/fcm/send", body, { headers: this.headers }).subscribe();
  }

}