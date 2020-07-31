import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//Utilizo la función cada vez que se crea un nuevo cliente
exports.notificacionNuevoCliente = functions.firestore
    .document('usuarios/{idUsuario}')
    .onCreate(async event => {
        const data = event.data();

        //Tomo los datos del usuario
        // const idUsuario = data.id;
        let perfil = data.perfil;

        if(perfil === 'cliente') {

            perfil= perfil.charAt(0).toUpperCase() + perfil.slice(1);

            //contenido de la notificacion
            const payload = {
                notification: {
                    title:'Nuevo cliente',
                    body:  `${perfil} esperando aprobación` ,
                    icon:'drawable-xxxhdpi-icon'
                }
            }

            // Buscar los token de quienes reciben el mensaje:
            //ref al documento padre
            const db = admin.firestore();
            const devicesRef = db.collection('usuarios').where('perfil', '==', 'supervisor');

            //tomar los tokens y enviar las notificaciones
            const devices = await devicesRef.get();

            const tokens:string[] = [];//los tokens de los dispositivos

            //iterar los documentos y cargar el array
            devices.forEach(resultado => {
                const token = resultado.data().token;

                console.log(token);

                if(token != '' && token != undefined) {
                    tokens.push(token);
                }
            });

            return admin.messaging().sendToDevice(tokens, payload);

        }
        
        return 'Nuevo usuario';
    });

//Envía una push notification cada vez que se crea una nueva reserva
    exports.notificacionNuevaReserva = functions.firestore
    .document('reservas/{idReserva}')
    .onCreate(async event => {
        // const data = event.data();

            //contenido de la notificacion
            const payload = {
                notification: {
                    title:'Nueva reserva',
                    body:  `Se creó una nueva reserva` ,
                    icon: 'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
                }
            }

            // Buscar los token de quienes reciben el mensaje:
            //ref al documento padre
            const db = admin.firestore();
            const devicesRef = db.collection('usuarios').where('perfil', '==', 'supervisor');

            //tomar los tokens y enviar las notificaciones
            const devices = await devicesRef.get();

            const tokens:string[] = [];//los tokens de los dispositivos

            //iterar los documentos y cargar el array
            devices.forEach(resultado => {
                const token = resultado.data().token;

                console.log(token);

                if(token != '' && token != undefined) {
                    tokens.push(token);
                }
            });

            return admin.messaging().sendToDevice(tokens, payload);

    });

//Envía una notificación cuando el cliente ingresa en la lista de espera
exports.notificacionListaDeEspera = functions.firestore
    .document('usuarios/{idUsuario}')
    .onUpdate(async event => {
        const data = event.after.data();

        //Tomo los datos del usuario
        // const idUsuario = data.id;
        let perfil = data.perfil;
        let estado = data.estado;
        

        if((perfil === 'cliente' || perfil === 'cliente anonimo') && estado === 'enEspera') {
            perfil= perfil.charAt(0).toUpperCase() + perfil.slice(1);

            //contenido de la notificacion
            const payload = {
                notification: {
                    title:`${perfil} en lista de espera`,
                    body:  `${perfil} esperando que se le asigne una mesa` ,
                    icon:'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
                }
            }

            // Buscar los token de quienes reciben el mensaje:
            //ref al documento padre
            const db = admin.firestore();
            const devicesRef = db.collection('usuarios').where('perfil', '==', 'metre');

            //tomar los tokens y enviar las notificaciones
            const devices = await devicesRef.get();

            const tokens:string[] = [];//los tokens de los dispositivos

            //iterar los documentos y cargar el array
            devices.forEach(resultado => {
                const token = resultado.data().token;

                console.log(token);

                if(token != '' && token != undefined) {
                    tokens.push(token);
                }
            });

            return admin.messaging().sendToDevice(tokens, payload);
        }

        return 'No es cliente';
    });

//Envía una notificación a cada mozo cada vez que se genera una nueva consulta
exports.notificacionNuevaConsulta = functions.firestore
    .document('consultas/{idConsulta}')
    .onCreate(async event => {
        const data = event.data();

        //Tomo los datos del usuario
        // const idUsuario = data.id;
        let mesa = data.nroMesa;
        let consulta = data.textoConsulta;

        //contenido de la notificacion
        const payload = {
            notification: {
                title:`Nueva consulta de mesa ${mesa}`,
                body:  `${consulta}` ,
                icon:'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
            }
        }

        // Buscar los token de quienes reciben el mensaje:
        //ref al documento padre
        const db = admin.firestore();
        const devicesRef = db.collection('usuarios').where('perfil', '==', 'mozo');

        //tomar los tokens y enviar las notificaciones
        const devices = await devicesRef.get();

        const tokens:string[] = [];//los tokens de los dispositivos

        //iterar los documentos y cargar el array
        devices.forEach(resultado => {
            const token = resultado.data().token;

            console.log(token);

            if(token != '' && token != undefined) {
                tokens.push(token);
            }
        });

        return admin.messaging().sendToDevice(tokens, payload);
    });


