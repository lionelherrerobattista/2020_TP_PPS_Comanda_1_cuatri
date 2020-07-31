import { Injectable } from '@angular/core';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private camera: Camera) { }

  getImageByName(collection, imageName) {
    console.log(firebase.storage().ref(`${collection}/${imageName}`).getDownloadURL())
    return firebase.storage().ref(`${collection}/${imageName}`).getDownloadURL();
  }

  deleteImage(collection, imageName) {
    return firebase.storage().refFromURL(imageName).delete();
  }
  // toma la foto
  // async tomarFoto(collection, imageName) {
    
  //   let options: CameraOptions = {
  //     quality: 50,
  //     targetHeight: 600,
  //     targetWidth: 600,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };
  //   try {
  //     let result = await this.camera.getPicture(options);
  //     let image = `data:image/jpeg;base64,${result}`;
  //     //guardo en Firebase Storage
  //     let pictures = firebase.storage().ref(`${collection}/${imageName}`);
  //     //tomo url de foto en Firebase Storage
  //     pictures.putString(image, "data_url").then(() => {
  //       pictures.getDownloadURL().then((url) => {
  //         alert("Foto guardada con éxito: " + url );
  //         return url;
  //       });  
  //     });

  //   } catch (error) {
  //     alert(error);
  //   }
  // }

  ///Toma una foto con la cámara del celular
  ///la guarda en Firestorage
  ///y devuelve una promesa con la url de la foto
  async tomarFoto(collection, imageName):Promise<string> {
    
    let options: CameraOptions = {
      quality: 80,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE
    };
    return new Promise(async (resolve, reject) => {
      
      try {
        let result = await this.camera.getPicture(options);
        let image = `data:image/jpeg;base64,${result}`;
        //guardo en Firebase Storage
        let pictures = firebase.storage().ref(`${collection}/${imageName}`);
        //tomo url de foto en Firebase Storage
        pictures.putString(image, "data_url").then(() => {
          pictures.getDownloadURL().then((url) => {
            // alert("Foto guardada con éxito: " + url );
            resolve(url);
          });  
        });
  
      } catch (error) {
        alert(error);
        reject(error)
      }

    })
  }
}
