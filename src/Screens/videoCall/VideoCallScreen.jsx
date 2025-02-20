// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {
//   Platform,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import {
//   ChannelProfileType,
//   ClientRoleType,
//   RtcSurfaceView,
//   createAgoraRtcEngine,
// } from 'react-native-agora';
// import requestCameraAndAudioPermission from '../../Components/permissions.js';
// import {SvgXml} from 'react-native-svg';
// import {
//   SVG_hangout_red,
//   SVG_mute_mic,
//   SVG_speaker,
//   SVG_speakeroff,
//   SVG_stop_camera,
//   SVG_switch_camera,
//   SVG_unmute_mic,
// } from './../../Utils/SVGImage.js';
// import {useWebSocket} from '../../shared/WebSocketProvider.jsx';
// import {useFocusEffect} from '@react-navigation/native';
// const {width, height} = Dimensions.get('window');
// const appId = '1be639d040da4a42be10d134055a2abd';

// const VideoCallScreen = ({route, navigation}) => {
//   const {config, mobile, chatId, userInfo} = route.params || {};
//   const _engine = useRef(null);
//   const [isJoined, setJoined] = useState(false);
//   const [peerIds, setPeerIds] = useState([]);
//   const [connectionStatus, setConnectionStatus] = useState('Not Connected');
//   const [isMicOn, setMicOn] = useState(true);
//   const [isCameraOn, setCameraOn] = useState(true);
//   const [isSpeakerOn, setSpeakerOn] = useState(true);
//   const {webSocket, leave} = useWebSocket();
//   const [callDuration, setCallDuration] = useState('00:00:00');
//   useEffect(() => {
//     const handleCallDurationUpdate = data => {
//       setCallDuration(data.callDuration);
//     };

//     webSocket.on('updateCallDuration', handleCallDurationUpdate);
//     return () => {
//       webSocket.off('updateCallDuration', handleCallDurationUpdate);
//     };
//   }, [webSocket, endCall]);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     if (Platform.OS === 'android') {
//   //       requestCameraAndAudioPermission().then(() => {
//   //         console.log('Permissions requested!');
//   //       });
//   //     }
//   //     if (
//   //       !config ||
//   //       !config.channelName ||
//   //       !config.token ||
//   //       typeof config.uid !== 'number'
//   //     ) {
//   //       console.error('Invalid config parameters');
//   //       navigation.goBack();
//   //       return;
//   //     }
//   //     init();
//   //     return () => {
//   //       // Cleanup function to be called when the screen is unfocused
//   //       if (_engine.current) {
//   //         _engine.current.leaveChannel();
//   //         _engine.current.removeAllListeners();
//   //         _engine.current.release();
//   //         _engine.current = null;
//   //       }
//   //     };
//   //   }, [config, navigation]),
//   // );

//   useFocusEffect(
//     useCallback(() => {
//       if (Platform.OS === 'android') {
//         requestCameraAndAudioPermission().then(() => {
//           console.log('Permissions requested!');
//         });
//       }

//       if (
//         !config ||
//         !config.channelName ||
//         !config.token ||
//         typeof config.uid !== 'number'
//       ) {
//         console.error('Invalid config parameters');
//         navigation.goBack();
//         return;
//       }

//       // Initialize the Agora Engine only if it's not already initialized
//       if (!_engine.current) {
//         init();
//       } else {
//         // Re-enable video if coming back from camera-off state
//         _engine.current.enableLocalVideo(true);
//         _engine.current.muteLocalVideoStream(false);
//         setCameraOn(true);
//       }

//       return () => {
//         // Cleanup when leaving the screen
//         if (_engine.current) {
//           _engine.current.enableLocalVideo(false);
//           _engine.current.muteLocalVideoStream(true);
//         }
//       };
//     }, [config, navigation]),
//   );

//   const init = async () => {
//     try {
//       _engine.current = createAgoraRtcEngine();
//       _engine.current.registerEventHandler({
//         onJoinChannelSuccess: () => {
//           showMessage('Successfully joined the channel ' + config.channelName);
//           setJoined(true);
//           setConnectionStatus('Connected');
//         },
//         onUserJoined: (_connection, Uid) => {
//           showMessage('Remote user joined with uid' + Uid);
//           setPeerIds(prev => [...prev, Uid]);
//         },
//         onUserOffline: (_connection, Uid) => {
//           showMessage('Remote user left the channel. uid: ' + Uid);
//           setPeerIds(prev => prev.filter(id => id !== Uid));
//         },
//         onError: err => {
//           console.error('Agora Error:', err);
//           showMessage('Agora Error: ' + JSON.stringify(err));
//           setConnectionStatus('Error');
//         },
//       });

//       _engine.current.initialize({
//         appId: appId,
//         channelProfile: ChannelProfileType.ChannelProfileCommunication,
//       });

