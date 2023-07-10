import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image, CheckBox } from 'react-native-elements';
import { icons } from '../../../../сonstants';
import styles from './styles';
const CheckListItem = props => {
  let item = props.item;
  let isChecked = props.isChecked;
  return (
    <View style={[styles.itemWrapper, item.type === 'city' ? styles.cityWrapper : null]}>
      <CheckBox
        containerStyle={styles.container}
        checkedIcon={<Image style={styles.iconStyle} source={icons.checkboxTrue} />}
        uncheckedIcon={<Image style={styles.iconStyle} source={icons.checkboxFalse} />}
        checked={isChecked}
        //onPress={() => setIsChecked(!isChecked)}
      />
      <TouchableOpacity style={styles.checkBoxLabelInner}>
        <Text style={styles.text}>{item['name']}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckListItem;
