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

  //Registra un usuario.
  //Si se registra, devuelve el usuario.
  //Si no, devuelve una excepción que se tiene que manejar
  async saveUserWithLogin(user) {
    
    return new Promise((resolve, reject) => {
      this.authService.createUser(user).then( async credenciales => {

        credenciales.user.sendEmailVerification();
        user.id = credenciales.user.uid;
  
        await this.saveUser(user);
  
        resolve(user);       
      }).catch(error => reject(error));//Manejar esta excepción!!
    });
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

  getUser(userId):Observable<Usuario>{
    return this.db.collection('usuarios').doc<Usuario>(userId).valueChanges();   
  
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
  getUsuariosFiltrados(filtro): Observable<Usuario[]> {
    return this.dataService.getAll('usuarios')
      .pipe(
        map( usuarios => usuarios.filter(usuario => {
          
          let filtrar = false;

          if(filtro == 'empleados') {
            filtrar = usuario.perfil != 'cliente' && usuario.perfil != 'cliente anonimo' //para mostrar todos los empleados
          } else if (filtro == 'clientes') {

            filtrar = usuario.perfil == 'cliente' || usuario.perfil == 'cliente anonimo' //para mostrar todos los clientes

          } else {
            filtrar = usuario.perfil == filtro; //para mostrar algo en particular
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
