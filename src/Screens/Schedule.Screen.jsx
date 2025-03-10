// import React, { useEffect, useState } from 'react';
// import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { Agenda } from 'react-native-calendars';
// import { ScheduleAllDateWise, ConsultaionAllDatewise } from '../Api/ScheduleService';
// import useScheduleCallHistoryStore from '../stores/schedule.store';

// const ScheduleScreen = () => {
//   const [items, setItems] = useState({});
//   const { schedules, setSchedules, callHistory, setCallHistory } = useScheduleCallHistoryStore();
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

//   useEffect(() => {
//     getAllSchedules();
//   }, [selectedDate]);

//   async function getAllSchedules() {
//     try {
//       const getScheduleData = await ScheduleAllDateWise({ selectedDate });
//       const formattedItems = {};
//       getScheduleData.forEach(schedule => {
//         const startDateStr = new Date(schedule.startTime).toISOString().split('T')[0];

//         if (!formattedItems[startDateStr]) {
//           formattedItems[startDateStr] = [];
//         }

//         formattedItems[startDateStr].push({
//           name: `Meeting with ${schedule.customer.name}`,
//           startTime: schedule.startTime,
//           endTime: schedule.endTime,
//           status: schedule.status,
//           height: 75,
//           day: startDateStr,
//         });
//       });

//       setItems(formattedItems);
//     } catch (error) {
//       console.log("Error fetching schedules:", error);
//     }

//     try {
//       const consult_res = await ConsultaionAllDatewise({ selectedDate });
//       console.log("check consultent==", consult_res);
//     } catch (error) {
//       console.log("Error fetching consult:", error);
//     }
//   }

//   const renderItem = (reservation) => {
//     return (
//       <TouchableOpacity
//         testID="item"
//         style={[styles.item, { height: reservation.height }]}
//         onPress={() => Alert.alert(
//           reservation.name,
//           `Status: ${reservation.status}\nStart: ${new Date(reservation.startTime).toLocaleTimeString()}\nEnd: ${new Date(reservation.endTime).toLocaleTimeString()}`
//         )}
//       >
//         <Text style={{ fontSize: 16, color: 'black' }}>{reservation.name}</Text>
//         <Text style={{ fontSize: 14, color: '#43515c' }}>
//           {new Date(reservation.startTime).toLocaleTimeString()} - {new Date(reservation.endTime).toLocaleTimeString()}
//         </Text>
//         <Text style={{ fontSize: 12, color: '#888888' }}>Status: {reservation.status}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyDate = () => {
//     return (
//       <View style={styles.emptyDate}>
//         <Text>This is an empty date!</Text>
//       </View>
//     );
//   };

//   const rowHasChanged = (r1, r2) => {
//     return r1.name !== r2.name;
//   };

//   const currentMonth = new Date();
//   const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

//   return (
//     <Agenda
//       testID="agenda"
//       items={items}
//       loadItemsForMonth={getAllSchedules}
//       selected={selectedDate}
//       onDayPress={(day) => setSelectedDate(day.dateString)}  // Update selectedDate when a day is pressed
//       renderItem={renderItem}
//       renderEmptyDate={renderEmptyDate}
//       rowHasChanged={rowHasChanged}
//       // showClosingKnob={true}
//       // minDate={currentMonth.toISOString().split('T')[0]}
//       // maxDate={nextMonth.toISOString().split('T')[0]}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//   },
//   emptyDate: {
//     height: 15,
//     flex: 1,
//     paddingTop: 30,
//   },
//   customDay: {
//     margin: 10,
//     fontSize: 24,
//     color: 'green',
//   },
//   dayItem: {
//     marginLeft: 34,
//   },
// });

// export default ScheduleScreen;

// async function getAllSchedules() {
//   const formattedItems = { ...items };
//   try {
//     const scheduleData = await ScheduleAllDateWise({ selectedDate });

