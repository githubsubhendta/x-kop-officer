import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {
  SVG_camera,
  SVG_gallery,
  SVG_edit_white,
  SVG_person,
} from '../Utils/SVGImage.js';
import {updateAvatar} from '../Api/user.api.js';
import userStoreAction from '../stores/user.store.js';
function Avatar({url}) {
  const [uri, setUri] = useState('');
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  const [zoomVisible, setZoomVisible] = useState(false);
  const {localTokens, addLoggedInUserAction, handleUpdateUser} =
    userStoreAction(state => state);
  useEffect(() => {
    if (url != '') {
      setUri(url);
    }
  }, [url]);
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        try {
          const newData = new FormData();
          newData.append('file', {
            name: image.filename || image.path.split('/').pop(),
            type: image.mime,
            uri:
              Platform.OS === 'ios'
                ? image.path.replace('file://', '')
                : image.path,
          });

          const res_upload = await updateAvatar(
            localTokens.accessToken,
            newData,
          );
          handleUpdateUser(res_upload.data.data[0]);
          setUri(res_upload.data.data[0].avatar);
        } catch (error) {
          console.log(error);
        }
        // setUri(image.path);
      })
      .finally(close);
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(async image => {
        try {
          const newData = new FormData();
          newData.append('file', {
            name: image.filename || image.path.split('/').pop(),
            type: image.mime,
            uri:
              Platform.OS === 'ios'
                ? image.path.replace('file://', '')
                : image.path,
          });
          const res_upload = await updateAvatar(
            localTokens.accessToken,
            newData,
          );
          addLoggedInUserAction(res_upload.data.data[0], true);
        } catch (error) {
          console.log(error);
        }
        // setUri(image.path);
      })
      .finally(close);
  };

  return (
    <>
      <View className="flex justify-center items-center pb-10">
        <View className="w-[100px] h-[100px] bg-slate-200 rounded-full flex flex-row justify-center items-center relative">
          {uri && uri != '' ? (
            <TouchableOpacity
              onPress={() => setZoomVisible(true)}
              className="w-[100%] h-[100%] rounded-full ">
              <Image
                source={{uri}}
                className="w-[100%] h-[100%] rounded-full "
              />
            </TouchableOpacity>
          ) : (
            <View className="w-[100px] h-[100px] bg-slate-200 rounded-full flex flex-row justify-center items-center relative">
              <SvgXml xml={SVG_person} height={'100px'} width={'100px'} />
            </View>
          )}
          <TouchableOpacity
            className="w-10 h-10 absolute bottom-0 right-0 rounded-full bg-[#997654]"
            onPress={open}>
            <View className="z-50 h-8 w-8 m-auto">
              <SvgXml xml={SVG_edit_white} height={'100%'} width={'100%'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={visible}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <SafeAreaView className="bg-white flex-row rounded-tl-3xl rounded-tr-3xl p-10">
          <Pressable
            className="flex-1 justify-center items-center"
            onPress={chooseImage}>
            <SvgXml xml={SVG_gallery} height={'30px'} width={'30px'} />
            <Text className="text-orange-900">Library </Text>
          </Pressable>
          <Pressable
            className="flex-1 justify-center items-center"
            onPress={openCamera}>
            <SvgXml xml={SVG_camera} height={'30px'} width={'30px'} />
            <Text className="text-orange-900">Camera</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal
        isVisible={zoomVisible}
        onBackButtonPress={() => setZoomVisible(false)}
        onBackdropPress={() => setZoomVisible(false)}
        className="flex-row justify-center items-center m-0">
        <View className="flex-1">
          <TouchableOpacity
            className="absolute top-10 right-0 z-10 p-10"
            onPress={() => setZoomVisible(false)}>
            <Text className=" text-white text-[18px]">Close</Text>
          </TouchableOpacity>
          {uri !== '' && (
            <Image
              source={{uri}}
              style={{width: '100%', height: '100%', resizeMode: 'contain'}}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
export default Avatar;
