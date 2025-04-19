import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { navigate } from '../navigation/NavigationService';

const { width } = Dimensions.get('window');

const CallStatusPopup = ({ isVisible, onPress, callType }) => {
  if (!isVisible) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigate(callType === 'video' ? 'VideoCallScreen' : 'AudioScreen');
        onPress && onPress();
      }}>
      <View style={styles.content}>
        <View style={styles.indicator} />
        <Text style={styles.text}>
          {callType === 'video' ? 'Video' : 'Audio'} call in progress. Tap to return
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  content: {
    backgroundColor: '#997654',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: width > 400 ? 16 : 14,
    flex: 1,
  },
});

export default CallStatusPopup;
