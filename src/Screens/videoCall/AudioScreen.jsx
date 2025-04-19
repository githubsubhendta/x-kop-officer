import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Platform,
  PermissionsAndroid,
  Dimensions,
  BackHandler,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { SvgXml } from 'react-native-svg';
import RNFS from 'react-native-fs';
import {
  SVG_arrow_back,
  SVG_hangout_red,
  SVG_mute_mic,
  SVG_request_video,
  SVG_speaker,
  SVG_speakeroff,
  SVG_unmute_mic,
} from './../../Utils/SVGImage.js';
import { useWebSocket } from '../../shared/WebSocketProvider.jsx';
import ChatModal from '../../Components/chat/ChatModal.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../Components/CustomModal.jsx';
import { useCall } from '../../context/callContext.js';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AudioScreen = ({ route, navigation }) => {
  const { config, mobile, chatId, userInfo } = route.params || {};
  const { webSocket, leave } = useWebSocket();
  const {
    startCall,
    minimizeCall,
    endCall: contextEndCall,
    activeCall,
    isMinimized,
    engine,
    peerIds,
    isJoined
  } = useCall();

  // Handle hardware back button
  useEffect(() => {
    const handleBackButton = () => {
      if (activeCall && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, [navigation, activeCall]);




  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  // Using isJoined from CallContext for connection status
  const [modelChat, setModelChat] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00:00');
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Only start a new call if we don't have an active call and engine isn't initialized
    if (!activeCall && !engine.current) {
      console.log('No active call, starting new call');
      startCall({ config, mobile, chatId, userInfo, callDuration });
    } else {
      console.log('Active call exists, not restarting - isMinimized:', isMinimized);
    }

    // Connection status is now handled by isJoined from CallContext
  }, [activeCall, config, mobile, chatId, userInfo, callDuration, startCall, engine]);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        if (
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('Permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      const microphoneStatus = await request(PERMISSIONS.IOS.MICROPHONE);
      const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      if (
        microphoneStatus === RESULTS.GRANTED &&
        cameraStatus === RESULTS.GRANTED
      ) {
        console.log('Microphone and camera permissions granted');
      } else {
        console.log('Microphone or camera permission denied');
      }
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);


  useEffect(() => {
    const handleVideoCallAnswered = async () => {
      console.log('VideoCallAnswered received');
      await engine.current?.leaveChannel();
      navigation.navigate('VideoCallScreen', { config, mobile, userInfo, chatId });
    };

    webSocket.on('VideoCallAnswered', handleVideoCallAnswered);


    const handleHandsup = () => {
      contextEndCall();
    };

    webSocket.on('appyHandsup', handleHandsup);

    return () => {
      webSocket.off('VideoCallAnswered', handleVideoCallAnswered);
      webSocket.off('appyHandsup', handleHandsup);
    };
  }, [engine, navigation, config, mobile, userInfo, chatId]);

  useEffect(() => {
    webSocket.on('newVideoCall', () => setShowVideoCallModal(true));
    webSocket.on('updateCallDuration', data => {
      setCallDuration(data.callDuration);
      if (activeCall) {
        startCall({ ...activeCall, callDuration: data.callDuration });
      }
    });
    return () => {
      webSocket.off('newVideoCall')
      webSocket.off('updateCallDuration');
    };
  }, []);

  // const handleNavigation = useCallback(() => {
  //   console.log('handleNavigation triggered');
  //   minimizeCall();
  //   setTimeout(() => {
  //     navigation.goBack();
  //     console.log('Navigated back from AudioScreen');
  //   }, 100);
  // }, [minimizeCall, navigation]);

  // Handle device back button
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => {
  //       if (activeCall) {
  //         console.log('Hardware back button pressed, minimizing');
  //         minimizeCall();
  //         navigation.goBack();
  //         return true; 
  //       }
  //       return false;
  //     },
  //   );

  //   return () => backHandler.remove();
  // }, [activeCall, minimizeCall, navigation]);

  const endCallHandler = useCallback(async () => {
    console.log('endCallHandler triggered');
    if (engine.current) {
      await engine.current.leaveChannel();
      engine.current.release();
      engine.current = null;
    }
    await contextEndCall();
    // Only navigate back if we can
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  const toggleMute = useCallback(async () => {
    if (engine.current) {
      await engine.current.muteLocalAudioStream(!isMuted);
      setIsMuted(prev => !prev);
    }
  }, [isMuted, engine]);

  const toggleSpeaker = useCallback(async () => {
    if (engine.current) {
      await engine.current.setEnableSpeakerphone(!isSpeakerEnabled);
      setIsSpeakerEnabled(prev => !prev);
    }
  }, [isSpeakerEnabled, engine]);

  const switchToVideoCall = useCallback(async () => {
    if (engine.current) {
      webSocket.emit('videocall', { calleeId: mobile });
    }
  }, [engine, webSocket, mobile]);



  const startRecording = async () => {
    if (!engine.current) return;
    try {
      const filePath = `${RNFS.DocumentDirectoryPath
        }/call_recording_${Date.now()}.aac`;
      await RNFS.mkdir(RNFS.DocumentDirectoryPath);
      await engine.current.startAudioRecording({
        filePath,
        sampleRate: 32000,
        quality: 1,
      });
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = useCallback(async () => {
    if (engine.current) {
      await engine.current.stopAudioRecording();
      setIsRecording(false);
    }
  }, [engine]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (activeCall && !isMinimized) {
        minimizeCall();
        console.log('AudioScreen blurred, minimized');
      }
    });

    return unsubscribe;
  }, [activeCall, isMinimized, minimizeCall]);

  useEffect(() => {
    webSocket.on('newVideoCall', () => setShowVideoCallModal(true));
    webSocket.on('VideoCallAnswered', async () => {
      await engine.current?.leaveChannel();
      navigation.navigate('VideoCallScreen', { config, mobile, userInfo, chatId });
    });
    webSocket.on('updateCallDuration', data => {
      setCallDuration(data.callDuration);
      if (activeCall) {
        startCall({ ...activeCall, callDuration: data.callDuration });
      }
    });

    return () => {
      webSocket.off('newVideoCall');
      webSocket.off('VideoCallAnswered');
      webSocket.off('updateCallDuration');
    };
  }, [
    webSocket,
    engine,
    navigation,
    config,
    mobile,
    userInfo,
    chatId,
    activeCall,
    startCall,
  ]);

  const chatModal = useMemo(
    () => (
      <ChatModal
        chatId={chatId}
        isVisible={modelChat}
        onClose={() => setModelChat(false)}
      />
    ),
    [chatId, modelChat],
  );

  if (isMinimized) {
    console.log('AudioScreen minimized, returning null');
    return null;
  }

  return (
    <View style={styles.container}>
      {!isJoined ? (
        <Text style={styles.connectionStatus}>Connecting...</Text>
      ) : (
        <View style={styles.mainContent}>
          <View style={styles.endCallButton}>
            {/* <TouchableOpacity onPress={handleNavigation}>
              <SvgXml xml={SVG_arrow_back} width={30} height={30} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={async () => {
              endCallHandler()
              // if (engine?.current) {
              //   await engine.current.leaveChannel();
              //   engine.current.release();
              //   engine.current = null;
              //   contextEndCall();
              //   leave();
              //   navigation.goBack();
              // }
            }}>
              <SvgXml xml={SVG_hangout_red} width={80} height={80} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Image
              source={
                userInfo?.avatar
                  ? { uri: userInfo?.avatar }
                  : require('./../../images/book2.jpg')
              }
              style={styles.profileImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{userInfo?.name}</Text>
              <Text style={styles.title}>General Offences</Text>
              <Text style={styles.status}>Call in Progress</Text>
              <View style={styles.counterContainer}>
                <Text style={styles.callDuration}>{callDuration} mins left</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={switchToVideoCall}>
              <SvgXml xml={SVG_request_video} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleMute}>
              {isMuted ? <SvgXml xml={SVG_unmute_mic} /> : <SvgXml xml={SVG_mute_mic} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleSpeaker}>
              {isSpeakerEnabled ? <SvgXml xml={SVG_speaker} /> : <SvgXml xml={SVG_speakeroff} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={isRecording ? stopRecording : () => setIsModalVisible(true)}
            >
              <Icon
                name={isRecording ? 'stop' : 'fiber-manual-record'}
                size={24}
                color={isRecording ? 'black' : 'red'}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity 
              style={styles.button} 
              onPress={handleNavigation}
            >
              <Text>Minimize</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.messageInputContainer}>
            <TouchableOpacity
              style={styles.InputContainer}
              onPress={() => setModelChat(true)}
            >
              <TextInput
                style={styles.input}
                placeholder="Start Typing Here"
                placeholderTextColor="#888"
                editable={false}
              />
              <View style={styles.iconsContainer}>
                <View style={styles.iconButton}>
                  <Icon name="attach-file" size={24} color="#888" />
                </View>
                <View style={styles.iconButton}>
                  <Icon name="send" size={24} color="#888" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {chatModal}
        </View>
      )}

      <CustomModal
        isVisible={showVideoCallModal}
        onClose={() => setShowVideoCallModal(false)}
        message="Requesting for Video Call"
        buttons={[
          { label: 'Cancel', onPress: () => setShowVideoCallModal(false), color: 'gray' },
          {
            label: 'OK',
            onPress: async () => {
              setShowVideoCallModal(false);
              webSocket.emit('VideoCallanswerCall', { callerId: mobile });
              await engine.current?.leaveChannel();
              setTimeout(() => {
                navigation.navigate('VideoCallScreen', { config, mobile, chatId, userInfo });
              }, 300);
            },
          },
        ]}
      />

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        message="Do you want to start recording?"
        buttons={[
          { label: 'Cancel', onPress: () => setIsModalVisible(false), color: 'gray' },
          { label: 'OK', onPress: () => { setIsModalVisible(false); startRecording(); } },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  connectionStatus: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
    fontSize: width > 400 ? 18 : 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  endCallButton: {
    margin: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  name: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: '500',
    color: 'gray',
  },
  title: {
    fontSize: width > 400 ? 20 : 18,
    color: 'gray',
  },
  status: {
    fontSize: width > 400 ? 16 : 14,
    color: 'gray',
  },
  counterContainer: {
    backgroundColor: '#997654',
    borderRadius: 15,
    marginTop: 10,
    padding: 10,
  },
  callDuration: {
    fontSize: width > 400 ? 18 : 16,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  button: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'slategray',
    borderWidth: 2,
  },
  messageInputContainer: {
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    fontSize: width > 400 ? 16 : 14,
    color: '#000',
    width: 'auto',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 5,
  },
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
});

export default AudioScreen;