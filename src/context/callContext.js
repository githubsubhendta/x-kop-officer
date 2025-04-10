// // // CallContext.jsx
// // import React, { createContext, useContext, useState } from 'react';
// // import { navigate } from '../navigation/NavigationService.js';

// // const CallContext = createContext();

// // export const CallProvider = ({ children }) => {
// //   const [activeCall, setActiveCall] = useState(null);
// //   const [isMinimized, setIsMinimized] = useState(false);
// //   const [engineInstance, setEngineInstance] = useState(null);

// //   const startCall = (callData, engine) => {
// //     setActiveCall(callData);
// //     setEngineInstance(engine);
// //     setIsMinimized(false);
// //   };

// //   const minimizeCall = () => {
// //     setIsMinimized(true);
// //   };

// //   const maximizeCall = () => {
// //     if (activeCall) {
// //       setIsMinimized(false);
// //       navigate('AudioScreen', {
// //         config: activeCall.config,
// //         mobile: activeCall.mobile,
// //         chatId: activeCall.chatId,
// //         userInfo: activeCall.userInfo,
// //       });
// //     }
// //   };

// //   const endCall = async () => {
// //     if (engineInstance?.current) {
// //       await engineInstance.current.leaveChannel();
// //       await engineInstance.current.release();
// //     }
// //     setActiveCall(null);
// //     setEngineInstance(null);
// //     setIsMinimized(false);
// //   };

// //   return (
// //     <CallContext.Provider 
// //       value={{ 
// //         activeCall, 
// //         isMinimized, 
// //         engineInstance,
// //         startCall, 
// //         minimizeCall, 
// //         maximizeCall, 
// //         endCall 
// //       }}
// //     >
// //       {children}
// //     </CallContext.Provider>
// //   );
// // };

// // export const useCall = () => useContext(CallContext);

// // import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// // import { navigate } from '../navigation/NavigationService.js';
// // import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';

// // const APP_ID = '1be639d040da4a42be10d134055a2abd';

// // const CallContext = createContext();

// // export const CallProvider = ({ children }) => {
// //   const [activeCall, setActiveCall] = useState(null);
// //   const [isMinimized, setIsMinimized] = useState(false);
// //   const engine = useRef(null);

// //   const initializeEngine = async (config) => {
// //     if (!engine.current) {
// //       engine.current = createAgoraRtcEngine();
// //       engine.current.initialize({
// //         appId: APP_ID,
// //         channelProfile: ChannelProfileType.ChannelProfileCommunication,
// //       });
// //       engine.current.enableAudio();
// //       engine.current.disableVideo();

// //       await engine.current.joinChannel(
// //         config.token,
// //         config.channelName,
// //         config.uid,
// //         { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
// //       );
// //       console.log('Engine initialized and channel joined');
// //     }
// //   };

// //   const startCall = async (callData) => {
// //     if (!activeCall) {  // Only start a new call if none exists
// //       await initializeEngine(callData.config);
// //       setActiveCall({ ...callData, engine });
// //       setIsMinimized(false);
// //       console.log('Call started - activeCall set, isMinimized: false');
// //     } else {
// //       console.log('Call already active, updating callData only');
// //       setActiveCall(prev => ({ ...prev, ...callData, engine }));
// //     }
// //   };

// //   const minimizeCall = () => {
// //     setIsMinimized(true);
// //     console.log('minimizeCall called - isMinimized set to true');
// //   };

// //   const maximizeCall = () => {
// //     if (activeCall) {
// //       setIsMinimized(false);
// //       navigate('AudioScreen', {
// //         config: activeCall.config,
// //         mobile: activeCall.mobile,
// //         chatId: activeCall.chatId,
// //         userInfo: activeCall.userInfo,
// //       });
// //       console.log('maximizeCall called - isMinimized set to false');
// //     }
// //   };

// //   const endCall = async () => {
// //     if (engine.current) {
// //       await engine.current.leaveChannel();
// //       engine.current.release();
// //       engine.current = null;
// //       console.log('endCall called - engine released');
// //     }
// //     setActiveCall(null);
// //     setIsMinimized(false);
// //     console.log('endCall completed - activeCall: null, isMinimized: false');
// //   };

// //   useEffect(() => {
// //     console.log('CallContext state changed - activeCall:', !!activeCall, 'isMinimized:', isMinimized);
// //   }, [activeCall, isMinimized]);

// //   return (
// //     <CallContext.Provider 
// //       value={{ 
// //         activeCall, 
// //         isMinimized, 
// //         engine,
// //         startCall, 
// //         minimizeCall, 
// //         maximizeCall, 
// //         endCall 
// //       }}
// //     >
// //       {children}
// //     </CallContext.Provider>
// //   );
// // };

// // export const useCall = () => useContext(CallContext);

// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { navigate } from '../navigation/NavigationService.js';
// import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';

// const APP_ID = '1be639d040da4a42be10d134055a2abd';

// const CallContext = createContext();

// export const CallProvider = ({ children }) => {
//   const [activeCall, setActiveCall] = useState(null);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const engine = useRef(null);

//   const initializeEngine = async (config) => {
//     if (!engine.current) {
//       engine.current = createAgoraRtcEngine();
//       engine.current.initialize({
//         appId: APP_ID,
//         channelProfile: ChannelProfileType.ChannelProfileCommunication,
//       });
//       engine.current.enableAudio();
//       engine.current.disableVideo();

//       await engine.current.joinChannel(
//         config.token,
//         config.channelName,
//         config.uid,
//         { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
//       );
//       console.log('Engine initialized and channel joined');
//     }
//   };

//   const startCall = async (callData) => {
//     if (!activeCall) {
//       await initializeEngine(callData.config);
//       setActiveCall({ ...callData, engine });
//       setIsMinimized(false);
//       console.log('Call started - activeCall set, isMinimized: false');
//     } else {
//       console.log('Call already active, updating callData only');
//       setActiveCall(prev => ({ ...prev, ...callData, engine }));
//     }
//   };

//   const minimizeCall = () => {
//     setIsMinimized(true);
//     console.log('minimizeCall called - isMinimized set to true');
//   };

//   const maximizeCall = () => {
//     if (activeCall) {
//       setIsMinimized(false);
//       navigate('AudioScreen', {
//         config: activeCall.config,
//         mobile: activeCall.mobile,
//         chatId: activeCall.chatId,
//         userInfo: activeCall.userInfo,
//       });
//       console.log('maximizeCall called - isMinimized set to false');
//     }
//   };

//   const endCall = async () => {
//     if (engine.current) {
//       await engine.current.leaveChannel();
//       engine.current.release();
//       engine.current = null;
//       console.log('endCall called - engine released');
//     }
//     setActiveCall(null);
//     setIsMinimized(false);
//     console.log('endCall completed - activeCall: null, isMinimized: false');
//   };

//   useEffect(() => {
//     console.log('CallContext state changed - activeCall:', !!activeCall, 'isMinimized:', isMinimized);
//   }, [activeCall, isMinimized]);

//   return (
//     <CallContext.Provider 
//       value={{ 
//         activeCall, 
//         isMinimized, 
//         engine,
//         startCall, 
//         minimizeCall, 
//         maximizeCall, 
//         endCall 
//       }}
//     >
//       {children}
//     </CallContext.Provider>
//   );
// };

// export const useCall = () => useContext(CallContext);