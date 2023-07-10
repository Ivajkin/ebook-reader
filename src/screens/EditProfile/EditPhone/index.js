import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { FieldInput, PhonInput } from '../../../components/fields';
import { HeaderBar } from '../../../components/menu';
import { setUserInfo } from '../../../redux/App/actions/mainActions';
import { putEditPhone } from '../../../requests/Profile';
import { COLORS, theme } from '../../../сonstants';
import { styles } from './styles';

const EditPhoneScreen = ({ navigation, route }) => {
  const [contryFlag, changeContryFlag] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [passValue, setPassValue] = useState(null);
  const [confPassValue, setConfPassValue] = useState(null);
  const [passErrorLengthFlag, changePassErrorLengthFlag] = useState(false);
  const [passErrorNumber, changePassErrorNumber] = useState(false);
  const [passErrorSymbol, changePassErrorSumbol] = useState(false);
  const [passErrorConf, changePassErrorConf] = useState(false);
  const [validatePassFlag, changeValidatePassFlag] = useState(true);
  const [validateConfPassFlag, changeValidateConfPassFlag] = useState(true);
  const [validatePhoneFlag, changeValidatePhoneFlag] = useState(true);

  const token = useSelector(state => state.appGlobal.loginToken);
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.appGlobal.userInfo);

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

  function validateConfPass(text) {
    if (text === passValue) {
      changePassErrorConf(false);
      changeValidateConfPassFlag(true);
      return true;
    } else {
      changePassErrorConf(true);
      changeValidateConfPassFlag(false);
      return false;
    }
  }

  const saveUserInfo = async userInfo => {
    try {
      let json = JSON.stringify({ name: userInfo.name, phone: userInfo.phone, id: userInfo.id });
      await AsyncStorage.setItem('@userInfo', json);
      console.log('#23', json);
      dispatch(setUserInfo(JSON.parse(json)));
    } catch (e) {
      console.log(e);
    }
  };
  async function onConfirmPhoneEdit() {
    let validateArr = [
      validatePhone(newPhone),
      validatePass(passValue),
      validateConfPass(confPassValue),
    ];
    if (validateArr.every(el => el)) {
      putEditPhone(token, newPhone, passValue, confPassValue)
        .then(res => {
          if (res?.data?.data?.user){
            saveUserInfo(res?.data?.data?.user)
          }

        })
        .catch(err => {
          console.log('put edit phone err', err);
        });
    }
  }

  return (
    <Fragment>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title={'Изменение номера'}
          backButton={true}
          goBackFlag={true}
          menuFlag={false}
          nav={navigation}
          route={route}
          screenBack={'EditProfileScreen'}
        >
          <Fragment>
            <View style={styles.wrapper}>
              <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                  <PhonInput
                    flag={contryFlag}
                    changeFlag={changeContryFlag}
                    value={newPhone}
                    setValue={setNewPhone}
                    validatePhoneFlag={validatePhoneFlag}
                    validatePhone={validatePhone}
                  />
                  <View style={{ paddingBottom: validatePassFlag ? 0 : 15 }}>
                    <FieldInput
                      field={{ name: 'Пароль', required: 0 }}
                      value={passValue}
                      setValue={setPassValue}
                      validateFlag={validatePassFlag}
                      setValidate={changeValidatePassFlag}
                      maxLength={15}
                      secureInput={true}
                    />
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
                        Пароль должен содержать хоть одну цифру
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View style={{ paddingBottom: validateConfPassFlag ? 0 : 15 }}>
                    <FieldInput
                      field={{ name: 'Подтверждение пароля', required: 0 }}
                      value={confPassValue}
                      setValue={setConfPassValue}
                      validateFlag={validateConfPassFlag}
                      setValidate={changeValidateConfPassFlag}
                      maxLength={15}
                      secureInput={true}
                    />
                    {passErrorConf ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        Поле подтверждения пароля не совпадает с полем пароля
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </Fragment>
          <TouchableOpacity style={styles.nextButtonWrapper} onPress={onConfirmPhoneEdit}>
            <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Изменить номер телефона</Text>
          </TouchableOpacity>
        </HeaderBar>
      </SafeAreaView>
    </Fragment>
  );
};

export default EditPhoneScreen;
