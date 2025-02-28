// import { useEffect, useRef } from 'react';
// import { Platform } from 'react-native';
// import Sound from 'react-native-sound';

// const useRingtone = (isVisible, ringtoneFile = 'ringtone1.mp3') => {
//   const ringtoneRef = useRef(null);

//   useEffect(() => {
//     if (isVisible) {
//       let soundPath = Platform.OS === 'android' ? 'ringtone' : ringtoneFile;

//       ringtoneRef.current = new Sound(soundPath, Sound.MAIN_BUNDLE, (error) => {
//         if (error) {
//           console.log('Failed to load the sound', error);
//           return;
//         }
//         ringtoneRef.current.setVolume(1);
//         ringtoneRef.current.setNumberOfLoops(-1); // Loop indefinitely
//         ringtoneRef.current.play();
//       });
//     } else {
//       stopRingtone();
//     }

//     return () => {
//       stopRingtone();
//     };
//   }, [isVisible]);

//   const stopRingtone = () => {
//     if (ringtoneRef.current) {
//       ringtoneRef.current.stop();
//       ringtoneRef.current.release();
//       ringtoneRef.current = null;
//     }
//   };

//   return { stopRingtone };
// };

// export default useRingtone;
