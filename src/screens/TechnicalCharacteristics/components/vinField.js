//#region react
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
//#endregion -----------

//#region components
import { theme, COLORS } from '../../../сonstants';
//#endregion

const VinField = props => {
  const { vinValue, validateVinFlag, field, vinNonStandart, setVinValue, changeValidateVinFlag } = props;
  const [activeVinFlag, changeActiveVinFlag] = useState(false);
  const [numVinSymbols, setNumVinSymbols] = useState(0);

  /**
   * validate vin
   */
  function validateVin(text) {
    if (text) {
      if (!vinNonStandart) {
        if (text.match(/^[a-np-zA-NP-Z0-9]{17}$/gm)) {
          changeValidateVinFlag(true);
        } else {
          changeValidateVinFlag(false);
        }
      } else {
        if (text.length > 1 && /^[a-np-zA-NP-Zа-нп-яёА-НП-ЯЁ0-9]*$/.test(text)) {
          changeValidateVinFlag(true);
        } else {
          changeValidateVinFlag(false);
        }
      }
    }
  }

  /**
   * useeffect for vin validate rerun
   */
  useEffect(() => {
    validateVin(vinValue);
  }, [vinNonStandart]);

  return (
    <View
      style={[
        styles.inputVinInner,
        {
          borderColor: validateVinFlag ? COLORS.gray : COLORS.red,
          backgroundColor: validateVinFlag ? COLORS.primary : COLORS.ping,
        },
      ]}
    >
      {activeVinFlag || vinValue ? (
        <Text
          style={[
            theme.FONTS.body_SF_R_11,
            styles.inputTitle,
            // {
            //   color: validateVinFlag ? COLORS.darkGray : COLORS.transparentRed,
            // },
          ]}
        >
          {field?.name + (field?.required == 2 ? '*' : field?.required == 1 ? '**' : '')}
        </Text>
      ) : (
        <></>
      )}
      <TextInput
        style={[
          theme.FONTS.body_SF_R_15,
          styles.inputVin,
          {
            //color: validateVinFlag ? COLORS.black : COLORS.red,
            color: COLORS.black,
            paddingBottom: 5,
            paddingTop:
              activeVinFlag || vinValue
                ? Platform.OS === 'ios'
                  ? 8
                  : 18
                : Platform.OS === 'ios'
                ? 0
                : 10,
          },
        ]}
        placeholderTextColor={validateVinFlag ? COLORS.darkGray : COLORS.transparentRed}
        placeholder={
          !activeVinFlag
            ? field?.name + (field?.required == 2 ? '*' : field?.required == 1 ? '**' : '')
            : null
        }
        //maxLength={17}
        onFocus={() => (changeActiveVinFlag(true) && validateVinFlag ? setValidateVinFlag(true) : '')}
        onBlur={() => changeActiveVinFlag(false)}
        onChangeText={text => {
          if (!text.length || (text[text.length - 1] !== 'O' && text[text.length - 1] !== 'О')) {
            setVinValue(text);
            setNumVinSymbols(text.length);
            //validateVin(text);
          }
        }}
        autoCapitalize="characters"
        value={vinValue}
        onEndEditing={event => validateVin(event.nativeEvent.text)}
      />
      <Text style={[theme.FONTS.body_R_R_14, styles.numVinText]}>{numVinSymbols + '/17'}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  inputVinInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
  },
  inputVin: {
    width: '90%',
    height: 50,
  },
  numVinText: {
    color: COLORS.darkGray,
  },
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: 15,
    color: COLORS.darkGray,
    //paddingLeft: 5,
    paddingRight: 5,
  },
});

export default VinField;
