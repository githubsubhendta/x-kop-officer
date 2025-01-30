// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import ParentScreen from './Screens/Parent.Screen.jsx';
// import LoginScreen from './Screens/Login.Screen.jsx';
// import SignUpScreen from './Screens/Signup.Screen.jsx';
// import DocumentSelectorScreen from './Screens/DocumentSelector.Screen.jsx';
// import ChatendScreen from './Screens/Chatend.Screen.jsx';
// import UserSummeryScreen from './Screens/UserSummery.Screen.jsx';
// import UserDetailsScreen from './Screens/UserDetails.Screen.jsx';
// import OnboardingScreen from './Screens/OnboardingScreen.jsx';
// import WhatWeDoScreen from './Screens/WhatWeDoScreen.jsx';
// import VerifyCodeScreen from './Screens/VerifyCodeScreen.jsx';
// import PersonDetails from './Screens/profile/PersonDetails.jsx';
// import RequestAbsence from './Screens/profile/RequestAbsence.jsx';
// import Transaction from './Screens/profile/Transaction.jsx';
// import VideoCallScreen from './Screens/videoCall/VideoCallScreen.jsx';
// import AudioScreen from './Screens/videoCall/AudioScreen.jsx';

// import userStoreAction from './stores/user.store.js';
// import { getCurrentUser, refreshToken } from './Api/user.api.js';

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   const {
//     localTokens,
//     isLoggedIn,
//     whatwedoStatus,
//     onboardStatus,
//     user,
//     addLoggedInUserAction,
//     addLocalTokens,
//   } = userStoreAction(state => state);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       setLoading(true);
//       if (user.name === undefined && localTokens) {
//         try {
//           const result = await getCurrentUser(localTokens);
//           addLoggedInUserAction({ ...result.data.data.user }, true);
//         } catch (error) {
//           if (error.response.status === 401 || error.response.status === 500) {
//             try {
//               const refreshRes = await refreshToken({
//                 refreshToken: localTokens.refreshToken,
//               });
//               const authData = {
//                 accessToken: refreshRes.data.data.accessToken,
//                 refreshToken: refreshRes.data.data.refreshToken,
//               };
//               await AsyncStorage.setItem('Authorized_data', JSON.stringify(authData));
//               const resultUpdate = await getCurrentUser(authData);
//               addLoggedInUserAction({ ...resultUpdate.data.data.user }, true, authData);
//             } catch (err) {
//               addLocalTokens(null);
//               await AsyncStorage.removeItem('Authorized_data');
//               addLoggedInUserAction({}, false);
//             }
//           }
//         }
//       }
//       setLoading(false);
//     };

//     checkUser();
//   }, [localTokens, user.name, addLoggedInUserAction, addLocalTokens]);

//   if (loading || onboardStatus == null || whatwedoStatus == null) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
//         <Text style={{ color: '#000' }}>Loading...</Text>
//       </View>
//     );
//   }

//   const initialRouteName = () => {
//     if (isLoggedIn) {
//       return whatwedoStatus ? 'Parent' : 'WhatWeDoScreen';
//     } else {
//       return onboardStatus ? 'LoginScreen' : 'OnboardingScreen';
//     }
//   };

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName={initialRouteName()}>
//         {!isLoggedIn ? (
//           <>
//             <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} options={{ headerShown: false }} />
//           </>
//         ) : (
//           <>
//             <Stack.Screen name="WhatWeDoScreen" component={WhatWeDoScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="Parent" component={ParentScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="DocumentSelector" component={DocumentSelectorScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="ChatendScreen" component={ChatendScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="UserSummeryScreen" component={UserSummeryScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="PersonDetails" component={PersonDetails} options={{ headerShown: false }} />
//             <Stack.Screen name="RequestAbsence" component={RequestAbsence} options={{ headerShown: false }} />
//             <Stack.Screen name="Transaction" component={Transaction} options={{ headerShown: false }} />
//             <Stack.Screen name="AudioScreen" component={AudioScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;

