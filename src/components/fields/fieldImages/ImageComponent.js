//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';

//#endregion

//#region plagins

//#endregion

//#region components

//#endregion

//#region constants
import { COLORS, icons, theme } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
import { ModalFotoCancel } from '../../modal';
//#endregion

//#endregion

const ImageComponent = props => {
  //#region valuevles
  const value = props.value;
  const setValue = props.setValue;
  const changeModalFotoCancelFlag = props.changeModalFotoCancelFlag;
  const setIndexDeleteFoto = props.setIndexDeleteFoto;
  const changeModalFotoCancelData = props.changeModalFotoCancelData
    ? props.changeModalFotoCancelData
    : () => {};
  const item = props.item;
  const i = props.i;
  const [modalVisible, setModalVisible] = useState(false);

  const [loadEndFlag, changeLoadEndFlag] = useState(false);
  const [modalCancelData, setModalCancelData] = useState({});
  // const deletePhoto = () => {
  //   console.log('#IC1', value, value.filter(el => el.id !== item.id));
  //   console.log('#IC2', item);
  //
  // }
  //console.log('#F3', item?.photo);
  return (
    <View style={styles.fotoInner} key={i}>
      <ImageBackground
        style={{ width: '100%', height: 165, backgroundColor: 'rgba(181, 181, 181, 0.5)' }}
        imageStyle={{ borderRadius: 5 }}
        source={{ uri: item?.photo || item?.storage_path }}
        //source={{ uri: item?.photo }}
        onLoadStart={() => changeLoadEndFlag(false)}
        onLoadEnd={() => changeLoadEndFlag(true)}
      />
      {(item.id && loadEndFlag) || item?.photo?.includes('file:///') ? (
        <TouchableOpacity
          style={styles.fotoDelete}
          onPress={() => {
            setModalVisible(true);
            setModalCancelData({
              fotoArray: props.value,
              setFotoArray: array => {
                let newArray = array.filter(el => el.id !== item.id);
                props.setValue(newArray);
              },
            });
            //props.deletePhoto(item);
            // return (
            //   changeModalFotoCancelFlag(true) ||
            //   setIndexDeleteFoto(i) ||
            //   changeModalFotoCancelData({ fotoArray: value, setFotoArray: setValue })
            // );
          }}
        >
          <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
        </TouchableOpacity>
      ) : (
        <ActivityIndicator style={styles.fotoDelete} color={COLORS.red} />
      )}
      <ModalFotoCancel
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalFotoCancelData={modalCancelData}
        columnNameDeleteFoto={props.column_name}
        indexDeleteFoto={props.value.findIndex(el => el.id === item.id)}
      />
    </View>
  );
};

export default ImageComponent;
