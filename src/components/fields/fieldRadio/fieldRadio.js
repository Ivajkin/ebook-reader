//#region import libres

//#region react components
import React, { useState } from 'react';
import { Text, View } from 'react-native';

//#endregion

//#region plagins
import RadioGroup from 'react-native-radio-buttons-group';
//#endregion

//#region components
import FieldInput from '../fieldInput/fieldInput';
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const FieldRadio = props => {
  //#region valuebles
  const field = props.field;
  const radioData = props.radioData;
  const setRadioData = props.setRadioData;
  const commentValue = props.commentValue ? props.commentValue : null;
  const setCommentValue = props.setCommentValue ? props.setCommentValue : null;
  const commentFlag = props.commentFlag != 'undefined' ? props.commentFlag : false;
  const changeCommentFlag = props.changeCommentFlag != 'undefined' ? props.changeCommentFlag : null;
  //#endregion



  function setValue(value) {
    if (changeCommentFlag) {
      value.map(item => {
        if (item.value === 'bad' || item.value === 'yes') {
          if (item?.selected) {
            changeCommentFlag(true);
          } else {
            changeCommentFlag(false);
          }
        }
      });
    }
    setRadioData(value);
  }

  function onPressRadioButton(radioProps) {
    let curChecked = radioProps.find(but => but.checked);

    if (changeCommentFlag && curChecked !== undefined) {
      changeCommentFlag(curChecked.value === 'bad' || curChecked.value === 'yes');
      //   radioData.map(item => {
      //     console.log(item.value === 'bad' || item.value === 'yes');
      //     changeCommentFlag(item.value === 'bad' || item.value === 'yes');
      //     // if (item.value === 'bad' || item.value === 'yes') {
      //     //   changeCommentFlag(true);
      //     //   console.log('ASI', item);
      //     //   // if (item?.selected) {
      //     //   //   changeCommentFlag(true);
      //     //   // } else {
      //     //   //   changeCommentFlag(false);
      //     //   // }
      //     // }
      //   });
    }
    if (curChecked !== undefined) {
      setRadioData(prev => {
        let newData = prev.map(button => {
          return {
            ...button,
            checked: button.value === curChecked.value,
          };
        });
        return newData;
      });
    }
  }
  return (
    <>
      <View style={styles.radioInner}>
        <Text style={styles.radioText}>
          {field.name + (field.required === 2 ? ' **' : field.required === 1 ? ' *' : '')}
        </Text>
        <RadioGroup
          containerStyle={styles.radioGroupContainer}
          radioButtons={radioData}
          layout={'row'}
          onPress={onPressRadioButton}
        />
      </View>
      {commentFlag && (
        <FieldInput
          field={{ name: 'Комментарий', require: 2 }}
          value={commentValue}
          setValue={setCommentValue}
          multiline={true}
        />
      )}
    </>
  );
};

export default FieldRadio;
