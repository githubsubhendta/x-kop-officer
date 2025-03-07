import { useWebSocket } from './WebSocketProvider';
import { useEffect} from 'react';
import { useFirebase } from './FirebaseProvider';
import useUserStore from '../stores/user.store';
import useChatStore from '../stores/chat.store';
import CallPopup from '../Components/CallPopup';
import { getCurrentRoute } from '../navigation/NavigationService';

const ParantWrapperProvider = ({children}) => {
    const {webSocket,callReceiver,userInfo,leave,processAccept} = useWebSocket();
    const {fcmToken} = useFirebase();
    const { user, handleUpdateUser } = useUserStore();
    const { conversations,setConversations } = useChatStore();
    const currentRoute = getCurrentRoute();
   
  useEffect(()=>{
    // console.log("check fcmToken fcm token===",fcmToken)
    if (webSocket && fcmToken) {
       webSocket.emit('onLive', {
      status: true,
      fcmToken,
    });
  } else{
    webSocket && webSocket.emit('onLive', {
      status: true
    });
  }
  },[webSocket,fcmToken]);





  const updateNewMessageStore = (newMessage,chatId) => {
    const updatedConversations = conversations.map(convo => {
      if (convo.conversationId === chatId) {
        return {
          ...convo,
          messages: newMessage,
        };
      }
      return convo;
    });

    setConversations(updatedConversations);
  };

  useEffect(() => {
    const handleMessage = data => {
      const currentConversation = conversations.find(convo => convo.conversationId === data.message.chat);
      if (currentConversation) {
          const updatedConversations = conversations.map((convo) => {
              if (convo.conversationId === data.message.chat) {
                  let allMessages = [...convo.messages];
                  allMessages.unshift(data.message)
                  return {
                      ...convo,
                      messages: allMessages,
                  };
              }
              return convo;
          });
          setConversations(updatedConversations);
      }
       else {
          setConversations([...conversations, { conversationId: data.message.chat, messages: [data.message] }]);
      }
      
    };

    const handleMessageUpdate = updatedMessage => {
      const currentConversation = conversations.find(
        convo => convo.conversationId === updatedMessage.message.chat,
      );
      let filteredMessages = currentConversation.messages.map(
        (msg) => {
           if(msg._id===updatedMessage.message._id){
          msg.content=updatedMessage.message.content
        }
        return msg;
      }
      );
      updateNewMessageStore(filteredMessages,updatedMessage.message.chat);
    };

    const handleMessageDeletion = ({ messageIds,chat_id }) => {
      const currentConversation = conversations.find(
        convo => convo.conversationId === chat_id,
      );
      let filteredMessages = currentConversation.messages.filter(
        msg => !messageIds.includes(msg._id),
      );
     
      updateNewMessageStore(filteredMessages,chat_id);
    };

    if (webSocket) {
      webSocket.on('receiveMessage', handleMessage);
      webSocket.on('messageUpdated', handleMessageUpdate);
      webSocket.on('messageDeleted', handleMessageDeletion);
    }

    return () => {
      if (webSocket) {
        webSocket.off('receiveMessage', handleMessage);
        webSocket.off('messageUpdated', handleMessageUpdate);
        webSocket.off('messageDeleted', handleMessageDeletion);
      }
    };
  }, [webSocket, user, handleUpdateUser,conversations]);
 
  return (
    <>
    <CallPopup isVisible={currentRoute?.name !="Home" && callReceiver} onAccept={processAccept} onReject={leave} userInfo={userInfo}  />
    {children}
    </>
  )
}

export default ParantWrapperProvider;