import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Modal,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Entypo';
import userImg from '../images/man-img.jpg';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import {
  Button,
  Menu,
  Divider,
  PaperProvider,
  RadioButton,
  Dialog,
  Portal,
} from 'react-native-paper';
import useUserStore from '../stores/user.store';
import {
  chatDetailsUpdate,
  getSingleConversation,
  uploadFileForMedia,
} from '../Api/chatService';
import DocumentPicker from 'react-native-document-picker';
import {useSnackbar} from '../shared/SnackbarProvider';

const UserSummeryScreen = ({route, navigation}) => {
  const {chatId, userInfo} = route.params;
  const [isSelected, setSelection] = useState(false);
  const [documentType, setDocumentType] = useState('first');
  const [visible, setVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const {user} = useUserStore();
  const [summary, setSummary] = useState('');
  const [media, setMedia] = useState([]);
  const [note, setNote] = useState('');
  const [chats, setChats] = useState(null);
  const [modalEdit, setModalEdit] = useState({type: '', fieldData: ''});
  const [loading, setLoading] = useState(false);
  const {showSnackbar} = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const response = await getSingleConversation(chatId);
        setChats(response);
        setSummary(response?.summary ? response.summary : '');
        setMedia(response?.media ? response.media : []);
        setNote(response?.note ? response.note : '');
      } catch (error) {
        setChats(null);
        console.log(error);
      }
    })();
  }, [chatId]);

  const openEditModal = type => {
    if (type === 'summary') {
      setModalEdit({type: 'summary', fieldData: summary});
    } else if (type === 'note') {
      setModalEdit({type: 'note', fieldData: note});
    }
    setEditModalVisible(true);
  };
  const closeEditModal = () => setEditModalVisible(false);

  const handleSaveEdit = () => {
    if (modalEdit.type == 'note') {
      setNote(modalEdit.fieldData);
    } else if (modalEdit.type == 'summary') {
      setSummary(modalEdit.fieldData);
    }
    setModalEdit({type: '', fieldData: ''});
    closeEditModal();
  };

  const updateChatDetails = async () => {
    try {
      setLoading(true);
      const res = await chatDetailsUpdate(chatId, {summary, note, media});
      // console.log("res update note",res)
      navigation.reset({
        index: 0,
        routes: [{name: 'Parent'}],
      });
    } catch (error) {
      console.log('check error update time');
    } finally {
      setLoading(false);
    }
  };

  const selectFiles = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      uploadFiles(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
    }
  };

  const onUploadProgress = progess => {
    console.log('check progress data===>', progess);
  };

  const uploadFiles = async files => {
    if (files.length === 0) {
      Alert.alert('Please select at least one file!');
      return;
    }
    const formData = new FormData();
    for (const file of files) {
      let fileUri = file.uri;
      const fileData = {
        uri: Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri,
        type: file.type,
        name: file.name,
      };
      formData.append('files', fileData);
    }

    formData.append('chatId', chatId);

    try {
      const response = await uploadFileForMedia(formData, onUploadProgress);
      console.log('response====upload file===>', response);
      if (response?.data?.data?.length) {
        setMedia(response?.data?.data || []);
        //   response.data.data.forEach(item=>{
        //     // sendMessage(item,getMessageTypeFromFile(item))
        //   })
      }
    } catch (error) {
      console.log(error);
      showSnackbar('File upload failed!' + error.message, 'error');
    }
  };

  return (
    <PaperProvider>
      <View className="relative flex-1 h-full">
        <View className="p-6 flex flex-wrap flex-row justify-between w-full">
          <Icon
            name="arrowleft"
            color="#000"
            size={20}
            onPress={() => navigation.goBack()}
            className="w-1/2"
          />
          <Icon2
            name="dots-three-vertical"
            color="#000"
            size={20}
            className="w-1/2"
            onPress={() => openMenu()}
          />
        </View>

        <View className="text-center flex justify-center items-center">
          <Image
            source={userInfo?.avatar ? {uri: userInfo.avatar} : userImg}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-black font-medium	pt-5 text-2xl">
            {userInfo?.name}
          </Text>
          <Text className="text-black pb-4">
            {user?.officerDetails?.ConsultationTypeID?.ConsultationTypeName ||
              'none'}
          </Text>
        </View>

        <View className="flex flex-wrap flex-row pl-6 pr-6 pb-2 justify-between w-full">
          <Text className="text-black font-bold w-1/2">Summary</Text>
          <Text
            className="text-blue-600 font-medium text-right border-b border-blue-600"
            onPress={() => openEditModal('summary')}>
            Edit
          </Text>
        </View>
        <Text className="text-black pl-6 pr-6">
          {summary != ''
            ? summary
            : `Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud`}
        </Text>

        <Text className="border-b border-gray-500 h-2 w-full p-2"></Text>

        <View className="flex flex-wrap flex-row p-6 justify-between w-full">
          <Text className="text-black font-bold w-1/2">Media</Text>
          <Text
            className="text-blue-600 font-medium text-right border-b border-blue-600"
            onPress={selectFiles}>
            Add
          </Text>
        </View>

        <View className="checklistWrappper text-left pl-6 pt-3 pb-5">
          <RadioButton.Group
            onValueChange={newValue => setDocumentType(newValue)}
            value={documentType}>
            {media.length > 0 ? (
              <View className="pb-0 flex flex-wrap items-center gap-6 justify-between flex-row w-full">
                {media.map((item, index) => (
                  <View key={'media_' + index} className="flex-row gap-2">
                    <Icon3 name="file-pdf-o" color="#000" size={20} />
                    <Text className="text-black text-base font-medium">
                      {item.substring(item.lastIndexOf('/') + 1)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="pb-0 flex flex-wrap items-center gap-6 justify-between flex-row w-full">
                <Text className="text-black text-base font-medium">
                  <Icon3 name="file-pdf-o" color="#000" size={20} />
                  Empty
                </Text>
              </View>
            )}

            {/* <View className="pb-0 flex flex-wrap items-center gap-6 justify-between flex-row w-full">
              <Text className="text-black text-base font-medium">
                <Icon3 name="file-pdf-o" color="#000" size={20} /> Essential
                checklist.pdf
              </Text>
            </View>
            <View className="flex flex-wrap items-center flex-row">
              <Text className="text-black text-base font-medium">
                <Icon3 name="file-pdf-o" color="#000" size={20} /> Paper
                document name.pdf
              </Text>
            </View> */}
          </RadioButton.Group>
        </View>

        <Text className="border-b border-gray-500 h-2 w-full"></Text>

        <View className="flex flex-wrap flex-row p-6 justify-between w-full">
          <Text className="text-black font-bold w-1/2">Notes</Text>
          <Text
            className="text-blue-600 font-medium text-right border-b border-blue-600"
            onPress={() => openEditModal('note')}>
            Write Notes
          </Text>
        </View>
        <Text className="text-center text-black">
          {note != '' ? note : `No Note Found`}
        </Text>

        <View className="absolute bottom-0 w-full">
          <TouchableHighlight className="ml-6 mr-6">
            <View className="flex justify-center items-center bg-red-800 py-4 rounded-lg">
              <Text
                className="text-white text-[18px] font-bold"
                onPress={updateChatDetails}>
                Save
              </Text>
            </View>
          </TouchableHighlight>
          <Text
            className="text-red-800 font-bold text-center p-6 text-[18px]"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Parent'}],
              });
            }}>
            Back To Dashboard
          </Text>
        </View>

        <Portal>
          <Dialog
            visible={editModalVisible}
            onDismiss={closeEditModal}
            style={{backgroundColor: 'white'}}>
            <Dialog.Title style={{color: 'black'}}>
              {'Edit ' + modalEdit.type}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder={'Edit ' + modalEdit.type}
                placeholderTextColor="gray"
                value={modalEdit.fieldData}
                onChangeText={text =>
                  setModalEdit({...modalEdit, fieldData: text})
                }
                style={{
                  height: 100,
                  backgroundColor: 'white',
                  padding: 10,
                  color: 'black',
                }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={closeEditModal}>Cancel</Button>
              <Button onPress={handleSaveEdit} disabled={loading}>
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

export default UserSummeryScreen;
