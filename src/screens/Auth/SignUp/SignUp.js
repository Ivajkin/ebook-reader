//#region react components
import React, { Fragment, useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
//#endregion ----------

//#region plugins
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
//#endregion ----------

//#region components
import { auth } from '../../../requests';
import { setLoginToken } from '../../../redux/App/actions/authActions';
import { FieldCheckSwitch, FieldInput, FieldModal, PhonInput } from '../../../components/fields';
//#endregion ----------

//#region constants
import { theme, COLORS, loader } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
import { setUserInfo } from '../../../redux/App/actions/mainActions';
import { ModalChoose } from '../../../components/modal';
//#endregion ----------

import AnimatedLoader from 'react-native-animated-loader';
const SignUpScreen = ({ navigation }) => {
  const [loaderVisible, setLoaderVisible] = useState(false);
  //#region valuebles
  const dispatch = useDispatch();

  //#region validate
  const [validateNameFlag, changeValidateNameFlag] = useState(true);
  const [validatePassFlag, changeValidatePassFlag] = useState(true);
  const [validateConfPassFlag, changeValidateConfPassFlag] = useState(true);
  const [validatePhoneFlag, changeValidatePhoneFlag] = useState(true);
  const [isValidateUserRole, setIsValidateUserRole] = useState(true);

  const [isPasswordLengthCorrect, setIsPasswordLengthCorrect] = useState(true);
  const [passwordSymbolsCorrect, setPasswordSymbolsCorrect] = useState(true);
  const [passwordHasNumber, setPasswordHasNumber] = useState(true);
  const [passwordHasLetter, setPasswordHasLetter] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordConfValid, setIsPasswordConfValid] = useState(true);
  const [isDealerNameValid, setIsDealerNameValid] = useState(true);
  const [isOccupationChosen, setIsOcupationChosen] = useState(true);
  const [phoneError, setPhoneError] = useState({ hasError: false, text: '' });
  const [companyError, setCompanyError] = useState({ hasError: false, text: '' });
  //#endregion ----------

  //#region pass error message
  const [passErrorLengthFlag, changePassErrorLengthFlag] = useState(false);
  const [passErrorNumber, changePassErrorNumber] = useState(false);
  const [passErrorSymbol, changePassErrorSumbol] = useState(false);
  const [passErrorConf, changePassErrorConf] = useState(false);
  //#endregion ----------

  const [contryFlag, changeContryFlag] = useState(false);
  //#endregion ----------

  //#region data
  const [nameValue, setNameValue] = useState(null);
  const [dealerName, setDealerName] = useState(null);
  const [isSoloWork, setIsSoloWork] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [phoneValue, setPhoneValue] = useState(null);
  const [passValue, setPassValue] = useState(null);
  const [confPassValue, setConfPassValue] = useState(null);
  const [occupation, setOccupation] = useState({ forSend: [], forInput: [] });

  //#region modal window
  const [isOpenChooseUserRole, setIsOpenChooseUserRole] = useState(false);

  let companyFieldRef = useRef(null);

  //#endregion ----------
  //#endregion ----------

  //#region functions

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

  useEffect(() => {
    if (!isSoloWork && occupation.forSend[0] === 'recruitment_specialist') {
      try {
        companyFieldRef.current.focus();
      } catch (e) {
        console.log('solo work error', e);
      }
    }
  }, [isSoloWork, occupation.forSend[0]]);

  const registerUserTap = () => {
    let validate1 = validateName(nameValue);
    let validate2 = validatePhone(phoneValue);
    let validate3 = validatePassword(passValue);
    let validate4 = validateConfPass(confPassValue);
    let validate5 = validateUserRole(occupation);
    if (validate1 && validate2 && validate3 && validate4 && validate5) {
      setLoaderVisible(true);
      auth
        .registerUser(
          nameValue,
          phoneValue,
          passValue,
          confPassValue,
          occupation.forSend[0],
          dealerName,
          companyName,
          +isSoloWork
        )
        .then(res => {
          setLoaderVisible(false);
          if (res) {
            saveToken(res.data.data.token);
            saveUserInfo(res.data.data.user);
            dispatch(setLoginToken(res.data.data.token));
            //navigation.navigate('ModerationWaitScreen');

            if (res.data.data.user.roles[0].name === 'dss_group_specialist') {
              navigation.navigate('ModerationWaitScreen');
            } else {
              auth
                .loginUser(phoneValue, passValue)
                .then(res2 => {
                  if (res2) {
                    auth
                      .getUserInfo(res2.data.data.access_token)
                      .then(response => {
                        const data = response.data.data;
                        if (data.status === 'active' || data.status === 'moderating') {
                          navigation.navigate('AllReportsScreen', {
                            userId: data?.id || null,
                          });
                          return;
                        } else if (data.status === 'blocked') {
                          navigation.navigate('BlockScreen');
                          return;
                        }
                        //navigation.navigate('ModerationWaitScreen');
                      })
                      .catch(error => {
                        setLoaderVisible(false);
                        console.log('error  get user info', error);
                      });
                  }
                })
                .catch(err => {
                  setLoaderVisible(false);
                  console.log('err login', err.response.data);
                });
            }
          }
        })
        .catch(err => {
          console.log('register user error', err.response);
          setLoaderVisible(false);
          if (err?.response?.data?.errors?.phone) {
            setPhoneError({
              hasError: true,
              text: err?.response?.data?.errors?.phone.join(),
            });
          } else {
            setPhoneError({
              hasError: false,
              text: '',
            });
          }
          if (err?.response?.data?.errors?.company_name) {
            setCompanyError({
              hasError: true,
              text: err?.response?.data?.errors?.company_name.join(),
            });
          } else {
            setCompanyError({
              hasError: false,
              text: '',
            });
          }
          // try {
          //   navigation.navigate('ErrorMessageScreen', {
          //     message: err.response.data.errors[Object.keys(err.response.data.errors)[0]][0],
          //   });
          // } catch {
          //   navigation.navigate('ErrorMessageScreen', {
          //     message: 'Ошибка регистрации\nПожалуйста, повторите регистрацию позже.',
          //   });
          // }
        })
        .finally(() => {
          setLoaderVisible(false);
        });
    }
  };

  function validateUserRole(userRoleValue = { forSend: [], forInput: [] }) {
    setIsDealerNameValid(true);
    if (userRoleValue.forSend.length) {
      setIsValidateUserRole(true);
      if (userRoleValue.forSend[0] === 'dealer' && (dealerName === null || dealerName === '')) {
        //setIsValidateUserRole(false);
        setIsDealerNameValid(false);
        return false;
      }
      return true;
    } else {
      //setOccupationError()
      setIsValidateUserRole(false);
      return false;
    }
  }

  function validatePhone(text) {
    setPhoneError({ hasError: false, text: '' });
    if (text && text.length === 12) {
      changeValidatePhoneFlag(true);
      return true;
    } else {
      changeValidatePhoneFlag(false);
      return false;
    }
  }

  function validateName(text) {
    if (text) {
      if (text.length < 2) {
        changeValidateNameFlag(false);
        return false;
      } else {
        changeValidateNameFlag(true);
        return true;
      }
    } else {
      changeValidateNameFlag(false);
      return false;
    }
  }

  function keyboardHideListener() {
    changeContryFlag(false);
  }

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
      let isValid = isCorrectLength && isCorrectSymbol && hasNumber;
      changeValidatePassFlag(isValid);
      return isValid;
    }
    return false;
  }
  function validatePasswordConfirm(text) {
    setIsPasswordConfValid(text === passValue);
    return text === passValue;
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
  //#endregion ----------

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', keyboardHideListener);
  }, []);

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 1 }}>
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.statusBarLine} />
        <Text style={[theme.FONTS.h3SF, styles.title]}>Регистрация</Text>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          style={styles.scrollInner}
          contentContainerStyle={styles.scrollContent}
        >
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <KeyboardAvoidingView
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              keyboardVerticalOffset={50}
              enabled={Platform.OS === 'ios' ? true : false}
              behavior="padding"
            >
              <View style={styles.inputWrapper}>
                <Text style={[theme.FONTS.h1, styles.text]}>
                  {'Зарегистрируйтесь, чтобы иметь доступ ко всем услугам приложения\nDSS community'}
                </Text>
                <View>
                  <FieldInput
                    field={{ name: 'Имя', required: 0 }}
                    value={nameValue}
                    setValue={setNameValue}
                    validateFlag={validateNameFlag}
                    setValidate={changeValidateNameFlag}
                    maxLength={50}
                    //multiline={true}
                  />
                  {!validateNameFlag ? (
                    <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                      Введите данные в поле (2-50 символов)
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
                <PhonInput
                  flag={contryFlag}
                  changeFlag={changeContryFlag}
                  value={phoneValue}
                  setValue={setPhoneValue}
                  validatePhoneFlag={validatePhoneFlag}
                  validatePhone={validatePhone}
                  phoneError={phoneError}
                />
                {!validatePhoneFlag ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                    Некорректный номер телефона
                  </Text>
                ) : (
                  <></>
                )}

                {phoneError.hasError ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>{phoneError.text}</Text>
                ) : (
                  <></>
                )}
                <View
                  style={{ paddingBottom: validatePassFlag ? (Platform.OS === 'android' ? 5 : 0) : 15 }}
                >
                  <FieldInput
                    field={{ name: 'Пароль', required: 0 }}
                    value={passValue}
                    setValue={setPassValue}
                    validateFlag={validatePassFlag}
                    setValidate={value => {
                      console.log('#A1', value);
                      changeValidatePassFlag(value);
                    }}
                    maxLength={15}
                    secureInput={true}
                    //validateOnType={true}
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
                <View>
                  <FieldInput
                    field={{ name: 'Подтверждение пароля', required: 0 }}
                    value={confPassValue}
                    setValue={setConfPassValue}
                    validateFlag={isPasswordConfValid}
                    setValidate={setIsPasswordConfValid}
                    maxLength={15}
                    secureInput={true}
                    validateOnType={false}
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
                <View>
                  <FieldModal
                    field={{ name: 'Род деятельности' }}
                    value={occupation}
                    showModal={setIsOpenChooseUserRole}
                    validateFlag={isValidateUserRole}
                    setValidate={setIsValidateUserRole}
                  />
                  {!isValidateUserRole ? (
                    <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                      Выберите род деятельности
                    </Text>
                  ) : (
                    <></>
                  )}
                </View>
                {occupation.forSend[0] === 'dealer' && (
                  <View>
                    <FieldInput
                      field={{ name: 'Название диллера', required: 0 }}
                      value={dealerName}
                      setValue={setDealerName}
                      validateFlag={isDealerNameValid}
                      setValidate={setIsDealerNameValid}
                    />
                    {!isDealerNameValid ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        Введите название диллера
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                )}
                {occupation.forSend[0] === 'recruitment_specialist' && (
                  <View>
                    <View style={{ paddingTop: 4, paddingBottom: 2 }}>
                      <FieldCheckSwitch
                        field={{ name: 'Работаю один', required: 0 }}
                        value={isSoloWork}
                        setValue={setIsSoloWork}
                        type={'switch'}
                      />
                    </View>
                    {!isSoloWork && (
                      <FieldInput
                        field={{ name: 'Название компании', required: 0 }}
                        value={companyName}
                        setValue={setCompanyName}
                        ref={companyFieldRef}
                      />
                    )}
                    {!isSoloWork && companyError.hasError ? (
                      <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                        {companyError.text}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    registerUserTap();
                  }}
                >
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
            </KeyboardAvoidingView>
          </KeyboardAwareScrollView>
        </ScrollView>
        <ModalChoose
          title={'Выберите свой род деятельности'}
          isOpen={isOpenChooseUserRole}
          closeModal={setIsOpenChooseUserRole}
          setValue={setOccupation}
          data={[
            {
              id: 'individual',
              label: 'Частное лицо',
              value: 'individual',
              borderColor: '#C8C8C8',
              borderColorActive: '#FF3B30',
              borderWidth: 2,
              borderWidthActive: 7,
            },
            {
              id: 'recruitment_specialist',
              label: 'Специалист по подбору',
              value: 'recruitment_specialist',
              borderColor: '#C8C8C8',
              borderColorActive: '#FF3B30',
              borderWidth: 2,
              borderWidthActive: 7,
            },
            {
              id: 'dealer',
              label: 'Дилер',
              value: 'dealer',
              borderColor: '#C8C8C8',
              borderColorActive: '#FF3B30',
              borderWidth: 2,
              borderWidthActive: 7,
            },
            {
              id: 'car_sale_specialist',
              label: 'Специалист по продаже авто',
              value: 'car_sale_specialist',
              borderColor: '#C8C8C8',
              borderColorActive: '#FF3B30',
              borderWidth: 2,
              borderWidthActive: 7,
            },
            {
              id: 'dss_group_specialist',
              label: 'Специалист DSS Group',
              value: 'dss_group_specialist',
              borderColor: '#C8C8C8',
              borderColorActive: '#FF3B30',
              borderWidth: 2,
              borderWidthActive: 7,
            },
          ]}
          type={'radiobuttonOneButton'}
          current={occupation}
        />
      </SafeAreaView>
    </Fragment>
  );
};

export default SignUpScreen;
