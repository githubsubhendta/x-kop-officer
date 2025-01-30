import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {logoutUser} from '../Api/user.api.js';
import userStoreAction from '../stores/user.store.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SVG_person,
  SVG_phone,
  SVG_edit,
  SVG_email,
  SVG_receipt,
  SVG_logout,
  SVG_go_next,
  SVG_file,
  SVG_lock,
  SVG_edit_doc,
} from '../Utils/SVGImage.js';

import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import Avatar from '../Components/Avatar.js';
import LogoutModal from '../Components/account/LogoutModal.jsx';

import notifee, {
  AndroidImportance,
  EventType,
  AndroidColor,
  AndroidCategory,
} from '@notifee/react-native';

// Get device dimensions
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const AccountScreen = ({navigation}) => {
  const {addLoggedInUserAction, addLocalTokens, user} = userStoreAction(
    state => state,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogoutUser = async () => {
    try {
      const Auth_data = await AsyncStorage.getItem('Authorized_data');
      const response = await logoutUser(Auth_data);
      if (response.data.success) {
        addLocalTokens(null);
        await AsyncStorage.removeItem('Authorized_data');
        addLoggedInUserAction({}, false);
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('error:', error.response.message);
    }
  };

  async function onDisplayNotification() {
    const channelId = await notifee.createChannel({
      id: 'call',
      name: 'Call Notifications',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: `Bhupendra is calling...`,
      body: 'Incoming voice call',
      android: {
        channelId,
        color: AndroidColor.GREEN,
        category: AndroidCategory.CALL,
        autoCancel: true,
        ongoing: true,
        actions: [
          {
            title: 'Decline',
            pressAction: {id: 'decline'},
          },
          {
            title: 'Answer',
            pressAction: {id: 'answer'},
          },
        ],
      },
    });
  }

  useEffect(() => {
    // Handle actions like "Answer" and "Decline"
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.ACTION_PRESS:
          if (detail.pressAction.id === 'answer') {
            console.log('Call Answered');
            // Handle answer logic (e.g., redirect to call screen)
          } else if (detail.pressAction.id === 'decline') {
            console.log('Call Declined');
            // Handle decline logic
          }
          break;
        case EventType.DISMISSED:
          console.log('Notification Dismissed');
          break;
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar url={user.avatar || ''} />
        </View>
        <Text
          // style={styles.headerText}
          className="text-[#862A0D] text-xl font-bold text-center">
          {user.name}
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.push('PersonDetails')}>
            <SvgXml xml={SVG_person} style={styles.icon} />
            <Text style={styles.menuText}>Personal Details</Text>
            <SvgXml xml={SVG_go_next} style={styles.iconNext} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.push('Transaction')}>
            <SvgXml xml={SVG_receipt} style={styles.icon} />
            <Text style={styles.menuText}>Transactions</Text>
            <SvgXml xml={SVG_go_next} style={styles.iconNext} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.push('RequestAbsence')}>
            <SvgXml xml={SVG_edit_doc} style={styles.icon} />
            <Text style={styles.menuText}>Request Absences</Text>
            <SvgXml xml={SVG_go_next} style={styles.iconNext} />
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuItem}
            // onPress={onDisplayNotification}
            >
            <SvgXml xml={SVG_file} style={styles.icon} />
            <Text style={styles.menuText}>ExKop Guidelines</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible(true)}>
            <SvgXml xml={SVG_logout} style={styles.icon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LogoutModal
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(!modalVisible)}
        onLogout={handleLogoutUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#F3EADB',
    height: screenHeight * 0.29,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  // headerText: {
  //   color: '#D2691E',
  //   fontSize: screenWidth * 0.06,
  //   fontWeight: 'bold',
  //   position: 'absolute',
  //   top: '20%',
  // },
  avatarContainer: {
    // position: 'absolute',
    bottom: -screenHeight * 0.02,
    alignSelf: 'center',
  },
  scrollView: {
    paddingHorizontal: screenWidth * 0.05,
  },
  menu: {
    paddingTop: screenHeight * 0.06,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
  },
  icon: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
  },
  menuText: {
    flex: 1,
    fontSize: screenWidth * 0.045,
    color: '#282D2A',
  },
  iconNext: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
  },
  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: screenHeight * 0.01,
  },
});

export default AccountScreen;
