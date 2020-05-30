import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth:AngularFireAuth) { }

  ///Login del usuario registrado con email y password
  login(email:string, password:string) {

    return new Promise((resolve, rejected) => {

      this.angularFireAuth.signInWithEmailAndPassword(email, password).then(respuesta => {
        
        resolve(respuesta);

      }).catch(error => rejected(error));
    })
    
  }
}
