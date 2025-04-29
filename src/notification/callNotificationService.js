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


// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType, AndroidColor, AndroidCategory } from '@notifee/react-native';
// import { navigate } from './../navigation/NavigationService';

// // Function to set up notification channels
// export async function setupNotificationChannel() {
//   try {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });
//     await notifee.createChannel({
//       id: 'call',
//       name: 'Call Notifications',
//       sound: 'default',
//       importance: AndroidImportance.HIGH,
//     });
//   } catch (error) {
//     console.error('Error creating notification channel:', error);
//   }
// }

// // Function to display incoming call notification
// async function onDisplayNotification(data) {
//   console.log('check notification data', data);

//   const channelId = 'call';

//   await notifee.displayNotification({
//     title: `Bhupendra is calling...`,  
//     body: 'Incoming voice call',
//     android: {
//       channelId,
//       color: AndroidColor.GREEN,
//       category: AndroidCategory.CALL,
//       autoCancel: true,
//       ongoing: true,
//       fullScreenAction: {
//         id: 'default',
//       },
//       asForegroundService: true,
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
// }


// export function setupNotificationListeners() {
//   notifee.onBackgroundEvent(async ({ type, detail }) => {
//     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'answer') {
//       // Handle answering call
//       console.log('Call answered');
//       navigate('CallScreen');  // Navigate to the call screen
//     } else if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'decline') {
//       // Handle declining call
//       console.log('Call declined');
//     } else {
//       onDisplayNotification(detail.notification.data);
//     }
//   });
// }


// export async function handleBackgroundMessage(remoteMessage) {
//   console.log('Message handled in the background!', remoteMessage);
//   onDisplayNotification(remoteMessage.data); 
// }

// export function initializeFirebaseMessaging() {
//   messaging().onMessage(handleBackgroundMessage);
//   // messaging().setBackgroundMessageHandler(handleBackgroundMessage);
// }


// callNotificationService.js
// import messaging from '@react-native-firebase/messaging';
// import notifee, {
//   AndroidImportance,
//   EventType,
//   AndroidColor,
//   AndroidCategory,
//   AndroidVisibility
// } from '@notifee/react-native';
// import { navigate } from './../navigation/NavigationService';

// // Call notification channel setup
// export async function setupNotificationChannel() {
//   try {
//     // Call channel with high importance
//     await notifee.createChannel({
//       id: 'call',
//       name: 'Call Notifications',
//       sound: 'default',
//       importance: AndroidImportance.HIGH,
//       vibration: true,
//       vibrationPattern: [300, 600, 300, 600, 300, 600],
//       lights: true,
//       lightColor: AndroidColor.RED,
//       bypassDnd: true,
//       visibility: AndroidVisibility.PUBLIC,
//     });

//     console.log('Call channel created successfully');
//   } catch (error) {
//     console.error('Error creating call channel:', error);
//   }
// }

// // Display incoming call notification
// async function displayCallNotification(data) {
//   try {
//     const callerInfo = typeof data.userInfo === 'string' ? 
//       JSON.parse(data.userInfo) : data.userInfo;

//     await notifee.displayNotification({
//       id: `call_${Date.now()}`,
//       title: `Incoming Call from ${callerInfo?.name || 'Caller'}`,
//       body: 'Tap to answer',
//       data: data,
//       android: {
//         channelId: 'call',
//         smallIcon: 'ic_notification',
//         color: '#FF0000',
//         importance: AndroidImportance.HIGH,
//         fullScreenIntent: true,
//         pressAction: {
//           id: 'default',
//           launchActivity: 'default',
//         },
//         actions: [
//           {
//             title: 'Decline',
//             pressAction: {
//               id: 'decline',
//             },
//           },
//           {
//             title: 'Answer',
//             pressAction: {
//               id: 'answer',
//               launchActivity: 'default',
//             },
//           },
//         ],
//         ongoing: true,
//         autoCancel: false,
//         timestamp: Date.now(),
//         showTimestamp: true,
//       },
//       ios: {
//         sound: 'default',
//         categoryId: 'call',
//         critical: true,
//         criticalVolume: 1.0,
//       },
//     });
//   } catch (error) {
//     console.error('Error displaying call notification:', error);
//   }
// }

