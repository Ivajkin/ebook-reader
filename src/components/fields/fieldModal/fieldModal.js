//#region react components
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';
//#endregion ----------

//#region plagins

//#endregion ----------

//#region components

//#endregion ----------

//#region constants
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const FieldModal = props => {
  //#region valuevles

  const field = props.field;
  const setFieldId = props.setFieldId ? props.setFieldId : null;
  const value = props.value;
  const showModal = props.showModal ? props.showModal : () => {};
  const validateFlag = typeof props.validateFlag !== 'undefined' ? props.validateFlag : true;
  const setValidate = props.setValidate ? props.setValidate : null;

  //#endregion ----------s
  /**
   * modal functions
   */
  function press() {
    showModal(true);
    setFieldId && setFieldId(field.column_name);
    setValidate && setValidate(true);
  }

  return (
    <>
      {field ? (
        <TouchableOpacity
          style={[
            styles.inputInner,
            {
              backgroundColor: validateFlag ? COLORS.primary : COLORS.ping,
              borderColor: validateFlag ? COLORS.gray : COLORS.red,
              paddingVertical: props.value?.forInput?.length > 0 ? 5 : 15,
            },
          ]}
          onPress={() => press()}
        >
          <View style={styles.leftView}>
            {props.value?.forInput?.length > 0 ? (
              <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>
                {field?.name + (field?.required === 2 || props?.required ? ' *' : '')}
              </Text>
            ) : (
              <></>
            )}
            <Text
              style={[
                theme.FONTS.body_SF_R_15,
                styles.inputText,
                { color: value?.forInput?.length > 0 ? COLORS.black : COLORS.darkGray },
              ]}
              numberOfLines={1}
            >
              {
                value.forInput.length > 0

                ? value.forInput.join('/')
                : field.name + (field.required === 2 ? ' *' : '')
              }
            </Text>
          </View>

          <View style={styles.rightView}>
            <Image
              source={icons.arrowRight}
              style={{
                width: 8,
                height: 15,
                //rotation: 90,
                //transform: [{ rotateY: '90deg' }],
              }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
};

export default FieldModal;
