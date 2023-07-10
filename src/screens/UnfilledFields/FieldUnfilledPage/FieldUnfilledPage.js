//#region react
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
//#endregion -----------

//#region components
import { theme, COLORS, icons, FONTS, constants } from '../../../сonstants';
//#endregion

const FieldUnfilledPage = props => {
  const navigation = props.navigation ?? null;
  const name = props.name ?? '';
  const section = props.section ?? null;
  //const fields = props.fields ?? [];

  function goToPage() {
    if (constants.sectionOrderList[section]) {
      navigation.push(constants.sectionOrderList[section], {
        //unfilledFields: fields,
        goToUnfilled: true,
      });
    }
  }

  useEffect(() => {}, []);

  return (
    <TouchableOpacity style={styles.inputInner} onPress={goToPage}>
      <Text style={styles.inputTitle}>{name}</Text>

      <Image source={icons.arrowRight} style={styles.imageRight} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  inputInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.primary,
  },
  inputVin: {
    width: '90%',
    height: 50,
  },
  imageRight: {
    width: 10,
    height: 15,
    resizeMode: 'contain',
  },
  inputTitle: {
    ...FONTS.body_R_R_13,
    color: COLORS.darkGray,
  },
});

export default FieldUnfilledPage;
