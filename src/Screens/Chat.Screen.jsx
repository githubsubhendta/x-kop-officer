import React, {useEffect, useRef, useState, useCallback, memo} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatHeader from '../Components/chat/ChatHeader';
import ChatMessageInput from '../Components/chat/ChatMessageInput';
import ChatArea from '../Components/chat/ChatArea';
import {useWebSocket} from '../shared/WebSocketProvider';
import useUserStore from '../stores/user.store';
import {getAllConversations, usePaginatedChats} from '../Api/chatService.js';
import useChatStore from '../stores/chat.store.js';
import {SvgXml} from 'react-native-svg';
import Video from 'react-native-video';
import {SVG_download, SVG_PDF} from '../Utils/SVGImage.js';
import RNFS from 'rn-fetch-blob';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Message = ({item, user, onPress, onLongPress, selectedMessages}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileExists, setFileExists] = useState(false);

  const isFileExist = async fileUrl => {
    const {fs} = RNFS;
    const downloadDir =
      Platform.OS === 'android' && fs.dirs.DownloadDir
        ? fs.dirs.DownloadDir
        : fs.dirs.DocumentDir;
    const fileName = fileUrl.split('/').pop();
    const filePath = `${downloadDir}/${fileName}`;
    const exists = await fs.exists(filePath);
    return exists;
  };

  useEffect(() => {
    const checkFileExistence = async () => {
      const exists = await isFileExist(item.content);
      setFileExists(exists);
    };
    checkFileExistence();
  }, [item.content]);

  const downloadFiles = async fileUrl => {
    console.log('Starting file download...');
    try {
      setDownloading(true);
      setProgress(0);

      const {config, fs} = RNFS;
      const downloadDir =
        Platform.OS === 'android' && fs.dirs.DownloadDir
          ? fs.dirs.DownloadDir
          : fs.dirs.DocumentDir;
      const fileName = fileUrl.split('/').pop();
      const filePath = `${downloadDir}/${fileName}`;

      console.log('Download file path:', filePath);

      const dirExists = await fs.exists(downloadDir);
      if (!dirExists) {
        Alert.alert(
          'Error',
          `The download directory ${downloadDir} does not exist.`,
        );
        return;
      }

      const fileExists = await fs.exists(filePath);
      if (fileExists) {
        Alert.alert('File Exists', `The file "${fileName}" already exists.`);
        return;
      }

      const task = config({path: filePath, fileCache: true}).fetch(
        'GET',
        fileUrl,
      );
      task.progress(({bytesWritten, contentLength}) => {
        const progressPercentage = (bytesWritten / contentLength) * 100;
        setProgress(progressPercentage);
        console.log(`Download progress: ${progressPercentage.toFixed(2)}%`);
      });

      const result = await task;

      if (result?.respInfo?.status === 200) {
        Alert.alert('Download Complete', `File downloaded to: ${filePath}`);
        console.log('Download successful:', filePath);
      } else {
        Alert.alert(
          'Download Failed',
          `Failed with status code: ${result?.respInfo?.status || 'unknown'}`,
        );
        console.error('Download failed with status:', result?.respInfo?.status);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'An error occurred while downloading.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onLongPress={onLongPress}
        onPress={onPress}
        style={[
          styles.messageContainer,
          item.sender === user._id
            ? styles.currentUserMessage
            : styles.otherUserMessage,
          selectedMessages.includes(item._id) > 0 && styles.selectedMessage,
        ]}
      >
        {item.type === 'text' && (
          <Text style={styles.content}>{item.content}</Text>
        )}
        {item.type === 'image' && item.content && (
          <View style={styles.image}>
            <TouchableOpacity onPress={() => item.openImageModal(item.content)}>
              <Image source={{ uri: item.content }} style={styles.image} />
            </TouchableOpacity>
            {!fileExists && item.sender !== user._id && (
              <View className="absolute right-0 -bottom-5 w-8 h-7">
                {downloading ? (
                  <AnimatedCircularProgress
                    size={40}
                    width={4}
                    fill={progress}
                    tintColor="#4F46E5"
                    backgroundColor="#E5E7EB"
                    lineCap="round"
                  >
                    {(fill) => (
                      <Text className="text-xs font-bold text-gray-700">
                        {Math.round(progress)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                ) : (
                  <SvgXml
                    onPress={() => downloadFiles(item.content)}
                    xml={SVG_download}
                    height={'100%'}
                    width={'100%'}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {item.type === 'video' && (
          <View style={styles.videoContainer}>
            <TouchableOpacity
              onPress={() => item.openVideoModal(item.content)}
              style={styles.videoContainer}
            >
              <Icon
                name="play-circle-outline"
                size={40}
                color="white"
                style={styles.playIcon}
              />
            </TouchableOpacity>
            {!fileExists && item.sender !== user._id && (
              <View className="absolute right-0 -bottom-7 w-8 h-7">
                {downloading ? (
                  <AnimatedCircularProgress
                    size={30}
                    width={4}
                    fill={progress}
                    tintColor="#4F46E5"
                    backgroundColor="#E5E7EB"
                    lineCap="round"
                  >
                    {(fill) => (
                      <Text className="text-xs font-bold text-gray-700">
                        {Math.round(progress)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                ) : (
                  <SvgXml
                    onPress={() => downloadFiles(item.content)}
                    xml={SVG_download}
                    height={'100%'}
                    width={'100%'}
                  />
                )}
              </View>
            )}
          </View>
        )}
        {item.type === 'file' && (
          <View style={styles.backButton}>
            <TouchableOpacity style={styles.backButton}>
              <SvgXml xml={SVG_PDF} height={'100%'} width={'100%'} />
            </TouchableOpacity>
            {!fileExists && item.sender !== user._id && (
              <View className="absolute -right-14 mt-1 w-8 h-8">
                {downloading ? (
                  <AnimatedCircularProgress
                    size={40}
                    width={4}
                    fill={progress}
                    tintColor="#4F46E5"
                    backgroundColor="#E5E7EB"
                    lineCap="round"
                  >
                    {(fill) => (
                      <Text className="text-xs font-bold text-gray-700">
                        {Math.round(progress)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                ) : (
                  <SvgXml
                    onPress={() => downloadFiles(item.content)}
                    xml={SVG_download}
                    height={'100%'}
                    width={'100%'}
                  />
                )}
              </View>
            )}
          </View>
        )}
        <Text style={styles.timeStamp}>
          {new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ChatScreen = ({route, navigation}) => {
  const {webSocket} = useWebSocket();
  const {user} = useUserStore();
  const {chatId, chats} = route.params;
  const [openMenu, setOpenMenu] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const flatListRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const {conversations, setConversations} = useChatStore();
  const showEditButton = selectedMessages.length === 1;
  // const chats = user.chats.find(chat => chat._id === chatId);
  const officer =
    chats?.participants?.find(
      participant => participant?.officerDetails === undefined,
    ) || {};

  // useEffect(() => {
  //   if (conversations.length) {
  //     const currentConversation = conversations.find(
  //       convo => convo.conversationId === chatId,
  //     );

  //     if (currentConversation) {
  //       setAllMessages(
  //         currentConversation?.messages?.sort(
  //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  //         ),
  //       );
  //     }
  //   }
  // }, [conversations, chatId, setConversations]);

  useEffect(() => {
    (async () => {
      const getInitial = await getAllConversations(chatId);

      if (conversations.length === 0) {
        setConversations([
          { conversationId: chatId, messages: getInitial.messages },
        ]);
      } else {
        const currentConversation = conversations.find(
          (convo) => convo.conversationId === chatId,
        );
        if (currentConversation) {
          updateNewMessageStore(getInitial.messages);
        } else {
          setConversations([
            ...conversations,
            { conversationId: chatId, messages: getInitial.messages },
          ]);
        }
      }
    })();
  }, [chatId, conversations]);

  useEffect(() => {
    if (webSocket) {
      webSocket.on('newmessage', (newMessage) => {
        setAllMessages((prevMessages) => {
          const updatedMessages = [newMessage, ...prevMessages];
          return updatedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );
        });
      });

      return () => {
        webSocket.off('newmessage');
      };
    }
  }, [webSocket]);

  // const handleUpdateMessage = useCallback(() => {
  //   if (editingMessage && editContent.trim()) {
  //     if (webSocket) {
  //       webSocket.emit('updatemessage', {
  //         messageId: editingMessage,
  //         newContent: editContent,
  //         reciever: {id: officer._id, mobile: officer.mobile},
  //       });
  //     }
  //     setSelectedMessages([]);
  //     setEditingMessage(null);
  //     setEditContent('');
  //   }
  // }, [webSocket, editingMessage, editContent]);


  const handleUpdateMessage = useCallback(() => {
    if (editingMessage && editContent.trim()) {
      if (webSocket) {
        webSocket.emit('updatemessage', {
          messageId: editingMessage,
          newContent: editContent,
          receiver: { id: officer._id, mobile: officer.mobile },
        });
      }
      setSelectedMessages([]);
      setEditingMessage(null);
      setEditContent('');
    }
  }, [webSocket, editingMessage, editContent, officer._id, officer.mobile]);

  // const toggleMessageSelection = messageId => {
  //   setSelectedMessages(prev =>
  //     prev.includes(messageId)
  //       ? prev.filter(id => id !== messageId)
  //       : [...prev, messageId],
  //   );
  // };

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId],
    );
  };
  
  const handleEditMessage = useCallback(
    (messageId) => {
      const messageToEdit = allMessages.find((msg) => msg._id === messageId);
      if (messageToEdit) {
        setEditContent(messageToEdit.content);
        setEditingMessage(messageId);
      }
    },
    [allMessages],
  );

  const openImageModal = imageUri => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const openVideoModal = videoUri => {
    setSelectedVideo(videoUri);
    setVideoModalVisible(true);
  };

  const {loading, hasMoreChats, loadMoreChats} = usePaginatedChats(chatId);

  const onLoadMore = () => {
    if (!loading && hasMoreChats) {
      loadMoreChats();
    }
  };

  const updateNewMessageStore = newMessage => {
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
    (async () => {
      const getInitial = await getAllConversations(chatId);

      // setConversations([])
      if (conversations.length === 0) {
        setConversations([
          {conversationId: chatId, messages: getInitial.messages},
        ]);
      } else {
        const currentConversation = conversations.find(
          convo => convo.conversationId === chatId,
        );
        if (currentConversation) {
          updateNewMessageStore(getInitial.messages);
        } else {
          setConversations([
            ...conversations,
            {conversationId: chatId, messages: getInitial.messages},
          ]);
        }
      }
    })();
  }, []);

  const deleteMessages = useCallback(() => {
    if (selectedMessages.length === 0) return;
    Alert.alert(
      'Delete Messages',
      'Are you sure you want to delete the selected message(s)?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setSelectedMessages([]);
            if (webSocket) {
              webSocket.emit('deletemessages', {
                messageIds: selectedMessages,
                reciever: {id: officer._id, mobile: officer.mobile},
              });
            }
          },
          style: 'destructive',
        },
      ],
    );
  }, [selectedMessages, webSocket, user]);

  const filterMessageType = messageId => {
    const filterType = allMessages.find(msg => msg._id === messageId);
    return filterType.type;
  };

  // const handleEditMessage = useCallback(
  //   messageId => {
  //     const messageToEdit = allMessages.find(msg => msg._id === messageId);
  //     if (messageToEdit) {
  //       setEditContent(messageToEdit.content);
  //       setEditingMessage(messageId);
  //     }
  //   },
  //   [allMessages],
  // );

  // const removeUser = (userId) => {
  //   console.log(`Removing user with ID: ${userId}`);
    
  // };

  // const blockUser = (userId) => {
  //   console.log(`Blocking user with ID: ${userId}`);
    
  // };

  return (
    <View style={styles.container}>
      <ChatHeader
        officer={officer}
        chats={chats}
        selectedMessages={selectedMessages}
        filterMessageType={filterMessageType}
        handleEditMessage={handleEditMessage}
        deleteMessages={deleteMessages}
        showEditButton={showEditButton}
        setOpenMenu={setOpenMenu}
        openMenu={openMenu}
        navigation={navigation}
      //   blockUser={blockUser} 
      // removeUser={removeUser}
      />

      <ChatArea
        flatListRef={flatListRef}
        allMessages={allMessages?.map(message => ({
          ...message,
          openImageModal,
          openVideoModal,
        }))}
        renderMessage={({item}) => (
          <Message
            item={item}
            user={user}
            onLongPress={() =>
              item.sender != officer._id && toggleMessageSelection(item._id)
            }
            onPress={() =>
              item.sender != officer._id &&
              selectedMessages.length > 0 &&
              toggleMessageSelection(item._id)
            }
            selectedMessages={selectedMessages}
          />
        )}
        loading={loading}
        onLoadMore={onLoadMore}
      />
      <ChatMessageInput
        user={user}
        officer={officer}
        editingMessage={editingMessage}
        editContent={editContent}
        setEditContent={setEditContent}
        handleUpdateMessage={handleUpdateMessage}
        setEditingMessage={setEditingMessage}
        setSelectedMessages={setSelectedMessages}
      />

      <Modal visible={isModalVisible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image source={{uri: selectedImage}} style={styles.modalImage} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isVideoModalVisible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setVideoModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVideoModalVisible(false)}>
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <Video
              source={{uri: selectedVideo}}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  currentUserMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-end',
    shadowColor: '#000', 
  shadowOffset: {
    width: 0, 
    height: 2, 
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
  borderRadius: 8, 
  paddingLeft: 10, 
  marginVertical: 5, 
  },
  otherUserMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    shadowColor: '#000', 
  shadowOffset: {
    width: 0, 
    height: 2, 
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 2,
  borderRadius: 8, 
  paddingLeft: 10, 
  marginVertical: 5, 
  },
  selectedMessage: {
    borderColor: '#228B22',
    borderWidth: 2,
  },
  content: {
    fontSize: 16,
    color: 'black',
  },
  image: {
    position: 'relative',
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  videoContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  playIcon: {
    position: 'absolute',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '100%',
    height: '90%',
    borderRadius: 10,
  },
  videoPlayer: {
    width: '100%',
    height: '90%',
  },
  backButton: {
    position: 'relative',
    width: 32,
    height: 32,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default ChatScreen;

