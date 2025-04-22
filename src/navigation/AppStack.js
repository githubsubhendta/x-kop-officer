import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import useCheckUser from '../hooks/useCheckUser.js';
import FirebaseProvider from '../shared/FirebaseProvider.js';
import {WebSocketProvider} from '../shared/WebSocketProvider.jsx';
import WhatWeDoScreen from '../Screens/WhatWeDoScreen.jsx';
import ParentScreen from '../Screens/Parent.Screen.jsx';
import DocumentSelectorScreen from '../Screens/DocumentSelector.Screen.jsx';
import EndCallScreen from '../Screens/EndCall.Screen.jsx';
import UserSummeryScreen from '../Screens/UserSummery.Screen.jsx';
import UserdetailsScreen from '../Screens/UserDetails.Screen.jsx';
import PersonDetails from '../Screens/profile/PersonDetails.jsx';
import RequestAbsence from '../Screens/profile/RequestAbsence.jsx';
import Transaction from '../Screens/profile/Transaction.jsx';
import AudioScreen from '../Screens/videoCall/AudioScreen.jsx';
import VideoCallScreen from '../Screens/videoCall/VideoCallScreen.jsx';
import ParantWrapperProvider from '../shared/ParantWrapperProvider.jsx';
import ChatScreen from '../Screens/Chat.Screen.jsx';
import { CallProvider } from '../context/callContext.js';
import CallPopup from '../Components/callPopup/FloatingCallPopup.jsx';

const Stack = createStackNavigator();

const AppStack = () => {
  const {whatwedoStatus} = useCheckUser();

  return (
    <>
      <FirebaseProvider>
        <WebSocketProvider>
         
          <ParantWrapperProvider>
          <CallProvider>
          <CallPopup/>
            <Stack.Navigator
              initialRouteName={!whatwedoStatus ? 'WhatWeDoScreen' : 'Parent'}
              screenOptions={{headerShown: false}}>
               
              <Stack.Screen
                name="WhatWeDoScreen"
                component={WhatWeDoScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Parent"
                component={ParentScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="DocumentSelector"
                component={DocumentSelectorScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="UsersummeryScreen"
                component={UserSummeryScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="UserDetailsScreen"
                component={UserdetailsScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PersonDetails"
                component={PersonDetails}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="RequestAbsence"
                component={RequestAbsence}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Transaction"
                component={Transaction}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="AudioScreen"
                component={AudioScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="VideoCallScreen"
                component={VideoCallScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{headerShown: false}}
              />
               <Stack.Screen
                name="EndCallScreen"
                component={EndCallScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            </CallProvider>
          </ParantWrapperProvider>
          
        </WebSocketProvider>
      </FirebaseProvider>
    </>
  );
};

export default AppStack;
