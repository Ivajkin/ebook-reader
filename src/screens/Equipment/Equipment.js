//#region import libres

//#region react components
import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from 'react-native';
//#endregion

//#region images

//#region plagins
import AnimatedLoader from 'react-native-animated-loader';
import { connect, useDispatch } from 'react-redux';
//#endregion

//#region components
import { HeaderBar, ProgressMenu, Tabs } from '../../components/menu';
import { ModalChoose, ModalError } from '../../components/modal';
import { setOpenScreen } from '../../redux/App/actions/mainActions';
import { ModalChooseDataFunc } from '../../utils';
import { global } from '../../requests';
import { FieldModal, FieldInput, FieldCheckSwitch } from '../../components/fields';
import { loader, theme, COLORS, constants } from '../../сonstants';
import { globalFunctions } from '../../utils';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validateFields from '../../utils/validateRequired';
//#endregion

//#endregion

const EquipmentScreen = ({
  route,
  navigation,
  token,
  openScreen,
  reportId,
  sectionList,
  reportType,
}) => {
  //#region valuebles
  //#region redux
  const netInfo = useNetInfo();

  const section = sectionList.equipment;

  const dispatсh = useDispatch();
  //#endregion

  //#region system
  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'equipment',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'equipment',
    'back'
  );

  const refScroll = useRef();

  const screens = {
    overview: 'Обзор',
    exterior: 'Экстерьер',
    anti_theft_protection: 'Защита от угона',
    multimedia: 'мультимедиа',
    salon: 'салон',
    comfort: 'комфорт',
    safety: 'безопасность',
    other: 'Прочее',
  };

  const [linkID, setLinkID] = useState(0);

  const [modalChooseData, setModalChooseData] = useState(null);
  const [indexParantCheckRadio, setIndexParantCheckRadio] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(true);

  //const [modalErrorMessage, setModalErrorMessage] = useState('Завершите предыдущий шаг!');
  //#endregion system

  //#region flag
  const [modalChoosFlag, changeModalChoosFlag] = useState(false);
  //const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);
  //#endregion flag

  //#region data
  const [fields, setFields] = useState(null);

  //#region text
  const [complectName, setComplectName] = useState(null);
  const [comment, setComment] = useState(null);
  const [signalingData, setSignalingData] = useState(null);
  const [countSeatsData, setCountSeatsData] = useState(null);
  const [airbagsData, setAirbagsData] = useState(null);
  //#endregion

  //#region checkbox
  const [lightCorection, changeLightCorection] = useState(false);
  const [lightWash, changeLightWash] = useState(false);
  const [lightFog, changeLightFog] = useState(false);
  const [lightAdaptive, changeLightAdaptive] = useState(false);
  const [lightFar, changeLightFar] = useState(false);
  const [lightSensor, changeLightSensor] = useState(false);
  const [rainSensor, changeRainSensor] = useState(false);
  const [airbrushing, changeAirbrushing] = useState(false);
  const [bodyKit, changeBodyKit] = useState(false);
  const [roofRails, changeRoofRails] = useState(false);
  const [immobilizer, changeImmobilizer] = useState(false);
  const [volumeSensor, changeVolumeSensor] = useState(false);
  const [centralLocking, changeCentralLocking] = useState(false);
  const [AUX, changeAUX] = useState(false);
  const [bluetooth, changeBluetooth] = useState(false);
  const [USB, changeUSB] = useState(false);
  const [voice, changeVoice] = useState(false);
  const [backMultimedia, changeBackMultimedia] = useState(false);
  const [nav, changeNav] = useState(false);
  const [v12, changeV12] = useState(false);
  const [v220, changeV220] = useState(false);
  const [leatherRudder, changeLeatherRudder] = useState(false);
  const [leatherGearshift, changeLeatheGearshift] = useState(false);
  const [foldingSeat, changeFoldingSeat] = useState(false);
  const [sportSeat, changeSportSeat] = useState(false);
  const [trirdRowSeat, changeTrirdRowSeat] = useState(false);
  const [luk, changeLuk] = useState(false);
  const [heatedSteeringWheel, changeHeatedSteeringWheel] = useState(false);
  const [panoramicRoof, changePanoramicRoof] = useState(false);
  const [frontCenterArmrest, changeFrontCenterArmrest] = useState(false);
  const [tintedGlass, changeTintedGlass] = useState(false);
  const [onboardComputer, changeOnboardComputer] = useState(false);
  const [remoteEngineStart, changeRemoteEngineStart] = useState(false);
  const [startingEngineButton, changeStartingEngineButton] = useState(false);
  const [multifunctionalSteeringWheel, changeMultifunctionalSteeringWheel] = useState(false);
  const [openingTrunkWithoutHands, changeOpeningTrunkWithoutHands] = useState(false);
  const [paddleShifters, changePaddleShifters] = useState(false);
  const [programmablePreHeater, changeProgrammablePreHeater] = useState(false);
  const [adjustablePedalAssembly, changeAdjustablePedalAssembly] = useState(false);
  const [startStopSystem, changeStartStopSystem] = useState(false);
  const [keylessAccessSystem, changeKeylessAccessSystem] = useState(false);
  const [electronicDashboard, changeElectronicDashboard] = useState(false);
  const [powerMirrors, changePowerMirrors] = useState(false);
  const [trunkLidElectricDrive, changeTrunkLidElectricDrive] = useState(false);
  const [electroFoldingMirrors, changeElectroFoldingMirrors] = useState(false);
  const [ABS, changeABS] = useState(false);
  const [ESP, changeESP] = useState(false);
  const [tirePressureSensor, changeTirePressureSensor] = useState(false);
  const [rearDoorLock, changeRearDoorLock] = useState(false);
  const [armoredBody, changeArmoredBody] = useState(false);
  const [ERAGLONASS, changeERAGLONASS] = useState(false);
  const [crankcaseProtection, changeCrankcaseProtection] = useState(false);
  const [towbar, changeTowbar] = useState(false);
  //#endregion

  //#region select
  const [lightData, setLightData] = useState({ forSend: [], forInput: [] });
  const [electricHeatingData, setElectricHeatingData] = useState({ forSend: [], forInput: [] });
  const [typeDisksData, setTypeDisksData] = useState({ forSend: [], forInput: [] });
  const [audioSistemData, setAudioSistemData] = useState({ forSend: [], forInput: [] });
  const [materialSalonData, setMaterialSalonData] = useState({ forSend: [], forInput: [] });
  const [colorSalonData, setColorSalonData] = useState({ forSend: [], forInput: [] });
  const [heatedSeatsData, setHeatedSeatsData] = useState({ forSend: [], forInput: [] });
  const [heightSeatsData, setHeightSeatsData] = useState({ forSend: [], forInput: [] });
  const [electricallySeatsData, setElectricallySeatsData] = useState({ forSend: [], forInput: [] });
  const [seatPositionMemoryData, setSeatPositionMemoryData] = useState({ forSend: [], forInput: [] });
  const [seatVentilationData, setSeatVentilationData] = useState({ forSend: [], forInput: [] });
  const [cameraData, setCameraData] = useState({ forSend: [], forInput: [] });
  const [conditionerData, setConditionerData] = useState({ forSend: [], forInput: [] });
  const [cruiseControlData, setCruiseControlData] = useState({ forSend: [], forInput: [] });
  const [steeringWheelAdjustmentData, setSteeringWheelAdjustmentData] = useState({
    forSend: [],
    forInput: [],
  });
  const [parkingAssistanceSystemData, setParkingAssistanceSystemData] = useState({
    forSend: [],
    forInput: [],
  });
  const [powerSteeringData, setPowerSteeringData] = useState({ forSend: [], forInput: [] });
  const [powerWindowsData, setPowerWindowsData] = useState({ forSend: [], forInput: [] });
  const [supportSystemsData, setSupportSystemsData] = useState({ forSend: [], forInput: [] });
  const [isofixFasteningSystemData, setIsofixFasteningSystemData] = useState({
    forSend: [],
    forInput: [],
  });
  const [suspensionData, setSuspensionData] = useState({ forSend: [], forInput: [] });

  const currentSelected = {
    headlights: lightData,
    adjustable_steering_wheel: steeringWheelAdjustmentData,
    interior_material: materialSalonData,
    interior_color: colorSalonData,
    heated_seats: heatedSeatsData,
    seat_height_adjustment: heightSeatsData,
    electrically_adjustable_seats: electricallySeatsData,
    seat_position_memory: seatPositionMemoryData,
    seat_ventilation: seatVentilationData,
    electric_heating: electricHeatingData,
    support_systems: supportSystemsData,
    isofix_fastening_systems: isofixFasteningSystemData,
    suspension: suspensionData,
    audio_system: audioSistemData,
    disc_type: typeDisksData,
    camera: cameraData,
    conditioner: conditionerData,
    cruise_control: cruiseControlData,
    parking_assistance: parkingAssistanceSystemData,
    power_steering: powerSteeringData,
    power_windows: powerWindowsData,
  };
  //#endregion

  //#region validate flag
  const [complectNameValidateFlag, changeComplectNameValidateFlag] = useState(true);
  const [lightDataValidateFlag, changeLightDataValidateFlag] = useState(true);
  const [electricHeatingDataValidateFlag, changeElectricHeatingDataValidateFlag] = useState(true);
  const [commentValidateFlag, changeCommentValidateFlag] = useState(true);
  const [typeDisksValidateFlag, changeTypeDisksValidateFlag] = useState(true);
  const [signalingDataValidateFlag, changeSignalingDataValidateFlag] = useState(true);
  const [audioSistemDataValidateFlag, changeAudioSistemDataValidateFlag] = useState(true);
  const [materialSalonDataValidateFlag, changeMaterialSalonDataValidateFlag] = useState(true);
  const [colorSalonDataValidateFlag, changeColorSalonDataValidateFlag] = useState(true);
  const [countSeatsDataValidateFlag, changeCountSeatsDataValidateFlag] = useState(true);
  const [heatedSeatsDataValidateFlag, changeHeatedSeatsDataValidateFlag] = useState(true);
  const [heightSeatsDataValidateFlag, changeHeightSeatsDataValidateFlag] = useState(true);
  const [electricallySeatsDataValidateFlag, changeElectricallySeatsDataValidateFlag] = useState(true);
  const [seatPositionMemoryValidateFlag, changeSeatPositionMemoryDataValidateFlag] = useState(true);
  const [seatVentilationDataValidateFlag, changeSeatVentilationDataValidateFlag] = useState(true);
  const [cameraDataValidateFlag, changeCameraDataValidateFlag] = useState(true);
  const [conditionerDataValidateFlag, changeConditionerDataValidateFlag] = useState(true);
  const [cruiseControlDataValidateFlag, changeCruiseControlDataValidateFlag] = useState(true);
  const [steeringWheelAdjustmentDataValidateFlag, changeSteeringWheelAdjustmentDataValidateFlag] =
    useState(true);
  const [parkingAssistanceSystemDataValidateFlag, changeParkingAssistanceSystemDataValidateFlag] =
    useState(true);
  const [powerSteeringDataValidateFlag, changePowerSteeringDataValidateFlag] = useState(true);
  const [powerWindowsDataValidateFlag, changePowerWindowsDataValidateFlag] = useState(true);
  const [supportSystemsDataValidateFlag, changeSupportSystemsDataValidateFlag] = useState(true);
  const [airbagsDataValidateFlag, changeAirbagsDataValidateFlag] = useState(true);
  const [isofixFasteningSystemDataValidateFlag, changeIsofixFasteningSystemDataValidateFlag] =
    useState(true);
  const [suspensionDataValidateFlag, changeSuspensionDataValidateFlag] = useState(true);
  //#endregion

  //#region unfilled fields
  //const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const [unfilledScreens, setUnfilledScreens] = useState({});
  //#endregion

  const fieldsArray = {
    name: {
      tab: 'overview',
      value: complectName,
      setValue: setComplectName,
      validateFlag: complectNameValidateFlag,
      changeValidateFlag: changeComplectNameValidateFlag,
    },
    automatic_headlight: {
      tab: 'overview',
      value: lightCorection,
      setValue: changeLightCorection,
      validateFlag: null,
      changeValidateFlag: null,
    },
    'headlight washer': {
      tab: 'overview',
      value: lightWash,
      setValue: changeLightWash,
      validateFlag: null,
      changeValidateFlag: null,
    },
    fog_lights: {
      tab: 'overview',
      value: lightFog,
      setValue: changeLightFog,
      validateFlag: null,
      changeValidateFlag: null,
    },
    adaptive_lighting: {
      tab: 'overview',
      value: lightAdaptive,
      setValue: changeLightAdaptive,
      validateFlag: null,
      changeValidateFlag: null,
    },
    beam_control_system: {
      tab: 'overview',
      value: lightFar,
      setValue: changeLightFar,
      validateFlag: null,
      changeValidateFlag: null,
    },
    headlights: {
      tab: 'overview',
      value: lightData,
      setValue: setLightData,
      validateFlag: lightDataValidateFlag,
      changeValidateFlag: changeLightDataValidateFlag,
    },
    rain_sensor: {
      tab: 'overview',
      value: rainSensor,
      setValue: changeRainSensor,
      validateFlag: null,
      changeValidateFlag: null,
    },
    light_sensor: {
      tab: 'overview',
      value: lightSensor,
      setValue: changeLightSensor,
      validateFlag: null,
      changeValidateFlag: null,
    },
    electric_heating: {
      tab: 'overview',
      value: electricHeatingData,
      setValue: setElectricHeatingData,
      validateFlag: electricHeatingDataValidateFlag,
      changeValidateFlag: changeElectricHeatingDataValidateFlag,
    },
    comment_overview: {
      tab: 'overview',
      value: comment,
      setValue: setComment,
      validateFlag: commentValidateFlag,
      changeValidateFlag: changeCommentValidateFlag,
    },
    airbrushing: {
      tab: 'exterior',
      value: airbrushing,
      setValue: changeAirbrushing,
      validateFlag: null,
      changeValidateFlag: null,
    },
    body_kit: {
      tab: 'exterior',
      value: bodyKit,
      setValue: changeBodyKit,
      validateFlag: null,
      changeValidateFlag: null,
    },
    roof_rails: {
      tab: 'exterior',
      value: roofRails,
      setValue: changeRoofRails,
      validateFlag: null,
      changeValidateFlag: null,
    },
    disc_type: {
      tab: 'exterior',
      value: typeDisksData,
      setValue: setTypeDisksData,
      validateFlag: typeDisksValidateFlag,
      changeValidateFlag: changeTypeDisksValidateFlag,
    },
    immobilizer: {
      tab: 'anti_theft_protection',
      value: immobilizer,
      setValue: changeImmobilizer,
      validateFlag: null,
      changeValidateFlag: null,
    },
    signaling: {
      tab: 'anti_theft_protection',
      value: signalingData,
      setValue: setSignalingData,
      validateFlag: signalingDataValidateFlag,
      changeValidateFlag: changeSignalingDataValidateFlag,
    },
    volume_sensor: {
      tab: 'anti_theft_protection',
      value: volumeSensor,
      setValue: changeVolumeSensor,
      validateFlag: null,
      changeValidateFlag: null,
    },
    central_locking: {
      tab: 'anti_theft_protection',
      value: centralLocking,
      setValue: changeCentralLocking,
      validateFlag: null,
      changeValidateFlag: null,
    },
    aux: {
      tab: 'multimedia',
      value: AUX,
      setValue: changeAUX,
      validateFlag: null,
      changeValidateFlag: null,
    },
    bluetooth: {
      tab: 'multimedia',
      value: bluetooth,
      setValue: changeBluetooth,
      validateFlag: null,
      changeValidateFlag: null,
    },
    usb: {
      tab: 'multimedia',
      value: USB,
      setValue: changeUSB,
      validateFlag: null,
      changeValidateFlag: null,
    },
    audio_system: {
      tab: 'multimedia',
      value: audioSistemData,
      setValue: setAudioSistemData,
      validateFlag: audioSistemDataValidateFlag,
      changeValidateFlag: changeAudioSistemDataValidateFlag,
    },
    voice_control: {
      tab: 'multimedia',
      value: voice,
      setValue: changeVoice,
      validateFlag: null,
      changeValidateFlag: null,
    },
    rear_seat_multimedia: {
      tab: 'multimedia',
      value: backMultimedia,
      setValue: changeBackMultimedia,
      validateFlag: null,
      changeValidateFlag: null,
    },
    navigation_system: {
      tab: 'multimedia',
      value: nav,
      setValue: changeNav,
      validateFlag: null,
      changeValidateFlag: null,
    },
    '12v_socket': {
      tab: 'multimedia',
      value: v12,
      setValue: changeV12,
      validateFlag: null,
      changeValidateFlag: null,
    },
    '220v_socket': {
      tab: 'multimedia',
      value: v220,
      setValue: changeV220,
      validateFlag: null,
      changeValidateFlag: null,
    },
    interior_material: {
      tab: 'salon',
      value: materialSalonData,
      setValue: setMaterialSalonData,
      validateFlag: materialSalonDataValidateFlag,
      changeValidateFlag: changeMaterialSalonDataValidateFlag,
    },
    interior_color: {
      tab: 'salon',
      value: colorSalonData,
      setValue: setColorSalonData,
      validateFlag: colorSalonDataValidateFlag,
      changeValidateFlag: changeColorSalonDataValidateFlag,
    },
    leather_steering_wheel: {
      tab: 'salon',
      value: leatherRudder,
      setValue: changeLeatherRudder,
      validateFlag: null,
      changeValidateFlag: null,
    },
    gear_lever_leather_trim: {
      tab: 'salon',
      value: leatherGearshift,
      setValue: changeLeatheGearshift,
      validateFlag: null,
      changeValidateFlag: null,
    },
    seats_number: {
      tab: 'salon',
      value: countSeatsData,
      setValue: setCountSeatsData,
      validateFlag: countSeatsDataValidateFlag,
      changeValidateFlag: changeCountSeatsDataValidateFlag,
    },
    heated_seats: {
      tab: 'salon',
      value: heatedSeatsData,
      setValue: setHeatedSeatsData,
      validateFlag: heatedSeatsDataValidateFlag,
      changeValidateFlag: changeHeatedSeatsDataValidateFlag,
    },
    seat_height_adjustment: {
      tab: 'salon',
      value: heightSeatsData,
      setValue: setHeightSeatsData,
      validateFlag: heightSeatsDataValidateFlag,
      changeValidateFlag: changeHeightSeatsDataValidateFlag,
    },
    electrically_adjustable_seats: {
      tab: 'salon',
      value: electricallySeatsData,
      setValue: setElectricallySeatsData,
      validateFlag: electricallySeatsDataValidateFlag,
      changeValidateFlag: changeElectricallySeatsDataValidateFlag,
    },
    seat_position_memory: {
      tab: 'salon',
      value: seatPositionMemoryData,
      setValue: setSeatPositionMemoryData,
      validateFlag: seatPositionMemoryValidateFlag,
      changeValidateFlag: changeSeatPositionMemoryDataValidateFlag,
    },
    seat_ventilation: {
      tab: 'salon',
      value: seatVentilationData,
      setValue: setSeatVentilationData,
      validateFlag: seatVentilationDataValidateFlag,
      changeValidateFlag: changeSeatVentilationDataValidateFlag,
    },
    folding_rear_seat: {
      tab: 'salon',
      value: foldingSeat,
      setValue: changeFoldingSeat,
      validateFlag: null,
      changeValidateFlag: null,
    },
    sport_front_seat: {
      tab: 'salon',
      value: sportSeat,
      setValue: changeSportSeat,
      validateFlag: null,
      changeValidateFlag: null,
    },
    third_row_seats: {
      tab: 'salon',
      value: trirdRowSeat,
      setValue: changeTrirdRowSeat,
      validateFlag: null,
      changeValidateFlag: null,
    },
    luke: {
      tab: 'salon',
      value: luk,
      setValue: changeLuk,
      validateFlag: null,
      changeValidateFlag: null,
    },
    heated_steering_wheel: {
      tab: 'salon',
      value: heatedSteeringWheel,
      setValue: changeHeatedSteeringWheel,
      validateFlag: null,
      changeValidateFlag: null,
    },
    panoramic_roof: {
      tab: 'salon',
      value: panoramicRoof,
      setValue: changePanoramicRoof,
      validateFlag: null,
      changeValidateFlag: null,
    },
    front_center_armrest: {
      tab: 'salon',
      value: frontCenterArmrest,
      setValue: changeFrontCenterArmrest,
      validateFlag: null,
      changeValidateFlag: null,
    },
    tinted_glass: {
      tab: 'salon',
      value: tintedGlass,
      setValue: changeTintedGlass,
      validateFlag: null,
      changeValidateFlag: null,
    },
    on_board_computer: {
      tab: 'comfort',
      value: onboardComputer,
      setValue: changeOnboardComputer,
      validateFlag: null,
      changeValidateFlag: null,
    },
    remote_engine_start: {
      tab: 'comfort',
      value: remoteEngineStart,
      setValue: changeRemoteEngineStart,
      validateFlag: null,
      changeValidateFlag: null,
    },
    engine_start_from_button: {
      tab: 'comfort',
      value: startingEngineButton,
      setValue: changeStartingEngineButton,
      validateFlag: null,
      changeValidateFlag: null,
    },
    camera: {
      tab: 'comfort',
      value: cameraData,
      setValue: setCameraData,
      validateFlag: cameraDataValidateFlag,
      changeValidateFlag: changeCameraDataValidateFlag,
    },
    conditioner: {
      tab: 'comfort',
      value: conditionerData,
      setValue: setConditionerData,
      validateFlag: conditionerDataValidateFlag,
      changeValidateFlag: changeConditionerDataValidateFlag,
    },
    cruise_control: {
      tab: 'comfort',
      value: cruiseControlData,
      setValue: setCruiseControlData,
      validateFlag: cruiseControlDataValidateFlag,
      changeValidateFlag: changeCruiseControlDataValidateFlag,
    },
    multifunctional_steering_wheel: {
      tab: 'comfort',
      value: multifunctionalSteeringWheel,
      setValue: changeMultifunctionalSteeringWheel,
      validateFlag: null,
      changeValidateFlag: null,
    },
    trunk_without_hands: {
      tab: 'comfort',
      value: openingTrunkWithoutHands,
      setValue: changeOpeningTrunkWithoutHands,
      validateFlag: null,
      changeValidateFlag: null,
    },
    paddle_shifters: {
      tab: 'comfort',
      value: paddleShifters,
      setValue: changePaddleShifters,
      validateFlag: null,
      changeValidateFlag: null,
    },
    programmable_pre_heater: {
      tab: 'comfort',
      value: programmablePreHeater,
      setValue: changeProgrammablePreHeater,
      validateFlag: null,
      changeValidateFlag: null,
    },
    adjustable_steering_wheel: {
      tab: 'comfort',
      value: steeringWheelAdjustmentData,
      setValue: setSteeringWheelAdjustmentData,
      validateFlag: steeringWheelAdjustmentDataValidateFlag,
      changeValidateFlag: changeSteeringWheelAdjustmentDataValidateFlag,
    },
    adjustable_pedal_assembly: {
      tab: 'comfort',
      value: adjustablePedalAssembly,
      setValue: changeAdjustablePedalAssembly,
      validateFlag: null,
      changeValidateFlag: null,
    },
    start_stop_system: {
      tab: 'comfort',
      value: startStopSystem,
      setValue: changeStartStopSystem,
      validateFlag: null,
      changeValidateFlag: null,
    },
    keyless_access: {
      tab: 'comfort',
      value: keylessAccessSystem,
      setValue: changeKeylessAccessSystem,
      validateFlag: null,
      changeValidateFlag: null,
    },
    parking_assistance: {
      tab: 'comfort',
      value: parkingAssistanceSystemData,
      setValue: setParkingAssistanceSystemData,
      validateFlag: parkingAssistanceSystemDataValidateFlag,
      changeValidateFlag: changeParkingAssistanceSystemDataValidateFlag,
    },
    power_steering: {
      tab: 'comfort',
      value: powerSteeringData,
      setValue: setPowerSteeringData,
      validateFlag: powerSteeringDataValidateFlag,
      changeValidateFlag: changePowerSteeringDataValidateFlag,
    },
    electronic_dashboard: {
      tab: 'comfort',
      value: electronicDashboard,
      setValue: changeElectronicDashboard,
      validateFlag: null,
      changeValidateFlag: null,
    },
    power_mirrors: {
      tab: 'comfort',
      value: powerMirrors,
      setValue: changePowerMirrors,
      validateFlag: null,
      changeValidateFlag: null,
    },
    trunk_lid_drive: {
      tab: 'comfort',
      value: trunkLidElectricDrive,
      setValue: changeTrunkLidElectricDrive,
      validateFlag: null,
      changeValidateFlag: null,
    },
    electro_folding_mirrors: {
      tab: 'comfort',
      value: electroFoldingMirrors,
      setValue: changeElectroFoldingMirrors,
      validateFlag: null,
      changeValidateFlag: null,
    },
    power_windows: {
      tab: 'comfort',
      value: powerWindowsData,
      setValue: setPowerWindowsData,
      validateFlag: powerWindowsDataValidateFlag,
      changeValidateFlag: changePowerWindowsDataValidateFlag,
    },
    abs: {
      tab: 'safety',
      value: ABS,
      setValue: changeABS,
      validateFlag: null,
      changeValidateFlag: null,
    },
    esp: {
      tab: 'safety',
      value: ESP,
      setValue: changeESP,
      validateFlag: null,
      changeValidateFlag: null,
    },
    support_systems: {
      tab: 'safety',
      value: supportSystemsData,
      setValue: setSupportSystemsData,
      validateFlag: supportSystemsDataValidateFlag,
      changeValidateFlag: changeSupportSystemsDataValidateFlag,
    },
    airbags: {
      tab: 'safety',
      value: airbagsData,
      setValue: setAirbagsData,
      validateFlag: airbagsDataValidateFlag,
      changeValidateFlag: changeAirbagsDataValidateFlag,
    },
    tire_pressure_sensor: {
      tab: 'safety',
      value: tirePressureSensor,
      setValue: changeTirePressureSensor,
      validateFlag: null,
      changeValidateFlag: null,
    },
    rear_door_lock: {
      tab: 'safety',
      value: rearDoorLock,
      setValue: changeRearDoorLock,
      validateFlag: null,
      changeValidateFlag: null,
    },
    armored_body: {
      tab: 'safety',
      value: armoredBody,
      setValue: changeArmoredBody,
      validateFlag: null,
      changeValidateFlag: null,
    },
    isofix_fastening_systems: {
      tab: 'safety',
      value: isofixFasteningSystemData,
      setValue: setIsofixFasteningSystemData,
      validateFlag: isofixFasteningSystemDataValidateFlag,
      changeValidateFlag: changeIsofixFasteningSystemDataValidateFlag,
    },
    era_glonass: {
      tab: 'safety',
      value: ERAGLONASS,
      setValue: changeERAGLONASS,
      validateFlag: null,
      changeValidateFlag: null,
    },
    suspension: {
      tab: 'other',
      value: suspensionData,
      setValue: setSuspensionData,
      validateFlag: suspensionDataValidateFlag,
      changeValidateFlag: changeSuspensionDataValidateFlag,
    },
    crankcase_protection: {
      tab: 'other',
      value: crankcaseProtection,
      setValue: changeCrankcaseProtection,
      validateFlag: null,
      changeValidateFlag: null,
    },
    towbar: {
      tab: 'other',
      value: towbar,
      setValue: changeTowbar,
      validateFlag: null,
      changeValidateFlag: null,
    },
  };
  //#endregion valuebles

  //#region function

  async function getData(flag = false) {
    setLoaderVisible(true);
    if (!netInfo?.isConnected) {
      console.log('no connection');
    } else {
      global
        .getFields(reportType, section.id, token)
        .then(res => {
          let tempFields = {};
          let tempSubFieldArray = {};
          res.data.data.map((item, i) => {
            tempFields[item.column_name] = item;
            if (item.type === 'select-radiobutton' || item.type === 'select-checkbox') {
              if (!modalChooseData) {
                tempSubFieldArray[item.column_name] =
                  ModalChooseDataFunc.getDataFuncForSetModalChooseData(
                    item,
                    fieldsArray[item.column_name].setValue
                  );
              } else {
                if (!modalChooseData[item.column_name]) {
                  tempSubFieldArray[item.column_name] =
                    ModalChooseDataFunc.getDataFuncForSetModalChooseData(
                      item,
                      fieldsArray[item.column_name].setValue
                    );
                }
              }
            }
          });
          setFields(tempFields);
          if (Object.keys(tempSubFieldArray).length > 0) {
            let check = false;
            let tempKey = Object.keys(tempSubFieldArray);
            if (modalChooseData) {
              let resKeys = Object.keys(modalChooseData);
              tempKey.map(item => {
                check = resKeys.includes(item);
              });
            }
            if (!check) {
              if (modalChooseData) {
                setModalChooseData(Object.assign(modalChooseData, tempSubFieldArray));
              } else {
                setModalChooseData(tempSubFieldArray);
              }
            }
          }
          setLoaderVisible(false);
        })
        .catch(err => {
          setLoaderVisible(false);
          console.log('get fields err, equipment', err);
        });
    }
    //}
  }

  async function saveData() {
    let res = validate();

    let fieldsOfObjects = {};

    setLoaderVisible(true);
    let sendFields = [];
    Object.keys(fields).map(item => {
      if (fields[item].type === 'select-radiobutton') {
        if (fieldsArray[item].value.forSend[0]) {
          sendFields.push({
            id: fields[item].id,
            val: fieldsArray[item].value.forSend[0],
            val_text: String(fieldsArray[item].value.forSend[0]),
          });

          fieldsOfObjects[fields[item].id] = {
            ...fields[item],
            val: fieldsArray[item].value.forSend[0],
            val_text: String(fieldsArray[item].value.forSend[0]),
            sub_field: {
              id: fieldsArray[item].value.forSend[0],
              value: String(fieldsArray[item].value.forSend[0]),
            },
          };
        }
      } else if (fields[item].type === 'select-checkbox') {
        sendFields.push({
          id: fields[item].id,
          val: fieldsArray[item].value.forSend,
          val_text: JSON.stringify(fieldsArray[item].value.forSend),
        });

        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: fieldsArray[item].value.forSend,
          val_text: JSON.stringify(fieldsArray[item].value.forSend),
          sub_field: {
            id: fieldsArray[item].value.forSend,
            value: JSON.stringify(fieldsArray[item].value.forSend),
          },
        };
      } else if (fields[item].type === 'text' || fields[item].type === 'checkbox') {
        if (fields[item].type === 'text' && fieldsArray[item].value) {
          sendFields.push({
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
        } else if (fields[item].type === 'checkbox') {
          sendFields.push({
            id: fields[item].id,
            val: fieldsArray[item].value,
            val_text: JSON.stringify(fieldsArray[item].value),
          });

          fieldsOfObjects[fields[item].id] = {
            ...fields[item],
            val: fieldsArray[item].value,
            val_text: JSON.stringify(fieldsArray[item].value),
            sub_field: {
              id: fieldsArray[item].value,
              value: JSON.stringify(fieldsArray[item].value),
            },
          };
        }
      }
    });

    let sendReportData = {
      report_id: reportId,
      fields: sendFields,
    };

    if (!netInfo?.isConnected) {
      console.log('no connection, equipment send data');
      // const result = new Promise(async function (resolve, reject) {
      //   const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));
      //
      //   if (
      //     !shouldSendedReportData ||
      //     shouldSendedReportData === null ||
      //     shouldSendedReportData.length < 1
      //   ) {
      //     await AsyncStorage.setItem(
      //       '@shouldSendedReportData',
      //       JSON.stringify([
      //         {
      //           report_id: reportId,
      //           fields: { ...fieldsOfObjects },
      //         },
      //       ])
      //     );
      //   } else {
      //     const temple = shouldSendedReportData.find(item => item.report_id === reportId) || {
      //       fields: {},
      //     };
      //     const newShouldSend = shouldSendedReportData.filter(item => item.report_id !== reportId);
      //     await AsyncStorage.setItem(
      //       '@shouldSendedReportData',
      //       JSON.stringify([
      //         ...newShouldSend,
      //         {
      //           report_id: reportId,
      //           fields: { ...temple.fields, ...fieldsOfObjects },
      //         },
      //       ])
      //     );
      //   }
      //   resolve(true);
      // });
      // return result;
    } else {
      const result = await global.sendReportData(sendReportData, token);
      return result;
    }
  }
  const dispatch = useDispatch();

  async function fetchData() {
    try {
      setLoaderVisible(true);
      let result = [];
      if (!netInfo?.isConnected) {
        console.log('no connection, equipment fetch data');
      } else {
        let res = await global.getSavedReport(token, reportId, section.id, null, null);
        result = res.data.data;
      }

      result.map(item => {
        switch (item.type) {
          case 'text':
            if (item?.saved_fields?.length > 0) {
              fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
            }
            if (item?.val) {
              fieldsArray[item.column_name].setValue(item.val);
            }
            break;
          case 'checkbox':
            if (item?.saved_fields?.length > 0) {
              fieldsArray[item.column_name].setValue(item.saved_fields[0].val);
            }
            if (item?.val) {
              fieldsArray[item.column_name].setValue(item.val);
            }
            break;
          case 'select-radiobutton':
            let value = { forSend: [], forInput: [] };
            if (item?.sub_field?.id || item?.sub_field?.field_id || item?.saved_fields?.length > 0) {
              let sub_field = {};
              if (item?.sub_field) {
                sub_field = item?.sub_field;
              } else {
                item.saved_fields.map(item2 => {
                  sub_field = item2?.sub_field;
                });
              }
              if (item?.val) {
                sub_field = item?.sub_fields.find(k => k.id === item?.sub_field?.id);
              }
              if (sub_field) {
                value.forInput.push(sub_field.value);
                value.forSend.push(sub_field.id);
              }
              fieldsArray[item.column_name].setValue(value);
            }
            break;
          case 'select-checkbox':
            let value1 = { forSend: [], forInput: [] };
            if (item?.sub_field?.id || item?.sub_field?.field_id || item?.saved_fields?.length > 0) {
              if (item?.saved_fields) {
                item?.saved_fields.map(k => {
                  if (k.sub_field?.value && k.sub_field?.id) {
                    value1.forInput.push(k.sub_field.value);
                    value1.forSend.push(k.sub_field.id);
                  }
                });
              }

              if (item?.val) {
                item?.sub_fields.map(k => {
                  if (item?.sub_field?.id?.includes(k.id)) {
                    if (k?.value && k?.id) {
                      value1.forInput.push(k?.value);
                      value1.forSend.push(k?.id);
                    }
                  }
                });
              }

              fieldsArray[item.column_name].setValue(value1);
            }
            break;
          default:
            break;
        }
      });
      setLoaderVisible(false);
    } catch (err) {
      console.log(err);
      setLoaderVisible(false);
    }
  }

  function validate() {
    let currentTab = Object.keys(screens)[linkID];
    let currentTabFieldNames = Object.keys(fields).filter(
      field_name => fields[field_name]?.tab === currentTab
    );
    let currentTabFieldDescriptions = {};
    let currentTabFields = {};
    currentTabFieldNames.forEach(field_name => {
      //console.log('#B4', field_name, fieldsArray[field_name]);
      currentTabFields[field_name] = fieldsArray[field_name].value;
      currentTabFieldDescriptions[field_name] = fields[field_name];
    });
    let validationResults = validateFields(
      currentTabFields,
      currentTabFieldDescriptions,
      goToUnfilled,
      {}
    );
    Object.keys(validationResults).forEach(field_name => {
      if (fieldsArray[field_name].changeValidateFlag) {
        fieldsArray[field_name].changeValidateFlag(validationResults[field_name]);
      }
    });
    // console.log('#B3', validationResults);
    let allValid = Object.values(validationResults).every(item => item);

    //validating section for menu
    let validationResultsSectionMenu = validateFields(
      currentTabFields,
      currentTabFieldDescriptions,
      true,
      {}
    );
    let allValidSectionMenu = Object.values(validationResultsSectionMenu).every(item => item);
    allValidSectionMenu
      ? dispatch(setOpenScreen('Equipment_' + Object.keys(screens)[linkID], 2))
      : dispatch(setOpenScreen('Equipment_' + Object.keys(screens)[linkID], 1));

    //validating all for menu
    let allTabsFieldNames = Object.keys(fields);
    let allTabsFieldDescriptions = {};
    let allTabsFields = {};
    allTabsFieldNames.forEach(field_name => {
      //console.log('#B4', field_name, fieldsArray[field_name]);
      allTabsFields[field_name] = fieldsArray[field_name].value;
      allTabsFieldDescriptions[field_name] = fields[field_name];
    });
    let validationResultsAllTabsMenu = validateFields(allTabsFields, allTabsFieldDescriptions, true, {});
    let allValidMenu = Object.values(validationResultsAllTabsMenu).every(item => item);
    if (allValidMenu) {
      dispatсh(setOpenScreen('EquipmentScreen', 2));
    } else {
      dispatсh(setOpenScreen('EquipmentScreen', 1));
    }
    //console.log('#K3', allValid, allValidSectionMenu, allValidMenu);
    return allValid;
  }

  // console.log('#B1', fields);
  // let res = false;
  // try {
  //   let validateArray = [];
  //   Object.keys(fields).map(item => {
  //     if (valueArray[item].tab === tab) {
  //       if (fields[item].type === 'text' || fields[item].type.includes('select')) {
  //         let req = false;
  //         if (doubleReq) req = fields[item].required === 2 || fields[item].required === 1;
  //         else req = fields[item].required === 2;
  //
  //         if (req) {
  //           if (fields[item].type === 'text') {
  //             if (valueArray[item].value) {
  //               validateArray.push(true);
  //               valueArray[item].changeValidateFlag(true);
  //             } else {
  //               validateArray.push(false);
  //               valueArray[item].changeValidateFlag(false);
  //             }
  //           } else {
  //             if (valueArray[item].value.forSend.length > 0) {
  //               validateArray.push(true);
  //               valueArray[item].changeValidateFlag(true);
  //             } else {
  //               validateArray.push(false);
  //               valueArray[item].changeValidateFlag(false);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  //   res =
  //     validateArray.length > 0
  //       ? validateArray.every(item => {
  //           return item;
  //         })
  //       : true;
  // } catch (err) {
  //   console.log('err', err);
  //   res = false;
  // }
  // return res;

  function next(id) {
    let valid = validate();

    if (valid) {
      //changeStateSreen(id)
      if (
        id <=
        Object.keys(Object.keys(unfilledScreens).length > 0 ? unfilledScreens : screens).length - 1
      ) {
        setLinkID(id);
      } else {
        setLoaderVisible(true);
        //console.log('loader', loaderVisible);
        globalFunctions.globalSendDataAndGoNext(
          token,
          reportId,
          setLoaderVisible,
          saveData,
          'EquipmentScreen',
          navigation,
          dispatсh,
          sectionList,
          constants,
          'equipment',
          goToUnfilled
        );
        setLoaderVisible(false);
        dispatсh(setOpenScreen('EquipmentScreen', 2));
      }
      return true;
    } else {
      //setModalErrorMessage('Не все обязательные поля заполнены');
      //changeModalErrorVisibleFlag(true);
      return false;
    }
  }

  //#endregion function

  // useEffect(() => {
  //   !modalErrorVisibleFlag && setModalErrorMessage('Завершите предыдущий шаг!');
  // }, [modalErrorVisibleFlag]);

  useEffect(() => {
    if (fields && refScroll.current && refScroll) {
      refScroll.current.scrollTo({ y: 0 });
    }
    if (openScreen.EquipmentScreen !== 2) {
      dispatсh(setOpenScreen('EquipmentScreen', 1));
    }
    if (openScreen['Equipment_' + Object.keys(screens)[linkID]] !== 2) {
      dispatсh(setOpenScreen('Equipment_' + Object.keys(screens)[linkID], 1));
    }
  }, [linkID, netInfo]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'EquipmentScreen') {
      // if (goToUnfilled) {
      //   getData(true);
      // } else {
      getData()
        .then(() => {
          fetchData().catch(err => {
            console.log('fetch data error, equipment', err);
          });
        })
        .catch(err => {
          console.log('get data error, equipment', err);
        });
      // if (openScreen.EquipmentScreen === 0) {
      //   getData().then(()=>fetchData());
      //   fetchData();
      // } else {
      //   getData();
      //   fetchData();
      // }
      //}
    }
  }, [netInfo, route]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={section.title}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={saveData}
            setLoaderVisible={setLoaderVisible}
            currentScreen={'EquipmentScreen'}
            validateFunc={() =>
              fields
                ? validate()
                : () => {
                    true;
                  }
            }
          />
        }
        tabs={
          <Tabs
            showDivider={false}
            active={linkID}
            titles={
              Object.values(screens)
              //unfilledFields.length === 0 ? Object.values(screens) : Object.values(unfilledScreens)
            }
            links={setLinkID}
            listStep={
              Object.keys(screens).map(item => {
                return 'Equipment_' + item;
              })
              // unfilledFields.length === 0
              //   ? Object.keys(screens).map(item => {
              //       return 'Equipment_' + item;
              //     })
              //   : Object.keys(unfilledScreens).map(item => {
              //       return 'Equipment_' + item;
              //     })
            }
            // checkFunc={() =>
            //   fields
            //     ? validate()
            //     : () => {
            //         true;
            //       }
            // }
            modalErrorFunc={() => {}} //{changeModalErrorVisibleFlag}
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
            dispatсh
          )
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            nextSection.toScetion,
            navigation,
            dispatсh
          )
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
      >
        {loaderVisible ? (
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={COLORS.none}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
        ) : (
          <KeyboardAvoidingView
            style={styles.container}
            keyboardVerticalOffset={50}
            enabled={Platform.OS === 'ios' ? true : false}
            behavior="padding"
          >
            {fields ? (
              <ScrollView
                ref={refScroll}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
              >
                {Object.keys(fieldsArray).map(item => {
                  if (
                    Object.keys(fields).includes(item) &&
                    fieldsArray[item].tab ===
                      Object.keys(Object.keys(unfilledScreens).length > 0 ? unfilledScreens : screens)[
                        linkID
                      ]
                  ) {
                    if (
                      fields[item].type === 'select-radiobutton' ||
                      fields[item].type === 'select-checkbox'
                    ) {
                      return (
                        <React.Fragment key={fields[item].id}>
                          <FieldModal
                            field={fields[item]}
                            setFieldId={setIndexParantCheckRadio}
                            value={fieldsArray[item].value}
                            showModal={changeModalChoosFlag}
                            validateFlag={fieldsArray[item].validateFlag}
                            //setValidate={fieldsArray[item].changeValidateFlag}
                          />
                        </React.Fragment>
                      );
                    } else if (fields[item].type === 'text') {
                      //console.log('#BL1', fieldsArray[item].value);
                      return (
                        <FieldInput
                          key={fields[item].id}
                          field={fields[item]}
                          value={fieldsArray[item].value}
                          setValue={fieldsArray[item].setValue}
                          validateFlag={fieldsArray[item].validateFlag}
                          setValidate={fieldsArray[item].changeValidateFlag}
                          multiline={true}
                        />
                      );
                    } else {
                      return (
                        <FieldCheckSwitch
                          key={fields[item].id}
                          field={fields[item]}
                          value={fieldsArray[item].value}
                          setValue={fieldsArray[item].setValue}
                          type={'switch'}
                        />
                      );
                    }
                  }
                })}
              </ScrollView>
            ) : (
              <></>
            )}
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next(linkID + 1)}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </HeaderBar>

      {modalChooseData && indexParantCheckRadio ? (
        <ModalChoose
          title={
            modalChooseData[indexParantCheckRadio] ? modalChooseData[indexParantCheckRadio].title : ''
          }
          isOpen={modalChoosFlag}
          closeModal={changeModalChoosFlag}
          setValue={
            modalChooseData[indexParantCheckRadio] ? modalChooseData[indexParantCheckRadio].setValue : ''
          }
          data={
            modalChooseData[indexParantCheckRadio] ? modalChooseData[indexParantCheckRadio].data : ''
          }
          type={
            modalChooseData[indexParantCheckRadio] ? modalChooseData[indexParantCheckRadio].type : ''
          }
          current={
            currentSelected[indexParantCheckRadio]
              ? currentSelected[indexParantCheckRadio]
              : { forInput: [], forSend: [] }
          }
        />
      ) : (
        <></>
      )}
      {/*<ModalError*/}
      {/*  modalFlag={modalErrorVisibleFlag}*/}
      {/*  changeModalFlag={changeModalErrorVisibleFlag}*/}
      {/*  message={modalErrorMessage}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    sectionList: state.appGlobal.sectionList,
    reportType: state.appGlobal.reportType,
    token: state.appGlobal.loginToken,
    reportId: state.appGlobal.reportId,
    openScreen: state.appGlobal.openScreen,
  };
};
export default connect(mapStateToProps, null)(EquipmentScreen);
