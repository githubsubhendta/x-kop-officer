import React, {useEffect, useRef, useState} from 'react';
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
import {SvgXml} from 'react-native-svg';
import {
  SVG_hangout_red,
  SVG_mute_mic,
  SVG_speaker,
  SVG_speakeroff,
  SVG_stop_camera,
  SVG_switch_camera,
  SVG_unmute_mic,
} from './../../Utils/SVGImage.js';
import {useWebSocket} from '../../shared/WebSocketProvider.jsx';

const {width, height} = Dimensions.get('window');
const appId = '1be639d040da4a42be10d134055a2abd';

const VideoCallScreen = ({route, navigation}) => {
  const {config, mobile, chatId, userInfo} = route.params || {};
  const _engine = useRef(null);
  const [isJoined, setJoined] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [isMicOn, setMicOn] = useState(true);
  const [isCameraOn, setCameraOn] = useState(true);
  const [isSpeakerOn, setSpeakerOn] = useState(true);
  const {webSocket, leave} = useWebSocket();
  const [callDuration, setCallDuration] = useState('00:00:00');

  // const durationInterval = useRef(null);

  useEffect(() => {
    const handleCallDurationUpdate = data => {
      setCallDuration(data.callDuration);
    };

    webSocket.on('updateCallDuration', handleCallDurationUpdate);
    return () => {
      webSocket.off('updateCallDuration', handleCallDurationUpdate);
    };
  }, [webSocket, endCall]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('Permissions requested!');
      });
    }

    if (
      !config ||
      !config.channelName ||
      !config.token ||
      typeof config.uid !== 'number'
    ) {
      console.error('Invalid config parameters');
      navigation.goBack();
      return;
    }
    init();
    // return () => {
    //   endCall();
    // };
  }, []);

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
          showMessage('Remote user joined with uid' + Uid);
          setPeerIds(prev => [...prev, Uid]);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setPeerIds(prev => prev.filter(id => id !== Uid));
        },
        onError: err => {
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

  // const init = async () => {
  //   try {
  //     _engine.current = createAgoraRtcEngine();
  //     _engine.current.registerEventHandler({
  //       onJoinChannelSuccess: () => {
  //         showMessage('Successfully joined the channel ' + config.channelName);
  //         setJoined(true);
  //         setConnectionStatus('Connected');

  //         // Start call duration counter
  //         setCallDuration(0);
  //         if (durationInterval.current) clearInterval(durationInterval.current);
  //         durationInterval.current = setInterval(() => {
  //           setCallDuration(prev => prev + 1);
  //         }, 1000);
  //       },
  //       onUserJoined: (_connection, Uid) => {
  //         showMessage('Remote user joined with uid' + Uid);
  //         setPeerIds(prev => [...prev, Uid]);
  //       },
  //       onUserOffline: (_connection, Uid) => {
  //         showMessage('Remote user left the channel. uid: ' + Uid);
  //         setPeerIds(prev => prev.filter(id => id !== Uid));
  //       },
  //       onError: err => {
  //         console.error('Agora Error:', err);
  //         showMessage('Agora Error: ' + JSON.stringify(err));
  //         setConnectionStatus('Error');
  //       },
  //     });

  //     _engine.current.initialize({
  //       appId: appId,
  //       channelProfile: ChannelProfileType.ChannelProfileCommunication,
  //     });

  //     _engine.current.enableVideo();
  //     _engine.current.startPreview();
  //     startCall();
  //   } catch (error) {
  //     console.error('Error initializing Agora Engine:', error);
  //     showMessage('Error initializing Agora Engine: ' + error);
  //   }
  // };

  const startCall = async () => {
    try {
      await _engine.current?.joinChannel(
        config.token,
        config.channelName,
        config.uid,
        {clientRoleType: ClientRoleType.ClientRoleBroadcaster},
      );
      setConnectionStatus('Connecting...');
    } catch (error) {
      console.error('Error joining channel:', error);
      showMessage('Error joining channel: ' + error);
      setConnectionStatus('Error');
    }
  };

  const endCall = async () => {
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
  };

  // const endCall = async () => {
  //   try {
  //     if (_engine.current) {
  //       await _engine.current.leaveChannel();
  //       _engine.current.removeAllListeners();
  //       _engine.current.release();
  //       leave();
  //     }
  //   } catch (error) {
  //     console.error('Error ending call:', error);
  //     showMessage('Error ending call: ' + error);
  //   }
  //   setPeerIds([]);
  //   setJoined(false);
  //   setConnectionStatus('Not Connected');
  //   // Stop call duration counter
  //   if (durationInterval.current) clearInterval(durationInterval.current);
  // };

  const toggleMic = () => {
    _engine.current?.muteLocalAudioStream(!isMicOn);
    setMicOn(prev => !prev);
  };

  const switchCamera = () => {
    _engine.current?.switchCamera();
  };

  const toggleCamera = () => {
    _engine.current?.enableLocalVideo(!isCameraOn);
    setCameraOn(prev => !prev);
  };

  const toggleSpeaker = () => {
    _engine.current?.setEnableSpeakerphone(!isSpeakerOn);
    setSpeakerOn(prev => !prev);
  };

  const showMessage = message => {
    console.log(message);
  };

  const _renderRemoteVideos = () => {
    if (peerIds.length > 0) {
      const id = peerIds[0];
      return (
        <RtcSurfaceView style={styles.remote} canvas={{uid: id}} key={id} />
      );
    } else {
      return <Text style={styles.text}>No remote video</Text>;
    }
  };

  const _renderVideos = () => (
    <View style={styles.fullView}>
      <View style={styles.remoteContainer}>
        <View style={styles.counterContainer}>
          <Text style={styles.callDuration}>{callDuration} mins left</Text>
        </View>
        {_renderRemoteVideos()}
      </View>
      {isCameraOn && (
        <View style={styles.localContainer}>
          <RtcSurfaceView style={styles.local} canvas={{uid: 0}} />
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.max}>
      {isJoined && _renderVideos()}
      <View style={styles.buttonHolder}>
        <TouchableOpacity onPress={endCall} style={styles.button}>
          <SvgXml xml={SVG_hangout_red}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMic} style={styles.button}>
          {isMicOn ? (
             <SvgXml xml={SVG_unmute_mic} />
          ) : (
            <SvgXml xml={SVG_mute_mic} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={switchCamera} style={styles.button}>
          <SvgXml xml={SVG_switch_camera} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCamera} style={styles.button}>
          {isCameraOn ? (
            <SvgXml xml={SVG_stop_camera} />
          ) : (
            <SvgXml xml={SVG_switch_camera} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSpeaker} style={styles.button}>
          {isSpeakerOn ? (
            <SvgXml xml={SVG_speaker} />
          ) : (
            <SvgXml xml={SVG_speakeroff} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  fullView: {
    flex: 1,
    position: 'relative',
  },
  localContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 100,
    height: 150,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  local: {
    width: '100%',
    height: '100%',
  },
  remoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remote: {
    width: width - 20,
    height: height / 2,
    borderRadius: 10,
  },
  counterContainer: {
    width: 180,
    backgroundColor: '#997654',
    borderRadius: 20,
    margin: 10,
    padding: 8,
    alignItems:"center",
  },
  callDuration: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 31,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'slategray',
    // borderWidth: 2,
  },
  text: {
    color: 'black',
  },
});

export default VideoCallScreen;
