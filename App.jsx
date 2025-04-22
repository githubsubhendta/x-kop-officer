import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/AppNavigator';
import { AppState, Text, View, StatusBar } from 'react-native';
import userStoreAction from './src/stores/user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import 'react-native-gesture-handler';
import { LoadingProvider } from './src/shared/LoadingProvider';
import MainApp from './src/MainApp';
import { Provider as PaperProvider } from 'react-native-paper';
import { SnackbarProvider } from './src/shared/SnackbarProvider';
import { NavigationContainer } from '@react-navigation/native';
import {
  navigationRef,
  isReadyRef,
  processNavigationQueue,
} from './src/navigation/NavigationService.js';
import { NetworkProvider } from './src/shared/NetworkProvider.js';
import CallPopup from './src/Components/callPopup/FloatingCallPopup.jsx';
import { CallProvider } from './src/context/callContext.js';
import { WebSocketProvider } from './src/shared/WebSocketProvider.jsx';




const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        processNavigationQueue();
      }}>
      <NetworkProvider>

        <SafeAreaView style={{ flex: 1 }} className="bg-white">
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <SnackbarProvider>
            <LoadingProvider>
              <MainApp />
             
            </LoadingProvider>
          </SnackbarProvider>
        </SafeAreaView>

      </NetworkProvider>
    </NavigationContainer>
  );
};

export default App;
