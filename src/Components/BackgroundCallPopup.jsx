// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Platform,
//   Vibration,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Modal,
// } from 'react-native';
// import { Card } from "react-native-paper";
// import book from '../images/book2.jpg';
// import {SvgXml} from 'react-native-svg';
// import {SVG_phone, SVG_hangout_white} from '../Utils/SVGImage';


// const BackgroundCallPopup = ({userInfo, onAccept, onReject, user}) => {
//     useEffect(() => {
//       return () => {
//         Vibration.cancel();
//       };
//     }, []);

//     const {callReceiver, userInfo, leave, processAccept} = useWebSocket();

  
//     return (
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.cardContent}>
//             <Image
//               source={userInfo?.avatar ? {uri: userInfo?.avatar} : book}
//               style={styles.avatar}
//             />
//             <View>
//               <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">{userInfo?.name}</Text>
//               <Text style={styles.cardDetail}>
//                 {user?.officerDetails?.ConsultationTypeID?.ConsultationTypeName}
//               </Text>
//               <Text style={styles.cardNote}>Note: None</Text>
//             </View>
//             <View style={styles.cardActions}>
//               <TouchableOpacity onPress={onAccept}>
//                 <SvgXml xml={SVG_phone} height="40px" width="40px" />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={onReject}>
//                 <SvgXml xml={SVG_hangout_white} height="40px" width="40px" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Card.Content>
//       </Card>
//     );
//   };

//   const styles = StyleSheet.create({
//     card: {
//         marginVertical: 8,
//         backgroundColor: '#fff',
//         borderColor: '#D9D9D9',
//         borderWidth: 2,
//         // paddingHorizontal: width * 0.04, // Dynamic padding
//       },
//       cardContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: width * 0.04,
//       },
//       avatar: {
//         width: width * 0.13, 
//         height: width * 0.13,
//         borderRadius: width * 0.065,
//       },
//       cardName: {
//         fontSize: width * 0.04,
//         paddingLeft:width * 0.01,
//         fontWeight: '500',
//         color: '#000',
//       },
//       cardDetail: {
//         fontSize: width * 0.035,
//         paddingLeft:width * 0.01,
//         fontWeight: '400',
//         color: '#000',
//       },
//       cardNote: {
//         fontSize: width * 0.035,
//         paddingLeft:width * 0.01,
//         fontWeight: '400',
//         color: '#000',
//       },
//       cardActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: width * 0.02,
//         paddingLeft: width * 0.04,
//       },
//   })

//   export default BackgroundCallPopup;

// BackgroundCallPopup.js
import React, { useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Vibration,
} from 'react-native';
import { Card } from "react-native-paper";
import book from '../images/book2.jpg';
import { SvgXml } from 'react-native-svg';
import { SVG_phone, SVG_hangout_white } from '../Utils/SVGImage';

const { width } = Dimensions.get('window');

const BackgroundCallPopup = ({ userInfo, onAccept, onReject, user }) => {
  useEffect(() => {
    // Vibrate when call comes in
    Vibration.vibrate([500, 500, 500], true);
    
    return () => {
      Vibration.cancel();
    };
  }, []);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Image
            source={userInfo?.avatar ? { uri: userInfo?.avatar } : book}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">
              {userInfo?.name || 'Unknown Caller'}
            </Text>
            <Text style={styles.cardDetail}>
              {user?.officerDetails?.ConsultationTypeID?.ConsultationTypeName || 'Incoming Call'}
            </Text>
            <Text style={styles.cardNote}>Note: None</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={onAccept} style={styles.actionButton}>
              <SvgXml xml={SVG_phone} height="40px" width="40px" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onReject} style={styles.actionButton}>
              <SvgXml xml={SVG_hangout_white} height="40px" width="40px" />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#D9D9D9',
    borderWidth: 2,
    width: width * 0.9,
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  cardName: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#000',
  },
  cardDetail: {
    fontSize: width * 0.035,
    fontWeight: '400',
    color: '#000',
  },
  cardNote: {
    fontSize: width * 0.035,
    fontWeight: '400',
    color: '#000',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
  },
  actionButton: {
    padding: 5,
  },
});

export default BackgroundCallPopup;