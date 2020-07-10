import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";
import { FormsModule } from '@angular/forms'  
import { ReactiveFormsModule} from '@angular/forms' 
import { firebaseConfig } from 'src/environments/environment';
import { ModalModifUsuarioPageModule } from './pages/modal-modif-usuario/modal-modif-usuario.module';
import { ModalMenuDetallePageModule } from './pages/modal-menu-detalle/modal-menu-detalle.module';
import { ModalConsultaPageModule } from './pages/modal-consulta/modal-consulta.module';
import { ModalDetallePedidoPageModule } from './pages/modal-detalle-pedido/modal-detalle-pedido.module';


import { FirebaseX } from "@ionic-native/firebase-x/ngx";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    ModalModifUsuarioPageModule,
    ModalConsultaPageModule,
    ModalMenuDetallePageModule,
    ModalDetallePedidoPageModule,
    HttpClientModule
    
  ],
  providers: [
    AngularFirestore,
    StatusBar,
    BarcodeScanner,
    Camera,
    SplashScreen, 
    SplashScreen,
    FirebaseX,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