//   if(scheduleData.length>0){
//     formattedItems[selectedDate] = scheduleData.map(schedule => ({
//       name: `${schedule.customer.name}`,
//       data: schedule,
//       startTime: schedule.startTime,
//       endTime: schedule.endTime,
//       status: schedule.status,
//       height: 200,
//       type: 'Schedule',
//     }));
//   }
// } catch (error) {
//   console.log('Error fetching data:', error);
// }

// try {
//     const consultData = await ConsultaionAllDatewise({ selectedDate });
//     const newArr =
//       consultData.length > 0
//         ? consultData.map(consult => ({
//             name: `${consult.customer.name}`,
//             data: consult,
//             startTime: consult.startCallTime,
//             endTime: consult.endCallTime,
//             status: consult.status,
//             height: 200,
//             type: 'consultData',
//           }))
//         : [];

//     formattedItems[selectedDate] = [
//       ...newArr,
//       ...formattedItems[selectedDate],
//     ];
//   } catch (error) {
//     console.log('Error fetching data:', error);
//   }

//     setItems(formattedItems);

// }

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Divider,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {
  ScheduleAllDateWise,
  ConsultaionAllDatewise,
} from '../Api/ScheduleService';
import {SvgXml} from 'react-native-svg';
import {SVG_alarm_on, SVG_DUO, SVG_receipt_long} from '../Utils/SVGImage';
import {useWebSocket} from '../shared/WebSocketProvider';
import useUserStore from '../stores/user.store';

