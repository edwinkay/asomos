importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging.js');

// Inicializa la aplicación de Firebase en el service worker
firebase.initializeApp({
  apiKey: 'AIzaSyC-xnNzaTCFveAr77Iqf1CQ-wRct6kCBkQ',
  authDomain: 'fitpal-horario.firebaseapp.com',
  projectId: 'fitpal-horario',
  storageBucket: 'fitpal-horario.appspot.com',
  messagingSenderId: '240368209776',
  appId: '1:240368209776:web:7b2960966943d391e049b5'
});

// Recupera una instancia de Firebase Messaging para manejar mensajes en segundo plano
const messaging = firebase.messaging();