//       _engine.current.enableVideo();
//       _engine.current.startPreview();
//       startCall();
//     } catch (error) {
//       console.error('Error initializing Agora Engine:', error);
//       showMessage('Error initializing Agora Engine: ' + error);
//     }
//   };

//   // const init = async () => {
//   //   try {
//   //     _engine.current = createAgoraRtcEngine();
//   //     _engine.current.registerEventHandler({
//   //       onJoinChannelSuccess: () => {
//   //         showMessage('Successfully joined the channel ' + config.channelName);
//   //         setJoined(true);
//   //         setConnectionStatus('Connected');

//   //         // Start call duration counter
//   //         setCallDuration(0);
//   //         if (durationInterval.current) clearInterval(durationInterval.current);
//   //         durationInterval.current = setInterval(() => {
//   //           setCallDuration(prev => prev + 1);
//   //         }, 1000);
//   //       },
//   //       onUserJoined: (_connection, Uid) => {
//   //         showMessage('Remote user joined with uid' + Uid);
//   //         setPeerIds(prev => [...prev, Uid]);
//   //       },
//   //       onUserOffline: (_connection, Uid) => {
//   //         showMessage('Remote user left the channel. uid: ' + Uid);
//   //         setPeerIds(prev => prev.filter(id => id !== Uid));
//   //       },
//   //       onError: err => {
//   //         console.error('Agora Error:', err);
//   //         showMessage('Agora Error: ' + JSON.stringify(err));
//   //         setConnectionStatus('Error');
//   //       },
//   //     });

//   //     _engine.current.initialize({
//   //       appId: appId,
//   //       channelProfile: ChannelProfileType.ChannelProfileCommunication,
//   //     });

//   //     _engine.current.enableVideo();
//   //     _engine.current.startPreview();
//   //     startCall();
//   //   } catch (error) {
//   //     console.error('Error initializing Agora Engine:', error);
//   //     showMessage('Error initializing Agora Engine: ' + error);
//   //   }
//   // };

//   const startCall = async () => {
//     try {
//       await _engine.current?.joinChannel(
//         config.token,
//         config.channelName,
//         config.uid,
//         {clientRoleType: ClientRoleType.ClientRoleBroadcaster},
//       );
//       setConnectionStatus('Connecting...');
//     } catch (error) {
//       console.error('Error joining channel:', error);
//       showMessage('Error joining channel: ' + error);
//       setConnectionStatus('Error');
//     }
//   };

//   const endCall = async () => {
//     try {
//       if (_engine.current) {
//         await _engine.current.leaveChannel();
//         _engine.current.removeAllListeners();
//         _engine.current.release();
//         leave();
//       }
//     } catch (error) {
//       console.error('Error ending call:', error);
//       showMessage('Error ending call: ' + error);
//     }

//     setPeerIds([]);
//     setJoined(false);
//     setConnectionStatus('Not Connected');
//   };

//   // const endCall = async () => {
//   //   try {
//   //     if (_engine.current) {
//   //       await _engine.current.leaveChannel();
//   //       _engine.current.removeAllListeners();
//   //       _engine.current.release();
//   //       leave();
//   //     }
//   //   } catch (error) {
//   //     console.error('Error ending call:', error);
//   //     showMessage('Error ending call: ' + error);
//   //   }
//   //   setPeerIds([]);
//   //   setJoined(false);
//   //   setConnectionStatus('Not Connected');
//   //   // Stop call duration counter
//   //   if (durationInterval.current) clearInterval(durationInterval.current);
//   // };

//   const toggleMic = () => {
//     _engine.current?.muteLocalAudioStream(!isMicOn);
//     setMicOn(prev => !prev);
//   };

//   const switchCamera = () => {
//     _engine.current?.switchCamera();
//   };

//   const toggleCamera = () => {
//     if (isCameraOn) {
//       // Turn off the camera and switch to audio-only call
//       _engine.current?.enableLocalVideo(true);
//       _engine.current?.muteLocalVideoStream(false);
//       navigation.goBack();
//     } else {
//       // Turn on the camera and switch back to video call
//       _engine.current?.enableLocalVideo(false);
//       _engine.current?.muteLocalVideoStream(true);
//     }
//     setCameraOn(prev => !prev);
//   };

//   const toggleSpeaker = () => {
//     _engine.current?.setEnableSpeakerphone(!isSpeakerOn);
//     setSpeakerOn(prev => !prev);
//   };
//   const showMessage = message => {
//     console.log(message);
//   };
//   const _renderRemoteVideos = () => {
//     if (peerIds.length > 0) {
//       const id = peerIds[0];
//       return (
//         <RtcSurfaceView style={styles.remote} canvas={{uid: id}} key={id} />
//       );
//     } else {
//       return <Text style={styles.text}>No remote video</Text>;
//     }
//   };

