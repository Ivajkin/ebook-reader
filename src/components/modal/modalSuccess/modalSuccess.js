//#region react components
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Platform, Animated, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
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
import { theme, COLORS, constants } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const ModalSuccess = props => {
  //#region valuebles
  const dispatch = props.dispatch ? props.dispatch : null;
  const modalFlag = props.modalFlag;
  const changeModalFlag = props.changeModalFlag;
  const message = props.message;
  const setLoaderVisible = props.setLoaderVisible;
  const navigation = props?.refNav?.current ?? null;
  const reportId = useSelector(state => state.appGlobal.reportId);

  const [modalOpacity, setModalOpacity] = useState(new Animated.Value(0.0));
  //#endregion ----------

  //#region functions
  async function requestClose() {
    setLoaderVisible(true);
    const reportList = JSON.parse(await AsyncStorage.getItem('@reportList')) || [];
    const report = reportList?.find(item => item?.id === reportId);
    // if (reportList && reportList.length) {
    //   const newReportList = reportList?.filter(item => item.id !== reportId);
    //   newReportList.push(report);
    //   report.status = 'completed';
    //   await AsyncStorage.setItem('@reportList', JSON.stringify([...newReportList]));
    const token = await AsyncStorage.getItem('@token');
    const userInfo = await AsyncStorage.getItem('@userInfo');
    const userInfoObj = JSON.parse(userInfo);

    axiosOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {},
    };

    const res1 = await axios.get(constants.env.reportList, {
      ...axiosOptions,
      params: { 'filter[user_id]': [userInfoObj.id] },
    });
    await AsyncStorage.setItem('@reportList', JSON.stringify(res1.data.data));
    // }

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
    setLoaderVisible(false);
    // if (item.status === 'completed') {
    // navigation.navigate('CompleteReportScreen', {
    //   itemId: reportId,
    //   item: report,
    // });
    // return;
    // }
    navigation?.navigate('AllReportsScreen');
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
            opacity: modalOpacity,
            backgroundColor: 'rgba(0,0,0,0)',
          }}
        >
          {/* <Modal
				statusBarTranslucent={true}
				style={styles.modalExit}
				animationType="fade"
				transparent={true}
				visible={modalFlag}
				onRequestClose={() => {
					requestClose()
				}}> */}
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
            <View style={styles.modalViewWrapper}>
              <View style={styles.modalViewWrapperContent}>
                <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
                  Ожидайте модерации вашего отчета от администрации
                </Text>
                <Text style={[theme.FONTS.body_R_L_14, styles.modalMessage]}>{message}</Text>
                <View style={styles.modalTouchableInner}>
                  <TouchableOpacity style={styles.buttonWrapper} onPress={() => requestClose()}>
                    <Text style={[theme.FONTS.body_SF_R_14, styles.modalText, { color: COLORS.red }]}>
                      Ок
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {/* </Modal> */}
        </Animated.View>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalSuccess;
