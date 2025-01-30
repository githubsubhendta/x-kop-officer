import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { SvgXml } from 'react-native-svg';
// import { RtcSurfaceView } from 'react-native-agora';
import useAgoraEngine from '../../hooks/useAgoraEngine';
// import useWebSocketStore from '../../stores/webSocket.js';
import { 
  SVG_hangout_red, SVG_mute_mic, SVG_request_video, SVG_speaker, SVG_speakeroff, SVG_unmute_mic 
} from './../../Utils/SVGImage.js';
import MessageInput from '../../Components/chat/MessageInput.jsx';

import { useWebSocket } from '../../shared/WebSocketProvider.jsx';
import ChatModal from '../../Components/chat/ChatModal.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AudioScreen = ({ route, navigation }) => {
  const { config, mobile, chatId, userInfo } = route.params || {};
  const { webSocket,leave } = useWebSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [peerIds, setPeerIds] = useState([]);
  const [modelChat,setModelChat] = useState(false);

  const [callDuration,setCallDuration] = useState('00:00:00');

  const { engine, isJoined } = useAgoraEngine(
    config,
    () => setConnectionStatus('Connected'),
    (Uid) => {
      if (!peerIds.includes(Uid)) {
        setPeerIds(prev => [...prev, Uid]);
      }
    },
    (Uid) => {
      setPeerIds(prev => prev.filter(id => id !== Uid));
    },
    () => setConnectionStatus('Not Connected')
  );

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

  const endCall = useCallback(async () => {
    if (engine.current) {
      await engine.current.leaveChannel();
      leave()
    }
  }, [engine, webSocket, mobile, navigation]);

  const switchToVideoCall = useCallback(async () => {
    if (engine.current) {
      webSocket.emit('videocall', { calleeId: mobile });
    }
  }, [engine, webSocket, mobile]);


  const createTwoButtonAlert = () => {
    Alert.alert('Call', 'Requesting for Video Call', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: async () => {
        webSocket.emit('VideoCallanswerCall', { callerId: mobile });
        await engine.current?.leaveChannel();
        setTimeout(() => {
          navigation.navigate('VideoCallScreen', { config, mobile,chatId,userInfo });
        }, 300);
      }},
    ]);
  };

  useEffect(() => {
    webSocket.on('newVideoCall', createTwoButtonAlert);
    webSocket.on('VideoCallAnswered', async () => {
      await engine.current?.leaveChannel();
      navigation.navigate('VideoCallScreen', { config, mobile,userInfo,chatId });
    });
    return () => {
      webSocket.off('newVideoCall', createTwoButtonAlert);
      webSocket.off('VideoCallAnswered', async () => {
        await engine.current?.leaveChannel();
        navigation.navigate('VideoCallScreen', { config, mobile,userInfo,chatId });
      });
    };
  }, [webSocket, engine, createTwoButtonAlert, navigation, config, mobile]);

  useEffect(() => {
    const handleCallDurationUpdate = (data) => {
      setCallDuration(data.callDuration)
     
    };
  
    webSocket.on('updateCallDuration', handleCallDurationUpdate);
    return () => {
      webSocket.off('updateCallDuration', handleCallDurationUpdate);
    };
  }, [webSocket, endCall]);

  const handleClose = useCallback(() => setModelChat(false), []);

  const chatModal = useMemo(() => (
    <ChatModal 
      chatId={chatId} 
      isVisible={modelChat} 
      onClose={handleClose} 
    />
  ), [chatId, modelChat, handleClose]);

  return (
    <View style={styles.container}>
      {connectionStatus !== 'Connected' ? (
        <Text style={styles.connectionStatus}>{connectionStatus}</Text>
      ) : (
        <View style={styles.mainContent}>
          <View style={styles.endCallButton}>
            <TouchableOpacity onPress={endCall}>
              <SvgXml xml={SVG_hangout_red} width={80} height={80} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
          {/* userInfo */}
            <Image source={userInfo?.avatar?{ uri: userInfo?.avatar }:require("./../../images/book2.jpg")} style={styles.profileImage} />
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
              {isMuted ? <SvgXml xml={SVG_mute_mic} /> : <SvgXml xml={SVG_unmute_mic} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleSpeaker}>
              {isSpeakerEnabled ? <SvgXml xml={SVG_speaker} /> : <SvgXml xml={SVG_speakeroff} />}
            </TouchableOpacity>
          </View>
          {/* <View style={styles.messageInputContainer}>
            <MessageInput />
          </View> */}
                <View style={styles.messageInputContainer}>
        <TouchableOpacity
          style={styles.InputContainer}
          onPress={() => setModelChat(true)}>
          <TextInput
            style={styles.input}
            placeholder="Start Typing Here"
            placeholderTextColor="#888"
            editable={false}
          />
          <View style={styles.iconsContainer}>
            {/* Attach File Button */}
            <View style={styles.iconButton}>
              <Icon name="attach-file" size={24} color="#888" />
            </View>
            <View style={styles.iconButton}>
              <Icon name="send" size={24} color="#888" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
         {/* <ChatModal chatId={chatId} isVisible={modelChat} onClose={()=>setModelChat(false)} /> */}
         {chatModal}
        </View>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   connectionStatus: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: 'black',
//   },
//   mainContent: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   endCallButton: {
//     margin: 20,
//     alignItems: 'flex-end',
//   },
//   infoContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: '500',
//   },
//   title: {
//     fontSize: 20,

//   },
//   status: {
//     fontSize: 16,
//     color: 'gray',
//   },
//   counterContainer: {
//     backgroundColor: '#997654',
//     borderRadius: 15,
//     marginTop: 10,
//     padding: 10,
//   },
//   callDuration: {
//     fontSize: 18,
//     color: 'white',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   button: {
//     width: 62,
//     height: 62,
//     borderRadius: 31,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor: 'slategray',
//     borderWidth: 2,
//   },
//   messageInputContainer: {
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   input: {
//     // flex: 1,
//     fontSize: 16,
//     color: '#000',
//     width: 'auto',
//   },
//   iconsContainer: {
//     flexDirection: 'row',
//     // width:"100%",
//   },
//   iconButton: {
//     padding: 5,
//     marginLeft: 5,
//   },
//   InputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     margin: 10,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  connectionStatus: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  endCallButton: {
    margin: 20,
    alignItems: 'flex-end',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '500',
    color: 'gray',
  },
  title: {
    fontSize: 20,
    color: 'gray',
  },
  status: {
    fontSize: 16,
    color: 'gray',
  },
  counterContainer: {
    backgroundColor: '#997654',
    borderRadius: 15,
    marginTop: 10,
    padding: 10,
  },
  callDuration: {
    fontSize: 18,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'slategray',
    borderWidth: 2,
  },
  messageInputContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    // flex: 1,
    fontSize: 16,
    color: '#000',
    width: 'auto',
  },
  iconsContainer: {
    flexDirection: 'row',
    // width:"100%",
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





