import { View, Text, TextInput, TouchableHighlight, StatusBar } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { userLogin } from "../Api/user.api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snackbar from "react-native-snackbar";

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState(null);
  const [otp, setOtp] = useState(null); // State to store the OTP

  const handleLoginSubmit = async () => {
    if (mobile == "") {
      return Snackbar.show({
        text: "Please Enter Mobile No.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }

    if (mobile != "" && mobile.length === 10) {
      try {
        const result = await userLogin({ mobile, role: "officer" });
        // console.log("Api Response",result.data.data?.otp)

        if (result.data.data.isOTP) {
          // Save OTP and Mobile
          setOtp(result.data.data?.otp); 
          const jsonValue = JSON.stringify({ mobile: result.data.data.mobile });
          await AsyncStorage.setItem("loggedin-mobile", jsonValue);

          Snackbar.show({
            text: `Your OTP is: ${result.data.data?.otp}`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "green",
          });

          navigation.navigate("VerifyCodeScreen");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          Snackbar.show({
            text: error.response.data.message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red",
          });
        } else {
          console.error(error);
        }
      }
    } else {
      Snackbar.show({
        text: "Please Enter Valid Mobile No.",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  const handleSignUpNav = () => {
    const isSignUpScreenPresent = navigation
      .getState()
      .routes.some((route) => route.name === "SignUpScreen");
    if (!isSignUpScreenPresent) {
      navigation.push("SignUpScreen");
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "SignUpScreen" }],
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className="flex-1 justify-center items-center px-4 w-[100%]">
        <Text className="text-black text-[24px] font-medium">
          Welcome to ExKop
        </Text>
        <Text className="text-[#8B8C9F] text-[14px] font-regular">
          Consult expertises in the field and discover the correct ways to your
          problems. Empower today
        </Text>

        <View className="my-10 w-[100%] px-10">
          <View className="flex-row items-center my-4 rounded-md border-2 border-gray-400">
            <View className="px-3">
              <Text className="text-sm text-gray-500">+91</Text>
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

          <TouchableHighlight onPress={handleLoginSubmit} className="rounded-lg">
            <View className="flex justify-center items-center bg-[#862A0D] py-4 rounded-[12px]">
              <Text className="text-white text-[18px] font-medium">Login</Text>
            </View>
          </TouchableHighlight>

          {otp && (
            <View className="mt-4">
              <Text className="text-green-600 text-[16px] font-medium">
                Your OTP is: {otp}
              </Text>
            </View>
          )}

          <View className="flex justify-center items-center my-5">
            <Text className="text-[#862A0D] text-[14px] font-medium">
              If you don't have an account,{" "}
              <Text
                onPress={handleSignUpNav}
                style={{ textDecorationLine: "underline" }}
              >
                sign up
              </Text>
            </Text>
          </View>
          <View className="flex justify-center items-center mt-10 mb-4">
            <Text className="text-[#8B8C9F] text-[16px]">or</Text>
          </View>
          <TouchableHighlight
            onPress={() => navigation.push("VerifyCodeScreen")}
            className="rounded-[12px]"
          >
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

export default LoginScreen;
