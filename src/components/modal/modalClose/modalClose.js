//#region react
import React from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
//#endregion --------

//#region components
import { theme } from '../../../сonstants';
//#endregion --------

//#region actions
import { setReportId, setOpenScreen } from '../../../redux/App/actions/mainActions';

//#endregion

//#region styles
import styles from './styles';
import { AllReports } from '../../../requests';
import { useSelector } from 'react-redux';

//#endregion --------

const ModalClose = props => {
  //#region valuevles

  const dispatch = props.dispatch;
  const modalVisible = props.modalVisible;
  const setModalVisible = props.setModalVisible;
  const navigation = props.nav;
  const backScreen = props.backScreen ? props.backScreen : null;
  const menusState = useSelector(state => state.appGlobal.openScreen);

  const token = useSelector(state => state.appGlobal.loginToken);
  //#endregion --------

  //#region functions
  function goBack() {
    setModalVisible(false);
    dispatch(setReportId(null));
    dispatch(
      setOpenScreen({
        TechnicalCharacteristics: 0,
        EquipmentScreen: 0,

        Equipment_overview: 0,
        Equipment_exterior: 0,
        Equipment_anti_theft_protection: 0,
        Equipment_multimedia: 0,
        Equipment_salon: 0,
        Equipment_comfort: 0,
        Equipment_safety: 0,
        Equipment_other: 0,

        DocumentsScreen: 0,
        MarkingsScreen: 0,
        CompletenessScreen: 0,
        TiresScreen: 0,
        FotoExteriorScreen: 0,
        FotoInteriorScreen: 0,
        CheckingLKPScreen: 0,
        DamageScreen: 0,

        Damage_right_side: 0,
        Damage_front_side: 0,
        Damage_left_side: 0,
        Damage_rear_side: 0,
        Damage_roof_side: 0,
        Damage_window_side: 0,
        Damage_rims_side: 0,
        Damage_interior_side: 0,

        TechCheckScreen: 0,

        TechCheck_engine_off: 0,
        TechCheck_engine_on: 0,
        TechCheck_test_drive: 0,
        TechCheck_elevator: 0,

        LocationScreen: 0,
        SignatureScreen: 0,
      })
    );

    let canDelete = Object.keys(menusState).every(screenName => {
      if (screenName.split('_').length > 1) {
        return true;
      }
      if (screenName !== props.screenName) {
        return menusState[screenName] === 0;
      }
      return true;
    });
    console.log('STATES MODAL CLOSE', menusState, canDelete);
    if (canDelete) {
      AllReports.deleteReport(token, props.id).catch(err => {
        console.log('error', err);
      });
    }
    backScreen ? navigation.navigate(backScreen) : navigation.navigate('AllReportsScreen');
  }
  //#endregion

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
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={() => {}}>
        <View style={styles.modalViewWrapper}>
          <View style={styles.modalViewWrapperContent}>
            <Text style={[theme.FONTS.body_R_R_16]}>Вы уверены что хотите выйти из осмотра?</Text>
            <TouchableOpacity
              style={styles.modalContinueTouchable}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[theme.FONTS.body_SF_M_15, styles.modalContinueTouchableText]}>
                Продолжить осмотр
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalEndTouchable} onPress={goBack}>
              <Text style={[theme.FONTS.body_SF_R_14, styles.modalEndTouchableText]}>
                Выйти без сохранения
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalClose;
