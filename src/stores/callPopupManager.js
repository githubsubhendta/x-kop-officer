// callPopupManager.js
import React from 'react';
import { View, Modal, StyleSheet, Dimensions } from 'react-native';
import BackgroundCallPopup from '../Components/BackgroundCallPopup.jsx';

const { width } = Dimensions.get('window');

let currentPopup = null;
let updateFunction = null;

export const showCallPopup = (callData, onAccept, onReject) => {
  if (currentPopup) {
    currentPopup.close();
  }
  
  const timeout = setTimeout(() => {
    closeCallPopup();
    onReject?.();
  }, 30000); // 30 seconds timeout

  currentPopup = {
    close: () => {
      clearTimeout(timeout);
      updateFunction?.();
    },
    data: callData,
    onAccept: () => {
      clearTimeout(timeout);
      onAccept();
      closeCallPopup();
    },
    onReject: () => {
      clearTimeout(timeout);
      onReject();
      closeCallPopup();
    }
  };
  
  updateFunction?.();
};

export const closeCallPopup = () => {
  if (currentPopup) {
    currentPopup.close();
    currentPopup = null;
    updateFunction?.();
  }
};

export const CallPopupContainer = () => {
  const [visible, setVisible] = React.useState(false);
  const [popupData, setPopupData] = React.useState(null);

  React.useEffect(() => {
    updateFunction = () => {
      setVisible(!!currentPopup);
      setPopupData(currentPopup ? currentPopup.data : null);
    };
    return () => {
      updateFunction = null;
    };
  }, []);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={closeCallPopup}
    >
      <View style={styles.modalContainer}>
        {popupData && (
          <BackgroundCallPopup
            userInfo={popupData.userInfo}
            user={popupData.user}
            onAccept={() => currentPopup?.onAccept()}
            onReject={() => currentPopup?.onReject()}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});