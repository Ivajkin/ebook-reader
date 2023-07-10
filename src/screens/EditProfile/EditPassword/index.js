import React, { Fragment, useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { FieldInput } from '../../../components/fields';
import { HeaderBar } from '../../../components/menu';
import { putEditPassword } from '../../../requests/Profile';
import { COLORS, theme } from '../../../сonstants';
import { styles } from './styles';
import { auth } from '../../../requests';
//import { auth } from '../../requests';

const EditPasswordScreen = ({ navigation, route }) => {
  const [oldPassValue, setOldPassValue] = useState(null);
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(null);
  const [passValue, setPassValue] = useState(null);
  const [confPassValue, setConfPassValue] = useState(null);
  const [isPasswordLengthCorrect, setIsPasswordLengthCorrect] = useState(true);
  const [passwordSymbolsCorrect, setPasswordSymbolsCorrect] = useState(true);
  const [passwordHasNumber, setPasswordHasNumber] = useState(true);
  const [passwordHasLetter, setPasswordHasLetter] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordConfValid, setIsPasswordConfValid] = useState(true);
  const [isPasswordNotTheSame, setIsPasswordNotTheSame] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState({});

  const token = useSelector(state => state.appGlobal.loginToken);

  function validatePassword(text) {
    if (text) {
      let isCorrectSymbol = /^[A-Za-z\d!@#$%^&*()_=+[\]{};\|,.]{1,}$/.test(text);
      let isCorrectLength = text.length >= 7 && text.length <= 15;
      let hasNumber = /\d/.test(text);
      let hasLetter = /[A-Za-z]+/.test(text);
      let isNew = text !== oldPassValue;
      setPasswordSymbolsCorrect(isCorrectSymbol);
      setPasswordHasNumber(hasNumber);
      setPasswordHasLetter(hasLetter);
      setIsPasswordLengthCorrect(isCorrectLength);
      setIsPasswordValid(isCorrectLength && isCorrectSymbol && hasNumber && hasLetter);
      setIsPasswordConfValid(text === confPassValue);
      setIsPasswordNotTheSame(isNew);
      return isCorrectLength && isCorrectSymbol && hasNumber && isNew;
    }
    setIsPasswordLengthCorrect(false);
    return false;
  }
  function validatePasswordConfirm(text) {
    setIsPasswordConfValid(text === passValue);
    return text === passValue;
  }
  function validateOldPassword(text) {
    let notEmpty = !!text;
    setIsOldPasswordValid(notEmpty);
  }
  function onConfirm() {
    setIsPasswordValid(validatePassword(passValue));
    validateOldPassword(oldPassValue);
    let validate =
      isPasswordValid &&
      validatePasswordConfirm(confPassValue) &&
      isOldPasswordValid &&
      isPasswordNotTheSame;
    // console.log(
    //   isPasswordValid,
    //   validatePasswordConfirm(confPassValue),
    //   isOldPasswordValid,
    //   isPasswordNotTheSame
    // );
    if (validate) {
      putEditPassword(token, oldPassValue, passValue, confPassValue)
        .then(res => {
          setPasswordErrors({});
          navigation.goBack();
          //console.log(res.data.data);
        })
        .catch(err => {
          setPasswordErrors(err?.response?.data?.errors?.messages);
          //console.log('put edit password error', Object.keys(err?.response), err?.response?.data?.messa);
        });
    }
  }

  return (
    <Fragment>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title={'Изменение пароля'}
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
                  <View style={{ paddingBottom: isPasswordValid ? 0 : 15 }}>
                    <FieldInput
                      field={{ name: 'Старый пароль', required: 0 }}
                      value={oldPassValue}
                      setValue={setOldPassValue}
                      maxLength={15}
                      secureInput={true}
                      validateFlag={isOldPasswordValid}
                      validateOnType={true}
                      setValidate={setIsOldPasswordValid}
                      validateFunc={validateOldPassword}
                    />
                    {!isOldPasswordValid ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        Пароль не может быть пустым
                      </Text>
                    ) : (
                      <></>
                    )}
                    {passwordErrors['current_password'] && (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        Неверный пароль
                      </Text>
                    )}
                    <FieldInput
                      field={{ name: 'Пароль', required: 0 }}
                      value={passValue}
                      setValue={setPassValue}
                      validateFlag={isPasswordValid}
                      setValidate={setIsPasswordValid}
                      maxLength={15}
                      secureInput={true}
                      validateOnType={true}
                      validateFunc={validatePassword}
                    />
                    {!isPasswordNotTheSame ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        Пароль должен отличаться от предыдущего
                      </Text>
                    ) : (
                      <></>
                    )}
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
                  <View style={{ paddingBottom: isPasswordConfValid ? 0 : 15 }}>
                    <FieldInput
                      field={{ name: 'Подтверждение пароля', required: 0 }}
                      value={confPassValue}
                      setValue={setConfPassValue}
                      validateFlag={isPasswordConfValid}
                      setValidate={setIsPasswordConfValid}
                      maxLength={15}
                      secureInput={true}
                      validateOnType={true}
                      validateFunc={validatePasswordConfirm}
                    />
                    {!isPasswordConfValid ? (
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
          <TouchableOpacity
            style={styles.nextButtonWrapper}
            onPress={function confirmHandler() {
              onConfirm();
            }}
          >
            <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Изменить пароль</Text>
          </TouchableOpacity>
        </HeaderBar>
      </SafeAreaView>
    </Fragment>
  );
};

export default EditPasswordScreen;