// // Display regular notification
// async function displayGeneralNotification(data) {
//   try {
//     await notifee.displayNotification({
//       title: data.title || 'Notification',
//       body: data.body || 'You have a new notification',
//       data,
//       android: {
//         channelId: 'default',
//         smallIcon: 'ic_notification',
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error displaying general notification:', error);
//   }
// }


import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import RNCallKeep from 'react-native-callkeep';
import { Platform, PermissionsAndroid } from 'react-native';
import { navigate } from '../navigation/NavigationService';

// CallKeep options
const callKeepOptions = {
  ios: {
    appName: 'YourAppName',
    supportsVideo: true,
    maximumCallGroups: 1,
    maximumCallsPerCallGroup: 1,
    ringtoneSound: 'ringtone.caf',
    includesCallsInRecents: false,
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This app needs to access your phone calling accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
    foregroundService: {
      channelId: 'call_foreground',
      channelName: 'Foreground service for calls',
      notificationTitle: 'Call in progress',
      notificationIcon: 'ic_notification',
    },
    additionalPermissions: [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ],
  },
};

// Initialize CallKeep
let callKeepInitialized = false;

async function initializeCallKeep() {
  try {
    if (callKeepInitialized) return true;
    
    if (!RNCallKeep || !RNCallKeep.setup) {
      console.warn('RNCallKeep not available');
      return false;
    }

    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn('Required permissions not granted');
        return false;
      }
    }

    await RNCallKeep.setup(callKeepOptions);
    
    // Setup event listeners
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', onEndCallAction);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onMuteCallAction);

    callKeepInitialized = true;
    console.log('CallKeep initialized successfully');
    return true;
  } catch (error) {
    console.error('CallKeep initialization failed:', error);
    return false;
  }
}

// CallKeep event handlers
function onAnswerCallAction({ callUUID }) {
  console.log('Call answered via CallKeep UI', callUUID);
  navigate('AudioScreen', { callUUID });
}

function onEndCallAction({ callUUID }) {
  console.log('Call ended via CallKeep UI', callUUID);
  RNCallKeep.endCall(callUUID);
}

function onIncomingCallDisplayed({ error }) {
  if (error) {
    console.error('Incoming call display failed:', error);
  }
}

function onMuteCallAction({ muted, callUUID }) {
  console.log(`Call ${callUUID} muted: ${muted}`);
}

// Initialize CallKeep when the app starts
initializeCallKeep();

