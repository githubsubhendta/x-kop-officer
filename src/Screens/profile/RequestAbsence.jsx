import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {SvgXml} from 'react-native-svg';
import {SVG_arrow_back} from '../../Utils/SVGImage';
import MyBottomSheet from '../../Components/MyBottomSheet';
import useHttpRequest from '../../hooks/useHttpRequest';

const RequestAbsence = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState('Approved');
  const {data, fetchData} = useHttpRequest();

  const [approvedData, setApprovedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData('/officer-available/absences', 'GET'); // Refetch data on refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchData('/officer-available/absences', 'GET');
  }, []);

  useEffect(() => {
    if (data) {
      setApprovedData(data.data.filter(item => item.status === 'Approved'));
      setPendingData(data.data.filter(item => item.status === 'Pending'));
      setRejectedData(data.data.filter(item => item.status === 'Rejected'));
    }
  }, [data]);

  const formatDate = date => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <View className="p-6 h-full w-full">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="text-[#862A0D]">
          <SvgXml
            xml={SVG_arrow_back}
            width={'30px'}
            height={'30px'}
            color={'#862A0D'}
          />
        </TouchableOpacity>
        <Text className="text-[#862A0D] text-[24px] font-medium pt-5 pb-4">
          Request Absence
        </Text>
        {/* Tab Buttons */}
        <View className="flex flex-row gap-2 justify-between">
          <TouchableOpacity
            onPress={() => setCurrentTab('Approved')}
            className={`flex-1 text-center py-2 ${
              currentTab === 'Approved'
                ? 'border-2 border-r-0 border-l-0 border-t-0'
                : ''
            }`}>
            <Text
              className={`text-[16px] text-center font-medium ${
                currentTab === 'Approved' ? 'text-[#000]' : 'text-[#666666]'
              }`}>
              Approved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentTab('Pending')}
            className={`flex-1 text-center py-2 ${
              currentTab === 'Pending'
                ? 'border-2 border-r-0 border-l-0 border-t-0'
                : ''
            }`}>
            <Text
              className={`text-[16px] text-center font-medium ${
                currentTab === 'Pending' ? 'text-[#000]' : 'text-[#666666]'
              }`}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentTab('Rejected')}
            className={`flex-1 text-center py-2 ${
              currentTab === 'Rejected'
                ? 'border-2 border-r-0 border-l-0 border-t-0'
                : ''
            }`}>
            <Text
              className={`text-[16px] text-center font-medium ${
                currentTab === 'Rejected' ? 'text-[#000]' : 'text-[#666666]'
              }`}>
              Rejected
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView
          className="min-h-screen"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="min-h-screen">
            {/* Approved Tab */}
            {currentTab === 'Approved' &&
              (approvedData.length > 0 ? (
                approvedData.map((item, index) => (
                  <View
                    key={index}
                    className="p-4 bg-[#F0F0F0] my-2 rounded-md">
                    <Text className="text-[#666666] text-[16px]">
                      Reason: {item.reason}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      From: {formatDate(item.fromDate)}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      Until: {formatDate(item.untilDate)}
                    </Text>
                    <Text className="text-[#4CAF50] text-[16px]">
                      Status: {item.status}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-[#666666] text-[16px] text-center mt-4">
                  No Approved Absences
                </Text>
              ))}

            {/* Pending Tab */}
            {currentTab === 'Pending' &&
              (pendingData.length > 0 ? (
                pendingData.map((item, index) => (
                  <View
                    key={index}
                    className="p-4 bg-[#F0F0F0] my-2 rounded-md">
                    <Text className="text-[#666666] text-[16px]">
                      Reason: {item.reason}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      From: {formatDate(item.fromDate)}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      Until: {formatDate(item.untilDate)}
                    </Text>
                    <Text className="text-[#FFC107] text-[16px]">
                      Status: {item.status}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-[#666666] text-[16px] text-center mt-4">
                  No Pending Absences
                </Text>
              ))}

            {/* Rejected Tab */}
            {currentTab === 'Rejected' &&
              (rejectedData.length > 0 ? (
                rejectedData.map((item, index) => (
                  <View
                    key={index}
                    className="p-4 bg-[#F0F0F0] my-2 rounded-md">
                    <Text className="text-[#666666] text-[16px]">
                      Reason: {item.reason}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      From: {formatDate(item.fromDate)}
                    </Text>
                    <Text className="text-[#666666] text-[16px]">
                      Until: {formatDate(item.untilDate)}
                    </Text>
                    <Text className="text-[#F44336] text-[16px]">
                      Status: {item.status}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-[#666666] text-[16px] text-center mt-4">
                  No Rejected Absences
                </Text>
              ))}
          </View>
        </ScrollView>

        <View className="absolute  left-0 right-0 p-6 w-100 -bottom-[10px] bg-[#F0F0F0] bg-opacity-50">
          <TouchableHighlight
            className="rounded-[60px]"
            onPress={() => setVisible(true)}>
            <View className="flex justify-center items-center bg-[#862A0D] border-none py-3 rounded-md">
              <Text className="text-[#fff] text-[17px] font-bold">
                Request Absences
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
      {visible && <MyBottomSheet setVisible={state => setVisible(state)} />}
    </>
  );
};

export default RequestAbsence;
