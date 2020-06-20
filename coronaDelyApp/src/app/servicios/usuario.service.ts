import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map} from "rxjs/operators";
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Usuario } from '../clases/usuario';
import { Elementos } from '../clases/enums/elementos';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  // Esta es la función original
  // saveUserWithLogin(user) {
  //   return this.authService.createUser(user).then(createdUser => {
  //     user.id = createdUser.user.uid;
  //     this.saveUser(user);
  //   })
  // }

  // Uso el async, si no, no me funciona. Esta función hace lo mismo que la original
  async saveUserWithLogin(user) {
    let credenciales = await this.authService.createUser(user);
    user.id = credenciales.user.uid;

    await this.saveUser(user);

    return user;
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

  getUsuario(userId) {
    return this.dataService.getOneUsuario(Elementos.Usuarios, userId);
  }


  getAllUsers(collection): Observable<Usuario[]> {
    return this.dataService.getAll(collection);
  }

  ///Filtra la lista de usuarios de firebase
  ///'Filtro == empleados' para mostrar solo empleados
  ///para los demás casos filtro == nombreperfil
  getUsuariosFiltrados(filtro): Observable<Usuario[]> {
    return this.dataService.getAll('usuarios')
      .pipe(
        map( usuarios => usuarios.filter(usuario => {
          
          let filtrar = false;

          if(filtro == 'empleados') {
            filtrar = usuario.perfil != 'cliente' //para mostrar todos los empleados
          } else {
            filtrar = usuario.perfil == filtro;
          }

          return filtrar
        })
      )
    );
  }

  updateUser(collection: string, id: string, object: any) {
     //Paso clase a object de Javascript para que guarde en Firebase
    return this.dataService.update(collection, id, Object.assign({},object));
  }

  deleteDocument(collection:string, user: any) {
    return this.dataService.deleteDocument(collection, user.id);
  }
  
}
