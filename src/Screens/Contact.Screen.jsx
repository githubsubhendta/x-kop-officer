// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import {Searchbar, Card} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {navigate} from '../navigation/NavigationService';
// import {useConversationList} from '../Api/conversationService';

// const ContactScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedLetter, setSelectedLetter] = useState('');
//   const {loading, error, conversationList, getAllConversationList} =
//     useConversationList();

//   useEffect(() => {
//     if (conversationList.length === 0) {
//       getAllConversationList();
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       console.log('Error:', error);
//     }
//   }, [error]);

//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

//   const matchedChats = conversationList?.filter(chat => {
//     const officerName =
//       chat.participants.find(user => user.officerDetails == undefined)?.name ||
//       '';
//     return officerName[0]?.toUpperCase() === selectedLetter;
//   });

//   const otherChats = conversationList?.filter(chat => {
//     const officerName =
//       chat.participants.find(user => user.officerDetails == undefined)?.name ||
//       '';
//     return (
//       officerName[0]?.toUpperCase() !== selectedLetter &&
//       officerName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const displayedChats = [...(matchedChats || []), ...(otherChats || [])];

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
//       <View>
//         <Text
//           style={{
//             fontWeight: '500',
//             paddingHorizontal: 24,
//             paddingVertical: 16,
//             fontSize: 24,
//             color: '#862A0D',
//           }}>
//           Consultations
//         </Text>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             margin: 24,
//             marginTop: 0,
//             borderRadius: 10,
//             borderWidth: 1,
//             borderColor: '#fff',
//             backgroundColor: '#fff',
//           }}>
//           <Searchbar
//             style={{flex: 1, backgroundColor: 'transparent'}}
//             placeholder="Search"
//             onChangeText={setSearchQuery}
//             value={searchQuery}
//           />
//           <Icon
//             name="filter-variant-plus"
//             size={25}
//             color="black"
//             style={{marginRight: 14}}
//           />
//         </View>

//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <View style={{flex: 1}}>
//             {loading ? (
//               <ActivityIndicator size="large" style={{marginTop: 20}} />
//             ) : (
//               <ScrollView>
//                 {displayedChats?.length > 0 ? (
//                   displayedChats.map((chat, index) => {
//                     const officer = chat.participants.find(
//                       user => user.officerDetails == undefined,
//                     );
//                     return (
//                       <TouchableOpacity
//                         key={index}
//                         style={{marginLeft: 4}}
//                         onPress={() =>
//                           navigate('ChatScreen', {
//                             chatId: chat._id,
//                             chats: chat,
//                           })
//                         }>
//                         <Card.Title
//                           title={officer?.name || 'Unknown Officer'}
//                           subtitle={
//                             officer?.officerDetails?.ConsultationTypeID
//                               ?.ConsultationTypeName || 'General Offences'
//                           }
//                           left={() => (
//                             <Image
//                               source={{
//                                 uri:
//                                   officer?.avatar ||
//                                   'https://via.placeholder.com/50',
//                               }}
//                               style={{
//                                 width: 50,
//                                 height: 50,
//                                 borderRadius: 25,
//                                 // marginRight: 2,
//                                 borderWidth: 1,
//                                 borderColor: '#F7F7F7',
//                               }}
//                             />
//                           )}
//                           titleStyle={{
//                             fontWeight: 'bold',
//                             paddingTop: 3,
//                           }}
//                           style={{
//                             fontWeight: 600,
//                             borderBottomWidth: 1,
//                             borderBottomColor: '#D3D3D3',
//                             marginLeft: 4,
//                           }}
//                         />
//                       </TouchableOpacity>
//                     );
//                   })
//                 ) : (
//                   <View style={{marginHorizontal: 16, marginTop: 20}}>
//                     <Text>No chats available</Text>
//                   </View>
//                 )}
//               </ScrollView>
//             )}
//           </View>