//Envía la notificación cada vez que se genera un nuevo producto
//Al empleado del sector correspondiente
exports.notificacionNuevoPedido = functions.firestore
    .document('pedidos/{idPedido}')
    .onCreate(async event => {
        const data = event.data();
        let paraCocinero = false;
        let paraBartender = false;

        //Tomo los datos del usuario
        // const idUsuario = data.id;
        let productos = data.productos;

        for(let producto of productos) {

            if(producto.sector === 'cocina'){
                paraCocinero = true;
            } else if (producto.sector === 'bar') {
                paraBartender = true;
            }

            if(paraBartender && paraCocinero){
                break;
            }
        }


        if(paraCocinero) {

            //contenido de la notificacion
            const payload = {
                notification: {
                    title:`Nuevo producto para preparar`,
                    body:  `Consultar lista` ,
                    icon:'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
                }
            }

            // Buscar los token de quienes reciben el mensaje:
            //ref al documento padre
            const db = admin.firestore();
            const devicesRef = db.collection('usuarios').where('perfil', '==', 'cocinero');

            //tomar los tokens y enviar las notificaciones
            const devices = await devicesRef.get();

            const tokens:string[] = [];//los tokens de los dispositivos

            //iterar los documentos y cargar el array
            devices.forEach(resultado => {
                const token = resultado.data().token;

                console.log(token);

                if(token != '' && token != undefined) {
                    tokens.push(token);
                }
            });

            return admin.messaging().sendToDevice(tokens, payload);
            
        }


        if(paraBartender) {

            //contenido de la notificacion
            const payload = {
                notification: {
                    title:`Nuevo producto para preparar`,
                    body:  `Consultar lista`,
                    icon:'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
                }
            }

            // Buscar los token de quienes reciben el mensaje:
            //ref al documento padre
            const db = admin.firestore();
            const devicesRef = db.collection('usuarios').where('perfil', '==', 'bartender');

            //tomar los tokens y enviar las notificaciones
            const devices = await devicesRef.get();

            const tokens:string[] = [];//los tokens de los dispositivos

            //iterar los documentos y cargar el array
            devices.forEach(resultado => {
                const token = resultado.data().token;

                console.log(token);

                if(token != '' && token != undefined) {
                    tokens.push(token);
                }
            });

            return admin.messaging().sendToDevice(tokens, payload);
            
        }
        

        return 'Se enviaron los mensajes';
    });


//Envía una notificación cuando el pedido está listo para servir
exports.notificacionPedidoListo = functions.firestore
.document('pedidos/{idPedido}')
.onUpdate(async event => {
    const data = event.after.data();

   let estado = data.estado;
   let numeroMesa = data.mesa.numero;
    

    if(estado == 'listo para entregar') {
        //contenido de la notificacion
        const payload = {
            notification: {
                title:`Pedido ${estado}`,
                body:  `Entregar a mesa nro. ${numeroMesa}` ,
                icon:'https://firebasestorage.googleapis.com/v0/b/coronadelyapp.appspot.com/o/icon.png?alt=media&token=e46394bd-a2c8-4b75-8dcb-0fb58316928b'
            }
        }

        // Buscar los token de quienes reciben el mensaje:
        //ref al documento padre
        const db = admin.firestore();
        const devicesRef = db.collection('usuarios').where('perfil', '==', 'mozo');

        //tomar los tokens y enviar las notificaciones
        const devices = await devicesRef.get();

        const tokens:string[] = [];//los tokens de los dispositivos

        //iterar los documentos y cargar el array
        devices.forEach(resultado => {
            const token = resultado.data().token;

            console.log(token);

            if(token != '' && token != undefined) {
                tokens.push(token);
            }
        });

        return admin.messaging().sendToDevice(tokens, payload);
    }

    return 'No esta listo todavía';
});


// exports const enviarPush = functions.database.ref('/bar').onWrite(event => {
//   const tokens = "";
//   const payload = {};
//   return admin.messaging().sendToDevice(tokens, payload);  
// })