import React, { useState } from 'react';

import { Text, View, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';

import { COLORS, icons, theme } from '../../../../сonstants';
import ModalDelete from '../ModalDelete/ModalDelete';
import { styles } from './styles';

const AdditionalPhoto = props => {
  //#region valuevles
  const value = props.value;
  const setValue = props.setValue;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancelData, setModalCancelData] = useState({});
  // const changeModalFotoCancelFlag = props.changeModalFotoCancelFlag;
  // const setIndexDeleteFoto = props.setIndexDeleteFoto;
  // const changeModalFotoCancelData = props.changeModalFotoCancelData
  //   ? props.changeModalFotoCancelData
  //   : () => {};
  const item = props.item;
  const i = props.i;

  const [loadEndFlag, changeLoadEndFlag] = useState(false);
  const deletePhoto = () => {
    setModalVisible(true);
    setModalCancelData({
      fotoArray: value,
      setFotoArray: array => {
        let newArray = array.filter(el => el.id !== item.id);
        props.setValue(newArray);
      },
    });
  };
  console.log('#T1', item);
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
            deletePhoto();
          }}
        >
          <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
        </TouchableOpacity>
      ) : (
        <ActivityIndicator style={styles.fotoDelete} color={COLORS.red} />
      )}
      <ModalDelete
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        modalFotoCancelData={modalCancelData}
        //columnNameDeleteFoto={props.column_name}
        item={item}
        //indexDeleteFoto={i}
      />
    </View>
  );
};

export default AdditionalPhoto;
