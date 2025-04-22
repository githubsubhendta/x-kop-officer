// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
// } from 'react';
// import {io as SocketIOClient} from 'socket.io-client';
// import {BASE_URI_websocket} from '../Api/ApiManager.js';
// import userStoreAction from './../stores/user.store.js';
// import {useNetwork} from './NetworkProvider';

// const WebSocketContext = createContext();
// import {navigate, reset} from '../navigation/NavigationService.js';
// import { useCall } from '../context/callContext.js';

// export const WebSocketProvider = ({children}) => {
//   const [webSocket, setWebSocket] = useState(null);
//   const {user, localTokens} = userStoreAction(state => state);
//   const {isConnected} = useNetwork();
//   const [callReceiver, setCallReceiver] = useState(false);
//   const userInfo = useRef(null);
//   const consultationTypeName = useRef(null);
//   const otherUserId = useRef(null);
//   const remoteRTCMessage = useRef(null);
//   const chatId = useRef(null);

//   const createWebSocket = async () => {
//     if (!isConnected) {
//       console.log('No internet connection, WebSocket not created.');
//       return;
//     }

//     const token = localTokens?.accessToken;
//     if (!token) {
//       console.log('Access token not available, WebSocket not created.');
//       return;
//     }

//     try {
//       const callerId = user.mobile;

//       const socket = SocketIOClient(BASE_URI_websocket, {
//         transports: ['websocket'],
//         query: {callerId},
//         extraHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       socket.on('connect', () => {
//         console.log(user.mobile + ' WebSocket connected ' + user.name);
//       });

//       socket.on('disconnect', () => {
//         console.log('WebSocket disconnected');
//       });

//       socket.on('connect_error', async error => {
//         // console.error('WebSocket connection error:', error);
//         const newTokens = await userStoreAction(state => state.refreshTokens);
//         if (newTokens) {
//           socket.io.opts.extraHeaders.Authorization = `Bearer ${newTokens.accessToken}`;
//           socket.connect();
//         }
//       });

//       setWebSocket(socket);
//     } catch (error) {
//       // console.error('Error creating WebSocket:', error);
//     }
//   };

//   const closeWebSocket = () => {
//     if (webSocket) {
//       webSocket.disconnect();
//       setWebSocket(null);
//     }
//   };

//   useEffect(() => {
//     if (isConnected && localTokens?.accessToken) {
//       createWebSocket();
//     } else {
//       closeWebSocket();
//     }

//     return () => {
//       closeWebSocket();
//     };
//   }, [isConnected, user, localTokens]);

//   useEffect(() => {
//     if (webSocket) {
//       webSocket.on('newCall', data => {
//         remoteRTCMessage.current = data.rtcMessage;
//         otherUserId.current = data.callerId;
//         consultationTypeName.current = data.consultationTypeName;
//         userInfo.current = data.userInfo;
//         setCallReceiver(true);
//       });

//       webSocket.on('appyHandsup', data => {
//         setCallReceiver(false);
             
//         if (data.type == 'call_reject') {
//           // reset(0,[{
//           //   name: "Parent",
//           // }])
//           return;
//         }

//         reset(0, [
//           {
//             name: 'EndCallScreen',
//             params: {chatId: chatId.current, userInfo: userInfo.current},
//           },
//         ]);
//       });

//       webSocket.on('callAnswered', data => {
//         chatId.current = data.chatId;
//         navigate('AudioScreen', {
//           config: remoteRTCMessage.current,
//           mobile: otherUserId.current,
//           chatId: chatId.current,
//           userInfo: userInfo.current,
//         });
//       });
//     }

//     return () => {
//       if (webSocket) {
//         webSocket.off('newCall');
//         webSocket.off('appyHandsup');
//         webSocket.off('callAnswered');
//       }
//     };
//   }, [webSocket]);

//   const leave = (type = 'any') => {
//     // webSocket?.emit('handsup', { otherUserId: mobile });

