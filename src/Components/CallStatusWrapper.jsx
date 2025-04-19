import React from 'react';
import { useCallStatus } from '../context/CallStatusContext';
import CallStatusPopup from './CallStatusPopup';
import { useRoute } from '@react-navigation/native';

const CallStatusWrapper = ({ children }) => {
  const { callStatus } = useCallStatus();
  const route = useRoute();

  // Don't show popup on call screens
  const hideOnScreens = ['AudioScreen', 'VideoCallScreen'];
  const shouldShowPopup = callStatus.isInCall && !hideOnScreens.includes(route.name);

  return (
    <>
      <CallStatusPopup
        isVisible={shouldShowPopup}
        callType={callStatus.callType}
      />
      {children}
    </>
  );
};

export default CallStatusWrapper;
