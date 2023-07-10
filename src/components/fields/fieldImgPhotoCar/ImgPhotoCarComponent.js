//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';

//#endregion

//#region plagins

//#endregion

//#region components
import { ModalFotoCancel } from '../../modal';
//#endregion

//#region constants
import { COLORS, icons, theme } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const ImgPhotoCarComponent = props => {
  //#region valuevles
  const makeFoto = props.makePhoto;
  const dowloadFoto = props.dowloadFoto;
  //const changeModalFotoCancelFlag = props.changeModalFotoCancelFlag;
  const [modalVisible, setModalVisible] = useState(false);
  const setIndexDeleteFoto = props.setIndexDeleteFoto;
  const changeModalFotoCancelData = props.changeModalFotoCancelData
    ? props.changeModalFotoCancelData
    : () => {};
  const item = props.item;
  const fieldsItem = props.fieldsItem;
  const i = props.i;

  const [loadEndFlag, changeLoadEndFlag] = useState(false);
  const [photo, setPhoto] = useState(props.fieldsItem.meta_val);
  const [isPhotoDefault, setIsPhotoDefault] = useState(true);
  const [modalCancelData, setModalCancelData] = useState({});

  // const getIsDefault = () => {
  //   //console.log(props.photos);
  //   console.log(
  //     '#RR1',
  //     props.fieldsItem?.column_name,
  //     props.photos.find(el => el.column_name !== props.fieldsItem?.column_name)?.isDefault
  //   );
  //   return props.photos.find(el => el.column_name !== props.fieldsItem?.column_name)?.isDefault
  // };
  useEffect(() => {
    let thisPhoto = props.photos.find(ph => ph.column_name === fieldsItem.column_name);

    if (!thisPhoto) {
      // console.log('couldnt find for', fieldsItem.column_name);
      setPhoto(fieldsItem.meta_val);

      setIsPhotoDefault(true);
    } else {
      setIsPhotoDefault(thisPhoto?.isDefault);
      // console.log('#A9', thisPhoto);

      setPhoto(thisPhoto.photo);
    }

    //console.log(fieldsItem.column_name, isPhotoDefault, loadEndFlag, photo);
  }, [props.photos]);

  // useEffect(() => {
  //   console.log('de', fieldsItem.column_name, isPhotoDefault, loadEndFlag, photo);
  // }, [photo]);

  const deletePhoto = () => {
    //console.log('#S1', props.fieldsItem.column_name);
    //console.log('#S2', props.photos);
    // props.setPhotos()
    // !isPhotoDefault
    //   ? setModalVisible(true) ||
    //     // changeModalFotoCancelFlag(true)
    //     setIndexDeleteFoto(0) ||
    //     //changeModalFotoCancelData({ fotoArray: item.value, setFotoArray: item.setValue })
    //     setModalCancelData({
    //       fotoArray: item.value,
    //       setFotoArray: array => {
    //         setPhoto(props.fieldsItem.meta_val);
    //         setIsPhotoDefault(true);
    //         props.setPhotos(array);
    //         //console.log('#5', array);
    //         item.setValue(array);
    //       },
    //     })
    //   : '';
    setModalVisible(true);
    setModalCancelData({
      fotoArray: props.photos,
      setFotoArray: array => {
        let newArray = array.filter(el => el.column_name !== props.fieldsItem.column_name);
        newArray.push({
          column_name: props.fieldsItem.column_name,
          name: props.fieldsItem.name,
          id: props.fieldsItem.id,
          photo: props.fieldsItem.meta_val,
          isDefault: true,
        });
        //console.log('#KK4', newArray);
        props.setPhotos(newArray);
      },
    });
  };
  return (
    <View
      key={i}
      style={[
        {
          borderWidth: !item.validateFlag ? 2 : 0,
        },
        styles.photoContainer,
      ]}
    >
      {!item.validateFlag && (
        <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
          {fieldsItem.required === 2 ? '*Обязательное фото' : '**Обязательное фото'}
        </Text>
      )}
      <ImageBackground
        onLoadStart={() => changeLoadEndFlag(false)}
        onLoadEnd={() => {
          //console.log('load end', fieldsItem.column_name, photo);
          changeLoadEndFlag(true);
        }}
        style={styles.foto}
        imageStyle={{
          opacity: !isPhotoDefault
            ? 1
            : 0.5,
        }}
        source={{
          uri: photo,
        }}
        // source={item.value.length > 0 ? { uri: item.value[0].photo } : { uri: fieldsItem?.meta_val }}
      >
        {!isPhotoDefault ? (
          loadEndFlag ? (
            <TouchableOpacity
              style={styles.fotoDelete}
              onPress={() => {
                deletePhoto();
              }}
            >
              <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator style={styles.fotoDelete} color={COLORS.red} />
          )
        ) : (
          <View style={styles.imageBtnInner}>
            <TouchableOpacity
              style={styles.imageBtn}
              onPress={() => {
                dowloadFoto(
                  item.value,
                  item.setValue,
                  item.changeValidateFlag,
                  fieldsItem.id,
                  fieldsItem.column_name
                );
              }}
            >
              <Image style={{ width: 16, height: 13 }} source={icons.downloadFoto} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageBtn}
              onPress={() =>
                makeFoto(
                  item.value,
                  item.setValue,
                  item.changeValidateFlag,
                  fieldsItem.id,
                  fieldsItem.column_name
                )
              }
            >
              <Image style={{ width: 16, height: 14 }} source={icons.makeFoto} />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
      <View style={styles.line} />
      <ModalFotoCancel
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalFotoCancelData={modalCancelData}
        columnNameDeleteFoto={fieldsItem.column_name}
        indexDeleteFoto={i}
      />
    </View>
  );
};

export default ImgPhotoCarComponent;
