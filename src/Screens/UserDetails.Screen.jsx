import { View, Text, Image, DatePickerIOS, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Entypo";
import userImg from "../images/man-img.jpg";
import Icon1 from "react-native-vector-icons/Foundation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Icon3 from "react-native-vector-icons/FontAwesome";
import { Button, Menu, Divider, PaperProvider, RadioButton, Searchbar } from 'react-native-paper';
import Icon4 from 'react-native-vector-icons/Ionicons';
const UserdetailsScreen = ({ navigation }) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const [documentType, setDocumentType] = useState("first");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [text, setText] = React.useState('');

    const handleSend = () => {
        console.log('Sending:', text);
    };

    const handleAttachFile = () => {
        console.log('Attaching file...');
    };
    return (
        <View className="relative flex-1 h-full">
            <View className="pl-6 pr-6 flex flex-wrap flex-row  w-full items-center">
                <Icon name="arrowleft" color="#000" size={20} onPress={() => navigation.push("ChatendScreen")} className="w-1/12" />
                <View className="text-left flex flex-row gap-4 justify-center items-center  w-10/12">
                    <Image source={userImg} className="w-10 h-10 rounded-full w--1/2" />
                    <View className="flex w-1/2">
                        <Text className="text-black font-medium	pt-5 text-[14px]">Abirav Sharma</Text>
                        <Text className="text-black pb-4">General offences </Text>
                    </View>
                </View>
                <Icon2 name="dots-three-vertical" color="#000" size={20} className="text-right w-1/12" onPress={() => setOpenMenu(true)} />
            </View>
            <View className="p-6 bg-yellow-500 ml-6 mr-6 mt-6 rounded-md">
                <Text className="text-black font-bold text-[18px]">Summary</Text>
                <Text className="text-black">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation</Text>
            </View>
            <View className="flex flex-wrap justify-between flex-row p-6 bg-blue-400 rounded-md	mt-4 ml-6 mr-6">
                <Text className="text-black text-[16px]">View Previous Recording</Text>
                <Icon1 name="play-video" color="#000" size={30} onPress={() => navigation.push("ChatendScreen")} className="w-1/12" />
            </View>
            <Text className="text-black p-6" onPress={() => setOpenDate(!openDate)}>{moment(chosenDate).format('DD/MM/YYYY')}</Text>
            <View>
                {/* <DateTimePicker date={chosenDate}  /> */}
                {/* {openDate && 
                 <DateTimePicker
                  mode="date"
                  value={chosenDate.date}
                  onDateChange={(e,date)=>setChosenDate({date})}
                   />
             }  */}

                <DateTimePickerModal
                    isVisible={openDate}
                    mode="date"
                    date={chosenDate}
                    onConfirm={(date) => {
                        setOpenDate(false);
                        setChosenDate(date);

                    }}
                    onCancel={() => {
                        setOpenDate(false);
                    }}
                />
            </View>
            <View className="checklistWrappper text-right bg-gray-300 p-6 ml-6 mr-6 min-w-fit w-fit">
                <RadioButton.Group onValueChange={newValue => setDocumentType(newValue)} value={documentType}>
                    <View className="">
                        <Text className="text-black text-base font-medium"><Icon3 name="file-pdf-o" color="#000" size={20} />  2 Attachment</Text>
                    </View>
                </RadioButton.Group>
            </View>
            <View className="absolute bottom-0 flex flex-row m-6 border-2 border-gray-300 rounded-lg justify-center bg-white w-max left-0 right-0">
                <TextInput
                    className="flex-1 items-center p-4 text-black"
                    placeholder="Type here..."
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity onPress={handleAttachFile} className="py-5 pr-3">
                    <Icon4 name="attach-outline" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSend} className="py-5 pr-2">
                    <Icon4 name="send-outline" size={25} color="black" />
                </TouchableOpacity>
            </View>
        </View>

    )
}


export default UserdetailsScreen