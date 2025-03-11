import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Modal} from 'react-native';
import WebView from 'react-native-webview';
import ModalSettingsProps from '../../types/ModalSettingsProps';
import {COLOR, FONT} from '../../assets/colorTheme';

const ModalSettings: React.FC<ModalSettingsProps> = ({isVisible, onClose}) => {
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);

  const handlePress = () => {
    setIsWebViewVisible(true);
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
          <View style={styles.modalView}>
            <Text style={styles.textHead}>О приложении</Text>
            <Text style={styles.modalText}>
              Приложение для отображения погоды
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.developer}>Разработчик</Text> -{' '}
              <Text onPress={handlePress} style={styles.nevion}>
                Nevionn
              </Text>
            </Text>
            <Text style={styles.modalText}>Версия 2.3.2</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => onClose()}>
              <Text style={styles.textButton}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isWebViewVisible} animationType="slide">
        <WebView
          source={{uri: 'https://gitlab.com/web4450122/weather-mobile-app'}}
        />
        <TouchableOpacity
          style={styles.openWeViewButton}
          onPress={() => setIsWebViewVisible(false)}>
          <Text style={styles.textButton}>Закрыть</Text>
        </TouchableOpacity>
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
    backgroundColor: COLOR.SECONDARY_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    borderRadius: 20,
    padding: 11,
    width: '35%',
    elevation: 2,
    backgroundColor: COLOR.BUTTON_COLOR,
  },
  openWeViewButton: {
    padding: 11,
    backgroundColor: 'black',
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: FONT.SIZE.defaultText,
  },
  textHead: {
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: FONT.SIZE.headerText,
  },
  developer: {
    color: 'white',
    fontSize: FONT.SIZE.defaultText,
  },
  nevion: {
    color: 'pink',
    textDecorationLine: 'underline',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: FONT.SIZE.defaultText,
  },
});

export default ModalSettings;
