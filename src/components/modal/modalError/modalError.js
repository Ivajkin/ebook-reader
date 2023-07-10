//#region react components
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
//#endregion ----------

//#region plagins
//#endregion ----------

//#region components
import { theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const ModalError = props => {
  //#region valuebles
  const modalFlag = props.modalFlag;
  const changeModalFlag = props.changeModalFlag;
  const message = props.message;
  //#endregion ----------

  //#region functions

  //#endregion ----------

  useEffect(() => {}, []);

  return (
    <Modal
      statusBarTranslucent={true}
      style={styles.modalExit}
      animationType="fade"
      transparent={true}
      visible={modalFlag}
      onRequestClose={() => {
        changeModalFlag(!modalFlag);
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => {
          changeModalFlag(false);
        }}
      >
        <View style={styles.modalViewWrapper}>
          <View style={styles.modalViewWrapperContent}>
            <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>Ошибка!</Text>
            <Text style={[theme.FONTS.body_R_L_14, styles.modalMessage]}>{message}</Text>
            <View style={styles.modalTouchableInner}>
              <TouchableOpacity onPress={() => changeModalFlag(false)}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.modalText, { color: COLORS.red }]}>
                  Ок
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalError;
