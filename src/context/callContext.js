// import React, { createContext, useContext, useState, useRef } from 'react';
// import { navigate } from '../navigation/NavigationService.js';
// import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
// import { useWebSocket } from '../shared/WebSocketProvider.jsx';

// const APP_ID = '1be639d040da4a42be10d134055a2abd';

// const CallContext = createContext();

// export const CallProvider = ({ children }) => {
//   const [activeCall, setActiveCall] = useState(null);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const engine = useRef(null);
//   const { leave } = useWebSocket();

//   const [peerIds, setPeerIds] = useState([]);
//   const [isJoined, setIsJoined] = useState(false);

//   const initializeEngine = async (config) => {
//     if (!engine.current) {
//       try {
//         engine.current = createAgoraRtcEngine();
//         engine.current.registerEventHandler({
//           onJoinChannelSuccess: () => {
//             console.log('Successfully joined channel:', config.channelName);
//             setIsJoined(true);
//           },
//           onUserJoined: (_, uid) => {
//             console.log('Remote user joined:', uid);
//             setPeerIds(prev => [...prev, uid]);
//           },
//           onUserOffline: (_, uid) => {
//             console.log('Remote user left:', uid);
//             setPeerIds(prev => {
//               const updated = prev.filter(id => id !== uid);
//               // ✅ End the call when no more remote users are connected
//               if (updated.length === 0) {
//                 endCall();
//               }
//               return updated;
//             });
//           },
//           onError: (err) => {
//             console.error('Agora error:', err);
//           },
//         });

//         engine.current.initialize({
//           appId: APP_ID,
//           channelProfile: ChannelProfileType.ChannelProfileCommunication,
//         });
//         await engine.current.setDefaultAudioRouteToSpeakerphone(true);

//         if (config?.video) {
//           engine.current.enableVideo();
//           engine.current.startPreview();
//         } else {
//           engine.current.enableAudio();
//           engine.current.disableVideo();
//         }

//         await engine.current.joinChannel(
//           config.token,
//           config.channelName,
//           config.uid,
//           { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
//         );
//       } catch (error) {
//         console.error('Error initializing Agora engine:', error);
//         throw error;
//       }
//     }
//   };

//   const startCall = async (callData) => {
//     await initializeEngine(callData.config);
//     setActiveCall({ ...callData, engine });
//     setIsMinimized(false);
//   };

//   const handleNavigationStateChange = (routeName) => {
//     if (activeCall) {
//       if (routeName === 'AudioScreen' || routeName === 'VideoCallScreen') {
//         setIsMinimized(false);
//       } else {
//         setIsMinimized(true);
//       }
//     }
//   };

//   const minimizeCall = () => {
//     setIsMinimized(true);
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
//     }
//   };

//   const endCall = async () => {
//     if (engine.current) {
//       await engine.current.leaveChannel();
//       engine.current.release();
//       engine.current = null;
//     }
//     setActiveCall(null);
//     setIsMinimized(false);
//     setPeerIds([]);
//     setIsJoined(false);
//     leave();
//   };

//   return (
//     <CallContext.Provider 
//       value={{ 
//         activeCall, 
//         isMinimized, 
//         engine,
//         handleNavigationStateChange,
//         peerIds,
//         isJoined,
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


import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { navigate, reset } from '../navigation/NavigationService.js';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { useWebSocket } from '../shared/WebSocketProvider.jsx';


