import {View, Text, TouchableHighlight,StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {OtpInput} from 'react-native-otp-entry';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {verifyOTP} from '../Api/user.api.js';
import {getCurrentUser} from '../Api/user.api.js';
import userStoreAction from '../stores/user.store.js';
import Snackbar from 'react-native-snackbar';
const VerifyCodeScreen = ({navigation}) => {
  const [contiButton, setContiButton] = useState(false);
  const [otp, setOtp] = useState(null);
  const [mobile, setMobile] = useState('');
  const {addLoggedInUserAction} = userStoreAction(state => state);
  const [loading,setLoading] = useState(false);

  const handleInputChange = text => {
    if (text.length == 4) {
      setOtp(text);
      setContiButton(true);
    } else {
      setContiButton(false);
    }
  };

  useEffect(() => {
    (async () => {
      const mob_res = await AsyncStorage.getItem('loggedin-mobile');
      if(mob_res){
        setMobile(JSON.parse(mob_res).mobile);
      }
      
    })();
  }, []);

  const handleSubmitOTP = async () => {
    try {
      if(mobile !=""){
        setLoading(true)
        const result = await verifyOTP({mobile, otp});
        await AsyncStorage.removeItem('loggedin-mobile');
        const auth_data = {
          accessToken: result.data.data.accessToken,
          refreshToken: result.data.data.refreshToken,
        };
        await AsyncStorage.setItem('Authorized_data', JSON.stringify(auth_data));
        const result_user = await getCurrentUser(JSON.stringify(auth_data));
        addLoggedInUserAction({...result_user.data.data.user}, true,auth_data);
      } else{
        Snackbar.show({
          text: "You have enter wrong otp code.",
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      }
   
    } catch (error) {
      if(error?.responce?.data != undefined){
       return Snackbar.show({
          text: error.responce.data.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      }
      return Snackbar.show({
        text: "Invalid Token",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } finally{
      setLoading(false)
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
         <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View className=" flex justify-center items-center px-10">
        <Text className="text-[24px] text-black font-medium">
          Verify It s You!{' '}
        </Text>
        <Text className="text-slate-400 text-center text-[14px]">
          We have sent an unique{' '}
          <Text className="text-[#677294] font-bold">4 Digit OTP Code</Text>{' '}
          to your registered mobile number {mobile !== '' && mobile}
        </Text>

        <View className="flex justify-center items-center m-10">
          <OtpInput
            numberOfDigits={4}
            focusColor="#862A0D'"
            focusStickBlinkingDuration={500}
            onTextChange={handleInputChange}
            // onFilled={(text) => console.log(`OTP is ${text}`)}
            theme={{
              //   containerStyle: styles.container,
              //   inputsContainerStyle: styles.inputsContainer,
              //   pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: {color: '#862A0D'},
              //   focusStickStyle: styles.focusStick,
              //   focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
        </View>
      </View>
      <View className="w-[100%] px-10 mt-25">
        <TouchableHighlight
          onPress={() => handleSubmitOTP()}
          className="rounded-lg"
          disabled={!contiButton && !loading}>
          <View
            className={`flex justify-center items-center py-3 rounded-lg  
          ${contiButton ? 'bg-[#862A0D]' : 'bg-[#d7b3a8]'}`}>
            <Text className="text-white text-[16px] font-medium">Continue</Text>
          </View>
        </TouchableHighlight>
      </View>

    </SafeAreaView>
  );
};

export default VerifyCodeScreen;