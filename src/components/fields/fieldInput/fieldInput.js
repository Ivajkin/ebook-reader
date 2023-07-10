//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
//#endregion ----------

//#region plagins

//#endregion ----------

//#region components
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const FieldInput = React.forwardRef((props, ref) => {
  //#region valuevles
  //const defaultValue = props.defaultValue;
  const field = props.field;
  const value = props.value;
  const setValue = props.setValue;
  const [active, setActive] = useState(false);
  const validateFlag = props.validateFlag !== undefined ? props.validateFlag : true;
  const setValidate = props.setValidate ? props.setValidate : null;
  const fieldType = props.fieldType ? props.fieldType : 'default';
  const maxLength = props.maxLength ? props.maxLength : 200;
  const reg = props.reg ? props.reg : null;
  const secureInput = props.secureInput ? props.secureInput : false;
  const validateOnType = props.validateOnType ? props.validateOnType : false;
  const upperCased = props.upperCased ? props.upperCased : false;
  const validateFunc = props.validateFunc ? props.validateFunc : null;
  const [secureFlag, changeSecureFlag] = useState(true);
  const multiline = props.multiline ? props.multiline : false;
  const textAlignVertical = props.textAlignVertical ? props.textAlignVertical : 'auto';
  //const height = props.height ? props.height : 50;

  // const [localValue, setLocalValue] = useState(value);
  /**
   * modal functions
   */

  // console.log(
  //   '#A&D3',
  //   !active ? field?.name + (field?.required === 2 || props?.required ? ' *' : '') : null,
  //   typeof value
  // );
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

  return (
    <View>
      {field ? (
        <View
          style={[
            styles.inputInnerAllPlatforms,
            !props.multiline && styles.inputInnerSingleLine,
            {
              borderColor: validateFlag ? COLORS.gray : COLORS.red,
              backgroundColor: validateFlag ? COLORS.primary : COLORS.ping,
              //minHeight: props?.height - 30 ?? 25,
              //maxHeight: !active && !value ? 55 : '100%',
            },
          ]}
        >
          {Platform.OS === 'ios' ? (
            <View style={[styles.leftBlockIOS, !multiline && styles.leftBlockSingleLine]}>
              {active || value ? (
                <View style={styles.textViewIOS}>
                  <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>
                    {field?.name + (field?.required === 2 || props?.required ? ' *' : '')}
                  </Text>
                </View>
              ) : (
                <></>
              )}

              {/*<TextInput*/}
              {/*  placeholder={'ekdm'}*/}
              {/*/>*/}
              <TextInput
                //ref={ref}
                spellCheck={false}
                autoCapitalize={upperCased ? 'characters' : 'none'}
                style={[
                  theme.FONTS.body_SF_R_15,
                  styles.inputIOS,
                  { height: props?.height ? props?.height - 20: 25,}
                  // {
                  //   height: !(active || value) ? (props?.height ? props?.height : '100%') : 25,
                  //   textAlignVertical: 'center',
                  //   borderWidth: 1,
                  // },
                ]}
                placeholderTextColor={COLORS.darkGray}
                keyboardType={fieldType}
                placeholder={
                  !active ? field?.name + (field?.required === 2 || props?.required ? ' *' : '') : null
                }
                maxLength={maxLength}
                onFocus={() => (setActive(true) && setValidate ? setValidate(true) : '')}
                onBlur={() => setActive(false)}
                onChangeText={text => {
                  if (props?.fieldType === 'numeric') {
                    return onType(text.replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
                  } else {
                    return onType(text);
                  }
                }}
                value={value}
                secureTextEntry={secureInput ? secureFlag : false}
                multiline={props?.multiline ?? false}
                textAlignVertical={textAlignVertical}
              />
            </View>
          ) : (
            <View
              style={[
                styles.leftBlockAndroid,
                !multiline && styles.leftBlockSingleLine,
                { justifyContent: textAlignVertical === 'top' ? 'top' : 'center' },
              ]}
            >
              {active || value ? (
                <Text style={[styles.inputTitleAndroid, theme.FONTS.body_SF_R_11]}>
                  {field?.name + (field?.required === 2 || props?.required ? ' *' : '')}
                </Text>
              ) : (
                <></>
              )}

              {/*<TextInput*/}
              {/*  ref={ref}*/}
              {/*  autoCapitalize={upperCased ? 'characters' : 'none'}*/}
              {/*  style={[styles.inputAndroid, theme.FONTS.body_SF_R_15]} //, styles.input*/}
              {/*  //placeholderTextColor={COLORS.darkGray}*/}
              {/*  keyboardType={fieldType}*/}
              {/*  placeholder={*/}
              {/*    !active ? field?.name + (field?.required === 2 || props?.required ? ' *' : '') : null*/}
              {/*  }*/}
              {/*  maxLength={maxLength}*/}
              {/*  onFocus={() => (setActive(true) && setValidate ? setValidate(true) : '')}*/}
              {/*  onBlur={() => setActive(false)}*/}
              {/*  onChangeText={text => {*/}
              {/*    if (props?.fieldType === 'numeric') {*/}
              {/*      return onType(text.replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' '));*/}
              {/*    } else {*/}
              {/*      return onType(text);*/}
              {/*    }*/}
              {/*  }}*/}
              {/*  value={value}*/}
              {/*  secureTextEntry={secureInput ? secureFlag : false}*/}
              {/*  multiline={multiline}*/}
              {/*  //textAlignVertical={textAlignVertical}*/}
              {/*/>*/}
            </View>
          )}

          {secureInput ? (
            <TouchableOpacity
              onPress={() => {
                changeSecureFlag(!secureFlag);
              }}
              style={styles.secureInput}
            >
              {secureFlag ? (
                <Image source={icons.eyeClose} style={{ width: 20, height: 18 }} />
              ) : (
                <Image source={icons.eyeOpen} style={{ width: 19, height: 10 }} />
              )}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
});

export default FieldInput;
