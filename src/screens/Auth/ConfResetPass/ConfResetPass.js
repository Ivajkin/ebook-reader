//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
//#endregion ----------

//#region components
import { auth } from '../../../requests';
import { icons, theme } from '../../../сonstants';
import { FieldInput } from '../../../components/fields';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const ConfResetPassScreen = ({ navigation, route }) => {
  const params = route.params;
  const phone = params.phone;
  const [code, setCode] = useState(params.code);
  const timerValue = 116;
  const [timerCount, setTimer] = useState(timerValue);

  const [codeRepeat, setCodeRepeat] = useState(false);
  const [validatePassFlag, changeValidatePassFlag] = useState(true);
  const [passValue, setPassValue] = useState('');

  /**
   * function for new code request
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
        console.log('getCodeLocal error, ConfResetPass', err);
        return [false];
      });
    return result;
  }

  /**
   * function for code repeat process
   */

  function codeRepeatProcessing() {
    if (timerCount == timerValue) {
      setCodeRepeat(false);
      let result = getCodeLocal(phone);
      result[0] && setCode(result[1]);
    }
  }

  /**
   * async function for check code
   */
  async function validateCodeLocal(phone, code) {
    let result = await auth
      .validateCode(phone, code)
      .then(data => {
        if (data) {
          if (data.data.status === 'success') {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      })
      .catch(err => {
        console.log(err.response);
        return false;
      });
    return result;
  }

  async function send() {
    let result = await validateCodeLocal(phone, passValue);
    if (result) {
      changeValidatePassFlag(true);
      navigation.navigate('NewPassScreen', { phone: phone, code: code });
    } else {
      changeValidatePassFlag(false);
    }
  }

  /**
   * useeffect for start timer
   */

  useEffect(() => {
    if (timerCount == 0) {
      setTimer(timerValue);
      setCodeRepeat(true);
    }
  }, [timerCount]);

  const getTimeLeftStr = () => {
    let mins = String(Math.floor(timerCount / 60));
    if (mins.length < 2) {
      mins = '0' + mins;
    }
    let secs = String(Math.floor(timerCount % 60));
    if (secs.length < 2) {
      secs = '0' + secs;
    }
    return mins + ':' + secs;
  };
  /**
   * useeffect for end counter
   */

  useEffect(() => {
    if (!codeRepeat) {
      let interval = setInterval(() => {
        setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval);
          return lastTimerCount - 1;
        });
      }, 1000); //each count lasts for a second
      //cleanup the interval on complete
      return () => clearInterval(interval);
    }
  }, [codeRepeat]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.statusBarLine} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowLeftInner} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.arrowLeft} />
        </TouchableOpacity>
        <Text style={[theme.FONTS.h3SF, styles.title]}>Подтвердите сброс пароля</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        keyboardVerticalOffset={10}
        enabled={Platform.OS === 'ios' ? true : false}
        behavior="padding"
      >
        <View
          //onPress={() => Keyboard.dismiss()}
          style={{ height: '100%', paddingBottom: Platform.OS !== 'ios' ? 50 : 20 }}
        >
          <View style={styles.container}>
            <View>
              <Text style={[theme.FONTS.h1, styles.text]}>Введите код который пришел Вам по SMS</Text>
              <View style={{ paddingBottom: validatePassFlag ? 0 : 15 }}>
                <FieldInput
                  field={{ name: 'Код', required: 0 }}
                  value={passValue}
                  setValue={setPassValue}
                  validateFlag={validatePassFlag}
                  setValidate={changeValidatePassFlag}
                  maxLength={4}
                  secureInput={true}
                />
                {!validatePassFlag ? (
                  <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>Неверный код</Text>
                ) : (
                  <></>
                )}
              </View>

              <TouchableOpacity onPress={() => send()}>
                <Text style={[theme.FONTS.body_SF_M_15, styles.btn]}>Сбросить пароль</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => codeRepeatProcessing()}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.link]}>
                  {codeRepeat
                    ? 'Отправить еще раз пароль по SMS'
                    : 'Отправить повторно через ' + getTimeLeftStr()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
            style={styles.emptyFiller}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfResetPassScreen;
