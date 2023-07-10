//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
//#endregion

//#region components
import { auth } from '../../../requests';
import { PhonInput } from '../../../components/fields';
import { icons, theme } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const ResetPassScreen = ({ navigation }) => {
  const [phoneValue, setPhoneValue] = useState(null);
  const [contryFlag, changeContryFlag] = useState(false);
  const [validatePhoneFlag, changeValidatePhoneFlag] = useState(true);

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

  /**
   * async function for get code
   */

  async function getCodeLocal(phone) {
    let result = await auth
      .getCode(phone)
      .then(data => {
        if (data) {
          if (data.data.status === 'success') {
            return [true, data.data.data];
          } else {
            return [false];
          }
        } else {
          return [false];
        }
      })
      .catch(err => {
        console.log('get code local error', err.response);
        return [false];
      });
    return result;
  }

  async function send() {
    if (validatePhone(phoneValue)) {
      let result = await getCodeLocal(phoneValue);
      result[0]
        ? navigation.navigate('ConfResetPassScreen', { phone: phoneValue, code: result[1] })
        : changeValidatePhoneFlag(false);
    }
  }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.statusBarLine} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowLeftInner} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.arrowLeft} />
        </TouchableOpacity>
        <Text style={[theme.FONTS.h3SF, styles.title]}>Сброс пароля</Text>
      </View>
      <View style={styles.container}>
        <Text style={[theme.FONTS.h1, styles.text]}>
          Введите телефон который Вы указывали при регистрации
        </Text>
        <PhonInput
          flag={contryFlag}
          changeFlag={changeContryFlag}
          value={phoneValue}
          setValue={setPhoneValue}
          validatePhoneFlag={validatePhoneFlag}
          validatePhone={validatePhone}
        />
        <TouchableOpacity onPress={() => send()}>
          <Text style={[theme.FONTS.body_SF_M_15, styles.btn]}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassScreen;
