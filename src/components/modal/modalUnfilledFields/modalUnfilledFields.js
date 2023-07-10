//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Platform, Animated, StatusBar } from 'react-native';
//#endregion ----------

//#region plagins
//#endregion ----------

//#region actions
import {
  setReportEndModalFlag,
  setReportId,
  setOpenScreen,
} from '../../../redux/App/actions/mainActions';
//#endregion

//#region components
import { theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
//#endregion ----------

const ModalUnfilledFields = props => {
  //#region valuebles
  const dispatch = useDispatch();
  const modalFlag = props.modalFlag;
  const changeModalFlag = props.changeModalFlag;
  const navigation = useNavigation();

  const [modalOpacity, setModalOpacity] = useState(new Animated.Value(0.0));
  //#endregion ----------

  //#region functions
  function requestClose() {
    dispatch ? dispatch(setReportEndModalFlag('inProgress')) : '';
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
    changeModalFlag(false);
    navigation.navigate('AllReportsScreen');
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: 'AllReportsScreen' }],
    // });
  }

  function requestAnswer() {
    dispatch(setReportEndModalFlag('inProgress'));
    if (!props?.fromUnfilled){
      navigation?.navigate('UnfilledFieldsScreen');
    }
    //
  }

  //#endregion ----------

  useEffect(() => {
    if (modalFlag) {
      setTimeout(() => {
        Platform.OS !== 'ios' ? StatusBar.setBackgroundColor(COLORS.substrate) : '';
        Animated.timing(modalOpacity, {
          toValue: 1.0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setModalOpacity(new Animated.Value(0.0)));
      }, 700);
    } else {
      Platform.OS !== 'ios' ? StatusBar.setBackgroundColor('#fff') : '';
    }
  }, [modalFlag]);

  return (
    <>
      {modalFlag ? (
        <Animated.View
          style={{
            zIndex: 2,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // opacity: modalOpacity,
            backgroundColor: 'rgba(0,0,0,0)',
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
            <View style={styles.modalViewWrapper}>
              <View style={styles.modalViewWrapperContent}>
                <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
                  Невозможно сформировать отчет
                </Text>
                <Text style={[theme.FONTS.body_R_R_14, styles.modalSubTitle]}>
                  К сожалению Вы не ответили на все необходимые вопросы для формирование отчета
                </Text>
                <View style={styles.modalTouchableInner}>
                  <TouchableOpacity style={styles.buttonWrapperAnswer} onPress={() => requestAnswer()}>
                    <Text style={[theme.FONTS.body_R_R_13, { color: COLORS.primary }]}>
                      Ответить на вопросы
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      requestClose();
                    }}
                  >
                    <Text style={[theme.FONTS.body_R_R_14, styles.modalText, { color: COLORS.red }]}>
                      Сохранить и завершить отчет
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalUnfilledFields;
