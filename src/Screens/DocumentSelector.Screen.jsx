import { View, Text, InputAccessoryView, ScrollView, TextInput, StyleSheet, Button, Alert, TouchableHighlight, Image, FlatList  } from 'react-native'
import React, { useState } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome";
import { Searchbar } from 'react-native-paper';
import book from "../images/book2.jpg";

const DocumentSelectorScreen = ({navigation}) => {
  const [search, setSearch] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [documentType, setDocumentType] = useState("first");
  const [searchQuery, setSearchQuery] = React.useState('');
  const data = [
    { id: 1, label: 'Infrastructure Guide...' },
    { id: 2, label: 'Vehicles Guide...' },
    { id: 3, label: 'XYZ Guide...' },
    { id: 4, label: 'XYZ Guide...' },
    { id: 5, label: 'XYZ Guide...' },
    { id: 6, label: 'XYZ Guide...' }
  ];

  const renderItemFun = ({item}) => (
    <View style={styles.checkboxContainer}>
      <CheckBox
        value={isSelected}
        onValueChange={setSelection}
        style={styles.checkbox}
      />
      <Image source={book} className="w-full" />
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );

  return (
    <View className="flex-1 static overflow-y-auto">
      <View className="flex flex-wrap flex-row justify-between p-4 bg-red-200">
        <View className="w-1/2">
          <Text className="text-black text-bold  text-base font-bold">2 Documents Selected </Text>
        </View>
        <View className="w-1/2 text-right">
          <Text className="text-black text-right text-lg">⨯</Text>
        </View>
      </View>
      {/* style={styles.container} */}
 
      <Text className="text-black pl-6 pr-6 font-bold text-base">Recent</Text>
    <View style={styles.checkboxWrapper}>
      <FlatList
        data={data}
        renderItem={renderItemFun}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
      />
    </View>
      <Text className="text-black text-base font-bold pt-4 pl-6 pb-3">Documents</Text>
      <View className="checklistWrappper">
        <RadioButton.Group onValueChange={newValue => setDocumentType(newValue)} value={documentType}>
          <View className="flex flex-wrap items-center flex-row pl-6">
            <RadioButton value="first" />
            <Text className="text-black text-base font-medium"> <Icon name="file-pdf-o" color="#000" size={20} /> Essential checklist.pdf</Text>
          </View>
          <View className="flex flex-wrap items-center flex-row pl-6">
            <RadioButton value="second" />
            <Text className="text-black text-base font-medium"><Icon name="file-pdf-o" color="#000" size={20} /> Paper document name.pd</Text>
          </View>
        </RadioButton.Group>
      </View>
      <Text className="text-black text-base font-bold pt-4 pl-6 pb-3">Officials Forms</Text>
      <View className="absolute bottom-0 left-0 right-0 p-6 w-100 bg-white ">
        <TouchableHighlight className="rounded-lg">
          <View className="flex justify-center items-center bg-red-700 py-4 rounded-lg">
            <Text className="text-white text-[18px] font-bold" onPress={() => navigation.push("ChatendScreen")}>Attached Selected</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    // gap: 1,
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 30,
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    borderColor: '#000',
    paddingBottom: 4,
    paddingTop: 4,
    paddingRight: 4,
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    top: '0',
    right: '0',
    zIndex: 10,
    textAlign: 'right',
    color: '#000',
    Float: 'right',
  },
  checklistWrappper: {
    borderBottomColor: '#000',
    borderWidth: 1,
  },
  label: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
  },
  searchInput: {
    borderColor: '#000',
  },
});
export default DocumentSelectorScreen