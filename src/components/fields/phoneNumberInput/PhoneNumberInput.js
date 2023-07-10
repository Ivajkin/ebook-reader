//#region react
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//#endregion ----------

//#region plagins
import TextInputMask from 'react-native-text-input-mask';
//#endregion ----------

//#region constants
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region utils
import { useEffectAsync } from '../../../utils';
//#endregion ----------

//#region functions
import { phoneNumber } from '../../../requests';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

//#region other
import { cods } from './countryCod';
//#endregion ----------

const PhonInput = props => {
  //#region valuevles
  const [country, setCountry] = useState(Object.keys(cods));
  const [codsLocal, setCodsLocal] = useState(cods);
  const [countryFilter, changeCountryFilter] = useState(country);
  const [acitveFlag, changeActiveFlag] = useState(false);
  const refPhone = useRef();
  const [localPhone, setLocalPhone] = useState(null);
  const validatePhone = props.validatePhone;
  const validatePhoneFlag = props.validatePhoneFlag;
  const [isValid, setIsValid] = useState(true);
  //#endregion ----------

  function filterPhone(text) {
    setLocalPhone(text);
    if (text !== '') {
      props.changeFlag(true);
    }
    let formatedPhone = text.replace(/[-\s]/g, '');
    props.setValue(formatedPhone);
  }

  /**
   * async function for get country list
   */

  async function getCountryListLocal() {
    let result = await phoneNumber
      .getCountryList()
      .then(data => {
        return [true, data.data.data];
      })
      .catch(err => {
        console.log('get country list local err', err);
        return [false];
      });
    return result;
  }
  useEffectAsync(async () => {
    let result = await getCountryListLocal();
    if (result[0]) {
      let temporary = {};
      result[1].map((item, index) => {
        temporary[item.code] = item.country;
      });
      setCountry(Object.keys(temporary));
      setCodsLocal(temporary);
    }
  }, []);
  useEffect(() => {
    setIsValid(props.validatePhoneFlag && !props.phoneError?.hasError);
  }, [props.validatePhoneFlag, props.phoneError]);

  useEffect(() => {
    if (props.value === null) {
      setLocalPhone('7');
      setIsValid(true);

    }
  }, [props.value]);

  return (
    <View>
      <View
        style={[
          styles.inputInner,
          {
            backgroundColor: isValid ? COLORS.primary : COLORS.ping,
            borderColor: isValid ? COLORS.gray : COLORS.red,
          },
        ]}
      >
        {acitveFlag || props.value ? (
          <Text
            style={[
              theme.FONTS.body_SF_R_11,
              styles.inputTitle,
              { marginLeft: Platform.OS === 'ios' ? 0 : 5 },
              { color: validatePhoneFlag ? COLORS.darkGray : COLORS.transparentRed },
            ]}
          >
            Телефон
          </Text>
        ) : (
          <></>
        )}
        {/* color: '#858585' */}
        <View style={styles.container}>
          <TextInputMask
            ref={refPhone}
            placeholder={!acitveFlag ? 'Телефон' : null}
            placeholderTextColor={validatePhoneFlag ? COLORS.darkGray : COLORS.transparentRed}
            mask={'+[0] [000] [000]-[00]-[00000]'}
            onFocus={() => {
              changeActiveFlag(!acitveFlag);
              props.changeFlag(true);
            }}
            onBlur={() => changeActiveFlag(!acitveFlag)}
            defaultValue={'7'}
            onChangeText={text => filterPhone(text)}
            value={localPhone}
            style={[
              theme.FONTS.body_SF_R_15,
              styles.input,
              {
                borderColor: validatePhoneFlag ? COLORS.gray : COLORS.red,
                paddingTop:
                  acitveFlag || props.value
                    ? Platform.OS === 'ios'
                      ? 8
                      : 18
                    : Platform.OS === 'ios'
                    ? 0
                    : 10,
              },
            ]}
            keyboardType="phone-pad"
            onEndEditing={event => validatePhone(event.nativeEvent.text.replace(/[-\s]/g, ''))}
          />
        </View>
        {props.flag && (
          <ScrollView style={styles.countryInner} keyboardShouldPersistTaps={'handled'}>
            {country
              .filter(i => i.includes(props.value))
              .map((item, i) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  key={i}
                  onPress={() => {
                    props.setValue(item);
                    props.changeFlag(false);
                    filterPhone(item);
                    refPhone.current.focus();
                  }}
                >
                  <Text>{codsLocal[item]}</Text>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default PhonInput;
