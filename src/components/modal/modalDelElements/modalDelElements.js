//#region react components
import React from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
//#endregion ----------

//#region components
import { theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import styles from './styles';
//#endregion ----------

const ModalDelElement = props => {
  //#region valuebles
  const data = props.data;
  const setDataLocal = props.setDataLocal;
  const changeDataGlobal = props.changeDataGlobal;
  const modalVisible = props.modalVisible;
  const setModalVisible = props.setModalVisible;
  const navigation = props.navigation;
  const id = props.id;
  //#endregion ----------

  function deleteElement() {
    let tempData = {};
    Object.keys(data).map((item, index) => {
      item !== id ? (tempData[item] = data[item]) : '';
    });
    setDataLocal(tempData);
    changeDataGlobal(tempData);
    navigation.navigate('MarkingsScreen');
    // const newList = modalFotoCancelData.fotoArray.filter((item, i) => i !== indexDeleteFoto);
    // modalFotoCancelData.setFotoArray(newList);
    // setModalVisible(false);
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
        <View style={styles.modalViewWrapper}>
          <View style={styles.modalViewWrapperContent}>
            <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
              Вы уверены что хотите удалить данный элемент?
            </Text>
            <View style={styles.modalTouchableInner}>
              <TouchableOpacity
                style={[styles.buttonWrapper, , { justifyContent: 'flex-start' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={[theme.FONTS.body_SF_R_14, styles.modalText, { color: COLORS.grayishBlue }]}
                >
                  Отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonWrapper, { justifyContent: 'flex-end' }]}
                onPress={() => deleteElement()}
              >
                <Text style={[theme.FONTS.body_SF_R_14, styles.modalText, { color: COLORS.red }]}>
                  Удалить
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalDelElement;
