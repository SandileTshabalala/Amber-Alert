import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Modal, Text, FlatList } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../services/firebaseConfig';
import images from '../constants/images'; 

const NotificationBell = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'alerts'));
        const fetchedNotifications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image source={{ uri: item.image || images.placeholder }} style={styles.notificationImage} />
      <Text style={styles.notificationText}>
        {item.name} {item.surname}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={toggleModal}
      >
        <Image
          source={images.bellnotification}
          style={styles.bellIcon}
        />
      </TouchableOpacity>

      {modalVisible && 
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity style={styles.overlay} onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.noNotificationText}>No new notifications</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bellContainer: {
    backgroundColor: '#1f1f2e',
    padding: 12,
    borderRadius: 50,
    borderColor: '#EB6C24',
    borderWidth: 2,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#1f1f2e',
    borderRadius: 10,
    borderColor: '#EB6C24',
    borderWidth: 2,
    marginBottom: 80,
    marginRight: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
  },
  noNotificationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationBell;
