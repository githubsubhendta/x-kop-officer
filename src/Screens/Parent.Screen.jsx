import React, {useEffect, useState, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from './Home.Screen';
import ScheduleScreen from './Schedule.Screen';
import AccountScreen from './Account.Screen';
import ChatScreen from './Chat.Screen';

import {
  SVG_Home,
  SVG_calender,
  SVG_person,
  SVG_chat,
} from './../Utils/SVGImage';
import {SvgXml} from 'react-native-svg';
import {View, BackHandler, Alert, TouchableOpacity, Text} from 'react-native';
import ContactScreen from './Contact.Screen';
import {useNetwork} from '../shared/NetworkProvider';

const Tab = createBottomTabNavigator();

const ParentScreen = ({navigation}) => {
  const [backPressed, setBackPressed] = useState(0);
  const webviewRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState('Home');

  // useEffect(() => {
  //   let update = true;
  //   const backAction = () => {
  //     if (update) {
  //       if (backPressed > 0) {
  //         Alert.alert(
  //           'Exit App',
  //           'Do you want to exit the app?',
  //           [
  //             {
  //               text: 'Cancel',
  //               onPress: () => null,
  //               style: 'cancel',
  //             },
  //             {
  //               text: 'Exit',
  //               onPress: () => {
  //                 BackHandler.exitApp();
  //                 setBackPressed(0);
  //                 navigation.reset({
  //                   index: 0,
  //                   routes: [{ name: "Parent" }],
  //                 });
  //               },
  //             },
  //           ],
  //           { cancelable: false }
  //         );
  //       } else {
  //         if (webviewRef.current) {
  //           webviewRef.current.goBack();
  //         }
  //         setBackPressed(backPressed + 1);
  //         // ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
  //         setTimeout(() => setBackPressed(0), 1000);
  //       }
  //     }
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   return () => {
  //     backHandler.remove();
  //     update = false;
  //   };
  // }, [backPressed]);

  useEffect(() => {
    const backAction = () => {
      const state = navigation.getState();
      const currentRoute = state.routes[state.index].name;

      if (currentRoute === 'Parent' && selectedTab !== 'Home') {
        navigation.navigate('Home');
        handleTabPress('Home');
      } else if (selectedTab === 'Home') {
        Alert.alert('Exit App', 'Do you want to exit the app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Exit',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation, selectedTab]);

  const handleTabPress = tabName => {
    setSelectedTab(tabName);
    // console.log("Selected Tab:", tabName);
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: 'red',
        headerShown: false,
        tabBarStyle: {
          height: 50,
          paddingHorizontal: 5,
          paddingTop: 0,
          position: 'absolute',
        },
      })}
      tabBar={props => (
        <TabBarWithBorder {...props} selectedTab={selectedTab} />
      )}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{
          tabPress: () => handleTabPress('Home'),
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <View>
              <SvgXml xml={SVG_Home} width={'100px'} height={'30px'} />
            </View>
          ),
          tabBarLabel: () => null,
          borderBottomWidth: selectedTab === 'Home' ? 8 : 0,
          borderBottomColor: 'red',
        }}
      />
      <Tab.Screen
        name="ContactScreen"
        component={ContactScreen}
        listeners={{
          tabPress: () => handleTabPress('ContactScreen'),
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <View>
              <SvgXml xml={SVG_chat} width={'100px'} height={'30px'} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        listeners={{
          tabPress: () => handleTabPress('Schedule'),
        }}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <View>
              <SvgXml xml={SVG_calender} width={'100px'} height={'30px'} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        listeners={{
          tabPress: () => handleTabPress('Account'),
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <View>
              <SvgXml xml={SVG_person} width={'100px'} height={'34px'} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const TabBarWithBorder = ({state, descriptors, navigation, selectedTab}) => {
  const {isConnected} = useNetwork();
  return (
    <>
      <View style={{flexDirection: 'row'}}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className="flex-1 items-center justify-center pt-2">
              <View className="flex flex-row justify-center items-center">
                <View>
                  {options.tabBarIcon({
                    color: isFocused ? 'red' : 'black',
                    size: 24,
                  })}
                  {route.name === selectedTab && (
                    <View className="bg-orange-900 rounded-tl-full rounded-tr-full px-5 h-2 text-center flex flex-row justify-center"></View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {!isConnected && (
        <Text className="py-2 text-white mt-1 text-center bg-red-700">
          No Internet Connection
        </Text>
      )}
    </>
  );
};

export default ParentScreen;