//           <View
//             style={{
//               paddingVertical: 8,
//               backgroundColor: '#F6F6F6',
//               marginHorizontal: 8,
//               borderRadius: 16,
//             }}>
//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               className="h-[550px] overflow-y-auto scrollbar-hidden mb-64 ">
//               {alphabet.map((letter, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => setSelectedLetter(letter)}>
//                   <Text
//                     style={{
//                       paddingHorizontal: 8,
//                       paddingVertical: 4,
//                       textAlign: 'center',
//                       color: selectedLetter === letter ? '#862A0D' : '#9E9E9E',
//                     }}>
//                     {letter}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ContactScreen;



// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import {Searchbar, Card} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {navigate} from '../navigation/NavigationService';
// import {useConversationList} from '../Api/conversationService';

// const ContactScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedLetter, setSelectedLetter] = useState('');
//   const {loading, error, conversationList, getAllConversationList} =
//     useConversationList();

//   useEffect(() => {
//     if (conversationList.length === 0) {
//       getAllConversationList();
//     }
//   }, []);

//   useEffect(() => {
//     if (error) {
//       console.log('Error:', error);
//     }
//   }, [error]);

//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

//   const matchedChats = conversationList?.filter(chat => {
//     const officerName =
//       chat.participants.find(user => user.officerDetails == undefined)?.name ||
//       '';
//     return officerName[0]?.toUpperCase() === selectedLetter;
//   });

//   const otherChats = conversationList?.filter(chat => {
//     const officerName =
//       chat.participants.find(user => user.officerDetails == undefined)?.name ||
//       '';
//     return (
//       officerName[0]?.toUpperCase() !== selectedLetter &&
//       officerName.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const displayedChats = [...(matchedChats || []), ...(otherChats || [])];

//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
//       <View style={{flex: 1}}>
//         <Text
//           style={{
//             fontWeight: '500',
//             paddingHorizontal: 24,
//             paddingVertical: 16,
//             fontSize: 24,
//             color: '#862A0D',
//           }}>
//           Consultations
//         </Text>

//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             margin: 24,
//             marginTop: 0,
//             borderRadius: 10,
//             borderWidth: 1,
//             borderColor: '#fff',
//             backgroundColor: '#fff',
//           }}>
//           <Searchbar
//             style={{flex: 1, backgroundColor: 'transparent'}}
//             placeholder="Search"
//             onChangeText={setSearchQuery}
//             value={searchQuery}
//           />
//           <Icon
//             name="filter-variant-plus"
//             size={25}
//             color="black"
//             style={{marginRight: 14}}
//           />
//         </View>

