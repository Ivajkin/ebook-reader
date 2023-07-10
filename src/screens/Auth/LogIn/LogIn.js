//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  TextInput,
  Dimensions,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
//#endregion ----------

//#region plagins
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
//#endregion ----------

//#region components
import { auth } from '../../../requests';
import { setLoginToken } from '../../../redux/App/actions/authActions';
import { FieldInput, PhonInput } from '../../../components/fields';
import { theme } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
import { setUserInfo } from '../../../redux/App/actions/mainActions';
import { useIsFocused } from "@react-navigation/native";
//#endregion ----------

const LogInScreen = ({ navigation }) => {
  //#region valuevles
  const [contryFlag, changeContryFlag] = useState(false);

  const [validatePassFlag, changeValidatePassFlag] = useState(true);
  const [validatePhoneFlag, changeValidatePhoneFlag] = useState(true);

  const dispatch = useDispatch();

  const [passErrorLengthFlag, changePassErrorLengthFlag] = useState(false);
  const [passErrorNumber, changePassErrorNumber] = useState(false);
  const [passErrorSymbol, changePassErrorSumbol] = useState(false);

  const [phoneValue, setPhoneValue] = useState(null);
  const [passValue, setPassValue] = useState(null);

  const [keyboardOffset, setKeyboardOffset] = useState(Platform.OS === 'ios' ? 0 : 20);

  const isFocused = useIsFocused()
  const clear = ()=> {
    setPhoneValue(null);
    setPassValue(null);
    changeValidatePassFlag(true);
    changeValidatePhoneFlag(true);
  }

  useEffect(() => {
    console.log("called", isFocused);

    // Call only when screen open or when back on screen
    if(isFocused){
      clear();
    }
  }, [isFocused]);

  //#endregion ----------

  function validatePhone(text) {
    if (text) {
      if (text.length > 6 && text.length < 17) {
        changeValidatePhoneFlag(true);
        return true;
      } else {
        changeValidatePhoneFlag(false);
        return false;
      }
    } else {
      changeValidatePhoneFlag(false);
      return false;
    }
  }

  function validatePass(text) {
    if (text) {
      if (/^(?=.*\d)(?=.*[A-Za-z])[A-Za-z\d!@#$%^&*()_=+[\]{};\|,.]{7,15}$/.test(text)) {
        changePassErrorSumbol(false);
        changeValidatePassFlag(true);
        return true;
      } else {
        changePassErrorSumbol(true);
        changeValidatePassFlag(false);
        return false;
      }
    } else {
      changeValidatePassFlag(false);
      changePassErrorLengthFlag(true);
      return false;
    }
  }

  function keyboardHideListener() {
    changeContryFlag(false);
    setKeyboardOffset(Platform.OS === 'ios' ? 50 : 20);
  }

  function keyboardShowListener() {
    setKeyboardOffset(0);
  }

  const saveToken = async token => {
    try {
      await AsyncStorage.setItem('@token', token);
    } catch (e) {
      console.log(e);
    }
  };

  const saveUserInfo = async userInfo => {
    try {
      let json = JSON.stringify({ name: userInfo.name, phone: userInfo.phone, id: userInfo.id });
      await AsyncStorage.setItem('@userInfo', json);
      dispatch(setUserInfo(JSON.parse(json)));
    } catch (e) {
      console.log(e);
    }
  };

  function logIn() {
    let validate1 = validatePhone(phoneValue);
    let validate2 = validatePass(passValue);
    if (validate1 && validate2) {
      auth
        .loginUser(phoneValue, passValue)
        .then(res => {
          if (res) {
            saveToken(res.data.data.access_token);
            saveUserInfo(res.data.data.user);
            dispatch(setLoginToken(res.data.data.access_token));
            auth
              .getUserInfo(res.data.data.access_token)
              .then(response => {
                const data = response.data.data;

                if (
                  data.status === 'moderating' &&
                  data.roles.length > 0 &&
                  data.roles[0].name === 'dss_group_specialist'
                ) {
                  navigation.navigate('ModerationWaitScreen');
                  return;
                } else if (data.status === 'blocked') {
                  navigation.navigate('BlockScreen');
                  return;
                } else {
                  navigation.navigate('AllReportsScreen', {
                    userId: data?.id || null,
                  });
                  return;
                }
              })
              .catch(error => {
                console.log('error get user info', error);
              });
          }
        })
        .catch(err => {
          console.log('login error', err, err.response);
          try {
            navigation.navigate('ErrorMessageScreen', {
              message: err.response.data.errors.phone[0],
            });
          } catch {
            navigation.navigate('ErrorMessageScreen', {
              message: 'Неверный телефон или пароль\nПожалуйста введите верные данные.',
            });
          }
        });
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', keyboardHideListener);
    Keyboard.addListener('keyboardDidShow', keyboardShowListener);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={{ height: '100%' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={keyboardOffset}
          //enabled={Platform.OS === 'ios' ? true : false}
          enabled={true}
          behavior="padding"
        >
          <View style={styles.statusBarLine} />
          <Text style={[theme.FONTS.h3SF, styles.title]}>Авторизация</Text>
          <View style={[styles.container, { flexGrow: 1, flex: 1 }]}>
            <View>
              <Text style={[theme.FONTS.h1, styles.text]}>
                Введите свои данные для авторизации в приложении DSS community
              </Text>
              <PhonInput
                flag={contryFlag}
                changeFlag={changeContryFlag}
                value={phoneValue}
                setValue={setPhoneValue}
                validatePhoneFlag={validatePhoneFlag}
                validatePhone={validatePhone}
              />
              {/* <View style={{ paddingBottom: validatePassFlag ? 0 : 15, backgroundColor: '#838383', zIndex:2 }}> */}

              <FieldInput
                field={{ name: 'Пароль', required: 0 }}
                value={passValue}
                setValue={setPassValue}
                validateFlag={validatePassFlag}
                setValidate={changeValidatePassFlag}
                maxLength={15}
                secureInput={true}
                validateOnType={true}
                validateFunc={() => {
                  return true;
                }}
              />

              <View>
                {passErrorLengthFlag ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                    Пароль должен содержать 7-15 символов
                  </Text>
                ) : (
                  <></>
                )}
                {passErrorSymbol ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                    Пароль должен содержать буквы латинского алфавита, цифры или символы
                  </Text>
                ) : (
                  <></>
                )}
                {passErrorNumber ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                    Пароль должен содержать хотя бы одну цифру
                  </Text>
                ) : (
                  <></>
                )}
              </View>
              <TouchableOpacity onPress={() => logIn()}>
                <Text style={[theme.FONTS.body_SF_M_15, styles.logBtn]}>Войти</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emptySpace}>
              <TouchableOpacity
                style={{ height: '100%' }}
                onPress={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
            {/*<TouchableWithoutFeedback />*/}
            <View style={styles.linksInner}>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.link]}>Регистрация</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ResetPassScreen')}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.link]}>Забыли пароль?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default LogInScreen;