//   const _renderVideos = () => (
//     <View style={styles.fullView}>
//       <View style={styles.remoteContainer}>
//         <View style={styles.counterContainer}>
//           <Text style={styles.callDuration}>{callDuration} mins left</Text>
//         </View>
//         {_renderRemoteVideos()}
//       </View>

//       {isCameraOn && (
//         <View style={styles.localContainer}>
//           <RtcSurfaceView style={styles.local} canvas={{uid: 0}} />
//         </View>
//       )}
//     </View>
//   );
//   return (
//     <View style={styles.max}>
//       {isJoined && _renderVideos()}
//       <View style={styles.buttonHolder}>
//         <TouchableOpacity onPress={toggleMic} style={styles.button}>
//           {isMicOn ? (
//             <SvgXml xml={SVG_unmute_mic} />
//           ) : (
//             <SvgXml xml={SVG_mute_mic} />
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity onPress={switchCamera} style={styles.button}>
//           <SvgXml xml={SVG_switch_camera} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={endCall} style={styles.button}>
//           <SvgXml xml={SVG_hangout_red} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleCamera} style={styles.button}>
//           <SvgXml
//             xml={isCameraOn ? SVG_stop_camera : SVG_stop_camera}
//             className="mt-2"
//           />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleSpeaker} style={styles.button}>
//           {isSpeakerOn ? (
//             <SvgXml xml={SVG_speaker} />
//           ) : (
//             <SvgXml xml={SVG_speakeroff} />
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   max: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   fullView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   localContainer: {
//     position: 'absolute',
//     backgroundColor: '#000',
//     bottom: 10,
//     right: 20,
//     width: 120,
//     height: 170,
//     borderRadius: 14,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#fff',
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     shadowOffset: {width: 0, height: 2},
//     elevation: 5,
//   },
//   local: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 12,
//   },
//   remoteContainer: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   remote: {
//     width: width - 10,
//     height: height / 2.6,
//     borderRadius: 10,
//   },
//   counterContainer: {
//     position: 'absolute',
//     top: 10,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     paddingVertical: 5,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   callDuration: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonHolder: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//   },
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 31,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.3,
//         shadowRadius: 5,
//         shadowOffset: {width: 0, height: 2},
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   text: {
//     color: 'black',
//   },
// });

// export default VideoCallScreen;
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  createAgoraRtcEngine,
} from 'react-native-agora';
import requestCameraAndAudioPermission from '../../Components/permissions.js';
import { SvgXml } from 'react-native-svg';
import {
  SVG_hangout_red,
  SVG_mute_mic,
  SVG_speaker,
  SVG_speakeroff,
  SVG_stop_camera,
  SVG_switch_camera,
  SVG_unmute_mic,
} from './../../Utils/SVGImage.js';
import { useWebSocket } from '../../shared/WebSocketProvider.jsx';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const appId = '1be639d040da4a42be10d134055a2abd';

const VideoCallScreen = ({ route, navigation }) => {
  const { config, mobile, chatId, userInfo } = route.params || {};
  const _engine = useRef(null);
  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isMicOn, setMicOn] = useState(true);
  const [isCameraOn, setCameraOn] = useState(true);
  const [isSpeakerOn, setSpeakerOn] = useState(true);
  const { webSocket, leave } = useWebSocket();
  const [callDuration, setCallDuration] = useState('00:00:00');

  // Handle call duration updates from WebSocket
  useEffect(() => {
    const handleCallDurationUpdate = (data) => {
      setCallDuration(data.callDuration);
    };

    webSocket.on('updateCallDuration', handleCallDurationUpdate);
    return () => {
      webSocket.off('updateCallDuration', handleCallDurationUpdate);
    };
  }, [webSocket]);

  // Initialize Agora engine and handle permissions
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        requestCameraAndAudioPermission().then(() => {
          console.log('Permissions requested!');
        });
      }

      if (!config || !config.channelName || !config.token || typeof config.uid !== 'number') {
        console.error('Invalid config parameters');
        navigation.goBack();
        return;
      }

      init();
      return () => {
        if (_engine.current) {
          _engine.current.leaveChannel();
          _engine.current.removeAllListeners();
          _engine.current.release();
          _engine.current = null;
        }
      };
    }, [config, navigation]),
  );

  // Initialize Agora engine
  const init = async () => {
    try {
      _engine.current = createAgoraRtcEngine();
      _engine.current.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + config.channelName);
          setJoined(true);
          setConnectionStatus('Connected');
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setPeerIds((prev) => [...prev, Uid]);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setPeerIds((prev) => prev.filter((id) => id !== Uid));
        },
        onUserMuteVideo: (_connection, Uid, muted) => {
          if (muted) {
            showMessage('Remote user turned off the camera');
            navigation.goBack();
          }
        },
        onError: (err) => {
          console.error('Agora Error:', err);
          showMessage('Agora Error: ' + JSON.stringify(err));
          setConnectionStatus('Error');
        },
      });

      _engine.current.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });

      _engine.current.enableVideo();
      _engine.current.startPreview();
      startCall();
    } catch (error) {
      console.error('Error initializing Agora Engine:', error);
      showMessage('Error initializing Agora Engine: ' + error);
    }
  };

  // Start the call
  const startCall = async () => {
    try {
      await _engine.current?.joinChannel(
        config.token,
        config.channelName,
        config.uid,
        { clientRoleType: ClientRoleType.ClientRoleBroadcaster },
      );
      setConnectionStatus('Connecting...');
    } catch (error) {
      console.error('Error joining channel:', error);
      showMessage('Error joining channel: ' + error);
      setConnectionStatus('Error');
    }
  };

  // End the call
  const endCall = useCallback(async () => {
    try {
      if (_engine.current) {
        await _engine.current.leaveChannel();
        _engine.current.removeAllListeners();
        _engine.current.release();
        leave();
      }
    } catch (error) {
      console.error('Error ending call:', error);
      showMessage('Error ending call: ' + error);
    }

    setPeerIds([]);
    setJoined(false);
    setConnectionStatus('Not Connected');
  }, [leave]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    _engine.current?.muteLocalAudioStream(!isMicOn);
    setMicOn((prev) => !prev);
  }, [isMicOn]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    _engine.current?.enableLocalVideo(!isCameraOn);
    _engine.current?.muteLocalVideoStream(isCameraOn);
    setCameraOn((prev) => !prev);
  }, [isCameraOn]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    _engine.current?.setEnableSpeakerphone(!isSpeakerOn);
    setSpeakerOn((prev) => !prev);
  }, [isSpeakerOn]);

  // Switch camera
  const switchCamera = useCallback(() => {
    _engine.current?.switchCamera();
  }, []);

  const showMessage = message => {
      console.log(message);
      };
  // Render remote videos
  const _renderRemoteVideos = useMemo(() => {
    if (peerIds.length > 0) {
      const id = peerIds[0];
      return <RtcSurfaceView style={styles.remote} canvas={{ uid: id }} key={id} />;
    } else {
      return <Text style={styles.text}>No remote video</Text>;
    }
  }, [peerIds]);

  // Render all videos
  const _renderVideos = useMemo(() => (
    <View style={styles.fullView}>
      <View style={styles.remoteContainer}>
        <View style={styles.counterContainer}>
          <Text style={styles.callDuration}>{callDuration} mins left</Text>
        </View>
        {_renderRemoteVideos}
      </View>

      {isCameraOn && (
        <View style={styles.localContainer}>
          <RtcSurfaceView style={styles.local} canvas={{ uid: 0 }} />
        </View>
      )}
    </View>
  ), [callDuration, _renderRemoteVideos, isCameraOn]);

  // Render control buttons
  const renderControlButtons = useMemo(() => (
    <View style={styles.buttonHolder}>
      <ControlButton onPress={toggleMic}>
        {isMicOn ? <SvgXml xml={SVG_unmute_mic} /> : <SvgXml xml={SVG_mute_mic} />}
      </ControlButton>
      <ControlButton onPress={switchCamera}>
        <SvgXml xml={SVG_switch_camera} />
      </ControlButton>
      <ControlButton onPress={endCall}>
        <SvgXml xml={SVG_hangout_red} />
      </ControlButton>
      <ControlButton onPress={toggleCamera}>
        <SvgXml xml={SVG_stop_camera} style={{ marginTop: 8 }} />
      </ControlButton>
      <ControlButton onPress={toggleSpeaker}>
        {isSpeakerOn ? <SvgXml xml={SVG_speaker} /> : <SvgXml xml={SVG_speakeroff} />}
      </ControlButton>
    </View>
  ), [toggleMic, switchCamera, endCall, toggleCamera, toggleSpeaker, isMicOn, isSpeakerOn]);

  return (
    <View style={styles.max}>
      {isJoined ? _renderVideos : null}
      {renderControlButtons}
    </View>
  );
};

// Reusable ControlButton component
const ControlButton = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    {children}
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  max: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localContainer: {
    position: 'absolute',
    backgroundColor: '#000',
    bottom: 10,
    right: 20,
    width: 120,
    height: 170,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  local: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  remoteContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  remote: {
    width: width - 10,
    height: height / 2.6,
    borderRadius: 10,
  },
  counterContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  callDuration: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 31,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  text: {
    color: 'black',
  },
});

export default React.memo(VideoCallScreen);