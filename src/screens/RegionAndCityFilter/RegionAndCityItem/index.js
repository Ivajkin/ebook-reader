import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import {
  addChosenCity,
  addChosenRegion,
  deleteChosenCity,
  deleteChosenRegion,
} from '../../../redux/App/actions/regionAndCityActions';
import { icons } from '../../../сonstants';
import styles from './styles';
const RegionAndCityItem = props => {
  let item = props.item;
  let type = props.type;
  const defineIsChecked = () => {
    let defaultChecked = false;
    if (type === 'region') {
      let foundRegion = props.regionsChosen.find(el => el.title === item.title);
      if (foundRegion !== undefined) {
        defaultChecked = true;
      }
    } else {
      let foundCity = props.citiesChosen.find(el => el.id === item.id);
      if (foundCity !== undefined) {
        defaultChecked = true;
      }
      if (item.hasOwnProperty('region')) {
        let region = item.region;
        let foundChosenRegion = props.regionsChosen.find(regionChosen => regionChosen.title === region);
        if (foundChosenRegion !== undefined) {
          defaultChecked = true;
        }
      }
    }
    return defaultChecked;
  };

  const onCheckBoxPressed = () => {
    let newChecked = !defineIsChecked();

    if (type === 'region') {
      if (newChecked) {
        props.addRegionToChosen(item);
      } else {
        props.deleteRegionFromChosen(item);
      }
    } else {
      if (newChecked) {
        props.addCityToChosen(item);
      } else {
        props.deleteCityFromChosen(item);
      }
    }
    setIsChecked(newChecked);
  };
  const [isChecked, setIsChecked] = useState(defineIsChecked());
  return (
    <TouchableOpacity
      onPress={() => onCheckBoxPressed()}
      style={[styles.itemWrapper, type === 'city' ? styles.cityWrapper : null]}
    >
      <CheckBox
        containerStyle={styles.container}
        checkedIcon={<Image style={styles.iconStyle} source={icons.checkboxTrue} />}
        uncheckedIcon={<Image style={styles.iconStyle} source={icons.checkboxFalse} />}
        checked={defineIsChecked()}
        onPress={() => onCheckBoxPressed()}
      />
      <View style={styles.checkBoxLabelInner}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
      {/* {type === 'region' && (
        <TouchableOpacity onPress={props.onPressArrow} style={styles.arrowIconView}>
          <Image source={icons.arrowDown} style={styles.arrowIcon} />
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  return {
    regionsChosen: state.regions.regionsChosen,
    citiesChosen: state.regions.citiesChosen,
  };
};
const mapDispatchToProps = {
  addRegionToChosen: addChosenRegion,
  deleteRegionFromChosen: deleteChosenRegion,
  addCityToChosen: addChosenCity,
  deleteCityFromChosen: deleteChosenCity,
};
export default connect(mapStateToProps, mapDispatchToProps)(RegionAndCityItem);