const APP_ID = '1be639d040da4a42be10d134055a2abd';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [activeCall, setActiveCall] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const engine = useRef(null);
  const { webSocket, userInfo, leave } = useWebSocket();
  const [peerIds, setPeerIds] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const chatId = useRef(null);
  const isVideoEnabled = useRef(null);
  const [callDuration, setCallDuration] = useState('00:00:00');
  const timerRef = useRef(null);


  const initializeEngine = async config => {

    try {
      engine.current = createAgoraRtcEngine();
      engine.current.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log('Successfully joined channel:', config.channelName);
          setIsJoined(true);
        },
        onUserJoined: (_, uid) => {
          console.log('Remote user joined:', uid);
          setPeerIds(prev => [...prev, uid]);
        },
        onUserOffline: (_, uid) => {
          console.log('Remote user left:', uid);
          setPeerIds(prev => {
            const updated = prev.filter(id => id !== uid);
            if (updated.length === 0) {
              endCall();
            }
            return updated;
          });
        },
        onError: (err) => {
          console.error('Agora error:', err);
        },
      });

      engine.current.initialize({
        appId: APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
      await engine.current.setDefaultAudioRouteToSpeakerphone(true);

      if (config?.video) {
        engine.current.enableVideo();
        engine.current.startPreview();
        isVideoEnabled.current = 'VIDEO';
        console.log('Video enabled');
      } else {
        engine.current.enableAudio();
        engine.current.disableVideo();
        isVideoEnabled.current = 'AUDIO';
        console.log('Audio only');
      }

      await engine.current.joinChannel(
        config.config?.token,
        config.config?.channelName,
        config.config?.uid,
        { clientRoleType: ClientRoleType.ClientRoleBroadcaster },
      );
    } catch (error) {
      console.error('Error initializing Agora engine:', error);
      // throw error;
    }

  };

  const switchToVideoCall = async () => {
    if (engine.current) {
      try {
        await engine.current.enableVideo();
        await engine.current.startPreview();
        isVideoEnabled.current = 'VIDEO';
      } catch (error) {
        console.log('Error switching to video call:', error);
      }
    }
  };

  const switchToAudioCall = async () => {
    if (engine.current) {
      try {
        await engine.current.enableAudio();
        await engine.current.disableVideo();
        isVideoEnabled.current = 'AUDIO';
      } catch (error) {
        console.log('Error switching to video call:', error);
      }
    }
  };

  const startCall = async callData => {
    await initializeEngine(callData);
    setActiveCall({ ...callData });
    setCallDuration('00:00:00');
    setIsMinimized(false);
    chatId.current = callData.chatId; // Store chatId from callData
  };

  const handleNavigationStateChange = (routeName) => {
    if (activeCall) {
      if (routeName === 'AudioScreen' || routeName === 'VideoCallScreen') {
        setIsMinimized(false);
      } else {
        setIsMinimized(true);
      }
    }
  };

  const minimizeCall = () => {
    setIsMinimized(true);
  };

  const maximizeCall = () => {
    if (activeCall) {
      navigate('AudioScreen', activeCall);
      setIsMinimized(false);
    }
  };

  const endCall = async () => {
    if (engine.current) {
      await engine.current.leaveChannel();
      // engine.current.release();
      engine.current = null;
    }
    setActiveCall(null);
    setIsMinimized(false);
    setPeerIds([]);
    setIsJoined(false);
    leave();
    setCallDuration('00:00:00');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
  };
  useEffect(() => {
    if (webSocket) {
      // WebSocket listener for call duration
      const handleUpdateCallDuration = (data) => {
        console.log('CallContext: updateCallDuration received', data.callDuration);
        if (data.callDuration) {
          setCallDuration(data.callDuration);
          // Optionally stop local timer if WebSocket is reliable
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      };

      webSocket.on('updateCallDuration', handleUpdateCallDuration);

      // Local timer as fallback
      if (isJoined && !timerRef.current) {
        let seconds = 0;
        timerRef.current = setInterval(() => {
          seconds += 1;
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;
          setCallDuration(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
          );
        }, 1000);
      }

      // Handle call rejection
      webSocket.on('appyHandsup', data => {
        if (data.type === 'call_reject') {
          endCall();
          return;
        }

        reset(0, [
          {
            name: 'EndCallScreen',
            params: { chatId: chatId.current, userInfo: userInfo.current },
          },
        ]);
      });

      return () => {
        webSocket.off('updateCallDuration', handleUpdateCallDuration);
        webSocket.off('appyHandsup');
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [webSocket, userInfo, isJoined]);


  // useEffect(() => {
  //   if (!webSocket) return;

  //   const handleHandsup = () => {
  //     endCall();
  //     reset(0, [{name: 'EndCallScreen'}]);
  //   };
  //   webSocket.on('appyHandsup', handleHandsup);
  //   return () => {
  //     webSocket.off('appyHandsup', handleHandsup);
  //   };
  // }, [webSocket]);

  return (
    <CallContext.Provider
      value={{
        activeCall,
        isMinimized,
        callDuration,
        engine,
        handleNavigationStateChange,
        peerIds,
        isJoined,
        switchToVideoCall,
        startCall,
        minimizeCall,
        maximizeCall,
        endCall,
        isVideoEnabled,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
