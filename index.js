/**
 * @format
 */
import './src/notification/firebase-messaging-background-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeFirebaseMessaging, setupNotificationListeners } from './src/notification/callNotificationService';
import { useEffect } from 'react';

const Root = () => {
  useEffect(() => {
    // setupNotificationChannel();
    initializeFirebaseMessaging();
    setupNotificationListeners();
  }, []);

  return <App />;
};

AppRegistry.registerComponent(appName, () => Root);

// AppRegistry.registerComponent(appName, () => () => {
//     setupNotificationChannel(); 
//     initializeFirebaseMessaging(); 
//     setupNotificationListeners(); 
//       return <App />;
//     });

//     AppRegistry.registerComponent(appName, () => Root);


// import React, { useEffect } from 'react';
// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import {
//   initializeFirebaseMessaging,
//   setupNotificationChannel,
//   setupNotificationListeners,
// } from './src/notification/callNotificationService';

// const Root = () => {
//   useEffect(() => {
//     setupNotificationChannel();
//     initializeFirebaseMessaging();
//     setupNotificationListeners();
//   }, []);

//   return <App />;
// };

// AppRegistry.registerComponent(appName, () => Root);

// import './src/notification/firebase-messaging-background-handler'; // <-- Register headless task
// import React, { useEffect } from 'react';
// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import {
//   initializeFirebaseMessaging,
//   setupNotificationChannel,
//   setupNotificationListeners,
// } from './src/notification/callNotificationService';

// const Root = () => {
//   useEffect(() => {
//     setupNotificationChannel();
//     initializeFirebaseMessaging();
//     setupNotificationListeners();
//   }, []);

//   return <App />;
// };

// AppRegistry.registerComponent(appName, () => Root);


