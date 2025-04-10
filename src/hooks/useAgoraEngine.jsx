import { useState, useEffect, useRef } from 'react';
import { ChannelProfileType, ClientRoleType, createAgoraRtcEngine } from 'react-native-agora';

const APP_ID = '1be639d040da4a42be10d134055a2abd';

const useAgoraEngine = (config, onJoinSuccess, onUserJoined, onUserOffline, onError) => {
  const engine = useRef(null);
  const [peerIds, setPeerIds] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!config || !config.channelName || !config.token || typeof config.uid !== 'number') {
      onError(new Error('Invalid config parameters'));
      return;
    }

    const init = async () => {
      try {
        engine.current = createAgoraRtcEngine();
        engine.current.registerEventHandler({
          onJoinChannelSuccess: () => {
            onJoinSuccess(config.channelName);
            setIsJoined(true);
          },
          onUserJoined: (_connection, Uid) => {
            onUserJoined(Uid);
            setPeerIds(prev => [...prev, Uid]);
          },
          onUserOffline: (_connection, Uid) => {
            onUserOffline(Uid);
            setPeerIds(prev => prev.filter(id => id !== Uid));
          },
          onError: err => {
            onError(err);
          },
        });

        engine.current.initialize({
          appId: APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
        });

        if (config.video) {
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
          { clientRoleType: ClientRoleType.ClientRoleBroadcaster },
        );
      } catch (error) {
        onError(error);
      }
    };

    init();

    return () => {
      if (engine.current) {
        engine.current.leaveChannel();
        engine.current.release();
        engine.current = null;
      }
    };
  }, [config]);

  return { engine, peerIds, isJoined };
};

export default useAgoraEngine;



// import { useState, useEffect, useRef } from 'react';
// import { ChannelProfileType, ClientRoleType, createAgoraRtcEngine } from 'react-native-agora';

// const APP_ID = '1be639d040da4a42be10d134055a2abd';

// const useAgoraEngine = (config, onJoinSuccess, onUserJoined, onUserOffline, onError) => {
//   const engine = useRef(null);
//   const [peerIds, setPeerIds] = useState([]);
//   const [isJoined, setIsJoined] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);

//   useEffect(() => {
//     if (!config || !config.channelName || !config.token || typeof config.uid !== 'number') {
//       console.error('Invalid config:', config);
//       onError(new Error('Invalid config parameters'));
//       return;
//     }

//     const init = async () => {
//       try {
//         console.log('Initializing Agora Engine with config:', config);
//         engine.current = createAgoraRtcEngine();
//         engine.current.registerEventHandler({
//           onJoinChannelSuccess: () => {
//             console.log('Joined channel successfully:', config.channelName);
//             onJoinSuccess(config.channelName);
//             setIsJoined(true);
//             setIsJoining(false);
//           },
//           onUserJoined: (_connection, Uid) => {
//             console.log('User joined:', Uid);
//             onUserJoined(Uid);
//             setPeerIds(prev => [...prev, Uid]);
//           },
//           onUserOffline: (_connection, Uid) => {
//             console.log('User offline:', Uid);
//             onUserOffline(Uid);
//             setPeerIds(prev => prev.filter(id => id !== Uid));
//           },
//           onError: (errCode, msg) => {
//             console.error('Agora Engine Error:', { errCode, msg });
//             onError(new Error(`Agora Error ${errCode}: ${msg}`));
//             setIsJoining(false);
//           },
//           onLeaveChannel: () => {
//             console.log('Left channel');
//             setIsJoined(false);
//           },
//         });

//         await engine.current.initialize({
//           appId: APP_ID,
//           channelProfile: ChannelProfileType.ChannelProfileCommunication,
//         });
//         console.log('Engine initialized');

//         engine.current.enableAudio();
//         engine.current.disableVideo();

//         console.log('Joining channel with token:', config.token);
//         setIsJoining(true);

