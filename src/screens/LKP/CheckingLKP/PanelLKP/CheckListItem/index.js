import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image, CheckBox } from 'react-native-elements';
import { icons } from '../../../../../сonstants';
import styles from './styles';
const CheckListItem = props => {
  let item = props.item;
  return (
    <View style={[styles.itemWrapper, item.type === 'city' ? styles.cityWrapper : null]}>
      <CheckBox
        containerStyle={styles.container}
        checkedIcon={<Image style={styles.iconStyle} source={icons.checkboxTrue} />}
        uncheckedIcon={<Image style={styles.iconStyle} source={icons.checkboxFalse} />}
        checked={item.isChecked}
        onPress={() => {
          let newChecked = false;
          let newCheckList = props.checkList.map((el, ind, arr) => {
            if (el.id === item.id) {
              newChecked = !el.isChecked;
              return {
                ...el,
                isChecked: !el.isChecked,
              };
            }

            return el;
          });

          if (item.id === '0' && newChecked) {
            newCheckList[1].isChecked = false;
          }
          if (item.id === '1' && newChecked) {
            newCheckList[0].isChecked = false;
          }
          props.setCheckList(newCheckList);
        }}
        //onPress={() => setIsChecked(!isChecked)}
      />
      <TouchableOpacity style={styles.checkBoxLabelInner}>
        <Text style={styles.text}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckListItem;
