// import { create } from 'zustand';
// import { io as SocketIOClient } from 'socket.io-client'; 
// import { BASE_URI_websocket } from '../Api/ApiManager.js';
// import useUserStore from '../stores/user.store.js'; 

// const initWebSocket = (set) => ({
//   webSocket: null,
//   createWebSocket: async () => {
//     try {
//       const callerId = useUserStore.getState().user.mobile; 
//       const socket = SocketIOClient(BASE_URI_websocket, {
//         transports: ['websocket'],
//         query: { callerId },
//       });
//       set({ webSocket: socket });
//       socket.on('connect', () => {
//         console.log('WebSocket connected');
//       });

//       socket.on('disconnect', () => {
//         console.log('WebSocket disconnected');
//       });

//     } catch (error) {
//       console.error('Error creating WebSocket:', error);
//     }
//   },
//   closeWebSocket: () => {
//     const socket = get().webSocket;
//     if (socket) {
//       socket.disconnect();
//       set({ webSocket: null });
//     }
//   },
// });

// const useWebSocketStore = create((set, get) => ({
//   ...initWebSocket(set, get)
// }));

// export default useWebSocketStore;


import { create } from 'zustand';
import { io as SocketIOClient } from 'socket.io-client'; 
import { BASE_URI_websocket } from '../Api/ApiManager.js';
import useUserStore from '../stores/user.store.js'; 

const initWebSocket = (set, get) => ({
  webSocket: null,
  createWebSocket: async () => {
    try {
      const callerId = useUserStore.getState().user.mobile; 
      const token = useUserStore.getState().localTokens.accessToken;
      const socket = SocketIOClient(BASE_URI_websocket, {
        transports: ['websocket'],
        query: { callerId },
        extraHeaders: {
          Authorization: `Bearer ${token}` 
        }
      });
 
      set({ webSocket: socket });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  },
  closeWebSocket: () => {
    const socket = get().webSocket;
    if (socket) {
      socket.disconnect();
      set({ webSocket: null });
    }
  },
});

const useWebSocketStore = create((set, get) => ({
  ...initWebSocket(set, get)
}));

export default useWebSocketStore;

