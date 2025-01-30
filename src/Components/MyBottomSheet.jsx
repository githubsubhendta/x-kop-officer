import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {RadioButton, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SvgXml} from 'react-native-svg';
import {SVG_calender} from '../Utils/SVGImage';
import useHttpRequest from '../hooks/useHttpRequest';
import {useSnackbar} from '../shared/SnackbarProvider';
import Icon from 'react-native-vector-icons/AntDesign';

const MyBottomSheet = memo(({setVisible}) => {
  const slide = useRef(new Animated.Value(300)).current;
  const [checked, setChecked] = useState(false);
  const {showSnackbar} = useSnackbar();

  const [fromDate, setFromDate] = useState(null);
  const [atDate, setAtDate] = useState(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showAtDatePicker, setShowAtDatePicker] = useState(false);
  const [reason, setReason] = useState('');

  const {loading, error, data, fetchData} = useHttpRequest();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const SlideUp = () => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const SlideDown = () => {
    Animated.timing(slide, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    SlideUp();
  }, []);

  useEffect(() => {
    if (data) {
      showSnackbar('Request Absence Successfully Submitted', 'success');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      showSnackbar(error.data.message, 'error');
    }
  }, [error]);

  const closeModal = () => {
    SlideDown();
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(Platform.OS === 'ios');
    setFromDate(currentDate);
  };

  const onChangeAtDate = (event, selectedDate) => {
    const currentDate = selectedDate || atDate;
    setShowAtDatePicker(Platform.OS === 'ios');
    setAtDate(currentDate);
  };

  const showDatePicker = type => {
    if (type === 'from') {
      setShowFromDatePicker(true);
    } else if (type === 'at') {
      setShowAtDatePicker(true);
    }
  };

  const handleSubmitRequest = async () => {
    if (checked) {
      if (!reason) {
        return Alert.alert('Warning', 'Please mention a reason for absence.');
      }
      const curr_date = new Date();
      fetchData('/officer-available/absences', 'POST', {
        reason,
        fromDate: curr_date,
        untilDate: curr_date,
      });
    } else {
      if (!fromDate || !atDate) {
        return Alert.alert(
          'Please Select Dates',
          "Both the 'From' and 'Until' dates need to be selected.",
        );
      }
      if (fromDate > atDate) {
        return Alert.alert(
          'Invalid Date Selection',
          "'From Date' cannot be later than 'Until Date'. Please select valid dates.",
        );
      }

      fetchData('/officer-available/absences', 'POST', {
        reason,
        fromDate,
        untilDate: atDate,
      });
    }
  };

  return (
    <View style={styles.backdrop}>
      <Animated.View
        style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Request Absence</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Icon name="close" color="#DC2626" size={25} />
          </TouchableOpacity>
        </View>
        <ScrollView className="scrollbar-hidden">
          <View style={styles.radioButtonContainer}>
            <RadioButton
              value="first"
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
            />
            <Text style={styles.radioButtonText}>A day-off</Text>
          </View>
          {!checked && (
            <View style={styles.orContainer}>
              <Text style={styles.orText}>OR</Text>
            </View>
          )}
          <View style={styles.inputContainer}>
            {!checked && (
              <>
                <View style={styles.dateInput}>
                  <TextInput
                    label="From"
                    mode="outlined"
                    value={
                      fromDate ? fromDate.toLocaleDateString() : 'DD/MM/YY'
                    }
                    onFocus={() => showDatePicker('from')}
                    right={
                      <TextInput.Icon
                        icon={() => (
                          <SvgXml xml={SVG_calender} height={24} width={24} />
                        )}
                        onPress={() => showDatePicker('from')}
                      />
                    }
                    editable={false}
                  />
                  {showFromDatePicker && (
                    <DateTimePicker
                      value={fromDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeFromDate}
                      minimumDate={today}
                    />
                  )}
                </View>
                <View style={styles.dateInput}>
                  <TextInput
                    label="Until"
                    mode="outlined"
                    value={atDate ? atDate.toLocaleDateString() : 'DD/MM/YY'}
                    onFocus={() => showDatePicker('at')}
                    right={
                      <TextInput.Icon
                        icon={() => (
                          <SvgXml xml={SVG_calender} height={24} width={24} />
                        )}
                        onPress={() => showDatePicker('at')}
                      />
                    }
                    editable={false}
                  />
                  {showAtDatePicker && (
                    <DateTimePicker
                      value={atDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeAtDate}
                      minimumDate={today}
                    />
                  )}
                </View>
              </>
            )}
            <TextInput
              label="Enter Reason"
              mode="outlined"
              value={reason}
              onChangeText={text => setReason(text)}
            />
          </View>
          <TouchableHighlight
            style={styles.submitButton}
            onPress={handleSubmitRequest}
            disabled={loading}
            underlayColor="#751B0B">
            <View style={styles.submitButtonContent}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </View>
          </TouchableHighlight>
        </ScrollView>
      </Animated.View>
    </View>
  );
});

export default MyBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '60%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    // backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontSize: 18,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButtonText: {
    color: 'black',
    fontSize: 16,
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: 2,
  },
  orText: {
    color: '#888',
    fontSize: 14,
  },
  inputContainer: {
    padding: 20,
  },
  dateInput: {
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 60,
    backgroundColor: '#862A0D',
    // borderWidth: 2,
    marginBottom: 5,
    borderColor: '#862A0D',
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
