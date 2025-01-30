import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Vibration,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import userStoreAction from '../stores/user.store';
import Arrow from 'react-native-vector-icons/Entypo';
import {Card} from 'react-native-paper';
import book from '../images/book2.jpg';
import {SvgXml} from 'react-native-svg';
import {SVG_phone, SVG_hangout_white} from '../Utils/SVGImage';
import requestCameraAndAudioPermission from '../Components/permissions';
import {useWebSocket} from './../shared/WebSocketProvider.jsx';
import {getScheduleAll} from '../Api/ScheduleService.js';
import AppointmnetListModel from '../Components/AppointmnetListModel.jsx';

const HomeScreen = ({navigation}) => {
  const {callReceiver, userInfo, leave, processAccept} = useWebSocket();
  const User = userStoreAction(state => state);
  const currentHour = new Date().getHours();
  const VibInterval = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState({status: false, data: null});
  const [modalData, setModalData] = useState(null);
  const [showListModal, setShowListModal] = useState(false);

  const [schedulesList, setSchedulesList] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const dataGet = await getScheduleAll(3);
      setLoading(false);
      setSchedules(dataGet);
    })();
  }, [getScheduleAll]);

  const greetingMessage =
    currentHour >= 5 && currentHour < 12
      ? 'Good Morning'
      : currentHour >= 12 && currentHour < 18
      ? 'Good Afternoon'
      : currentHour >= 18 && currentHour < 22
      ? 'Good Evening'
      : 'Good Night';

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('Permissions requested!');
      });
    }
  }, []);

  useEffect(() => {
    if (callReceiver) {
      startVibration();
    } else {
      stopVibration();
    }
  }, [callReceiver]);

  const startVibration = () => {
    Vibration.vibrate(ONE_SECOND_IN_MS);
    VibInterval.current = setInterval(() => {
      Vibration.vibrate(ONE_SECOND_IN_MS);
    }, 3000);
  };

  const stopVibration = () => {
    Vibration.cancel();
    if (VibInterval.current) {
      clearInterval(VibInterval.current);
    }
  };

  const handleViewDetails = selectedScheduleData => {
    setShowModal({status: true, data: selectedScheduleData});
  };

  const showDetails = item => {
    setShowModal({status: true, data: {schedule: item}});
  };

  const ONE_SECOND_IN_MS = 1000;
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{greetingMessage},</Text>
            <View className="w-52">
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail">
                Mr. {User?.user?.name}
              </Text>
            </View>
          </View>
          <View style={styles.onlineStatus}>
            <Text style={{color: '#000'}}>Online</Text>
            <Arrow name="chevron-small-down" color="#588620" size={20} />
          </View>
        </View>
        <View style={styles.incomingCalls}>
          <Text style={styles.sectionTitle}>Incoming Calls</Text>
          {callReceiver && (
            <CallCard
              userInfo={userInfo.current}
              onAccept={processAccept}
              onReject={() => leave('call_reject')}
              user={User.user}
            />
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <Text style={styles.viewAll} onPress={() => setShowListModal(true)}>
            View All
          </Text>
        </View>

        {!loading ? (
          <>
            {schedules?.length > 0 &&
              schedules?.map((schedule, index) => (
                <View key={'schedule_' + index}>
                  <AppointmentCard
                    name="Karan Mehra"
                    date="Dec 15th, 2023 | 09:15 am"
                    schedule={schedule}
                    handleViewDetails={handleViewDetails}
                  />
                </View>
              ))}
          </>
        ) : (
          <View className="flex-row justify-center items-center">
            <ActivityIndicator />
          </View>
        )}

        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insights}></View>
      </ScrollView>
      {showListModal && (
        <AppointmnetListModel
          showListModal={showListModal}
          setShowListModal={setShowListModal}
          schedulesList={schedulesList}
          setSchedulesList={data => setSchedulesList(data)}
          showDetails={showDetails}
        />
      )}

      {showModal.status && (
        <Modal
          visible={showModal.status}
          animationType="slide"
          onRequestClose={() => setShowModal({status: false, data: null})}
          transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
            {/* {console.log('Check data all modal', showModal.data?.schedule)} */}
            <View className="bg-white p-6 rounded-lg w-4/5 max-h-4/5">
              <View className="flex-row mb-5 items-center">
                {/* Customer Avatar */}
                <Image
                  source={{
                    uri: showModal.data?.schedule?.customer?.avatar || '',
                  }}
                  className="w-10 h-10 rounded-full mr-3"
                  resizeMode="cover"
                />
                {/* Customer Name */}
                <Text className="text-lg font-bold text-gray-800 flex-1">
                  {showModal.data?.schedule?.customer?.name || 'N/A'}
                </Text>
                {/* Officer Avatar */}
                <Image
                  source={{
                    uri: showModal.data?.schedule?.officer?.avatar || '',
                  }}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
              </View>

              {/* Call Duration */}
              <View className="mb-2 w-[100%]">
                <Text className="text-sm text-gray-500">Call Duration</Text>
                <Text className="text-md font-semibold text-gray-800">
                  {showModal.data?.schedule?.startTime
                    ? new Date(showModal.data.schedule.startTime)
                        .toLocaleString()
                        .replace(/:00\b/, '')
                    : 'N/A'}{' '}
                  To {}
                  {showModal.data?.schedule?.endTime
                    ? new Date(showModal.data.schedule.endTime)
                        .toLocaleString()
                        .replace(/:00\b/, '')
                    : 'N/A'}
                </Text>
              </View>

              {/* Call Status and Total Price */}
              <View className="mb-5">
                <Text className="text-sm text-gray-500">Call Status</Text>
                <Text className="text-md font-semibold text-gray-800">
                  {showModal.data?.schedule?.status || 'N/A'}
                </Text>
                <Text className="text-sm text-gray-500">Total Call Price</Text>
                <Text className="text-md font-semibold text-gray-800">
                  Rs. {showModal.data?.schedule?.totalCallPrice || 'N/A'}
                </Text>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setShowModal({status: false, data: null})}
                className="bg-[#862A0D] py-2 rounded-md flex items-center">
                <Text className="text-white text-[16px]">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const CallCard = ({userInfo, onAccept, onReject, user}) => {
  useEffect(() => {
    return () => {
      Vibration.cancel();
    };
  }, []);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Image
            source={userInfo?.avatar ? {uri: userInfo?.avatar} : book}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.cardName}>{userInfo?.name}</Text>
            <Text style={styles.cardDetail}>
              {user?.officerDetails?.ConsultationTypeID?.ConsultationTypeName}
            </Text>
            <Text style={styles.cardNote}>Note: None</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={onAccept}>
              <SvgXml xml={SVG_phone} height="40px" width="40px" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onReject}>
              <SvgXml xml={SVG_hangout_white} height="40px" width="40px" />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const AppointmentCard = ({name, date, schedule, handleViewDetails}) => (
  <Card style={styles.card}>
    <Card.Content>
      <View style={styles.cardContent}>
        <Image source={{uri: schedule.customer.avatar}} style={styles.avatar} />
        <View>
          <Text style={styles.cardName}>{schedule.customer.name}</Text>
          <Text style={styles.cardDate}>{formatDate(schedule.startTime)}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => {}} style={styles.rescheduleButton}>
          <Text style={styles.rescheduleText}>Re-Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleViewDetails({name, date, schedule})}
          style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Card.Content>
  </Card>
);

function formatDate(dateString) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(dateString);

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const suffix = day => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';

  return `${month} ${day}${suffix(day)}, ${year} | ${hours}:${minutes} ${ampm}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greetingContainer: {},
  greeting: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  userName: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
  onlineStatus: {
    backgroundColor: '#EAFFD0',
    color: '#72A335',
    padding: 8,
    borderRadius: 8,
    borderColor: '#72A335',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomingCalls: {
    backgroundColor: '#F3EADB',
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  viewAll: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0044CC',
    textDecorationLine: 'underline',
  },
  card: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderColor: '#D9D9D9',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  cardDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  cardNote: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#D9D9D9',
    borderTopWidth: 2,
    marginTop: 12,
    paddingTop: 8,
  },
  rescheduleButton: {
    padding: 8,
  },
  rescheduleText: {
    fontSize: 14,
    color: '#997654',
  },
  viewDetailsButton: {
    backgroundColor: '#862A0D',
    padding: 6,
    borderRadius: 20,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 12,
  },
  insights: {
    backgroundColor: '#F3EADB',
    padding: 70,
    marginHorizontal: 5,
  },
  cardDate: {
    color: '#606366',
  },
});

export default HomeScreen;
