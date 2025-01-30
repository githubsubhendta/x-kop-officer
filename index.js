/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeFirebaseMessaging, setupNotificationChannel, setupNotificationListeners } from './src/notification/callNotificationService';

AppRegistry.registerComponent(appName, () => () => {
    setupNotificationChannel(); 
    initializeFirebaseMessaging(); 
    setupNotificationListeners(); 
      return <App />;
    });
  
