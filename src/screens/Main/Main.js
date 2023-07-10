//#region react components
import React, { useEffect } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
//#endregion --------

//#region plagins
import { useSelector } from 'react-redux';
//#endregion --------

//#region constants
import { images, SIZES, theme } from '../../сonstants';
//#endregion --------

//#region styles
import { styles } from '../Main/styles';
//#endregion --------

const MainScreen = ({ navigation }) => {
  const dimensions = Dimensions.get('window');
  const token = useSelector(state => state.appGlobal.loginToken);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.statusBarLine} />
      {token == null ? (
        <>
          <View style={styles.container}>
            <View>
              <ImageBackground
                source={images.mainLogo}
                style={styles.mainLogo}
                imageStyle={styles.mainLogoImg}
              />
              <Text style={[theme.FONTS.h1, styles.greeting]}>
                {'Приветствуем Вас в приложении\nDSS community'}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[theme.FONTS.body_SF_M_15, styles.regBtn]}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={[theme.FONTS.h4, styles.loginTitle]}>Есть аккаунт?</Text>
              <TouchableOpacity
                style={styles.loginBtnInner}
                onPress={() => {
                  navigation.navigate('LogInScreen');
                }}
              >
                <Text style={[theme.FONTS.body_SF_R_14, styles.loginBtn]}>Войдите</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default MainScreen;