//     webSocket.emit('handsup', {
//       otherUserId: otherUserId.current,
//       type: type,
//     });

//     setCallReceiver(false);
//   };

//   const processAccept = () => {
//     webSocket.emit('answerCall', {
//       callerId: otherUserId.current,
//       rtcMessage: remoteRTCMessage.current,
//       officer: user._id,
//       customer: userInfo.current._id,
//     });
//     setCallReceiver(false);
//   };

//   return (
//     <WebSocketContext.Provider
//       value={{
//         webSocket,
//         callReceiver,
//         userInfo,
//         consultationTypeName,
//         otherUserId,
//         remoteRTCMessage,
//         leave,
//         processAccept,
//       }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io as SocketIOClient } from 'socket.io-client';
import { BASE_URI_websocket } from '../Api/ApiManager.js';
import userStoreAction from '../stores/user.store.js';
import { useNetwork } from './NetworkProvider';
import { navigate } from '../navigation/NavigationService.js';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);
  const { user, localTokens } = userStoreAction(state => state);
  const { isConnected } = useNetwork();
  const [callReceiver, setCallReceiver] = useState(false);
  const userInfo = useRef(null);
  const consultationTypeName = useRef(null);
  const otherUserId = useRef(null);
  const remoteRTCMessage = useRef(null);
  const chatId = useRef(null);

  const createWebSocket = async () => {
    if (!isConnected) {
      console.log('No internet connection, WebSocket not created.');
      return;
    }

    const token = localTokens?.accessToken;
    if (!token) {
      console.log('Access token not available, WebSocket not created.');
      return;
    }

    try {
      const callerId = user.mobile;

      const socket = SocketIOClient(BASE_URI_websocket, {
        transports: ['websocket'],
        query: { callerId },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket.on('connect', () => {
        console.log(user.mobile + ' WebSocket connected ' + user.name);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socket.on('connect_error', async error => {
        const newTokens = await userStoreAction(state => state.refreshTokens);
        if (newTokens) {
          socket.io.opts.extraHeaders.Authorization = `Bearer ${newTokens.accessToken}`;
          socket.connect();
        }
      });

      setWebSocket(socket);
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  };

  const closeWebSocket = () => {
    if (webSocket) {
      webSocket.disconnect();
      setWebSocket(null);
    }
  };

  useEffect(() => {
    if (isConnected && localTokens?.accessToken) {
      createWebSocket();
    } else {
      closeWebSocket();
    }

    return () => {
      closeWebSocket();
    };
  }, [isConnected, user, localTokens]);

  useEffect(() => {
    if (webSocket) {
      webSocket.on('newCall', data => {
        remoteRTCMessage.current = data.rtcMessage;
        otherUserId.current = data.callerId;
        consultationTypeName.current = data.consultationTypeName;
        userInfo.current = data.userInfo;
        setCallReceiver(true);
      });

      webSocket.on('callAnswered', data => {
        chatId.current = data.chatId;
        navigate('AudioScreen', {
          config: remoteRTCMessage.current,
          mobile: otherUserId.current,
          chatId: chatId.current,
          userInfo: userInfo.current,
        });
      });
    }

    return () => {
      if (webSocket) {
        webSocket.off('newCall');
        webSocket.off('callAnswered');
      }
    };
  }, [webSocket]);

  const leave = (type = 'any') => {
    webSocket.emit('handsup', {
      otherUserId: otherUserId.current,
      type: type,
    });
    setCallReceiver(false);
  };

  const processAccept = () => {
    webSocket.emit('answerCall', {
      callerId: otherUserId.current,
      rtcMessage: remoteRTCMessage.current,
      officer: user._id,
      customer: userInfo.current._id,
    });
    setCallReceiver(false);
  };

  return (
    <WebSocketContext.Provider
      value={{
        webSocket,
        callReceiver,
        userInfo,
        consultationTypeName,
        otherUserId,
        remoteRTCMessage,
        leave,
        processAccept,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
