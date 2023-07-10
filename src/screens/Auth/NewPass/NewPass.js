//#region react components
import React, { useState } from 'react';
import { StatusBar, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
//#endregion

//#region components
import { auth } from '../../../requests';
import { FieldInput } from '../../../components/fields';
import { theme, images } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion

const NewPassScreen = ({ navigation, route }) => {
  const params = route.params;
  const phone = params.phone;
  const code = params.code;

  const [validatePassFlag, changeValidatePassFlag] = useState(true);
  const [validateConfPassFlag, changeValidateConfPassFlag] = useState(true);

  const [isPasswordLengthCorrect, setIsPasswordLengthCorrect] = useState(true);
  const [passwordSymbolsCorrect, setPasswordSymbolsCorrect] = useState(true);
  const [passwordHasNumber, setPasswordHasNumber] = useState(true);
  const [passwordHasLetter, setPasswordHasLetter] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordConfValid, setIsPasswordConfValid] = useState(true);

  const [passValue, setPassValue] = useState('');
  const [confPassValue, setConfPassValue] = useState(null);

  function validatePassword(text) {
    if (text) {
      let isCorrectSymbol = /^[A-Za-z\d!@#$%^&*()_=+[\]{};\|,.]{1,}$/.test(text);
      let isCorrectLength = text.length >= 7 && text.length <= 15;
      let hasNumber = /\d/.test(text);
      let hasLetter = /[A-Za-z]+/.test(text);
      setPasswordSymbolsCorrect(isCorrectSymbol);
      setPasswordHasNumber(hasNumber);
      setPasswordHasLetter(hasLetter);
      setIsPasswordLengthCorrect(isCorrectLength);
      setIsPasswordValid(isCorrectLength && isCorrectSymbol && hasNumber && hasLetter);
      setIsPasswordConfValid(text === confPassValue);
      return isCorrectLength || isCorrectSymbol || hasNumber;
    }
    return false;
  }

  function validatePasswordConfirm(text) {
    setIsPasswordConfValid(text === passValue);
    return text === passValue;
  }

  /**
   * async function for set new pass
   */
  async function setNewPassLocal(phone, code, passValue, confPassValue) {
    let result = await auth
      .setNewPass(phone, code, passValue, confPassValue)
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
        console.log('set new paa err', err);
        return [false];
      });
    return result;
  }

  async function send() {
    let validate = validatePassword(passValue);
    let validateConf = validatePasswordConfirm(confPassValue);
    if (validate && validateConf) {
      let result = await setNewPassLocal(phone, String(code), passValue, confPassValue);
      if (result[0]) {
        navigation.navigate('CompleteResetPassScreen', { data: result[1] });
      } else {
        changeValidatePassFlag(false);
        changeValidateConfPassFlag(false);
      }
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.statusBarLine} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowLeftInner} onPress={() => navigation.goBack()}>
          <Image source={images.arrowLeft} style={styles.arrowLeft} />
        </TouchableOpacity>
        <Text style={[theme.FONTS.h3SF, styles.title]}>Новый пароль</Text>
      </View>
      <View style={styles.container}>
        <Text style={[theme.FONTS.h1, styles.text]}>Введите новый пароль для приложения</Text>
        <View style={{ paddingBottom: validatePassFlag ? 0 : 15 }}>
          {/* <FieldInput
            field={{ name: 'Пароль', required: 0 }}
            value={passValue}
            setValue={setPassValue}
            validateFlag={validatePassFlag}
            setValidate={changeValidatePassFlag}
            maxLength={15}
            secureInput={true}
            validateOnType={true}
          /> */}
          <FieldInput
            field={{ name: 'Пароль', required: 0 }}
            value={passValue}
            setValue={setPassValue}
            validateFlag={validatePassFlag}
            setValidate={changeValidatePassFlag}
            maxLength={15}
            secureInput={true}
            validateOnType={true}
            validateFunc={validatePassword}
          />
          {!isPasswordLengthCorrect ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              Пароль должен содержать 7-15 символов
            </Text>
          ) : (
            <></>
          )}
          {!passwordSymbolsCorrect ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              Пароль должен содержать буквы латинского алфавита, цифры или символы
            </Text>
          ) : (
            <></>
          )}
          {!passwordHasNumber ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              Пароль должен содержать хотя бы одну цифру
            </Text>
          ) : (
            <></>
          )}
          {!passwordHasLetter ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              Пароль должен содержать хотя бы одну букву
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
            validateFunc={validatePasswordConfirm}
            maxLength={15}
            secureInput={true}
            validateOnType={true}
          />

          {!isPasswordConfValid ? (
            <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
              Поле подтверждения пароля не совпадает с полем пароля
            </Text>
          ) : (
            <></>
          )}
        </View>
        <TouchableOpacity onPress={() => send()}>
          <Text style={[theme.FONTS.body_SF_M_15, styles.btn]}>Изменить пароль</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NewPassScreen;
