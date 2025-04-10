// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useCall } from '../../context/callContext.js';
// import { SvgXml } from 'react-native-svg';
// import { SVG_hangout_red } from '../../Utils/SVGImage.js';
// import { useNavigationState } from '@react-navigation/native';

// const CallPopup = () => {
//   const { activeCall, isMinimized, maximizeCall, endCall } = useCall();
//   const state = useNavigationState(state => state);

//   const currentRouteName = state?.routes[state.index]?.name;

//   console.log('CallPopup - activeCall:', !!activeCall, 'isMinimized:', isMinimized, 'currentRoute:', currentRouteName);

//   // Hide popup if no active call
//   if (!activeCall) {
//     console.log('Popup hidden - no active call');
//     return null;
//   }

//   // Show popup only if minimized and not on AudioScreen or VideoCall
//   if (isMinimized && currentRouteName !== 'AudioScreen' && currentRouteName !== 'VideoCall') {
//     return (
//       <TouchableOpacity 
//         style={styles.popupContainer}
//         onPress={maximizeCall}
//       >
//         <View style={styles.popupContent}>
//           <View style={styles.callInfo}>
//             <Text style={styles.callerName}>{activeCall.userInfo?.name}</Text>
//             <Text style={styles.callStatus}>{activeCall.callDuration || 'Ongoing'}</Text>
//           </View>
//           <TouchableOpacity onPress={endCall}>
//             <SvgXml xml={SVG_hangout_red} width={40} height={40} />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   console.log('Popup hidden - conditions not met');
//   return null;
// };

// const styles = StyleSheet.create({
//   popupContainer: {
//     position: 'absolute',
//     top: 50,
//     left: 10,
//     right: 10,
//     zIndex: 1000,
//   },
//   popupContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#075E54',
//     padding: 10,
//     borderRadius: 8,
//     elevation: 5,
//   },
//   callInfo: {
//     flex: 1,
//   },
//   callerName: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   callStatus: {
//     color: 'white',
//     fontSize: 14,
//   },
// });

// export default CallPopup;