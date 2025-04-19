import { View, Text, TouchableHighlight } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/AntDesign";

const EndCallScreen = ({route,navigation }) => {
    const { chatId,userInfo } = route.params || {};

    return (
        <View className="flex-1 flex justify-center items-center h-[100vh] relative px-4">
            <View className="border-2 border-yellow-600	rounded-full relative">
                <View className="w-4 h-4 rounded-full bg-gray-400 absolute top-0 right-0"></View>
                <View className="w-[100px] h-[100px] rounded-full bg-yellow-600 p-7 m-5 shadow-lg shadow-gray-500/50">
                    <Icon name="check" color="#fff" size={40} />
                </View>
                <View className="w-4 h-4 rounded-full bg-yellow-600 absolute bottom-0"></View>
            </View>
            <Text className="text-red-800 bold text-xl pt-8">Call ended</Text>
            <Text className="text-sm text-black text-center pt-5">Please wait white we re-direct you Pro Tip : Add notes and summaries sessions</Text>
            <View className="absolute bottom-0 left-0 right-0 p-6 w-100 bg-white ">
                <TouchableHighlight className="rounded-lg" onPress={() => navigation.push("UsersummeryScreen",{chatId,userInfo})}>
                    <View className="flex justify-center items-center bg-white border-2 border-red-800 py-4 rounded-lg">
                        <Text className="text-red-800 text-[18px] font-bold">Add Notes</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    )

}
export default EndCallScreen