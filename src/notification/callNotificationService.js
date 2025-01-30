// // notificationService.js
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType,AndroidColor, AndroidCategory} from '@notifee/react-native';
// import { navigate } from './../navigation/NavigationService.js';



// export async function setupNotificationChannel() {
//   try {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });
//   } catch (error) {
//     console.error('Error creating notification channel:', error);
//   }
// }

// async function onDisplayNotification(data) {
// console.log("check notification data")
//   const channelId = await notifee.createChannel({
//     id: 'call',
//     name: 'Call Notifications',
//     sound: 'default',
//     importance: AndroidImportance.HIGH,
//   });

//   await notifee.displayNotification({
//     title: `Bhupendra is calling...`,
//     body: 'Incoming voice call',
//     android: {
//       channelId,
//       color: AndroidColor.GREEN,
//       category: AndroidCategory.CALL,
//       autoCancel: true,
//       ongoing: true,
//       actions: [
//         {
//           title: 'Decline',
//           pressAction: { id: 'decline' },
//         },
//         {
//           title: 'Answer',
//           pressAction: { id: 'answer' },
//         },
//       ],
//     },
//   });
//   }

// export function setupNotificationListeners() {
//   notifee.onBackgroundEvent(async ({ type, detail }) => {
//     onDisplayNotification(this.data)
//   });
// }


// export function initializeFirebaseMessaging() {
//   messaging().setBackgroundMessageHandler(handleBackgroundMessage);
// }


import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType, AndroidColor, AndroidCategory } from '@notifee/react-native';
import { navigate } from './../navigation/NavigationService';

// Function to set up notification channels
export async function setupNotificationChannel() {
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    await notifee.createChannel({
      id: 'call',
      name: 'Call Notifications',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });
  } catch (error) {
    console.error('Error creating notification channel:', error);
  }
}

// Function to display incoming call notification
async function onDisplayNotification(data) {
  console.log('check notification data', data);

  const channelId = 'call';

  await notifee.displayNotification({
    title: `Bhupendra is calling...`,  
    body: 'Incoming voice call',
    android: {
      channelId,
      color: AndroidColor.GREEN,
      category: AndroidCategory.CALL,
      autoCancel: true,
      ongoing: true,
      fullScreenAction: {
        id: 'default',
      },
      asForegroundService: true,
      actions: [
        {
          title: 'Decline',
          pressAction: { id: 'decline' },
        },
        {
          title: 'Answer',
          pressAction: { id: 'answer' },
        },
      ],
    },
    
  });
}


export function setupNotificationListeners() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'answer') {
      // Handle answering call
      console.log('Call answered');
      navigate('CallScreen');  // Navigate to the call screen
    } else if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'decline') {
      // Handle declining call
      console.log('Call declined');
    } else {
      onDisplayNotification(detail.notification.data);
    }
  });
}


export async function handleBackgroundMessage(remoteMessage) {
  console.log('Message handled in the background!', remoteMessage);
  onDisplayNotification(remoteMessage.data); 
}

export function initializeFirebaseMessaging() {
  messaging().onMessage(handleBackgroundMessage);
  // messaging().setBackgroundMessageHandler(handleBackgroundMessage);
}