const ScheduleScreen = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const {webSocket} = useWebSocket();
  const {user} = useUserStore();

  useEffect(() => {
    getAllSchedules();
  }, [selectedDate]);

  async function getAllSchedules() {
    // setItems({});
    const formattedItems = {};
    try {
      const scheduleData = await ScheduleAllDateWise({selectedDate});
      if (scheduleData.length > 0) {
        formattedItems[selectedDate] = [
          ...(formattedItems[selectedDate] || []), // Initialize if undefined
          ...scheduleData.map(schedule => ({
            name: `${schedule.customer.name}`,
            data: schedule,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            status: schedule.status,
            height: 200,
            type: 'Schedule',
          })),
        ];
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }

    try {
      const consultData = await ConsultaionAllDatewise({selectedDate});
      const newArr =
        consultData.length > 0
          ? consultData.map(consult => ({
              name: `${consult.customer.name}`,
              data: consult,
              startTime: consult.startCallTime,
              endTime: consult.endCallTime,
              status: consult.status,
              height: 200,
              type: 'consultData',
            }))
          : [];

      formattedItems[selectedDate] = [
        ...(formattedItems[selectedDate] || []),
        ...newArr,
      ];
    } catch (error) {
      console.log('Error fetching data:', error);
    }

    setItems(formattedItems);
  }

  const handleViewMoreDetails = reservation => {
    setModalData(reservation);
    setShowModal(true);
  };

  const joinCall = async joinCallData => {
    // {
    //   id: officers222._id,
    //   name: officers222.name,
    //   mobile: officers222.mobile,
    //   avatar: officers222.avatar,
    // }
    const joinPayload = {
      to_user: joinCallData.data.customer.mobile,
      scheduleId: joinCallData.data._id,
      officer: joinCallData.data.officer,
      ConsultationTypeName:
        user.officerDetails.ConsultationTypeID.ConsultationTypeName,
    };

    //  console.log("joinCallData=======>",joinPayload);
    webSocket.emit('join_meeting', joinPayload);
  };

  const renderItem = reservation => {
    return (
      <View className="w-full px-4">
        <View className="border-t border-gray-300 my-3" />
        <View className="flex-row items-start mb-4">
          <View className="border-b border-gray-300 mb-2" />
          <Text className="text-xs md:text-sm text-gray-700 font-semibold mr-3">
            {new Date(reservation.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          {/* Reservation Card */}
          <View className="flex-1 bg-white rounded-lg p-4 shadow-lg border border-gray-100">
            <View className="flex flex-row justify-between items-center mb-2">
              <Text
                className="text-xs md:text-md font-semibold text-gray-800 truncate max-w-[50%]"
                numberOfLines={1}
                ellipsizeMode="tail">
                {reservation.name}
              </Text>

              {reservation.type === 'consultData' ? (
                <TouchableOpacity
                  onPress={() => handleViewMoreDetails(reservation.data)}
                  className="text-blue-700 text-sm font-semibold">
                  <Text className="text-blue-700 text-xs md:text-sm ">
                    View More Details
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {}}
                  className="bg-blue-500 rounded-md px-3 py-1 shadow-md">
                  <Text
                    className="text-white text-center text-xs md:text-sm font-semibold"
                    onPress={() => joinCall(reservation)}>
                    Join
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {reservation.type === 'consultData' ? (
              <View className="flex-row items-center mt-2">
                <View className="w-5 h-5 rounded-full mr-2 justify-center items-center border-blue-800 border">
                  <View className="w-3 h-3 bg-blue-700 rounded-full" />
                </View>
                <Text className="text-gray-600 text-xs md:text-sm">
                  Recording Ready
                </Text>
              </View>
            ) : (
              <View className="flex flex-row gap-2 flex-wrap">
                <View className="flex-row justify-center items-center gap-1">
                  <SvgXml xml={SVG_alarm_on} />
                  <Text className="text-black text-[10px] md:text-[12px]">
                    {new Date(reservation.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) +
                      '-' +
                      new Date(reservation.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </Text>
                </View>
                <View className="flex-row justify-center items-center gap-1">
                  <SvgXml xml={SVG_receipt_long} />
                  <Text className="text-black text-[10px] md:text-[12px]">
                    Paid
                  </Text>
                </View>
                <View className="flex-row justify-center items-center gap-1">
                  <SvgXml xml={SVG_DUO} />
                  <Text className="text-black text-[10px] md:text-[12px]">
                    Video Call
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <View className="border-t border-gray-300 my-5" />
        <Text className="text-xs md:text-sm text-gray-700 font-semibold mt-3">
          {new Date(reservation.endTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View className="h-15 flex-1 pt-8 items-center">
        <Text className="text-gray-600">This is an empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  return (
    <>
      <Agenda
        items={items}
        loadItemsForMonth={getAllSchedules}
        selected={selectedDate}
        onDayPress={day => setSelectedDate(day.dateString)}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
      />
      {modalData && (
        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
          transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
            <View className="bg-white p-6 rounded-lg w-4/5 max-h-4/5">
              <View className="flex-row items-center justify-between mb-5 px-4">
                {/* Customer Avatar */}
                <Image
                  source={{uri: modalData.customer.avatar}}
                  className="w-12 h-12 rounded-full"
                />

                {/* Customer Name */}
                <Text className="text-base font-bold text-gray-900 flex-1 text-center">
                  {modalData.customer.name}
                </Text>

                {/* Officer Avatar */}
                <Image
                  source={{uri: modalData.officer.avatar}}
                  className="w-12 h-12 rounded-full"
                />
              </View>

              <View className="mb-2">
                <Text className="text-sm text-gray-500">Call Duration</Text>
                <Text className="text-md text-gray-800 font-semibold">
                  {new Date(modalData.startCallTime).toLocaleString()} {''} To{' '}
                  {''}
                  {''}
                  {new Date(modalData.endCallTime).toLocaleString()}
                </Text>
              </View>
              <View className="mb-5">
                <Text className="text-sm text-gray-500">Call Status</Text>
                <Text className="text-md font-semibold text-gray-800">
                  {modalData.status}
                </Text>
                <Text className="text-sm text-gray-500">Total Call Price</Text>
                <Text className="text-md font-semibold text-gray-800">
                  Rs.{modalData.payOfficer}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="bg-[#862A0D] py-2 rounded-md flex items-center">
                <Text className="text-white text-lg">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default ScheduleScreen;
