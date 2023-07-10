import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

const NoSignalScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.noConnectionView}>
        <Text style={styles.noConnectionText}>Отсутствует интернет</Text>
      </View>
      <View style={styles.noConnectionCentralView}>
        <Icon name="wifi-off" size={80} type="material-community" color={'#FF3B30'} />
        <Text style={styles.noConnectionText}>
          Некоторые функции приложения не доступны без подключения к сети. Проверьте своё соединение
        </Text>
      </View>
      <TouchableOpacity
        style={styles.toMainBtn}
        onPress={() => {
          navigation.navigate('MainScreen');
        }}
      >
        <Text style={styles.toMainBtnText}>Вернуться на главную</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoSignalScreen;