//         // Add a timeout to detect join failure
//         const joinTimeout = setTimeout(() => {
//           if (!isJoined) {
//             console.error('Channel join timeout after 10 seconds');
//             onError(new Error('Channel join timeout'));
//             setIsJoining(false);
//           }
//         }, 10000);

//         await engine.current.joinChannel(
//           config.token,
//           config.channelName,
//           config.uid,
//           { clientRoleType: ClientRoleType.ClientRoleBroadcaster },
//         );

//         clearTimeout(joinTimeout); // Clear timeout if join succeeds
//       } catch (error) {
//         console.error('Error in init:', error);
//         onError(error);
//         setIsJoining(false);
//       }
//     };

//     init();

//     return () => {
//       console.log('Component unmounting, engine persists');
//       // Do not release engine here to keep call alive
//     };
//   }, [config, onJoinSuccess, onUserJoined, onUserOffline, onError]);

//   const leaveChannel = async () => {
//     if (engine.current) {
//       console.log('Leaving channel');
//       await engine.current.leaveChannel();
//       engine.current.release();
//       engine.current = null;
//       setIsJoined(false);
//       setIsJoining(false);
//     }
//   };

//   return { engine, peerIds, isJoined, isJoining, leaveChannel };
// };

// export default useAgoraEngine;


// import { useEffect, useState } from 'react';
// import {
//   ChannelProfileType,
//   ClientRoleType,
//   createAgoraRtcEngine
// } from 'react-native-agora';

// const APP_ID = '1be639d040da4a42be10d134055a2abd';

// // Singleton pattern to keep engine persistent across screens
// let globalEngine = null;
// let isEngineInitialized = false;

// const useAgoraEngine = (
//   config,
//   onJoinSuccess = () => {},
//   onUserJoined = () => {},
//   onUserOffline = () => {},
//   onError = () => {}
// ) => {
//   const [peerIds, setPeerIds] = useState([]);
//   const [isJoined, setIsJoined] = useState(false);

//   useEffect(() => {
//     if (!config || !config.channelName || !config.token || typeof config.uid !== 'number') {
//       console.log('Agora config is invalid:', config);
//       onError(new Error('Invalid config parameters'));
//       return;
//     }
//     console.log('Joining channel with config:', config);

//     const init = async () => {
//       try {
//         if (!globalEngine) {
//           globalEngine = createAgoraRtcEngine();
//         }

//         if (!isEngineInitialized) {
//           globalEngine.initialize({
//             appId: APP_ID,
//             channelProfile: ChannelProfileType.ChannelProfileCommunication,
//           });

//           globalEngine.registerEventHandler({
//             onJoinChannelSuccess: () => {
//               onJoinSuccess(config.channelName);
//               setIsJoined(true);
//             },
//             onUserJoined: (_connection, Uid) => {
//               onUserJoined(Uid);
//               setPeerIds(prev => [...prev, Uid]);
//             },
//             onUserOffline: (_connection, Uid) => {
//               onUserOffline(Uid);
//               setPeerIds(prev => prev.filter(id => id !== Uid));
//             },
//             onError: err => {
//               onError(err);
//             },
//           });

//           isEngineInitialized = true;
//         }

//         if (config.video) {
//           globalEngine.enableVideo();
//           globalEngine.startPreview();
//         } else {
//           globalEngine.enableAudio();
//           globalEngine.disableVideo();
//         }

//         await globalEngine.joinChannel(
//           config.token,
//           config.channelName,
//           config.uid,
//           { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
//         );
//       } catch (error) {
//         onError(error);
//       }
//     };

//     init();

//     return () => {
//       // Don't release engine on unmount to persist across screens
//       // Leave channel if needed in a centralized cleanup method (not here)
//     };
//   }, [config]);

