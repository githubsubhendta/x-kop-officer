// src/notification/firebase-messaging-background-handler.js

import messaging from '@react-native-firebase/messaging';
import { handleBackgroundMessage } from './callNotificationService';

// This runs even when the app is in the background or killed
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('✅ [Background Handler] Message:', remoteMessage);
  await handleBackgroundMessage(remoteMessage);
});
