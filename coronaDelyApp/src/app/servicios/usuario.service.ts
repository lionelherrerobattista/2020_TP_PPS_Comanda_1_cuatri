import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Usuario } from '../clases/usuario';
import { Collections } from '../clases/enums/collections';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  resultado: any =  [];
  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  saveUserWithLogin(user) {

    
    return this.authService.createUser(user).then(createdUser => {
      user.id = createdUser.user.uid;
      this.saveUser(user);
    })
  }

  saveUser(user) {
    
    this.db.collection('usuarios').doc(user.id).set(Object.assign({}, user));
  }

  createUsuario(user:Usuario) {
    
    return this.db.collection('usuarios').add({...user});
  }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }

    getUserById(userId) {
        return this.db.collection<Usuario>('usuarios', (ref) =>  ref.where ('id', '==', userId).limit(1)). valueChanges();   
    }
    getUsusario(userId) {
      return this.dataService.getOne(Collections.Usuarios, userId);
  }


  getAllUsers(collection): Observable<DocumentChangeAction<Usuario>[]> {
     return this.dataService.getAll(collection);
  }

  updateUser(collection: string, id: string, object: any) {
    return this.dataService.update(collection, id, object);
  }

  deleteDocument(collection:string, user: any) {
    return this.dataService.deleteDocument(collection, user.id);
  }

  

}
