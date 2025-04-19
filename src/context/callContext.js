import React, { createContext, useContext, useState, useRef } from 'react';
import { navigate } from '../navigation/NavigationService.js';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { useWebSocket } from '../shared/WebSocketProvider.jsx';

const APP_ID = '1be639d040da4a42be10d134055a2abd';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [activeCall, setActiveCall] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const engine = useRef(null);
  const { leave } = useWebSocket();

  const [peerIds, setPeerIds] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  const initializeEngine = async (config) => {
    if (!engine.current) {
      try {
        engine.current = createAgoraRtcEngine();
        engine.current.registerEventHandler({
          onJoinChannelSuccess: () => {
            
            setIsJoined(true);
          },
          onUserJoined: (_, uid) => {
            console.log('Remote user joined:', uid);
            setPeerIds(prev => [...prev, uid]);
          },
          onUserOffline: (_, uid) => {
            console.log('Remote user left:', uid);
            setPeerIds(prev => prev.filter(id => id !== uid));
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
        } else {
          engine.current.enableAudio();
          engine.current.disableVideo();
        }

        await engine.current.joinChannel(
          config.token,
          config.channelName,
          config.uid,
          { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
        );
      } catch (error) {
        console.error('Error initializing Agora engine:', error);
        throw error;
      }
    }
  };

  const startCall = async (callData) => {
    await initializeEngine(callData.config);
    setActiveCall({ ...callData, engine });
    setIsMinimized(false);
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

  // const maximizeCall = () => {
  //   if (activeCall) {
  //     setIsMinimized(false);
  //     navigate('AudioScreen', {
  //       config: activeCall.config,
  //       mobile: activeCall.mobile,
  //       chatId: activeCall.chatId,
  //       userInfo: activeCall.userInfo,
  //     });
  //   }
  // };


  const maximizeCall = () => {
    if (activeCall) {
      setIsMinimized(false);
      navigate('AudioScreen', activeCall);
    }
  };

  const endCall = async () => {
    if (engine.current) {
      await engine.current.leaveChannel();
      engine.current.release();
      engine.current = null;
    }
    setActiveCall(null);
    setIsMinimized(false);
    setPeerIds([]);
    setIsJoined(false);
    leave();
  };

  return (
    <CallContext.Provider 
      value={{ 
        activeCall, 
        isMinimized, 
        engine,
        handleNavigationStateChange,
        peerIds,
        isJoined,
        startCall, 
        minimizeCall, 
        maximizeCall, 
        endCall 
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
