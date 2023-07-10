//#region react components
import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
//#endregion ----------

//#region plagins
import { useDispatch } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
//#endregion ----------

//#region components
import { setLoginToken } from '../../../redux/App/actions/authActions';
import { constants, theme, images } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const CompleteResetPassScreen = ({ navigation, route }) => {
  const params = route.params;
  const data = params.data;
  const dimensions = Dimensions.get('window');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const dispatch = useDispatch();

  const saveToken = async token => {
    try {
      await AsyncStorage.setItem('@token', token);
    } catch (e) {
      console.log(e);
    }
  };

  const saveUserInfo = async userInfo => {
    try {
      let json = JSON.stringify({ name: userInfo.name, phone: userInfo.phone });
      await AsyncStorage.setItem('@userInfo', json);
    } catch (e) {
      console.log(e);
    }
  };
  /**
   * function for navigate to main
   */

  function setTokenLocal(data) {
    setLoaderVisible(true);
    if (data.access_token) {
      // dispatch(setLoginToken(data.access_token));
      saveToken(data.access_token);
      saveUserInfo(data.user);
      setTimeout(() => {
        navigation.navigate('AllReportsScreen');
        setLoaderVisible(false);
      }, 3000);
    } else {
      setLoaderVisible(false);
      navigation.navigate('MainScreen');
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {loaderVisible ? (
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor="rgba(255, 255, 255, 1)"
          source={constants.loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
      ) : (
        <>
          <View style={styles.statusBarLine} />
          <Text style={[theme.FONTS.h3SF, styles.title]}>Восстановление пароля</Text>
          <View style={styles.container}>
            <Text style={[theme.FONTS.h1, styles.text]}>
              {'Поздравляем!\nВы успешно обновили свой пароль'}
            </Text>
            <ImageBackground source={images.lock} style={styles.lock} imageStyle={styles.lockImg} />
            {/* <Image source={lock} style={[styles.img, { width: dimensions.width - 30, height: Math.round(208 * (dimensions.width - 30) / 278) }]} /> */}
            <TouchableOpacity onPress={() => setTokenLocal(data)}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.btn]}>Войти в приложение</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CompleteResetPassScreen;
