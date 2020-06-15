import { Component, OnInit,EventEmitter, ViewChild, ElementRef, Output, AfterViewInit } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { NgForm } from '@angular/forms';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google:any;

@Component({
  selector: 'app-delivery-ruta',
  templateUrl: './delivery-ruta.component.html',
  styleUrls: ['./delivery-ruta.component.scss'],
})
export class DeliveryRutaComponent implements OnInit, AfterViewInit {

 
  @ViewChild('mapElement', { static: false }) mapNativeElement: ElementRef;
  @ViewChild('origen', { read: ElementRef, static: false }) startLocationElement: ElementRef
  @ViewChild('destino', { read: ElementRef, static: false }) endLocationElement: ElementRef

  direccionesService = new google.maps.DirectionsService;
  direccionesDisplay = new google.maps.DirectionsRenderer;
  form: NgForm;
  map;
  tiempo: String = "";
  @Output() tiempoEnvio: EventEmitter<object> = new EventEmitter<object>();

  constructor(
    private geolocalizacion: Geolocation,
    private http: HttpClient,
    private notificacionService: NotificacionesService
  ) { 
    console.log("delivery-ruta")
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit")
    let latLng = { lat: -34.61, lng: -58.37 }
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: 11,
      center: latLng,
      disableDefaultUI: true,
    });

    this.geolocalizacion.getCurrentPosition().then((resp) => {
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      this.autocompletarUbicacion(latitude, longitude);
      this.map.setCenter({ lat: latitude, lng: longitude });
      latLng = { lat: latitude, lng: longitude };
     }).catch((error) => {
       console.log('Error al obtener la ubicacion', error);
     }).finally(() => {
        new google.maps.Marker({
          position: latLng,
          map: this.map
        });
     }); 
    this.autocompletadoDireccion();
    this.direccionesDisplay.setMap(this.map);
  }

   success(pos) {
    var crd = pos.coords;
  
    console.log('Tu posicion actual es:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('Mas o Menos ' + crd.accuracy + ' metros.');
  };
  // Calcula el tiempo del trayecto y lo despliega en el mapa
  calcularYMostrarRuta(formValues) {
    const that = this;
    this.direccionesService.route({
      origin: formValues.origen,
      destination: formValues.destino,
      region: 'ar'
    }, (response, status) => {
      if (status === 'OK') {
        that.direccionesDisplay.setDirections(response);
        this.tiempo = response.routes[0].legs[0].duration.text;
        this.notificacionService.mostrarToast(`Tiempo de entrega estimado: ${this.tiempo}`, "primary", "top")
      } 
    });
  }

  // Completa el campo de Origen del envio con la dirección tomada del GPS
  autocompletarUbicacion(latitude, longitude){
    this.geocode(latitude, longitude).subscribe((response:any) => {
      if(response.status === "OK") {
        this.endLocationElement.nativeElement.value = response.results[0].formatted_address;
      }
      this.startLocationElement.nativeElement.value = "Avenida Bartolomé Mitre 750, Avellaneda";
    });
  }

  geocode(latitude, longitude){
    return this.http
    .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAGS1es2kjUoVdPlWCg3WGQ21iWxKufGXA`);
  }

  // Permite tener un buscado de direcciones correspondientes a Argentina
  autocompletadoDireccion(){
    var options = {
      componentRestrictions: {country: 'ar'}
    };

    this.startLocationElement.nativeElement.getInputElement().then(input => {
      var autocomplete = new google.maps.places.Autocomplete(input,options);
    });
    this.endLocationElement.nativeElement.getInputElement().then(input => {
      var autocomplete = new google.maps.places.Autocomplete(input,options);
    });
  }

  rutaEnvio(){
    this.tiempoEnvio.emit({"tiempo": this.tiempo, "destino": this.endLocationElement.nativeElement.value});
  }


}
