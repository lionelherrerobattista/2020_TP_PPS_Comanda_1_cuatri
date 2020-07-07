import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor( private AFauth: AngularFireAuth, 
    private router: Router) {

     }

  ///Login del usuario registrado con email y password
  logIn(email: string, password: string):Promise<firebase.auth.UserCredential> {
   console.log("auth-login")
    return new Promise((resolve, reject) => {

      
      this.AFauth.auth.signInWithEmailAndPassword(email, password)
       .then(respuesta => {  

        // respuesta.user.sendEmailVerification()
          
          resolve(respuesta);
        }).catch(error => {reject(error)});
    })    
  }

  logOut() {
    this.AFauth.auth.signOut().then(auth => {
      this.router.navigate(['/login']);
    })
  }

  getCurrentUser() {
      console.log("auth-getCurrentUser", this.AFauth.auth.currentUser)
      return this.AFauth.auth.currentUser;
    
  }

  createUser(user) {
    return this.AFauth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  //Paola- esto falta configurar
  // async googleSigin() {
  //   const provider = new auth.GoogleAuthProvider();
  //   const credential = await this.AFauth.auth.signInWithPopup(provider);
  //   return credential.user;
  // }

  // async facebookSigin() {
  //   const provider = new auth.FacebookAuthProvider();
  //   const credential = await this.AFauth.auth.signInWithPopup(provider);
  //   return credential.user;
  // }



}