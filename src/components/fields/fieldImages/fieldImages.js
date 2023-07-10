//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';

//#endregion

//#region plagins

//#endregion

//#region components
import ImageComponent from './ImageComponent';
//#endregion

//#region constants
import { COLORS, icons, theme } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const FieldImages = props => {
  //#region
  const value = props.value;
  const setValue = props.setValue;
  const changeModalFotoCancelFlag = props.changeModalFotoCancelFlag;
  const setIndexDeleteFoto = props.setIndexDeleteFoto;
  const changeModalFotoCancelData = props.changeModalFotoCancelData
    ? props.changeModalFotoCancelData
    : () => {};
  const dowloadFoto = props.dowloadFoto;
  const makeFoto = props.makeFoto;

  // useEffect(() => {
  //   console.log('#D1', props.value);
  // }, [props.value]);

  const deletePhoto = (item) => {
    console.log('#FI1', item);
    setValue(prev => {
      let newValue = prev.filter( el => el.id !== item.id)
      console.log(newValue);
      return newValue
    })
  }
  return (
    <>
      {props.value.length > 0 &&
        props.value.map((item, i) => (
          <React.Fragment key={i}>
            <ImageComponent
              item={item}
              i={i}
              value={value}
              setValue={setValue}
              changeModalFotoCancelFlag={changeModalFotoCancelFlag}
              setIndexDeleteFoto={setIndexDeleteFoto}
              changeModalFotoCancelData={changeModalFotoCancelData}
              columnName={props.columnName}
              //deletePhoto={deletePhoto}
            />
          </React.Fragment>
          // <View style={styles.fotoInner} key={i}>
          //   <ImageBackground
          //     style={{ width: '100%', height: 165, backgroundColor: 'rgba(181, 181, 181, 0.5)' }}
          //     imageStyle={{ borderRadius: 5 }} source={{ uri: item.photo }}
          //     onLoadStart={() => changeLoadEndFlag(false)}
          //     onLoadEnd={() => changeLoadEndFlag(true)}
          //   />
          //   {item.id && loadEndFlag ?
          //     <TouchableOpacity
          //       style={styles.fotoDelete}
          //       onPress={() => (changeModalFotoCancelFlag(true) || setIndexDeleteFoto(i) || changeModalFotoCancelData({ fotoArray: value, setFotoArray: setValue }))}
          //     >
          //       <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
          //     </TouchableOpacity>
          //     :
          //     <ActivityIndicator
          //       style={styles.fotoDelete}
          //       color={COLORS.red}
          //     />
          //   }
          // </View>
        ))}
      <View style={styles.fotoPickerInner}>
        <TouchableOpacity style={styles.fotoPickerBtn} onPress={() => dowloadFoto(value, setValue)}>
          <Image style={{ width: 16, height: 13 }} source={icons.downloadFoto} />
          <Text style={[theme.FONTS.body_SF_M_12, styles.fotoPickerText]}>Галерея</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fotoPickerBtn} onPress={() => makeFoto(value, setValue)}>
          <Image style={{ width: 16, height: 14 }} source={icons.makeFoto} />
          <Text style={styles.fotoPickerText}>Камера</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FieldImages;
