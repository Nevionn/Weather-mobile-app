import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Modal,
} from 'react-native';
import ModalSettingsProps from '../../types/ModalSettingsProps';
import {COLOR} from '../../assets/colorTheme';
import {APP_VERSION} from '../../../App';

const ModalSettings: React.FC<ModalSettingsProps> = ({isVisible, onClose}) => {
  const handlePress = () => {
    Linking.openURL('https://gitlab.com/web4450122/weather-mobile-app');
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          onClose();
        }}>
        <View style={styles.modalBackground}>
          <View
            style={{
              ...styles.modalView,
              backgroundColor: COLOR.SECONDARY_COLOR,
            }}>
            <Text style={styles.textHead}>О приложении</Text>
            <Text style={styles.modalText}>
              Приложение для отображения погоды
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.developer}>Разработчик</Text> -{' '}
              <Text onPress={handlePress} style={styles.nevion}>
                Nevion Soft
              </Text>
            </Text>
            <Text style={styles.modalText}>Версия {APP_VERSION}</Text>
            <TouchableOpacity
              style={{
                ...styles.openButton,
                backgroundColor: COLOR.BUTTON_COLOR,
              }}
              onPress={() => onClose()}>
              <Text style={styles.textButton}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: 245,
    width: '80%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
  },
  textHead: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  developer: {
    color: 'white',
  },
  nevion: {
    color: 'pink',
    textDecorationLine: 'underline',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
});

export default ModalSettings;
