//#region react components
import React from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
//#endregion ----------

//#region plagins

//#endregion ----------

//#region components

//#endregion ----------

//#region constants
import { icons, theme, COLORS } from '../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const FieldFilterModal = props => {
  //#region valuevles
  const field = props.field;
  const required = props.required;
  // const setFieldId = props.setFieldId ? props.setFieldId : null;
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
    // setFieldId && setFieldId(field.column_name);
    // setValidate && setValidate(true);
  }

  return (
    <>
      {field ? (
        <TouchableOpacity
          key={props.key}
          style={[styles.inputInner, { borderColor: validateFlag ? COLORS.gray : COLORS.red }]}
          onPress={() => press()}
        >
          <Text
            style={[
              theme.FONTS.body_SF_R_15,
              styles.inputText,
              { color: value?.forInput?.length > 0 ? COLORS.black : COLORS.darkGray },
            ]}
            numberOfLines={1}
          >
            {value?.forInput?.length
              ? value?.forInput.map((item, i) => (i >= value?.forInput.length - 1 ? item : `${item}, `))
              : field + (required ? ' *' : '')}
          </Text>
          <Image
            source={icons.arrowRight}
            style={{
              width: 8,
              height: 15,
              //rotation: 90,
              //transform: [{ rotateY: '90deg' }],
            }}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
};

export default FieldFilterModal;