//   // Optional method to end the call manually
//   const leaveChannel = async () => {
//     try {
//       if (globalEngine) {
//         await globalEngine.leaveChannel();
//         setIsJoined(false);
//         setPeerIds([]);
//       }
//     } catch (err) {
//       console.warn('Failed to leave channel:', err);
//     }
//   };

//   return {
//     engine: globalEngine,
//     peerIds,
//     isJoined,
//     leaveChannel,
//   };
// };

// export default useAgoraEngine;



// import { useEffect, useState } from 'react';
// import {
//   ChannelProfileType,
//   ClientRoleType,
//   createAgoraRtcEngine,
// } from 'react-native-agora';

// const APP_ID = '1be639d040da4a42be10d134055a2abd'; // Replace with your Agora App ID if different

// let globalEngine = null;
// let isEngineInitialized = false;

// const useAgoraEngine = (
//   config,
//   onJoinSuccess = () => {},
//   onUserJoined = () => {},
//   onUserOffline = () => {},
//   onError = () => {}
// ) => {
//   const [peerIds, setPeerIds] = useState([]);
//   const [isJoined, setIsJoined] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!config || !config.channelName || !config.token || typeof config.uid !== 'number') {
//       const err = new Error('Invalid config: ' + JSON.stringify(config));
//       console.error(err.message);
//       setError(err);
//       onError(err);
//       return;
//     }

//     const init = async () => {
//       try {
//         console.log('Initializing Agora engine...');
//         if (!globalEngine) {
//           globalEngine = createAgoraRtcEngine();
//         }

//         if (!isEngineInitialized) {
//           console.log('Setting up engine with App ID:', APP_ID);
//           await globalEngine.initialize({
//             appId: APP_ID,
//             channelProfile: ChannelProfileType.ChannelProfileCommunication,
//           });

//           globalEngine.registerEventHandler({
//             onJoinChannelSuccess: (connection, elapsed) => {
//               console.log('Channel joined successfully:', config.channelName, 'Elapsed:', elapsed);
//               setIsJoined(true);
//               onJoinSuccess(config.channelName);
//             },
//             onUserJoined: (_connection, uid) => {
//               console.log('User joined:', uid);
//               onUserJoined(uid);
//               setPeerIds(prev => [...new Set([...prev, uid])]);
//             },
//             onUserOffline: (_connection, uid) => {
//               console.log('User offline:', uid);
//               onUserOffline(uid);
//               setPeerIds(prev => prev.filter(id => id !== uid));
//             },
//             onError: (errCode, msg) => {
//               console.error('Agora error - Code:', errCode, 'Message:', msg);
//               const err = new Error(`Agora error ${errCode}: ${msg}`);
//               setError(err);
//               onError(err);
//             },
//             onConnectionStateChanged: (state, reason) => {
//               console.log('Connection state changed:', state, 'Reason:', reason);
//             },
//           });

//           isEngineInitialized = true;
//         }

//         console.log('Enabling audio and joining channel:', config);
//         globalEngine.enableAudio();
//         globalEngine.disableVideo(); // Ensure video is off for audio-only call

//         await globalEngine.joinChannel(
//           config.token,
//           config.channelName,
//           config.uid,
//           { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
//         );
//         console.log('Join channel command sent');
//       } catch (error) {
//         console.error('Engine setup or join failed:', error);
//         setError(error);
//         onError(error);
//       }
//     };

//     init();

//     return () => {
//       console.log('Component unmounting, engine persists');
//     };
//   }, [config, onJoinSuccess, onUserJoined, onUserOffline, onError]);

//   const leaveChannel = async () => {
//     try {
//       if (globalEngine && isJoined) {
//         await globalEngine.leaveChannel();
//         console.log('Channel left successfully');
//         setIsJoined(false);
//         setPeerIds([]);
//       }
//     } catch (err) {
//       console.error('Leave channel failed:', err);
//       setError(err);
//     }
//   };

//   return { engine: globalEngine, peerIds, isJoined, leaveChannel, error };
// };

// export default useAgoraEngine;