// Display call notification
async function displayCallNotification(data) {
  try {
    const callerInfo =
      typeof data.userInfo === 'string' ? JSON.parse(data.userInfo) : data.userInfo;
    const uuid =
      `data.callUUID || ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const handle = callerInfo?.phoneNumber || 'Unknown';
    const callerName = callerInfo?.name || 'Caller';

    // Display incoming call UI
    try {
      await RNCallKeep.displayIncomingCall(
        uuid,
        handle,
        callerName,
        'generic',
        true
      );
      console.log('CallKeep incoming call displayed');
    } catch (callKeepError) {
      console.error('CallKeep display error:', callKeepError);
      await displayGeneralNotification({
        ...data,
        title: `Incoming Call from ${callerName}`,
        body: 'Unable to show call interface',
      });
      return;
    }

    // Create notification channel for Android
    await notifee.createChannel({
      id: 'call',
      name: 'Call Notifications',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });

    // Display backup notification
    await notifee.displayNotification({
      title: `Incoming Call from ${callerName}`,
      body: 'Tap to answer',
      data: {
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, String(value)])
        ),
        callUUID: uuid,
      },
      android: {
        channelId: 'call',
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.CALL,
        smallIcon: 'ic_notification',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        fullScreenIntent: true,
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
        ongoing: true,
        autoCancel: false,
        timestamp: Date.now(),
        showTimestamp: true,
        style: {
          type: AndroidStyle.BIGTEXT,
          text: 'Tap to answer',
        },
      },
      ios: {
        sound: 'ringtone.caf',
        critical: true,
        criticalVolume: 1.0,
        categoryId: 'call',
      },
    });
  } catch (error) {
    console.error('Error displaying call notification:', error);
  }
}

// Display general notification
async function displayGeneralNotification(data) {
  try {
    const notificationData = typeof data === 'string' ? JSON.parse(data) : data || {};
    
    // Ensure required fields with proper fallbacks
    const title = notificationData.title;
    const body = notificationData.body;
    const image = notificationData.image || notificationData.imageUrl;

    // Build the base notification
    const notification = {
      // title,
      body,
      data: Object.fromEntries(
        Object.entries(notificationData).map(([key, value]) => [key, String(value)])
      ),
      android: {
        channelId: 'default',
        smallIcon: 'ic_notification',
        color: '#6200EE',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        timestamp: Date.now(),
        showTimestamp: true,
      },
      ios: {
        sound: 'default',
        summaryArgument: title,
        threadId: notificationData.threadId || 'general',
        categoryId: notificationData.category || 'general',
      },
    };

    // Add image if available (BIGPICTURE style)
    if (image) {
      notification.android.largeIcon = image;
      notification.android.style = {
        type: AndroidStyle.BIGPICTURE,
        picture: image,
        title,
        text: body,
      };
      notification.ios.attachments = [{ url: image }];
    } 
    // Add BIGTEXT style when no image
    else {
      notification.android.style = {
        type: AndroidStyle.BIGTEXT,
        text: body,
      };
    }

    await notifee.displayNotification(notification);
  } catch (error) {
    console.error('Error displaying general notification:', error);
  }
}


// Handle notification events
function handleNotificationEvent({ type, detail }) {
  if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
    const data = detail.notification.data;
    const callUUID = data.callUUID;

    if (data.action === 'CALL_NOTIFICATION') {
      if (detail.pressAction.id === 'answer') {
        console.log('Call answered via notification');

        if (callUUID) {
          RNCallKeep.answerIncomingCall(callUUID);
        }

        navigate('AudioScreen', {
          callerId: data.callerId,
          rtcMessage: data.rtcMessage ? JSON.parse(data.rtcMessage) : null,
          userInfo: data.userInfo ? JSON.parse(data.userInfo) : null,
          callUUID,
        });
      } else if (detail.pressAction.id === 'decline') {
        console.log('Call declined via notification');

        if (callUUID) {
          RNCallKeep.endCall(callUUID);
        }
      }
    } else {
      navigate('ChatScreen', {
        chatId: data.chatId,
        userId: data.userId,
        otherUserId: data.otherUserId,
      });
    }
  }
}

// Setup notification listeners
export function setupNotificationListeners() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('App killed - message received:', remoteMessage);
    if (remoteMessage.data?.action === 'CALL_NOTIFICATION') {
      await displayCallNotification(remoteMessage.data);
    } else {
      await displayGeneralNotification(remoteMessage.data);
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);
    if (remoteMessage.data?.action === 'CALL_NOTIFICATION') {
      await displayCallNotification(remoteMessage.data);
    } else {
      await displayGeneralNotification(remoteMessage.data);
    }
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('App in background - notification received:', remoteMessage);
    if (remoteMessage.data?.action === 'CALL_NOTIFICATION') {
      displayCallNotification(remoteMessage.data);
    } else {
      displayGeneralNotification(remoteMessage.data);
    }
  });

  notifee.onForegroundEvent(handleNotificationEvent);
  notifee.onBackgroundEvent(handleNotificationEvent);
}

// Initialize Firebase Messaging
export function initializeFirebaseMessaging() {
  setupNotificationListeners();
}