//         <View style={{flex: 1, flexDirection: 'row'}}>
//           <ScrollView >
//             {loading ? (
//               <ActivityIndicator size="large" style={{marginTop: 20}} />
//             ) : displayedChats.length > 0 ? (
//               displayedChats.map((chat, index) => {
//                 const officer = chat.participants.find(
//                   user => user.officerDetails == undefined,
//                 );
//                 return (
//                   <TouchableOpacity
//                     key={index}
//                     style={{marginLeft: 4}}
//                     onPress={() =>
//                       navigate('ChatScreen', {
//                         chatId: chat._id,
//                         chats: chat,
//                       })
//                     }>
//                     <Card.Title
//                       title={officer?.name || 'Unknown Officer'}
//                       subtitle={
//                         officer?.officerDetails?.ConsultationTypeID
//                           ?.ConsultationTypeName || 'General Offences'
//                       }
//                       left={() => (
//                         <Image
//                           source={{
//                             uri:
//                               officer?.avatar ||
//                               'https://via.placeholder.com/50',
//                           }}
//                           style={{
//                             width: 50,
//                             height: 50,
//                             borderRadius: 25,
//                             borderWidth: 1,
//                             borderColor: '#F7F7F7',
//                           }}
//                         />
//                       )}
//                       titleStyle={{
//                         fontWeight: 'bold',
//                         paddingTop: 3,
//                       }}
//                       style={{
//                         fontWeight: 600,
//                         borderBottomWidth: 1,
//                         borderBottomColor: '#D3D3D3',
//                         marginLeft: 4,
//                       }}
//                     />
//                   </TouchableOpacity>
//                 );
//               })
//             ) : (
//               <View style={{marginHorizontal: 16, marginTop: 20}}>
//                 <Text>No chats available</Text>
//               </View>
//             )}
//           </ScrollView>

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{
//               paddingVertical: 8,
//               backgroundColor: '#F6F6F6',
//               marginHorizontal: 8,
//               borderRadius: 16,
//               alignItems: 'center',
//             }}>
//             {alphabet.map((letter, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => setSelectedLetter(letter)}>
//                 <Text
//                   style={{
//                     paddingHorizontal: 8,
//                     paddingVertical: 4,
//                     textAlign: 'center',
//                     color: selectedLetter === letter ? '#862A0D' : '#9E9E9E',
//                   }}>
//                   {letter}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ContactScreen;
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Searchbar, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../navigation/NavigationService';
import { useConversationList } from '../Api/conversationService';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const ContactScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const { loading, error, conversationList, getAllConversationList } =
    useConversationList();

  useEffect(() => {
    if (conversationList.length === 0) {
      getAllConversationList();
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
    }
  }, [error]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const matchedChats = conversationList?.filter(chat => {
    const officerName =
      chat.participants.find(user => user.officerDetails == undefined)?.name || '';
    return officerName[0]?.toUpperCase() === selectedLetter;
  });

  const otherChats = conversationList?.filter(chat => {
    const officerName =
      chat.participants.find(user => user.officerDetails == undefined)?.name || '';
    return (
      officerName[0]?.toUpperCase() !== selectedLetter &&
      officerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const displayedChats = [...(matchedChats || []), ...(otherChats || [])];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Consultations</Text>

        <View style={styles.searchContainer}>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <Icon
            name="filter-variant-plus"
            size={width * 0.06} // Responsive icon size
            color="black"
            style={styles.filterIcon}
          />
        </View>

        <View style={styles.contentContainer}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {loading ? (
              <ActivityIndicator 
                size="large" 
                style={styles.loadingIndicator} 
              />
            ) : displayedChats.length > 0 ? (
              displayedChats.map((chat, index) => {
                const officer = chat.participants.find(
                  user => user.officerDetails == undefined,
                );
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.chatItem}
                    onPress={() =>
                      navigate('ChatScreen', {
                        chatId: chat._id,
                        chats: chat,
                      })
                    }>
                    <Card.Title
                      title={officer?.name || 'Unknown Officer'}
                      subtitle={
                        officer?.officerDetails?.ConsultationTypeID
                          ?.ConsultationTypeName || 'General Offences'
                      }
                      left={() => (
                        <Image
                          source={{
                            uri:
                              officer?.avatar ||
                              'https://via.placeholder.com/50',
                          }}
                          style={styles.avatar}
                        />
                      )}
                      titleStyle={styles.cardTitle}
                      subtitleStyle={styles.cardSubtitle}
                      style={styles.card}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.noChatsContainer}>
                <Text style={styles.noChatsText}>No chats available</Text>
              </View>
            )}
          </ScrollView>

          {/* Alphabet column */}
          <View style={styles.alphabetContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {alphabet.map((letter, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedLetter(letter)}>
                  <Text
                    style={[
                      styles.alphabetLetter,
                      selectedLetter === letter && styles.selectedLetter,
                    ]}>
                    {letter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, 
  },
  headerText: {
    fontWeight: '500',
    fontSize: width * 0.06,
    color: '#862A0D',
    paddingVertical: height * 0.02, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 0, 
  },
  filterIcon: {
    marginRight: width * 0.03,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.02,
  },
  chatItem: {
    // marginVertical: height * 0.005,
  },
  avatar: {
    width: width * 0.12, // 12% of screen width
    height: width * 0.12,
    borderRadius: width * 0.06,
    borderWidth: 1,
    borderColor: '#F7F7F7',
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
  },
  cardTitle: {
    color:'#000',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    paddingTop: 1,
  },
  cardSubtitle: {
    color:'#000',
    fontSize: width * 0.035,
  },
  loadingIndicator: {
    marginTop: height * 0.03,
  },
  noChatsContainer: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: width * 0.04,
  },
  alphabetContainer: {
    width: width * 0.08,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: width * 0.02,
    maxHeight: height * 0.8, 
  },
  alphabetLetter: {
    paddingVertical: 4,
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: width * 0.035,
  },
  selectedLetter: {
    color: '#862A0D',
  },
});

export default ContactScreen;


