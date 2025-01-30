import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  SVG_arrow_back,
  SVG_circle_check,
  SVG_edit_white,
  SVG_person,
} from '../../Utils/SVGImage.js';
import {SvgXml} from 'react-native-svg';
import {TextInput} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import userStoreAction from '../../stores/user.store.js';
import Avatar from '../../Components/Avatar.js';
import DocumentPicker from 'react-native-document-picker';
import {updateOfficerIdProof} from '../../Api/user.api.js';
import {useSnackbar} from '../../shared/SnackbarProvider.js';
import useHttpRequest from '../../hooks/useHttpRequest.jsx';

const PersonDetails = ({navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  let windowHeight = Dimensions.get('window').height;
  const {localTokens, user, handleUpdateUser} = userStoreAction();

  const [userData, setUserData] = useState({});
  const {showSnackbar} = useSnackbar();

  useEffect(() => {
    setUserData({
      name: user.name != undefined ? user.name : '',
      avatar: user.avatar != undefined ? user.avatar : null,
      mobile: user.mobile != undefined ? user.mobile : '',
      email: user.email != undefined ? user.email : '',
      emergency_contact:
        user.officerDetails.EmergencyContact != undefined
          ? user.officerDetails.EmergencyContact
          : '',
      officer_code:
        user.officerDetails.OfficerCode != undefined
          ? user.officerDetails.OfficerCode
          : '',
      Position:
        user.officerDetails.Position != undefined
          ? user.officerDetails.Position
          : '',
    });
  }, [user]);

  const {loading, error, data, fetchData} = useHttpRequest();

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
    try {
      const response = await updateOfficerIdProof(
        localTokens.accessToken,
        formData,
      );
      if (response?.data?.data.length) {
        handleUpdateUser(response.data.data[0]);
      }

      showSnackbar('Files uploaded successfully!', 'success');
    } catch (error) {
      console.log(error);
      showSnackbar('File upload failed!' + error.message, 'error');
    }
  };

  const updateOfficerProfile = async () => {
    await fetchData('/users/update-account', 'PATCH', {
      userData: {
        name: userData.name,
        mobile: userData.mobile,
        email: userData.email,
      },
      officerDetails: {
        OfficerCode: userData.officer_code,
        EmergencyContact: userData.emergency_contact,
        Position: userData.Position,
      },
    });
  };

  useEffect(() => {
    if (data?.success) {
      if (data.data.length > 0) {
        handleUpdateUser(data.data[0]);
      }
      showSnackbar('User uploaded successfully!', 'success');
    }
  }, [data]);

  useEffect(() => {
    if (error?.data?.message) {
      showSnackbar(error.data.message, 'error');
    }
  }, [error]);

  return (
    <>
      <ScrollView
        className={`w-[${windowWidth}px] h-[${windowHeight}px] bg-white`}>
        <View className="bg-white p-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="text-[#862A0D] -ml-[12px]">
            <SvgXml
              xml={SVG_arrow_back}
              width={'30px'}
              height={'30px'}
              color={'#862A0D'}
            />
          </TouchableOpacity>
          <Text className="text-[#862A0D] text-[22px] font-medium mt-2">
            Personal Details
          </Text>
        </View>
        <View className="flex flex-row m-auto bg-white">
          <Avatar url={user.avatar != undefined ? user.avatar : ''} />
        </View>

        <View>
          <View className="px-5">
            <TextInput
              mode="outlined"
              label="Name"
              value={userData.name}
              onChangeText={value => setUserData({...userData, name: value})}
              placeholder="Enter your name"
            />
          </View>
          <View className="px-5 mt-5">
            <TextInput
              number
              mode="outlined"
              label="Contact Number"
              value={userData.mobile}
              disabled
              placeholder="Enter your mobile"
              onChangeText={value => setUserData({...userData, mobile: value})}
              left={<TextInput.Affix text="+91" />}
              keyboardType="phone-pad"
            />
          </View>
          <View className="px-5 mt-5">
            <TextInput
              mode="outlined"
              label="Email ID"
              value={userData.email}
              onChangeText={value => setUserData({...userData, email: value})}
              placeholder="Enter your email"
            />
          </View>
          <View className="px-5 mt-5">
            <TextInput
              mode="outlined"
              label="Emergency Contact"
              value={userData.emergency_contact}
              onChangeText={value =>
                setUserData({...userData, emergency_contact: value})
              }
              placeholder="Enter your emergency contact"
              left={<TextInput.Affix text="+91" />}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View className="border border-slate-200 my-4" />

        <View className="px-3">
          <Text className="text-black text-[16px] font-medium mx-3">
            Official Details
          </Text>
          <View className="px-2 mt-5">
            <TextInput
              mode="outlined"
              label="Officer Code"
              value={userData.officer_code}
              onChangeText={value =>
                setUserData({...userData, officer_code: value})
              }
              placeholder="Enter your Officer Code"
            />
          </View>
          <View className="px-2 mt-5">
            <TextInput
              mode="outlined"
              label="Officer Position"
              value={userData.Position}
              onChangeText={value =>
                setUserData({...userData, Position: value})
              }
              placeholder="Enter your Officer Position"
            />
          </View>
          <View className="px-2 my-5">
            <TouchableOpacity
              onPress={selectFiles}
              className="border border-slate-500  relative py-3 px-3 bg-slate-50 rounded-md flex flex-row justify-between">
              <Text className="text-slate-800 absolute -top-2 left-3 bg-white px-1">
                ID Proof Document
              </Text>
              <View>
                <Text className="text-slate-800 text-[18px] font-bold">
                  Upload Proof Document
                </Text>
              </View>
              <View className="w-5 h-5">
                <SvgXml xml={SVG_circle_check} height={'100%'} width={'100%'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View className="bg-white bg-opacity-50">
        <TouchableOpacity
          onPress={updateOfficerProfile}
          className="bg-[#862A0D] py-3 mx-5 my-2 rounded-md">
          <Text className="text-white text-center text-[17px] font-medium">
            Update Account
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PersonDetails;
