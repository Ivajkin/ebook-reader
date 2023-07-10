//#region react
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
//#endregion --------

//#region components
import { theme, COLORS, loader } from '../../../../сonstants';
import { global } from '../../../../requests';
import { globalFunctions } from '../../../../utils';
//#endregion --------

//#region styles
import styles from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
//#endregion --------

const ModalDelete = props => {
  //#region valuevles
  const netInfo = useNetInfo();
  const modalVisible = props.modalVisible;
  const setModalVisible = props.setModalVisible;
  const modalFotoCancelData = props.modalFotoCancelData;
  const token = useSelector(state => state.appGlobal.loginToken);
  const [loaderVisible, setLoaderVisible] = useState(false);

  //console.log('#5', modalFotoCancelData);
  //#endregion --------

  async function deleteFoto() {
    let indexDeleteFoto = modalFotoCancelData.fotoArray.findIndex(el => el.id === props.item.id);

    //console.log('#F7', indexDeleteFoto);
    if (!netInfo?.isConnected) {
      console.log('not connected');
    } else {
      if (indexDeleteFoto !== -1) {
        global
          .delFiles(props.item.id, token)
          .then(result => {
            setLoaderVisible(false);
            const newList = modalFotoCancelData.fotoArray.filter(el => el.id !== props.item.id);
            modalFotoCancelData.setFotoArray(newList);
          })
          .catch(err => {
            console.log('delete photo error', err);
          });
      }
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

export default ModalDelete;
