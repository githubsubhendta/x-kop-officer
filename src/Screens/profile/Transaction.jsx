import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SvgXml} from 'react-native-svg';
import {SVG_arrow_back} from '../../Utils/SVGImage';
import {TextInput} from 'react-native-paper';
import userStoreAction from '../../stores/user.store';
import BankAccountModal from '../../Components/account/BankAccountModal';
import useBankDetailsStore from '../../stores/bankDetails.store';
import useHttpRequest from '../../hooks/useHttpRequest';
import WithdrawModal from '../../Components/account/WithdrawModal';

const Transaction = ({navigation}) => {
  const [text, setText] = useState('');
  const User = userStoreAction(state => state.user);
  const [userData, setUserData] = useState(null);
  const [currentTab, setCurrentTab] = useState('Received');

  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const {bankDetails, handleUpdateBankDetails} = useBankDetailsStore();
  const {data, error, loading, fetchData} = useHttpRequest();

  // useEffect(() => {
  // setUserData({
  //   name: User.name != undefined ? User.name : '',
  // });
  // }, [User]);

  useEffect(() => {
    fetchData('/bank/getBankDetails');
  }, []);

  useEffect(() => {
    if (Object.keys(bankDetails).length) {
      setAccountDetails(bankDetails);
    }
  }, [bankDetails]);

  useEffect(() => {
    if (data?.success) {
      handleUpdateBankDetails({
        bankName: data.data.bankName,
        accountNumber: data.data.accountNumber,
        accountHolder: data.data.accountHolder,
        ifscCode: data.data.ifscCode,
      });
    }
  }, [data]);

  return (
    <View className="p-4">
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
        Transaction
      </Text>
      <View className={`flex flex-row bg-[#F3EADB]`}>
        <View className="transaction-left pt-10 pb-10 pl-5">
          <Text className="text-black font-normal text-[14px]">
            Total Earnings
          </Text>
          <View className="pb-4">
            <Text className="text-black text-3xl font-bold">
              Rs {User.wallet}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setWithdrawModalVisible(true)}
            className="bg-[#862A0D] rounded-[12px] w-32">
            <Text className="text-[12px] text-[#fff] p-4">Cashout Amount</Text>
          </TouchableOpacity>
        </View>
        <View className="w-[30%] absolute right-0 top-0 bottom-0">
          <Image
            source={require('../../images/Ellipse.png')}
            className="w-full object-cover h-[100%]"
          />
        </View>
      </View>
      <View className="flex items-center justify-between flex-row py-6">
        <Text className="text-[16px] font-medium text-black">
          Cashout Account Details
        </Text>

        <Text
          onPress={() => setModalVisible(true)}
          className="text-[16px] text-[#0044CC] font-medium underline">
          {accountDetails ? 'Edit' : 'Add'}
        </Text>
      </View>

      {accountDetails && (
        <View className="">
          <TextInput
            mode="outlined"
            label="Account"
            value={
              accountDetails?.bankName +
              '-' +
              accountDetails.accountNumber.slice(-4)
            }
            placeholder="Enter your name"
            disabled
          />
        </View>
      )}

      <View className="flex flex-row gap-2 justify-between">
        <TouchableOpacity
          onPress={() => setCurrentTab('Received')}
          className={`flex-1 text-center py-2 ${
            currentTab === 'Received'
              ? 'border-2 border-r-0 border-l-0 border-t-0'
              : ''
          }`}>
          <Text
            className={`text-[16px] text-center font-medium ${
              currentTab === 'Received' ? 'text-[#000]' : 'text-[#666666]'
            }`}>
            Received
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
          onPress={() => setCurrentTab('Failed')}
          className={`flex-1 text-center py-2 ${
            currentTab === 'Failed'
              ? 'border-2 border-r-0 border-l-0 border-t-0'
              : ''
          }`}>
          <Text
            className={`text-[16px] text-center font-medium ${
              currentTab === 'Failed' ? 'text-[#000]' : 'text-[#666666]'
            }`}>
            Failed
          </Text>
        </TouchableOpacity>
      </View>
      <BankAccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        accountDetails={accountDetails}
      />

      <WithdrawModal
        modalVisible={withdrawModalVisible}
        setModalVisible={() => setWithdrawModalVisible(false)}
      />
    </View>
  );
};

export default Transaction;
