import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SVG_arrow_back } from '../../Utils/SVGImage';

const ChatHeader = ({
  officer,
  chats,
  selectedMessages,
  filterMessageType,
  handleEditMessage,
  deleteMessages,
  showEditButton,
  navigation,
  blockUser,   // Function to block the user passed from parent
  removeUser,  // Function to remove the user passed from parent
}) => {
  const [openMenu, setOpenMenu] = useState(false); // State for menu visibility
  const menuIconRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleMenuPress = () => {
    if (menuIconRef.current) {
      menuIconRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({ x: pageX, y: pageY + height });
        setOpenMenu(true);
      });
    }
  };

  const handleBlockUser = () => {
    blockUser(officer?.id);  // Assuming 'officer.id' is the user ID you need to block
    setOpenMenu(false);
  };

  const handleRemoveUser = () => {
    removeUser(officer?.id);  // Assuming 'officer.id' is the user ID you need to remove
    setOpenMenu(false);
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <SvgXml xml={SVG_arrow_back} height={'100%'} width={'100%'} />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: officer?.avatar || 'default_avatar_url' }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.userName}>{officer?.name || 'Officer'}</Text>
              <Text style={styles.userPosition}>
                {chats?.participants?.filter(user => user.officerDetails)[0]
                  ?.officerDetails?.ConsultationTypeID?.ConsultationTypeName ||
                  'General Offences'}
              </Text>
            </View>
          </View>
        </View>

        {selectedMessages.length > 0 ? (
          <View style={styles.headerButtons}>
            {showEditButton &&
              filterMessageType(selectedMessages[0]) === 'text' && (
                <TouchableOpacity
                  onPress={() => handleEditMessage(selectedMessages[0])}>
                  <Icon name="edit" size={24} color="blue" />
                </TouchableOpacity>
              )}
            <TouchableOpacity onPress={deleteMessages}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            // ref={menuIconRef}
            // onPress={handleMenuPress}
            style={styles.menuIcon}>
            <Icon2 name="dots-three-vertical" color="#000" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Menu Modal */}
      <Modal
        transparent
        visible={openMenu}
        animationType="fade"
        onRequestClose={() => setOpenMenu(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpenMenu(false)}>
          <View style={[styles.menu, { top: menuPosition.y, left: menuPosition.x - 100 }]}>
            <TouchableOpacity onPress={handleBlockUser}>
              <Text style={styles.menuItem}>Block</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveUser}>
              <Text className="text-red-600" style={styles.menuItem}>Remove</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    width: 32,
    height: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: {
    height: 42,
    width: 42,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    height: '100%',
    width: '100%',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    maxWidth: 200,
    flexShrink: 1,
  },
  userPosition: {
    fontSize: 14,
    color: '#555',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    right: 5,
  },
  menu: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
    position: 'absolute',
  },
  menuItem: {
    color: '#000',
    paddingVertical: 5,
    textAlign: 'left',
    fontSize: 15,
  },
});

export default ChatHeader;
