import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import useCheckUser from '../hooks/useCheckUser';
import OnboardingScreen from '../Screens/OnboardingScreen';
import LoginScreen from '../Screens/Login.Screen';
import SignUpScreen from '../Screens/Signup.Screen';
import VerifyCodeScreen from '../Screens/VerifyCodeScreen';
const Stack = createStackNavigator();
const AuthStack = () => {

const {onboardStatus } = useCheckUser();


  return (
  <Stack.Navigator
  initialRouteName={!onboardStatus?"OnboardingScreen":"LoginScreen"}
   screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
)};

export default AuthStack;
