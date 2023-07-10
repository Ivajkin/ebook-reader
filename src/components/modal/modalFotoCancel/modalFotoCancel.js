//#region react
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
//#endregion --------

//#region components
import { theme, COLORS, loader, constants } from '../../../сonstants';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
//#endregion --------

//#region styles
import styles from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
//#endregion --------

const ModalFotoCancel = props => {
  //#region valuevles
  const netInfo = useNetInfo();
  const modalVisible = props.modalVisible;
  const setModalVisible = props.setModalVisible;
  const modalFotoCancelData = props.modalFotoCancelData;
  //const indexDeleteFoto = props.indexDeleteFoto;
  const columnNameDeleteFoto = props.columnNameDeleteFoto;
  const token = useSelector(state => state.appGlobal.loginToken);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const indexDeleteFoto = props.indexDeleteFoto;

  //console.log('#5', modalFotoCancelData);
  //#endregion --------

  async function deleteFoto() {
    // let indexDeleteFoto = modalFotoCancelData.fotoArray.findIndex(
    //   el => el.column_name === columnNameDeleteFoto
    // );
    if (Array.isArray(modalFotoCancelData.fotoArray)) {
      if (!netInfo?.isConnected) {
        // setLoaderVisible(true);
        // if (Number.isInteger(modalFotoCancelData.fotoArray[indexDeleteFoto].id)) {
        //   const dataDelete = [modalFotoCancelData.fotoArray[indexDeleteFoto].id, token];
        //   const shouldDeleteFiles = JSON.parse(await AsyncStorage.getItem('@shouldDeleteFiles'));
        //   if (!shouldDeleteFiles || shouldDeleteFiles === null || shouldDeleteFiles.length < 1) {
        //     await AsyncStorage.setItem('@shouldDeleteFiles', JSON.stringify([dataDelete]));
        //   } else {
        //     const newShouldDeleteFiles = shouldDeleteFiles.filter(item => item[0] !== dataDelete[0]);
        //     await AsyncStorage.setItem(
        //       '@shouldDeleteFiles',
        //       JSON.stringify([...newShouldDeleteFiles, dataDelete])
        //     );
        //   }
        // } else {
        //   let shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
        //   if (shouldSendFiles || shouldSendFiles !== null || shouldSendFiles.length > 0) {
        //     const newShouldSendFiles = shouldSendFiles.filter(
        //       item => item[0] !== modalFotoCancelData.fotoArray[indexDeleteFoto].photo
        //     );
        //     await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify(newShouldSendFiles));
        //   }
        // }
        // setLoaderVisible(false);
        // const newList = modalFotoCancelData.fotoArray.filter((item, i) => i !== indexDeleteFoto);
        // modalFotoCancelData.setFotoArray(newList);
      } else {
        if (indexDeleteFoto !== -1 && !modalFotoCancelData.fotoArray[indexDeleteFoto].isDefault) {
          global
            .delFiles(modalFotoCancelData.fotoArray[indexDeleteFoto].id, token)
            .then(result => {
              setLoaderVisible(false);
              const newList = modalFotoCancelData.fotoArray.filter(
                el => el.id !== modalFotoCancelData.fotoArray[indexDeleteFoto].id
              );
              modalFotoCancelData.setFotoArray(newList);
              // globalFunctions.requestProcess(
              //   result,
              //   setLoaderVisible,
              //   () => {

              //     // const newList = modalFotoCancelData.filter(
              //     //   el => el.column_name !== modalFotoCancelData.fotoArray[indexDeleteFoto].column_name
              //     // );
              //     // console.log('#S4 newList', newList);
              //     // modalFotoCancelData.setFotoArray(newList);
              //   },
              //   constants.errorMessage.photoDel
              // );
            })
            .catch(err => {
              console.log('delete photo error', err);
            });
        }
        //125', modalFotoCancelData.fotoArray[indexDeleteFoto].id);
      }
    } else {
      //modalFotoCancelData.setFotoArray({ ...modalFotoCancelData.fotoArray, [indexDeleteFoto]: null });
    }
    setModalVisible(false);
  }

  return (
    <Modal
      statusBarTranslucent={true}
      style={styles.modalExit}
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => {
          setModalVisible(false);
        }}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        <View style={styles.modalViewWrapper}>
          <TouchableWithoutFeedback>
            <View style={styles.modalViewWrapperContent}>
              <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
                Вы уверены что хотите удалить данное фото?
              </Text>
              <View style={styles.modalTouchableInner}>
                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalBtnText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={() => deleteFoto()}
                >
                  <Text style={[styles.modalBtnText, { color: 'white' }]}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalFotoCancel;
