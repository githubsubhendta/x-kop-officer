import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import {userSignup} from '../Api/user.api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState(null);

  const handleSignUpSubmit = async () => {
    if (name === '' && mobile) {
      return Snackbar.show({
        text: 'Name and Mobile are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
    if (mobile.length !== 10) {
      return Snackbar.show({
        text: 'Please Enter Valid Mobile No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
    try {
      const result = await userSignup({mobile, name,type:"officer"});
      if (result.data.data.isOTP) {
        const jsonValue = JSON.stringify({mobile: result.data.data.mobile});
        await AsyncStorage.setItem('loggedin-mobile', jsonValue);
        navigation.navigate('VerifyCodeScreen');
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data != undefined) {
        Snackbar.show({
          text: error.response?.data?.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      } else {
        console.log(error.response);
      }
    }
  };

  const handleLoginNav = () => {
    const isLoginScreenPresent = navigation
      .getState()
      .routes.some(route => route.name === 'LoginScreen');
    if (!isLoginScreenPresent) {
      navigation.push('LoginScreen');
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className="flex-1 justify-center items-center px-10 w-[100%]">
        <Text className="text-black text-[24px] font-bold">
          Welcome to ExKop
        </Text>
        <Text className="text-[#8B8C9F] text-[14px] font-regular">
          Consult expertises in the field and discover the correct ways to your
          problems. Empower today
        </Text>

        <View className="my-10 w-[100%]">
          <TextInput
            className="border-2 border-slate-400 rounded-md px-4 text-slate-900 placeholder-slate-400"
            placeholderTextColor={'#708090'}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />

          <View className="flex-row items-center my-4 rounded-[12px] border-2 border-[#677294]">
            <View className="px-3">
              <Text className="text-[12px] text-[#677294]">+91</Text>
            </View>
            <View className="flex-1">
              <TextInput
                className="py-3 pl-2 text-gray-900"
                onChangeText={setMobile}
                value={mobile}
                keyboardType="numeric"
                placeholder="Mobile Number"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableHighlight
            onPress={handleSignUpSubmit}
            className="rounded-lg">
            <View className="flex justify-center items-center bg-[#862A0D] py-4 rounded-[12px]">
              <Text className="text-white text-[18px] font-medium">Sign Up</Text>
            </View>
          </TouchableHighlight>
          <View className="flex justify-center items-center my-5">
            <Text className="text-[#862A0D] text-[14px] font-medium">
              Have an account?{' '}
              <Text
                onPress={handleLoginNav}
                style={{textDecorationLine: 'underline'}}>
                Log in
              </Text>
            </Text>
          </View>
          <View className="flex justify-center items-center mt-10 mb-4">
            <Text className="text-[#8B8C9F] text-[16px]">or</Text>
          </View>
          <TouchableHighlight
            onPress={() => navigation.push('VerifyCodeScreen')}
            className="rounded-[12px]">
           <View className="flex justify-center items-center border-2 py-3 rounded-[12px] border-[#862A0D] bg-white">
              <Text className="text-[#862A0D] text-[18px] font-medium">
                Have a Code
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
