import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getScheduleAll} from '../Api/ScheduleService';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

const AppointmnetListModel = ({
  showListModal,
  setShowListModal,
  schedulesList,
  setSchedulesList,
  showDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        // Fetch schedules if schedulesList is empty
        if (!schedulesList || schedulesList.length === 0) {
          const data = await getScheduleAll('all');
          //   let arrData = [];
          // //   for (let i = 0; i < 10; i++) {
          // //     arrData = [...arrData, ...data];
          // //   }
          setSchedulesList(data);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch schedules when the modal is opened
    if (showListModal) {
      fetchSchedules();
    }
  }, []);

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

    return `${month} ${day}${suffix(
      day,
    )}, ${year} | ${hours}:${minutes} ${ampm}`;
  }

  const renderSchedule = ({item}) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardContent}>
          <Image source={{uri: item.customer.avatar}} style={styles.avatar} />
          <View>
            <Text style={styles.cardName}>{item.customer.name}</Text>
            <Text style={styles.cardDate}>{formatDate(item.startTime)}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <TouchableOpacity onPress={() => {}} style={styles.rescheduleButton}>
            <Text style={styles.rescheduleText}>Re-Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showDetails(item);
            }}
            style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching new data
  const onRefresh = async () => {
    setRefreshing(true);
    const data = await getScheduleAll('all');
    setSchedulesList(data);
    setRefreshing(false);
  };

  return (
    <Modal visible={showListModal} transparent={true} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 14,
            borderRadius: 8,
            width: '100%',
            height: '100%',
          }}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setShowListModal(false)}
            style={{
              alignSelf: 'flex-end',
              //   backgroundColor: '#DC2626',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9999,
              marginBottom: 10,
            }}>
            <Icon name="close" color="#DC2626" size={25} />
          </TouchableOpacity>

          {/* Schedule List */}
          {schedulesList?.length > 0 ? (
            <FlatList
              data={schedulesList}
              renderItem={renderSchedule}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#4B5563',
                  // display: 'flex',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}>
                {loading ? 'Loading schedules...' : 'No schedules found'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    padding: 40,
    marginHorizontal: 16,
  },
  cardDate: {
    color: '#606366',
  },
});

export default AppointmnetListModel;
