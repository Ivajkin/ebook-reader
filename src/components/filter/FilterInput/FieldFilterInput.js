//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Platform } from 'react-native';
//#endregion ----------

//#region plagins

//#endregion ----------

//#region components
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const FieldFilterInput = props => {
  //#region valuevles
  const field = props.field;
  const required = props.required;
  const value = props.value;
  const setValue = props.setValue;
  const [active, setActive] = useState(false);
  const validateFlag = props.validateFlag !== undefined ? props.validateFlag : true;
  const setValidate = props.setValidate ? props.setValidate : null;
  const fieldType = props.fieldType ? props.fieldType : 'default';
  const maxLength = props.maxLength ? props.maxLength : 200;
  const reg = props.reg ? props.reg : null;
  const validateOnType = props.validateOnType ? props.validateOnType : false;
  const upperCased = props.upperCased ? props.upperCased : false;
  const validateFunc = props.validateFunc ? props.validateFunc : null;
  const multiline = props.multiline ? props.multiline : false;
  const textAlignVertical = props.textAlignVertical ? props.textAlignVertical : 'auto';
  const height = props.height ? props.height : 50;

  const [localValue, setLocalValue] = useState('');
  /**
   * modal functions
   */

  function onType(text) {
    let localText = text;
    if (reg) {
      localText = text.replace(reg, '');
    }
    if (validateOnType) {
      validateFunc(localText);
    }
    setValue(localText);
  }

  useEffect(() => {
    setLocalValue(value);
    //console.log('el1', value);
    // if (value === '') {
    //   console.log('el', value);
    // }

  }, [value]);

  return (
    <>
      {field ? (
        <View style={[styles.inputInner, { borderColor: validateFlag ? COLORS.gray : COLORS.red }]}>
          {active || localValue ? (
            <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>
              {field + (required ? ' *' : '')}
            </Text>
          ) : (
            <></>
          )}
          <TextInput
            autoCapitalize={upperCased ? 'characters' : 'none'}
            style={[
              theme.FONTS.body_SF_R_15,
              styles.input,
              {
                paddingTop:
                  active || localValue
                    ? Platform.OS === 'ios'
                      ? height > 50
                        ? 15
                        : 5
                      : 18
                    : Platform.OS === 'ios'
                    ? 0
                    : 10,
                height: height,
              },
            ]}
            placeholderTextColor={COLORS.darkGray}
            keyboardType={fieldType}
            placeholder={!active ? field + (required ? ' *' : '') : null}
            maxLength={maxLength}
            onFocus={() => (setActive(true) && setValidate ? setValidate(true) : '')}
            onBlur={() => {
              setActive(false);
              onType(localValue);
            }}
            onChangeText={text => setLocalValue(text)}
            value={localValue}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default FieldFilterInput;
