//#region import libres

//#region react
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
//#endregion

//#region components
import { images } from '../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const ErrorMessageScreen = ({ route, navigation }) => {
  const dimensions = Dimensions.get('window');
  const { message } = route.params;

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.statusBarLine} />
      <Text style={styles.title}>Ошибка!</Text>
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
        <Image
          source={images.lock}
          style={[
            styles.img,
            { width: dimensions.width - 30, height: Math.round((208 * (dimensions.width - 30)) / 278) },
          ]}
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.btn}>Окей</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ErrorMessageScreen;
