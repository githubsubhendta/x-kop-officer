import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useCheckUser from './../hooks/useCheckUser';
import { useLoading } from '../shared/LoadingProvider';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import SplashScreen from '../Screens/Splash.Screen';

const Stack = createStackNavigator();

const MainStack = () => {
  const { isLoggedIn,loading, onboardStatus, whatwedoStatus } = useCheckUser();
  const { showLoading, hideLoading } = useLoading();

  // useEffect(() => {
  //   if (loading || onboardStatus == null || whatwedoStatus == null) {
  //     showLoading();
  //   } else {
  //     hideLoading();
  //   }
  // }, [loading, onboardStatus, whatwedoStatus, showLoading, hideLoading]);
 
  // if (loading || onboardStatus == null || whatwedoStatus == null) {
  //   return null; 
  // }

 const [minTime,setMinTime] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTime(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || onboardStatus == null || whatwedoStatus == null || minTime) {
    return <SplashScreen />;
  }

  return (
    // <NavigationContainer>
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name="AppStack"
          component={AppStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  // </NavigationContainer>
  );
};

export default MainStack;

