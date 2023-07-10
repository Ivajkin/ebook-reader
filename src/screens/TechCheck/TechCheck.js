//#region import libres

//#region react components
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
//#endregion

//#region redux
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region plagins
import { useDispatch, useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region components
import { HeaderBar, ProgressMenu, Tabs } from '../../components/menu';
import { ModalError, ModalFotoCancel } from '../../components/modal';
import { constants, loader, COLORS } from '../../сonstants';
import { globalFunctions } from '../../utils';
import { global } from '../../requests';
import EngineNotRunnig from './components/engineNotRunning';
import EngineRunnig from './components/engineRunning';
import TestDrive from './components/testDrive';
import LiftCheck from './components/liftCheck';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
//#endregion

//#region styles
import { styles } from './styles';
import validateFields from '../../utils/validateRequired';
//import validateRequired from '../../utils/validateRequired';
import AdditionalPhotos from '../../components/fields/AdditionalPhotos/AdditionalPhotos';
import { addPhoto } from '../../utils/photo';
//#endregion

//#endregion

const TechCheckScreen = ({ route, navigation }) => {
  //#region valuebles

  //#region system
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.technical_check_of_auto;
  const reportType = useSelector(state => state.appGlobal.reportType);
  const dispatch = useDispatch();
  const [linkID, setLinkID] = useState(0);

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'technical_check_of_auto',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'technical_check_of_auto',
    'back'
  );

  const refScroll = useRef();

  const [loaderVisible, setLoaderVisible] = useState(true);

  const screens = {
    engine_off: 'Незаведенный двигаель',
    engine_on: 'Заведенный двигатель/контр. лампы',
    test_drive: 'тест драйв',
    elevator: 'проверка на подъемнике',
  };

  const [modalErrorMessage, setModalErrorMessage] = useState('Не все обязательные поля заполнены!');
  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);

  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);

  const [modalCommentRequredFlag, changeModalCommentRequredFlag] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [lackOfCommentsModalVisible, setLackOfCommentsModalVisible] = useState(false);

  //const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  //const [unfilledScreens, setUnfilledScreens] = useState({});
  //#endregion system

  //#region radio config
  const radioStyles = {
    borderWidth: 2,
    borderWidthActive: 7,
    borderColor: '#C8C8C8',
    borderColorActive: '#FF3B30',
    marginVertical: 2,
    labelStyle: {
      //paddingRight: 5,
      marginLeft: 5,
      marginRight: 5,
    },
  };

  const [fieldsDescriptions, setFieldsDescriptions] = useState(null);
  const radioGoodBad = [
    Object.assign({ id: '1', label: 'Хорошо', value: 'good' }, radioStyles),
    Object.assign({ id: '2', label: 'Плохо', value: 'bad' }, radioStyles),
  ];
  const radioGoodBadNot = [
    Object.assign({ id: '1', label: 'Хорошо', value: 'good' }, radioStyles),
    Object.assign({ id: '2', label: 'Плохо', value: 'bad' }, radioStyles),
    Object.assign({ id: '3', label: 'Нет щупа', value: 'No probe' }, radioStyles),
  ];
  const radioYesNo = [
    Object.assign({ id: '1', label: 'Да', value: 'yes' }, radioStyles),
    Object.assign({ id: '2', label: 'Нет', value: 'no' }, radioStyles),
  ];
  //#endregion -----------

  //#region data
  const [fields, setFields] = useState([]);

  //group title
  const [groupTitles, setGroupTitles] = useState([]);

  // radio
  const [engineOilLevelRadio, changeEngineOilLevelRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [gearboxOilLevelRadio, changeGearboxOilLevelRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBadNot))
  );
  const [powerSteeringFluidLevelRadio, changePowerSteeringFluidLevelRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [brakeFluidLevelRadio, changeBrakeFluidLevelRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [coolantLevelRadio, changeCoolantLevelRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [requiresReplacementRadio, changeRequiresReplacementRadio] = useState(
    JSON.parse(JSON.stringify(radioYesNo))
  );
  const [DVSRadio, changeDVSRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [KPPRadio, changeKPPRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [GURRadio, changeGURRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [handoutRadio, changeHandoutRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [shockAbsorbersRadio, changeShockAbsorbersRadio] = useState(
    JSON.parse(JSON.stringify(radioYesNo))
  );
  const [frontAxleRadio, changeFrontAxleRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [rearAxleRadio, changeRearAxleRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));
  const [airbagRadio, changeAirbagRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [checkEngineRadio, changeCheckEngineRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [pressureOilsRadio, changePressureOilsRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [accumulatorRadio, changeAccumulatorRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [seatHeatingRadio, changeSeatHeatingRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [audioSystemRadio, changeAudioSystemRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [headlightsRadio, changeHeadlightsRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [rearLightsRadio, changeRearLightsRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [turnSignalsRadio, changeTurnSignalsRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [powerSteeringRadio, changePowerSteeringRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [conditioningRadio, changeConditioningRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [engineOperationRadio, changeEngineOperationRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [steeringRadio, changeSteeringRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [gearboxSwitchingRadio, changeGearboxSwitchingRadio] = useState(
    JSON.parse(JSON.stringify(radioGoodBad))
  );
  const [engineRadio, changeEngineRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [KPPTestRadio, changeKPPTestRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [suspensionRadio, changeSuspensionRadio] = useState(JSON.parse(JSON.stringify(radioGoodBad)));
  const [liftCheckRadio, changeLiftCheckRadio] = useState(JSON.parse(JSON.stringify(radioYesNo)));

  //comment flag
  const [engineOilLevelCommentFlag, changeEngineOilLevelCommentFlag] = useState(false);
  const [gearboxOilLevelCommentFlag, changeGearboxOilLevelCommentFlag] = useState(false);
  const [powerSteeringFluidLevelCommentFlag, changePowerSteeringFluidLevelCommentFlag] = useState(false);
  const [brakeFluidLevelCommentFlag, changeBrakeFluidLevelCommentFlag] = useState(false);
  const [coolantLevelCommentFlag, changeCoolantLevelCommentFlag] = useState(false);
  const [requiresReplacementCommentFlag, changeRequiresReplacementCommentFlag] = useState(false);
  const [DVSCommentFlag, changeDVSCommentFlag] = useState(false);
  const [KPPCommentFlag, changeKPPCommentFlag] = useState(false);
  const [GURCommentFlag, changeGURCommentFlag] = useState(false);
  const [handoutCommentFlag, changeHandoutCommentFlag] = useState(false);
  const [shockAbsorbersCommentFlag, changeShockAbsorbersCommentFlag] = useState(false);
  const [frontAxleCommentFlag, changeFrontAxleCommentFlag] = useState(false);
  const [rearAxleCommentFlag, changeRearAxleCommentFlag] = useState(false);
  const [airbagCommentFlag, changeAirbagCommentFlag] = useState(false);
  const [checkEngineCommentFlag, changeCheckEngineCommentFlag] = useState(false);
  const [pressureOilsCommentFlag, changePressureOilsCommentFlag] = useState(false);
  const [accumulatorCommentFlag, changeAccumulatorCommentFlag] = useState(false);
  const [seatHeatingCommentFlag, changeSeatHeatingCommentFlag] = useState(false);
  const [audioSystemCommentFlag, changeAudioSystemCommentFlag] = useState(false);
  const [headlightsCommentFlag, changeHeadlightsCommentFlag] = useState(false);
  const [rearLightsCommentFlag, changeRearLightsCommentFlag] = useState(false);
  const [turnSignalsCommentFlag, changeTurnSignalsCommentFlag] = useState(false);
  const [powerSteeringCommentFlag, changePowerSteeringCommentFlag] = useState(false);
  const [conditioningCommentFlag, changeConditioningCommentFlag] = useState(false);
  const [engineOperationCommentFlag, changeEngineOperationCommentFlag] = useState(false);
  const [steeringCommentFlag, changeSteeringCommentFlag] = useState(false);
  const [gearboxSwitchingCommentFlag, changeGearboxSwitchingCommentFlag] = useState(false);

  //comment
  const [engineOilLevelComment, setEngineOilLevelComment] = useState('');
  const [gearboxOilLevelComment, setGearboxOilLevelComment] = useState('');
  const [powerSteeringFluidLevelComment, setPowerSteeringFluidLevelComment] = useState('');
  const [brakeFluidLevelComment, setBrakeFluidLevelComment] = useState('');
  const [coolantLevelComment, setCoolantLevelComment] = useState('');
  const [requiresReplacementComment, setRequiresReplacementComment] = useState('');
  const [DVSComment, setDVSComment] = useState('');
  const [KPPComment, setKPPComment] = useState('');
  const [GURComment, setGURComment] = useState('');
  const [handoutComment, setHandoutComment] = useState('');
  const [shockAbsorbersComment, setShockAbsorbersComment] = useState('');
  const [frontAxleComment, setFrontAxleComment] = useState('');
  const [rearAxleComment, setRearAxleComment] = useState('');
  const [allComment, setAllComment] = useState('');
  const [airbagComment, setAirbagComment] = useState('');
  const [checkEngineComment, setCheckEngineComment] = useState('');
  const [pressureOilsComment, setPressureOilsComment] = useState('');
  const [accumulatorComment, setAccumulatorComment] = useState('');
  const [seatHeatingComment, setSeatHeatingComment] = useState('');
  const [audioSystemComment, setAudioSystemComment] = useState('');
  const [headlightsComment, setHeadlightsComment] = useState('');
  const [rearLightsComment, setRearLightsComment] = useState('');
  const [turnSignalsComment, setTurnSignalsComment] = useState('');
  const [powerSteeringComment, setPowerSteeringComment] = useState('');
  const [conditioningComment, setConditioningComment] = useState('');
  const [engineOperationComment, setEngineOperationComment] = useState('');
  const [steeringComment, setSteeringComment] = useState('');
  const [gearboxSwitchingComment, setGearboxSwitchingComment] = useState('');
  const [testDriveComment, setTestDriveComment] = useState('');
  const [rezDiagnostic, setRezDiagnostic] = useState('');
  const [allTestDriveComment, setAllTestDriveComment] = useState('');
  const [liftCheckComment, setLiftCheckComment] = useState('');

  //switch button
  const [electricBooster, changeElectricBooster] = useState(false);
  const [wontStart, changeWontStart] = useState(false);
  const [testDriveSwitch, changeTestDriveSwitch] = useState(false);
  const [eDiagnostic, changeEDiagnistic] = useState(false);

  //foto list
  const [engineNotRunningFotoList, setEngineNotRunningFotoList] = useState([]);
  const [testDriveFotoList, setTestDriveFotoList] = useState([]);
  const [liftCheckFotoList, setLiftCheckFotoList] = useState([]);

  //file reports
  const [fileReports, setFileReports] = useState(null);
  //#endregion -----------

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const system = {
    modalFotoCancelFlag,
    changeModalFotoCancelFlag,
    modalFotoCancelData,
    changeModalFotoCancelData,
    indexDeleteFoto,
    setIndexDeleteFoto,
    modalCommentRequredFlag,
    changeModalCommentRequredFlag,
    setLoaderVisible,
  };

  const fieldsArray = {
    tech_oil_engine_level: {
      group: 'Технические жидкости',
      value: engineOilLevelRadio,
      setValue: changeEngineOilLevelRadio,
      commentFlag: engineOilLevelCommentFlag,
      changeCommentFlag: changeEngineOilLevelCommentFlag,
      comment: engineOilLevelComment,
      setComment: setEngineOilLevelComment,
    },
    tech_oil_kpp_level: {
      group: 'Технические жидкости',
      value: gearboxOilLevelRadio,
      setValue: changeGearboxOilLevelRadio,
      commentFlag: gearboxOilLevelCommentFlag,
      changeCommentFlag: changeGearboxOilLevelCommentFlag,
      comment: gearboxOilLevelComment,
      setComment: setGearboxOilLevelComment,
    },
    tech_amplifier: {
      group: 'Технические жидкости',
      value: electricBooster,
      setValue: changeElectricBooster,
    },
    tech_liquid_gur_level: {
      group: 'Технические жидкости',
      value: powerSteeringFluidLevelRadio,
      setValue: changePowerSteeringFluidLevelRadio,
      commentFlag: powerSteeringFluidLevelCommentFlag,
      changeCommentFlag: changePowerSteeringFluidLevelCommentFlag,
      comment: powerSteeringFluidLevelComment,
      setComment: setPowerSteeringFluidLevelComment,
    },
    tech_liquid_brake_level: {
      group: 'Технические жидкости',
      value: brakeFluidLevelRadio,
      setValue: changeBrakeFluidLevelRadio,
      commentFlag: brakeFluidLevelCommentFlag,
      changeCommentFlag: changeBrakeFluidLevelCommentFlag,
      comment: brakeFluidLevelComment,
      setComment: setBrakeFluidLevelComment,
    },
    tech_liquid_cooling_level: {
      group: 'Технические жидкости',
      value: coolantLevelRadio,
      setValue: changeCoolantLevelRadio,
      commentFlag: coolantLevelCommentFlag,
      changeCommentFlag: changeCoolantLevelCommentFlag,
      comment: coolantLevelComment,
      setComment: setCoolantLevelComment,
    },
    tech_belt_replacement: {
      group: 'Износ приводных ремней',
      value: requiresReplacementRadio,
      setValue: changeRequiresReplacementRadio,
      commentFlag: requiresReplacementCommentFlag,
      changeCommentFlag: changeRequiresReplacementCommentFlag,
      comment: requiresReplacementComment,
      setComment: setRequiresReplacementComment,
    },
    tech_leaks_engine: {
      group: 'Течи и запотевания',
      value: DVSRadio,
      setValue: changeDVSRadio,
      commentFlag: DVSCommentFlag,
      changeCommentFlag: changeDVSCommentFlag,
      comment: DVSComment,
      setComment: setDVSComment,
    },
    tech_leaks_kpp: {
      group: 'Течи и запотевания',
      value: KPPRadio,
      setValue: changeKPPRadio,
      commentFlag: KPPCommentFlag,
      changeCommentFlag: changeKPPCommentFlag,
      comment: KPPComment,
      setComment: setKPPComment,
    },
    tech_leaks_gur: {
      group: 'Течи и запотевания',
      value: GURRadio,
      setValue: changeGURRadio,
      commentFlag: GURCommentFlag,
      changeCommentFlag: changeGURCommentFlag,
      comment: GURComment,
      setComment: setGURComment,
    },
    tech_leaks_transfer: {
      group: 'Течи и запотевания',
      value: handoutRadio,
      setValue: changeHandoutRadio,
      commentFlag: handoutCommentFlag,
      changeCommentFlag: changeHandoutCommentFlag,
      comment: handoutComment,
      setComment: setHandoutComment,
    },
    tech_leaks_amorts: {
      group: 'Течи и запотевания',
      value: shockAbsorbersRadio,
      setValue: changeShockAbsorbersRadio,
      commentFlag: shockAbsorbersCommentFlag,
      changeCommentFlag: changeShockAbsorbersCommentFlag,
      comment: shockAbsorbersComment,
      setComment: setShockAbsorbersComment,
    },
    tech_leaks_front_bridge: {
      group: 'Течи и запотевания',
      value: frontAxleRadio,
      setValue: changeFrontAxleRadio,
      commentFlag: frontAxleCommentFlag,
      changeCommentFlag: changeFrontAxleCommentFlag,
      comment: frontAxleComment,
      setComment: setFrontAxleComment,
    },
    tech_leaks_rear_bridge: {
      group: 'Течи и запотевания',
      value: rearAxleRadio,
      setValue: changeRearAxleRadio,
      commentFlag: rearAxleCommentFlag,
      changeCommentFlag: changeRearAxleCommentFlag,
      comment: rearAxleComment,
      setComment: setRearAxleComment,
    },
    tech_other_images: {
      group: null,
      value: engineNotRunningFotoList,
      setValue: setEngineNotRunningFotoList,
    },
    tech_engine_on: {
      group: null,
      value: wontStart,
      setValue: changeWontStart,
    },
    tech_comment_regular: {
      group: null,
      value: allComment,
      setValue: setAllComment,
    },
    tech_lamps_airbags: {
      group: 'Контрольные лампы',
      value: airbagRadio,
      setValue: changeAirbagRadio,
      commentFlag: airbagCommentFlag,
      changeCommentFlag: changeAirbagCommentFlag,
      comment: airbagComment,
      setComment: setAirbagComment,
    },
    tech_lamps_check_engine: {
      group: 'Контрольные лампы',
      value: checkEngineRadio,
      setValue: changeCheckEngineRadio,
      commentFlag: checkEngineCommentFlag,
      changeCommentFlag: changeCheckEngineCommentFlag,
      comment: checkEngineComment,
      setComment: setCheckEngineComment,
    },
    tech_lamps_oil_pressure: {
      group: 'Контрольные лампы',
      value: pressureOilsRadio,
      setValue: changePressureOilsRadio,
      commentFlag: pressureOilsCommentFlag,
      changeCommentFlag: changePressureOilsCommentFlag,
      comment: pressureOilsComment,
      setComment: setPressureOilsComment,
    },
    tech_electricity_battery: {
      group: 'Электрика',
      value: accumulatorRadio,
      setValue: changeAccumulatorRadio,
      commentFlag: accumulatorCommentFlag,
      changeCommentFlag: changeAccumulatorCommentFlag,
      comment: accumulatorComment,
      setComment: setAccumulatorComment,
    },
    tech_electricity_seat_heating: {
      group: 'Электрика',
      value: seatHeatingRadio,
      setValue: changeSeatHeatingRadio,
      commentFlag: seatHeatingCommentFlag,
      changeCommentFlag: changeSeatHeatingCommentFlag,
      comment: seatHeatingComment,
      setComment: setSeatHeatingComment,
    },
    tech_electricity_audio: {
      group: 'Электрика',
      value: audioSystemRadio,
      setValue: changeAudioSystemRadio,
      commentFlag: audioSystemCommentFlag,
      changeCommentFlag: changeAudioSystemCommentFlag,
      comment: audioSystemComment,
      setComment: setAudioSystemComment,
    },
    tech_electricity_front_headlights: {
      group: 'Электрика',
      value: headlightsRadio,
      setValue: changeHeadlightsRadio,
      commentFlag: headlightsCommentFlag,
      changeCommentFlag: changeHeadlightsCommentFlag,
      comment: headlightsComment,
      setComment: setHeadlightsComment,
    },
    tech_electricity_rear_headlights: {
      group: 'Электрика',
      value: rearLightsRadio,
      setValue: changeRearLightsRadio,
      commentFlag: rearLightsCommentFlag,
      changeCommentFlag: changeRearLightsCommentFlag,
      comment: rearLightsComment,
      setComment: setRearLightsComment,
    },
    tech_electricity_turn_signals: {
      group: 'Электрика',
      value: turnSignalsRadio,
      setValue: changeTurnSignalsRadio,
      commentFlag: turnSignalsCommentFlag,
      changeCommentFlag: changeTurnSignalsCommentFlag,
      comment: turnSignalsComment,
      setComment: setTurnSignalsComment,
    },
    tech_mechanics_power_steering: {
      group: 'Механика',
      value: powerSteeringRadio,
      setValue: changePowerSteeringRadio,
      commentFlag: powerSteeringCommentFlag,
      changeCommentFlag: changePowerSteeringCommentFlag,
      comment: powerSteeringComment,
      setComment: setPowerSteeringComment,
    },
    tech_mechanics_conditioner: {
      group: 'Механика',
      value: conditioningRadio,
      setValue: changeConditioningRadio,
      commentFlag: conditioningCommentFlag,
      changeCommentFlag: changeConditioningCommentFlag,
      comment: conditioningComment,
      setComment: setConditioningComment,
    },
    tech_mechanics_engine: {
      group: 'Механика',
      value: engineOperationRadio,
      setValue: changeEngineOperationRadio,
      commentFlag: engineOperationCommentFlag,
      changeCommentFlag: changeEngineOperationCommentFlag,
      comment: engineOperationComment,
      setComment: setEngineOperationComment,
    },
    tech_mechanics_handling: {
      group: 'Механика',
      value: steeringRadio,
      setValue: changeSteeringRadio,
      commentFlag: steeringCommentFlag,
      changeCommentFlag: changeSteeringCommentFlag,
      comment: steeringComment,
      setComment: setSteeringComment,
    },
    tech_mechanics_kpp: {
      group: 'Механика',
      value: gearboxSwitchingRadio,
      setValue: changeGearboxSwitchingRadio,
      commentFlag: gearboxSwitchingCommentFlag,
      changeCommentFlag: changeGearboxSwitchingCommentFlag,
      comment: gearboxSwitchingComment,
      setComment: setGearboxSwitchingComment,
    },
    tech_test_drive_bool: {
      group: null,
      value: testDriveSwitch,
      setValue: changeTestDriveSwitch,
    },
    tech_test_drive_engine: {
      group: null,
      value: engineRadio,
      setValue: changeEngineRadio,
    },
    tech_test_drive_kpp: {
      group: null,
      value: KPPTestRadio,
      setValue: changeKPPTestRadio,
    },
    tech_test_drive_suspension: {
      group: null,
      value: suspensionRadio,
      setValue: changeSuspensionRadio,
    },
    tech_test_drive_comment: {
      group: null,
      value: testDriveComment,
      setValue: setTestDriveComment,
    },
    tech_test_drive_bool_electro: {
      group: null,
      value: eDiagnostic,
      setValue: changeEDiagnistic,
    },
    tech_test_drive_electro_file: {
      group: null,
      value: fileReports,
      setValue: setFileReports,
    },
    tech_test_drive_results: {
      group: null,
      value: rezDiagnostic,
      setValue: setRezDiagnostic,
    },
    tech_test_drive_comment_regular: {
      group: null,
      value: allTestDriveComment,
      setValue: setAllTestDriveComment,
    },
    tech_test_drive_photos: {
      group: null,
      value: testDriveFotoList,
      setValue: setTestDriveFotoList,
    },
    tech_elevator_checked: {
      group: null,
      value: liftCheckRadio,
      setValue: changeLiftCheckRadio,
      changeCommentFlag: () => {},
      setComment: () => {},
    },
    tech_elevator_comment: {
      group: null,
      value: liftCheckComment,
      setValue: setLiftCheckComment,
    },
    tech_elevator_photos: {
      group: null,
      value: liftCheckFotoList,
      setValue: setLiftCheckFotoList,
    },
  };

  //#region functions
  async function getData(flag = false) {
    // if (flag) {
    //   let screensTemp = Array.from(
    //     new Set(
    //       unfilledFields.map(item => {
    //         return item.tab;
    //       })
    //     )
    //   );
    //   let newScreens = {};
    //   screensTemp.map(item => (newScreens[item] = screens[item]));
    //
    //   setUnfilledScreens(newScreens);
    //   setLoaderVisible(true);
    //   let tempFields = {};
    //   let tempGroupTitles = [];
    //   unfilledFields.map(item => {
    //     tempFields[item.column_name] = item;
    //     if (item.group_title && !tempGroupTitles.includes(item.group_title)) {
    //       tempGroupTitles.push(item.group_title);
    //     }
    //   });
    //   setGroupTitles(tempGroupTitles);
    //   setFields(tempFields);
    //   setLoaderVisible(false);
    // } else {
    setLoaderVisible(true);
    if (!netInfo?.isConnected) {
      const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
        item => item.id === section.id
      );

      let tempFields = {};
      let tempGroupTitles = [];
      reportFields.fields.map(item => {
        tempFields[item.column_name] = item;
        if (item.group_title && !tempGroupTitles.includes(item.group_title)) {
          tempGroupTitles.push(item.group_title);
        }
      });
      setGroupTitles(tempGroupTitles);
      setFields(tempFields);
      setLoaderVisible(false);
    } else {
      setLoaderVisible(true);
      global
        .getFields(reportType, section.id, token)
        .then(res => {
          setFieldsDescriptions(prev => {
            let newData = {};
            res.data.data.forEach(field => {
              newData[field.column_name] = field;
            });
            return newData;
          });
          let tempFields = {};
          let tempGroupTitles = [];
          res.data.data.map(item => {
            tempFields[item.column_name] = item;
            if (item.group_title && !tempGroupTitles.includes(item.group_title)) {
              tempGroupTitles.push(item.group_title);
            }
          });
          setGroupTitles(tempGroupTitles);
          //console.log('#I4', !fields, screens);
          setFields(tempFields);
          setLoaderVisible(false);
        })
        .catch(err => {
          setLoaderVisible(false);
          console.log('getData error on TechCheck', err);
        });
    }
    //}
  }

  async function saveData() {
    //setLoaderVisible(true)
    let tempSendData = {
      report_id: reportId,
      fields: [],
    };

    let fieldsOfObjects = {};
    Object.keys(fields).map(item => {
      switch (fields[item].type) {
        case 'radiobutton':
          // fieldsArray[item].value.map(item2 => {
          //   //console.log('#A10', fieldsArray[item]);
          //   if (fieldsArray[item].comment) {
          //     tempSendData.fields.push({
          //       id: fields[item].id,
          //       val: item2.id,
          //       val_text: item2.label,
          //       comment_text: fieldsArray[item].comment,
          //     });

          //     fieldsOfObjects[fields[item].id] = {
          //       ...fields[item],
          //       val: item2.id,
          //       val_text: item2.label,
          //       comment_text: fieldsArray[item].comment,
          //       sub_field: {
          //         id: item2.id,
          //         value: item2.label,
          //         comment_text: fieldsArray[item].comment,
          //       },
          //     };
          //   } else {
          //     tempSendData.fields.push({
          //       id: fields[item].id,
          //       val: item2.id,
          //       val_text: item2.label,
          //       saved_fields: [{ checked: item2.checked }],
          //     });

          //     fieldsOfObjects[fields[item].id] = {
          //       ...fields[item],
          //       val: item2.id,
          //       checked: item2.checked,
          //       val_text: item2.label,
          //       sub_field: {
          //         id: item2.id,
          //         value: item2.label,
          //       },
          //       saved_fields: [{ checked: item2.checked }],
          //     };
          //   }
          //   // if (item2?.selected) {
          //   //   if (fieldsArray[item].comment) {
          //   //     tempSendData.fields.push({
          //   //       id: fields[item].id,
          //   //       val: item2.id,
          //   //       val_text: item2.label,
          //   //       comment_text: fieldsArray[item].comment,
          //   //     });

          //   //     fieldsOfObjects[fields[item].id] = {
          //   //       ...fields[item],
          //   //       val: item2.id,
          //   //       val_text: item2.label,
          //   //       comment_text: fieldsArray[item].comment,
          //   //       sub_field: {
          //   //         id: item2.id,
          //   //         value: item2.label,
          //   //         comment_text: fieldsArray[item].comment,
          //   //       },
          //   //     };
          //   //   } else {
          //   //     tempSendData.fields.push({
          //   //       id: fields[item].id,
          //   //       val: item2.id,
          //   //       val_text: item2.label,
          //   //     });

          //   //     fieldsOfObjects[fields[item].id] = {
          //   //       ...fields[item],
          //   //       val: item2.id,
          //   //       val_text: item2.label,
          //   //       sub_field: {
          //   //         id: item2.id,
          //   //         value: item2.label,
          //   //       },
          //   //     };
          //   //   }
          //   // }
          // });

          let checked = fieldsArray[item].value.find(el => el.checked);
          tempSendData.fields.push({
            id: fields[item].id,
            val: JSON.stringify({
              itemChecked: checked?.id ?? '',
              comment: String(fieldsArray[item].comment ?? ''),
              commentFlag: String(fieldsArray[item].commentFlag ?? false),
            }),
            val_text: JSON.stringify({
              itemChecked: checked?.id ?? '',
              comment: String(fieldsArray[item].comment ?? ''),
              commentFlag: String(fieldsArray[item].commentFlag ?? false),
            }),
          });
          // tempSendData.fields.push({
          //   //...fields[item],
          //   id: fields[item].id,

          //   //val: JSON.stringify(fieldsArray[item].value),
          //   //saved_fields: fieldsArray[item].value,
          //   //sub_fields: fieldsArray[item].value,
          // });
          break;
        case 'text':
          if (
            fields[item].column_name !== 'tech_other_comment' &&
            fields[item].column_name !== 'tech_comment' &&
            fieldsArray[item].value !== null &&
            fieldsArray[item].value !== ''
          ) {
            if (fieldsArray[item].value) {
              tempSendData.fields.push({
                id: fields[item].id,
                val: fieldsArray[item].value,
                val_text: fieldsArray[item].value,
              });

              fieldsOfObjects[fields[item].id] = {
                ...fields[item],
                val: fieldsArray[item].value,
                val_text: fieldsArray[item].value,
                sub_field: {
                  id: fieldsArray[item].value,
                  value: fieldsArray[item].value,
                },
              };
            }
          }
          break;
        case 'checkbox':
          tempSendData.fields.push({
            id: fields[item].id,
            val: fieldsArray[item].value,
            val_text: String(fieldsArray[item].value),
            comment: String(fieldsArray[item].comment ?? ''),
            commentFlag: String(fieldsArray[item].commentFlag ?? false),
          });

          fieldsOfObjects[fields[item].id] = {
            ...fields[item],
            val: fieldsArray[item].value,
            val_text: String(fieldsArray[item].value),
            sub_field: {
              id: fieldsArray[item].value,
              value: String(fieldsArray[item].value),
              comment: String(fieldsArray[item].comment ?? ''),
              commentFlag: String(fieldsArray[item].commentFlag ?? false),
            },
          };
          break;
        default:
          break;
      }
    });

    if (!netInfo?.isConnected) {
      const result = new Promise(async function (resolve, reject) {
        const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));

        if (
          !shouldSendedReportData ||
          shouldSendedReportData === null ||
          shouldSendedReportData.length < 1
        ) {
          await AsyncStorage.setItem(
            '@shouldSendedReportData',
            JSON.stringify([
              {
                report_id: reportId,
                fields: { ...fieldsOfObjects },
              },
            ])
          );
        } else {
          const temple = shouldSendedReportData.find(item => item.report_id === reportId) || {
            fields: {},
          };
          const newShouldSend = shouldSendedReportData.filter(item => item.report_id !== reportId);
          await AsyncStorage.setItem(
            '@shouldSendedReportData',
            JSON.stringify([
              ...newShouldSend,
              {
                report_id: reportId,
                fields: { ...temple.fields, ...fieldsOfObjects },
              },
            ])
          );
        }
        resolve(true);
      });
      return result;
    } else {
      const result = await global.sendReportData(tempSendData, token);
      return result;
    }
  }

  async function fecthData(onlyPhoto = false) {
    try {
      setLoaderVisible(true);
      dispatch(
        setOpenScreen({
          TechCheck_engine_off: 1,
          TechCheck_engine_on: 1,
          TechCheck_test_drive: 1,
          TechCheck_elevator: 1,
        })
      );
      let result = [];
      let reportFieldsIds = [];
      if (!netInfo?.isConnected) {
        const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
          item => item.id === section.id
        );
        reportFieldsIds = reportFields.fields.map(function (obj) {
          return obj.id;
        });
        const savedReport = JSON.parse(await AsyncStorage.getItem('@reportList'))
          .find(item => item.id === reportId)
          .saved_fields.filter(item => reportFieldsIds.includes(item.field_id))
          .map(item => {
            return { ...item, ...item.field };
          });

        const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));
        let shouldSendedCurrentReportData = [...savedReport];
        if (shouldSendedReportData && shouldSendedReportData?.length) {
          const shouldSendedCurrentReportDataNew = Object.values(
            shouldSendedReportData?.find(item => item.report_id === reportId)?.fields
          )?.filter(item => item.section_id === section.id);
          if (shouldSendedCurrentReportDataNew && shouldSendedCurrentReportDataNew.length) {
            shouldSendedCurrentReportData = shouldSendedCurrentReportDataNew;
          }
        }
        result = shouldSendedCurrentReportData;
      } else {
        let res = await global.getSavedReport(token, reportId, section.id, null, null);
        result = res.data.data;
      }

      let tempFields = {};
      let tempGroupTitles = [];
      const shouldDeleteFiles = JSON.parse(await AsyncStorage.getItem('@shouldDeleteFiles'));
      const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));

      if (result.length > 0) {
        result.map(item => {
          tempFields[item.column_name] = item;
          if (item.group_title && !tempGroupTitles.includes(item.group_title)) {
            tempGroupTitles.push(item.group_title);
          }
          switch (item.type) {
            case 'text':
              if (item?.saved_fields?.length > 0) {
                if (!onlyPhoto) {
                  fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
                }
              }
              if (item?.val) {
                if (!onlyPhoto) {
                  fieldsArray[item.column_name].setValue(item.val);
                }
              }
              break;
            case 'checkbox':
              if (item?.saved_fields?.length > 0) {
                if (!onlyPhoto) {
                  fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
                }
              }
              if (item?.val) {
                if (!onlyPhoto) {
                  fieldsArray[item.column_name].setValue(item.val);
                }
              }
              break;
            case 'radiobutton':
              if (item?.saved_fields?.length > 0) {
                if (!onlyPhoto) {
                  let radioDataTemp = [...fieldsArray[item.column_name].value];
                  radioDataTemp.map(radioItem => {
                    try {
                      let itemData = JSON.parse(item.saved_fields[0].val);
                      if (radioItem.id === itemData.itemChecked) {
                        fieldsArray[item.column_name].changeCommentFlag(itemData.commentFlag === 'true');
                        fieldsArray[item.column_name].setComment(itemData.comment);

                        radioItem.checked = itemData.itemChecked;
                      }
                    } catch (err) {
                      console.log('current error', item.saved_fields[0].id);
                    }
                  });

                  fieldsArray[item.column_name].setValue(radioDataTemp);
                }
              }
              // if (item?.val) {
              //   if (!onlyPhoto) {
              //     fieldsArray[item.column_name].selected =
              //     // let radioDataTemp = [...fieldsArray[item.column_name].value];
              //     // radioDataTemp.map(radioItem => {
              //     //   try {
              //     //     if (radioItem.id === item.val) {
              //     //       if (['Плохо', 'Да'].includes(item.val_text) && item.comment_text) {
              //     //         fieldsArray[item.column_name].changeCommentFlag(true);
              //     //         fieldsArray[item.column_name].setComment(item.comment_text);
              //     //       }
              //     //       radioItem['selected'] = true;
              //     //     }
              //     //   } catch (err) {
              //     //     console.log('current error 2', item.id);
              //     //   }
              //     // });
              //     // fieldsArray[item.column_name].setValue(radioDataTemp);
              //   }
              // }
              break;
            case 'file':
              if (
                item?.saved_fields?.length > 0 &&
                item?.saved_fields[0]?.uploaded_files.length > 0 &&
                !onlyPhoto
              ) {
                fieldsArray[item.column_name].setValue({
                  id: item.saved_fields[0].uploaded_files[0].id,
                  val: item.saved_fields[0].uploaded_files[0].filename,
                });
              }
              break;
            case 'images':
              if (item?.saved_fields?.length > 0 && item?.saved_fields[0]?.uploaded_files.length > 0) {
                let images = [];
                item.saved_fields[0].uploaded_files.map(imageItem => {
                  images.push({ id: imageItem.id, photo: imageItem.storage_path });
                });
                fieldsArray[item.column_name].setValue(images);
              }
              if (item?.uploaded_files?.length > 0) {
                let images = [];
                let newFiles = [];
                if (shouldDeleteFiles && shouldDeleteFiles !== null) {
                  newFiles = item?.uploaded_files.filter(item => {
                    const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
                    if (!shouldDelFile || shouldDelFile?.length < 1) {
                      return item;
                    }
                  });
                } else {
                  newFiles = item?.uploaded_files;
                }

                newFiles.map(imageItem => {
                  images.push({ id: imageItem.id, photo: imageItem.storage_path });
                });
                fieldsArray[item.column_name].setValue(images);
              }
              break;
            default:
              break;
          }
        });
      }
      // result.map(item => {
      //   tempFields[item.column_name] = item;
      //   if (item.group_title && !tempGroupTitles.includes(item.group_title)) {
      //     tempGroupTitles.push(item.group_title);
      //   }
      //   //console.log('item', item);
      //   switch (item.type) {
      //     case 'text':
      //       if (item?.saved_fields?.length > 0) {
      //         if (!onlyPhoto) fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
      //       }
      //       if (item?.val) {
      //         if (!onlyPhoto) fieldsArray[item.column_name].setValue(item.val);
      //       }
      //       break;
      //     case 'checkbox':
      //       if (item?.saved_fields?.length > 0) {
      //         if (!onlyPhoto) fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
      //       }
      //       if (item?.val) {
      //         if (!onlyPhoto) fieldsArray[item.column_name].setValue(item.val);
      //       }
      //       break;
      //     case 'radiobutton':
      //       //console.log('#A6', item?.saved_fields);
      //       if (item?.saved_fields?.length > 0) {
      //         if (!onlyPhoto) {
      //           let radioDataTemp = [...fieldsArray[item.column_name].value];
      //           radioDataTemp.map(radioItem => {
      //             //console.log('#A5', radioItem);
      //             try {
      //               if (radioItem.id === item.saved_fields[0].val) {
      //                 if (
      //                   ['Плохо', 'Да'].includes(item.saved_fields[0].val_text) &&
      //                   item.saved_fields[0].comment_text
      //                 ) {
      //                   fieldsArray[item.column_name].changeCommentFlag(true);
      //                   fieldsArray[item.column_name].setComment(item.saved_fields[0].comment_text);
      //                 }

      //                 radioItem['selected'] = true;
      //               }
      //             } catch (err) {
      //               console.log('current error', item.saved_fields[0].id);
      //             }
      //           });
      //           fieldsArray[item.column_name].setValue(radioDataTemp);
      //         }
      //       }
      //       if (item?.val) {
      //         if (!onlyPhoto) {
      //           let radioDataTemp = [...fieldsArray[item.column_name].value];
      //           radioDataTemp.map(radioItem => {
      //             try {
      //               if (radioItem.id === item.val) {
      //                 if (['Плохо', 'Да'].includes(item.val_text) && item.comment_text) {
      //                   fieldsArray[item.column_name].changeCommentFlag(true);
      //                   fieldsArray[item.column_name].setComment(item.comment_text);
      //                 }
      //                 radioItem['selected'] = true;
      //               }
      //             } catch (err) {
      //               console.log('current error 2', item.id);
      //             }
      //           });
      //           fieldsArray[item.column_name].setValue(radioDataTemp);
      //         }
      //       }
      //       break;
      //     case 'file':
      //       if (
      //         item?.saved_fields?.length > 0 &&
      //         item?.saved_fields[0]?.uploaded_files.length > 0 &&
      //         !onlyPhoto
      //       ) {
      //         fieldsArray[item.column_name].setValue({
      //           id: item.saved_fields[0].uploaded_files[0].id,
      //           val: item.saved_fields[0].uploaded_files[0].filename,
      //         });
      //       }
      //       break;
      //     case 'images':
      //       if (item?.saved_fields?.length > 0 && item?.saved_fields[0]?.uploaded_files.length > 0) {
      //         let images = [];
      //         item.saved_fields[0].uploaded_files.map(imageItem => {
      //           images.push({ id: imageItem.id, photo: imageItem.storage_path });
      //         });
      //         fieldsArray[item.column_name].setValue(images);
      //       }
      //       if (item?.uploaded_files?.length > 0) {
      //         //console.log('item', item);
      //         let images = [];
      //         let newFiles = [];
      //         if (shouldDeleteFiles && shouldDeleteFiles !== null) {
      //           newFiles = item?.uploaded_files.filter(item => {
      //             const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
      //             if (!shouldDelFile || shouldDelFile?.length < 1) {
      //               return item;
      //             }
      //           });
      //         } else {
      //           newFiles = item?.uploaded_files;
      //         }

      //         //console.log(newFiles);

      //         // if (shouldSendFiles && shouldSendFiles !== null) {
      //         //   shouldSendFiles.map(k => {
      //         //     if (k[4] === reportId && k[7] === section.id && k[6] === item.column_name) {
      //         //       newFiles.push({ id: k[1], storage_path: k[0] });
      //         //     }
      //         //   });
      //         // }
      //         //console.log(newFiles);
      //         newFiles.map(imageItem => {
      //           images.push({ id: imageItem.id, photo: imageItem.storage_path });
      //         });
      //         fieldsArray[item.column_name].setValue(images);
      //       }
      //       break;
      //     default:
      //       break;
      //   }
      // });

      if (Array.isArray(fields) && fields.length > 0) {
        if (navFromProgress || openScreen['TechCheck_' + Object.keys(screens)[linkID]] !== 0) {
          Object.keys(tempFields).map(item => {
            if (fieldsArray[item]) {
              if (
                fieldsArray[item].type === 'images' &&
                tempFields[item].saved_fields[0].uploaded_files.length > 0
              ) {
                fieldsArray[item].setValue(tempFields[item].saved_fields[0].uploaded_files);
              }
            }
          });
          setLoaderVisible(false);
        } else {
          setGroupTitles(tempGroupTitles);
          // setFields(tempFields);
          setLoaderVisible(false);
        }
      } else {
        setGroupTitles(tempGroupTitles);
        // setFields(tempFields);
        setLoaderVisible(false);
      }
    } catch (e) {
      setLoaderVisible(false);
      //console.log(e);
    }
  }

  function checkRadio(radioData, comment, res, column_name) {
    let status = { status: 'off', validate: true };
    let variant = 'none';
    radioData.map(item => {
      if (item.selected) {
        variant = item.value;
      }
    });
    if (variant === 'bad' || variant === 'yes') {
      status = { status: 'on', validate: comment !== '' };
    } else if (variant === 'good' || variant === 'no' || variant === 'No probe') {
      status = { status: 'off', validate: true };
    } else {
      status = { status: 'none', validate: false };
    }
    if (status.status === 'on' && !status.validate) {
      res.comList.push(fields[column_name].name);
    }
    if (status.status === 'none' && fields[column_name].required === 2) {
      res.valid.push(false);
    }
  }
  const validateNormalField = field => {
    if (field) {
      if (typeof field.val === 'boolean') {
        return true;
      }

      if (Array.isArray(field.val)) {
        let res = field.val.map(el => el.checked);
        let checked = res.find(el => el === true);
        // if (checked !== undefined) {
        //   let comment = fieldsArray[field?.column_name]?.comment;
        //   console.log('#T8', fields[field?.column_name]?.name);
        //   setCommentList(prevState => {
        //     return [
        //       ...prevState,
        //       fields[field?.column_name]?.name,
        //     ];
        //   });
        // }
        //console.log('$ll', res);
        return checked !== undefined;
      }
    }

    return true;
  };

  const validateGURLevel = field => {
    if (electricBooster) {
      return true;
    } else {
      return validateNormalField(field);
    }
  };

  const validateTestDriveBlockField = field => {
    if (!testDriveSwitch) {
      return true;
    } else {
      return validateNormalField(field);
    }
  };

  const validateComments = (fieldsValues, fieldsDescription) => {
    //console.log('#VC0', fields);
    //console.log('#VC4', fieldsDescription);
    let requiredNow = Object.keys(fieldsDescription).filter(name => {
      return (
        name !== 'tech_elevator_checked' &&
        (fieldsValues[name]?.required === 2 || (fieldsValues[name]?.required > 0 && goToUnfilled))
      );
    });

    let unfilledComments = [];
    requiredNow.forEach(name => {
      let field = fieldsValues[name];
      //console.log('#VC2', field);
      if (Array.isArray(field.val)) {
        let bad = field.val.find(el => el.label === 'Плохо' || el.label === 'Да');
        if (bad?.checked) {
          //console.log('#S', name);
          if (!fieldsArray[name]?.comment && fieldsArray[name]?.comment === '') {
            //console.log('#S2', name);
            unfilledComments.push(fieldsValues[name]?.name);
          }
        }

        // if (checked !== undefined) {
        //   let comment = fieldsArray[field?.column_name]?.comment;
        //   console.log('#T8', fields[field?.column_name]?.name);
        //   setCommentList(prevState => {
        //     return [
        //       ...prevState,
        //       fields[field?.column_name]?.name,
        //     ];
        //   });
        // }
        //console.log('$ll', res);
      }
    });
    setCommentList(unfilledComments);

    return unfilledComments;
  };
  function validate() {
    //let res = { valid: [], comList: [] };
    setCommentList([]);

    // console.log('#T7', fieldsArray);
    //console.log('');
    let fieldsTab = {};
    let fieldsDescriptionsTab = {};

    let extrasForMenuSection = {};

    let fieldsForMenuAll = {};
    let fieldsDescriptionsForMenuAll = {};
    let extrasForMenuAll = {};

    let currentTabName = Object.keys(screens)[linkID];

    Object.keys(fieldsDescriptions).forEach(field_name => {
      if (fieldsDescriptions[field_name].tab === currentTabName) {
        fieldsDescriptionsTab[field_name] = fieldsDescriptions[field_name];
      }
      fieldsDescriptionsForMenuAll[field_name] = fieldsDescriptions[field_name];
    });

    Object.keys(fieldsArray).forEach(field_name => {
      if (fieldsDescriptions[field_name].tab === currentTabName) {
        fieldsTab[field_name] = {
          val: fieldsArray[field_name].value,
          required: fieldsDescriptionsTab[field_name].required,
          column_name: field_name,
          name: fieldsDescriptionsTab[field_name]?.name,
        };
      }
      fieldsForMenuAll[field_name] = {
        val: fieldsArray[field_name].value,
        required: fieldsDescriptionsTab[field_name]?.required ?? 0,
        column_name: field_name,
        name: fieldsDescriptionsTab[field_name]?.name,
      };
      //console.log('#Q9', fieldsDescriptionsTab);
    });

    let extras = {};

    Object.keys(fieldsDescriptionsTab).forEach(field_name => {
      let needCheck =
        fieldsDescriptions[field_name]?.required === 2 ||
        (fieldsDescriptions[field_name]?.required > 0 && goToUnfilled);
      let needCheckForMenu = fieldsDescriptions[field_name]?.required > 0;
      if (field_name === 'tech_liquid_gur_level') {
        if (needCheck) {
          extras[field_name] = validateGURLevel;
        }
        if (needCheckForMenu) {
          extrasForMenuSection[field_name] = validateGURLevel;
        }
      } else if (
        ['tech_test_drive_engine', 'tech_test_drive_kpp', 'tech_test_drive_suspension'].includes(
          field_name
        )
      ) {
        if (needCheck) {
          extras[field_name] = validateTestDriveBlockField;
        }
        if (needCheckForMenu) {
          extrasForMenuSection[field_name] = validateTestDriveBlockField;
        }
      } else {
        if (needCheck) {
          extras[field_name] = validateNormalField;
        }
        if (needCheckForMenu) {
          extrasForMenuSection[field_name] = validateNormalField;
        }
      }
    });

    Object.keys(fieldsDescriptionsForMenuAll).forEach(field_name => {
      let needCheckForMenu = fieldsDescriptionsForMenuAll[field_name]?.required > 0;
      if (field_name === 'tech_liquid_gur_level') {
        if (needCheckForMenu) {
          extrasForMenuAll[field_name] = validateGURLevel;
        }
      } else if (
        ['tech_test_drive_engine', 'tech_test_drive_kpp', 'tech_test_drive_suspension'].includes(
          field_name
        )
      ) {
        if (needCheckForMenu) {
          extrasForMenuAll[field_name] = validateTestDriveBlockField;
        }
      } else {
        if (needCheckForMenu) {
          extrasForMenuAll[field_name] = validateNormalField;
        }
      }
    });

    // console.log(
    //   '#X2',
    //   Object.keys(extras),
    //   Object.keys(extrasForMenuSection),
    //   Object.keys(extrasForMenuAll)
    // );

    let validationResults = validateFields(fieldsTab, fieldsDescriptionsTab, goToUnfilled, extras);
    let validationResultsForMenuSection = validateFields(
      fieldsTab,
      fieldsDescriptionsTab,
      true,
      extrasForMenuSection
    );
    let validationResultsForMenuAll = validateFields(
      fieldsForMenuAll,
      fieldsDescriptionsForMenuAll,
      true,
      extrasForMenuAll
    );

    let unfilledComments = validateComments(fieldsTab, fieldsDescriptionsTab);

    if (unfilledComments.length > 0) {
      //modalCommentRequredFlag
      //changeModalCommentRequredFlag(true)
      return 'comments_not_ok';
    }
    //console.log('#DW', commentList);

    let allValid = Object.values(validationResults).every(item => item);
    let allValidForSection = Object.values(validationResultsForMenuSection).every(item => item);
    let allValidForMenuAll = Object.values(validationResultsForMenuAll).every(item => item);
    //console.log('#X5', allValid, allValidForSection, allValidForMenuAll);

    if (allValidForMenuAll) {
      dispatch(setOpenScreen('TechCheckScreen', 2));
    } else {
      dispatch(setOpenScreen('TechCheckScreen', 1));
    }
    if (allValidForSection) {
      dispatch(setOpenScreen('TechCheck_' + Object.keys(screens)[linkID], 2));
    } else {
      dispatch(setOpenScreen('TechCheck_' + Object.keys(screens)[linkID], 1));
    }
    return allValid ? 'ok' : 'not_ok';

    //console.log('#X4', fieldsDescriptionsTab);
    // Object.keys(fieldsArray).map(item => {
    //   if (fields[item]) {
    //     if (fields[item].tab === Object.keys(screens)[linkID]) {
    //       let req = false;
    //
    //       if (fields[item].type === 'radiobutton') {
    //         if (item === 'tech_liquid_gur_level') {
    //           if (!electricBooster) {
    //             checkRadio(fieldsArray[item].value, fieldsArray[item].comment, res, item);
    //           }
    //         } else if (
    //           ['tech_test_drive_engine', 'tech_test_drive_kpp', 'tech_test_drive_suspension'].includes(
    //             item
    //           )
    //         ) {
    //           if (testDriveSwitch) {
    //             checkRadio(fieldsArray[item].value, fieldsArray[item].comment, res, item);
    //           }
    //         } else {
    //           checkRadio(fieldsArray[item].value, fieldsArray[item].comment ?? 'null', res, item);
    //         }
    //       } else if (fields[item].type === 'text') {
    //         if (doubleReq) req = fields[item].required === 2 || fields[item].required === 1;
    //         else req = fields[item].required === 2;
    //
    //         if (
    //           ['tech_test_drive_engine', 'tech_test_drive_kpp', 'tech_test_drive_suspension'].includes(
    //             item
    //           )
    //         ) {
    //           if (testDriveSwitch) {
    //             if (fieldsArray[item].value === '' && req) {
    //               res.valid.push(false);
    //             }
    //           }
    //         } else if (item === 'tech_test_drive_results') {
    //           if (eDiagnostic) {
    //             if (fieldsArray[item].value === '' && req) {
    //               res.valid.push(false);
    //             }
    //           }
    //         } else {
    //           if (fieldsArray[item].value === '' && req) {
    //             res.valid.push(false);
    //           }
    //         }
    //       }
    //     }
    //   }
    // });

    //return true;
  }
  function validForMenu() {
    let valid = validate() === 'ok';
    return valid;
  }
  function funcForMenu() {
    // let valid = requiredChecking();
    // if (valid.valid.length > 0) {
    //   setModalErrorMessage('Не все обязательные поля заполнены');
    //   changeModalErrorVisibleFlag(true);
    // } else if (valid.comList.length > 0) {
    //   setCommentList(valid.comList);
    //   changeModalCommentRequredFlag(true);
    // }
  }

  function next() {
    // if (
    //   linkID <=
    //   Object.keys(Object.keys(unfilledScreens).length > 0 ? unfilledScreens : screens).length - 1
    // ) {
    //   globalFunctions.globalSendDataAndGoNext(
    //     token,
    //     reportId,
    //     setLoaderVisible,
    //     saveData,
    //     'TechCheckScreen',
    //     navigation,
    //     dispatch,
    //     sectionList,
    //     constants,
    //     'technical_check_of_auto',
    //     goToUnfilled
    //   );
    // }
    setLoaderVisible(true);
    let valid = validate();
    if (valid !== 'ok') {
      //console.log('##A', valid);
      if (valid === 'comments_not_ok') {
        changeModalCommentRequredFlag(true)
      } else {
        setModalErrorMessage('Не все обязательные поля заполнены');
        changeModalErrorVisibleFlag(true);
      }
    } else {
      if (linkID < Object.keys(screens).length - 1) {
        setLinkID(prev => prev + 1);
      } else {
        globalFunctions.globalSendDataAndGoNext(
          token,
          reportId,
          setLoaderVisible,
          saveData,
          'TechCheckScreen',
          navigation,
          dispatch,
          sectionList,
          constants,
          'technical_check_of_auto',
          goToUnfilled
        );
      }
    }
    setLoaderVisible(false);
    // } else if (valid.comList.length > 0) {
    //   setCommentList(valid.comList);
    //   changeModalCommentRequredFlag(true);
    // } else {
    //   setLinkID(linkID + 1);
    // }
    // } else {
    //   globalFunctions.globalSendDataAndGoNext(
    //     token,
    //     reportId,
    //     setLoaderVisible,
    //     saveData,
    //     'TechCheckScreen',
    //     navigation,
    //     dispatch,
    //     sectionList,
    //     constants,
    //     'technical_check_of_auto',
    //     goToUnfilled
    //   );
    // }
  }

  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    let fieldId = extra_args.fieldId;
    console.log('#K3', column_name, fieldId);
    if (!netInfo?.isConnected) {
      console.log('no connection, tech check');
    } else {
      global
        .sendFiles(response.uri, response.name, extra_args.imgData.type, fieldId, reportId, token)
        .then(result => {
          console.log('#K1', result.data.data.id, result.data.data.storage_path);
          fieldsArray[column_name].setValue(arr => {
            let newAr = [
              ...arr,
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
              },
            ];
            console.log('#K2', newAr);
            //fieldsArray.tech_other_images.setValue(newAr);
            return newAr;
          });
        })
        .catch(err => {
          console.log('send files error in tech check', err?.response);
        });
    }
  }

  //#endregion -----------

  // useEffect(() => {
  //   if (netInfo?.isConnected !== null) {
  //     if (navFromProgress || openScreen['TechCheck_' + Object.keys(screens)[linkID]] !== 0) {
  //       getData();
  //       fecthData(true);
  //     }
  //   }
  // }, [navFromProgress, renderProgress, linkID, netInfo]);

  useEffect(() => {
    !modalErrorVisibleFlag && setModalErrorMessage('Завершите предыдущий шаг!');
  }, [modalErrorVisibleFlag]);

  useEffect(() => {
    if (fields) {
      refScroll.current.scrollToPosition(0, 0, true);
    }
  }, [linkID]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'TechCheckScreen') {
      // if (goToUnfilled) {
      //   getData(true);
      // } else {
      //   if (openScreen.TechCheckScreen === 0) {
      //     getData();
      //     fecthData();
      //   } else {
      //
      //   }
      // }
      getData()
        .then(
          fecthData().catch(error => {
            console.log('fetch data error, tech check', error);
          })
        )
        .catch(error => {
          console.log('get data error, tech check', error);
        });
    }
  }, [netInfo, route]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <HeaderBar
        title={section.title}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={saveData}
            setLoaderVisible={setLoaderVisible}
            validateFunc={() =>
              fields
                ? validForMenu()
                : () => {
                    true;
                  }
            }
            currentScreen={'TechCheckScreen'}
          />
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={goToUnfilled ? true : backSection.check}
        endReport={goToUnfilled ? true : false}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={!fields ? COLORS.none : COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        {!fields ? (
          <></>
        ) : (
          <View style={styles.wrapper}>
            <View style={styles.container}>
              <Tabs
                showDivider={false}
                active={linkID}
                titles={Object.values(screens)}
                links={setLinkID}
                listStep={Object.keys(screens).map(item => {
                  return 'TechCheck_' + item;
                })}
                // checkFunc={() =>
                //   fields
                //     ? validForMenu()
                //     : () => {
                //         true;
                //       }
                // }
                checkFunc={() => {
                  return true;
                }}
                modalErrorFunc={funcForMenu}
              />
              <KeyboardAwareScrollView
                ref={refScroll}
                contentContainerStyle={[styles.scroll, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
              >
                {/* <ScrollView
									showsVerticalScrollIndicator={false}
									contentContainerStyle={styles.scroll}
									ref={refScroll}
								> */}
                {Object.keys(screens)[linkID] === 'engine_off' ? (
                  <>
                    <EngineNotRunnig
                      fields={fields}
                      fieldsArray={fieldsArray}
                      system={system}
                      groupTitles={groupTitles}
                    />
                    <AdditionalPhotos
                      value={fieldsArray.tech_other_images.value}
                      setValue={fieldsArray.tech_other_images.setValue}
                      dowloadFoto={(value, setValue) => {
                        addPhoto(
                          'gallery',
                          value,
                          setValue,
                          serverWorkFuncImage,
                          setLoaderVisible,
                          {
                            fieldId: fields.tech_other_images.id,
                            column_name: fields.tech_other_images.column_name,
                          },
                          true
                        );
                      }}
                      makeFoto={(value, setValue) => {
                        addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible, {
                          fieldId: fields.tech_other_images.id,
                          column_name: fields.tech_other_images.column_name,
                        });
                      }}
                    />
                  </>
                ) : Object.keys(screens)[linkID] === 'engine_on' ? (
                  <EngineRunnig
                    fields={fields}
                    fieldsArray={fieldsArray}
                    groupTitles={groupTitles}
                    system={system}
                  />
                ) : Object.keys(screens)[linkID] === 'test_drive' ? (
                  <>
                    <TestDrive fields={fields} fieldsArray={fieldsArray} system={system} />
                    {fields.tech_test_drive_photos && (
                      <AdditionalPhotos
                        value={fieldsArray.tech_test_drive_photos.value}
                        setValue={fieldsArray.tech_test_drive_photos.setValue}
                        dowloadFoto={(value, setValue) => {
                          addPhoto(
                            'gallery',
                            value,
                            setValue,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            {
                              fieldId: fields.tech_test_drive_photos.id,
                              column_name: fields.tech_test_drive_photos.column_name,
                            },
                            true
                          );
                        }}
                        makeFoto={(value, setValue) => {
                          addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible, {
                            fieldId: fields.tech_test_drive_photos.id,
                            column_name: fields.tech_test_drive_photos.column_name,
                          });
                        }}
                      />
                    )}
                  </>
                ) : Object.keys(screens)[linkID] === 'elevator' ? (
                  <>
                    <LiftCheck fields={fields} fieldsArray={fieldsArray} system={system} />
                    {fields.tech_elevator_photos && (
                      <AdditionalPhotos
                        value={fieldsArray.tech_elevator_photos.value}
                        setValue={fieldsArray.tech_elevator_photos.setValue}
                        dowloadFoto={(value, setValue) => {
                          addPhoto(
                            'gallery',
                            value,
                            setValue,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            {
                              fieldId: fields.tech_elevator_photos.id,
                              column_name: fields.tech_elevator_photos.column_name,
                            },
                            true
                          );
                        }}
                        makeFoto={(value, setValue) => {
                          addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible, {
                            fieldId: fields.tech_elevator_photos.id,
                            column_name: fields.tech_elevator_photos.column_name,
                          });
                        }}
                      />
                    )}
                  </>
                ) : (
                  <></>
                )}
                <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
                  <Text style={styles.nextBtn}>Далее</Text>
                </TouchableOpacity>
                {/* </ScrollView> */}
              </KeyboardAwareScrollView>
            </View>
          </View>
        )}
      </HeaderBar>
      <ModalFotoCancel
        modalVisible={modalFotoCancelFlag}
        setModalVisible={changeModalFotoCancelFlag}
        modalFotoCancelData={modalFotoCancelData}
        indexDeleteFoto={indexDeleteFoto}
      />

      <Modal
        statusBarTranslucent={true}
        style={styles.modalExit}
        //animationType="fade"
        transparent={true}
        visible={modalCommentRequredFlag}
        onRequestClose={() => {
          changeModalCommentRequredFlag(false);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            changeModalCommentRequredFlag(false);
          }}
        >
          <View style={styles.modalViewWrapper}>
            <View style={styles.modalViewWrapperContent}>
              <Text style={styles.modalTitle}>Необходимо оставить комментарий в блоках:</Text>
              {commentList.length > 0 &&
                commentList.map((item, i) => (
                  <Text key={i} style={styles.modalList}>
                    {'\u2022' + ' ' + item}
                  </Text>
                ))}
              <View style={styles.modalTouchableInner}>
                <TouchableOpacity
                  onPress={() => {
                    changeModalCommentRequredFlag(false);
                  }}
                >
                  <Text style={[styles.modalText, { color: '#FF3B30' }]}>Ок</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <ModalError
        modalFlag={modalErrorVisibleFlag}
        changeModalFlag={changeModalErrorVisibleFlag}
        message={modalErrorMessage}
      />
    </SafeAreaView>
  );
};

export default TechCheckScreen;
