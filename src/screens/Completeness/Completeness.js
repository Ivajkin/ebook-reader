//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
//#endregion

//#region plagins
import AnimatedLoader from 'react-native-animated-loader';
import { useDispatch, useSelector } from 'react-redux';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { ModalChooseDataFunc } from '../../utils';
import { FieldModal, FieldCheckSwitch } from '../../components/fields';
import { ModalChoose, ModalError } from '../../components/modal';
import { loader, COLORS, theme, constants } from '../../сonstants';
import { global } from '../../requests';
import { globalFunctions } from '../../utils';
//#endregion

//#region redux
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validateFields from '../../utils/validateRequired';
//#endregion

//#endregion

const CompletenessScreen = ({ route, navigation }) => {
  const netInfo = useNetInfo();
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.completeness;
  const reportID = useSelector(state => state.appGlobal.reportId);
  const dispatсh = useDispatch();

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'completeness',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'completeness',
    'back'
  );

  const [loaderVisible, setLoaderVisible] = useState(true);
  const [indexParantCheckRadio, setIndexParantCheckRadio] = useState(null);
  const [modalChoosFlag, changeModalChoosFlag] = useState(false);
  const [modalChooseData, setModalChooseData] = useState(null);

  const [countKeysData, setCountKeysData] = useState({ forSend: [], forInput: [] });
  const [toolData, setToolData] = useState({ forSend: [], forInput: [] });
  const [spareWheelData, setSpareWheelData] = useState({ forSend: [], forInput: [] });
  const [motoristSetData, setMotoristSetData] = useState({ forSend: [], forInput: [] });

  const [countKeysDataValidateFlag, changeCountKeysDataValidateFlag] = useState(true);
  const [ToolDataValidateFlag, changeToolDataValidateFlag] = useState(true);
  const [spareWheelDataValidateFlag, changeSpareWheelDataValidateFlag] = useState(true);
  const [motoristSetDataValidateFlag, changeMotoristSetDataValidateFlag] = useState(true);

  //const [modalErrorMessage, setModalErrorMessage] = useState('Завершите предыдущий шаг!');
  //const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);

  const [manual, changeManual] = useState(false);

  const [fields, setFields] = useState(null);

  const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const fieldsArray = {
    keys_count: {
      value: countKeysData,
      setValue: setCountKeysData,
      validateFlag: countKeysDataValidateFlag,
      changeValidateFlag: changeCountKeysDataValidateFlag,
    },
    completeness_tools: {
      value: toolData,
      setValue: setToolData,
      validateFlag: ToolDataValidateFlag,
      changeValidateFlag: changeToolDataValidateFlag,
    },
    spare_wheel: {
      value: spareWheelData,
      setValue: setSpareWheelData,
      validateFlag: spareWheelDataValidateFlag,
      changeValidateFlag: changeSpareWheelDataValidateFlag,
    },
    motorist_set: {
      value: motoristSetData,
      setValue: setMotoristSetData,
      validateFlag: motoristSetDataValidateFlag,
      changeValidateFlag: changeMotoristSetDataValidateFlag,
    },
    usage_instruction: {
      value: manual,
      setValue: changeManual,
      validateFlag: null,
      changeValidateFlag: () => {},
    },
  };

  const currentSelected = {
    completeness_tools: toolData,
    spare_wheel: spareWheelData,
    motorist_set: motoristSetData,
  };

  async function getData(flag = false) {
    try {
      if (flag) {
        let tempFields = {};
        let tempSubFieldArray = {};
        unfilledFields.map(item => {
          tempFields[item.column_name] = item;
          if (item.type === 'select-radiobutton' || item.type === 'select-checkbox') {
            if (!modalChooseData) {
              tempSubFieldArray[item.column_name] = ModalChooseDataFunc.getDataFuncForSetModalChooseData(
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
        setModalChooseData(tempSubFieldArray);
        setLoaderVisible(false);
      } else {
        let result = [];
        if (!netInfo?.isConnected) {
          const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
            item => item.id === section.id
          );
          result = reportFields.fields;
        } else {
          let res = await global.getFields(reportType, section.id, token);
          result = res.data.data;
        }
        let tempFields = {};
        let tempSubFieldArray = {};
        result.map(item => {
          tempFields[item.column_name] = item;
          if (item.type === 'select-radiobutton' || item.type === 'select-checkbox') {
            if (!modalChooseData) {
              tempSubFieldArray[item.column_name] = ModalChooseDataFunc.getDataFuncForSetModalChooseData(
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
        setModalChooseData(tempSubFieldArray);
        setLoaderVisible(false);
      }
    } catch (err) {
      console.log(err);
      setLoaderVisible(false);
    }
  }

  async function saveData() {
    let sendData = {
      report_id: reportID,
      fields: [],
    };

    let fieldsOfObjects = {};

    Object.keys(fields).map(item => {
      if (fields[item].type === 'select-radiobutton') {
        sendData.fields.push({
          id: fields[item].id,
          val: fieldsArray[item].value.forSend[0] ? fieldsArray[item].value.forSend[0] : null,
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
      } else if (fields[item].type === 'select-checkbox') {
        sendData.fields.push({
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
      } else if (fields[item].type === 'checkbox') {
        sendData.fields.push({
          id: fields[item].id,
          val: fieldsArray[item].value,
          val_text: String(fieldsArray[item].value),
        });
        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: fieldsArray[item].value,
          val_text: String(fieldsArray[item].value),
          sub_field: {
            id: fieldsArray[item].value,
            value: String(fieldsArray[item].value),
          },
        };
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
                report_id: reportID,
                fields: { ...fieldsOfObjects },
              },
            ])
          );
        } else {
          const temple = shouldSendedReportData.find(item => item.report_id === reportID) || {
            fields: {},
          };
          const newShouldSend = shouldSendedReportData.filter(item => item.report_id !== reportID);
          await AsyncStorage.setItem(
            '@shouldSendedReportData',
            JSON.stringify([
              ...newShouldSend,
              {
                report_id: reportID,
                fields: { ...temple.fields, ...fieldsOfObjects },
              },
            ])
          );
        }
        resolve(true);
      });
      return result;
    } else {
      const result = await global.sendReportData(sendData, token);
      return result;
    }
  }

  async function fetchData() {
    try {
      setLoaderVisible(true);
      let result = [];
      if (!netInfo?.isConnected) {
        const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
          item => item.id === section.id
        );
        const reportFieldsIds = reportFields.fields.map(function (obj) {
          return obj.id;
        });
        const savedReport = JSON.parse(await AsyncStorage.getItem('@reportList'))
          .find(item => item.id === reportID)
          .saved_fields.filter(item => reportFieldsIds.includes(item.field_id))
          .map(item => {
            return { ...item, ...item.field };
          });

        const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));
        let shouldSendedCurrentReportData = [...savedReport];
        if (shouldSendedReportData && shouldSendedReportData?.length) {
          const shouldSendedCurrentReportDataNew = Object.values(
            shouldSendedReportData?.find(item => item.report_id === reportID)?.fields
          )?.filter(item => item.section_id === section.id);
          if (shouldSendedCurrentReportDataNew && shouldSendedCurrentReportDataNew.length) {
            shouldSendedCurrentReportData = shouldSendedCurrentReportDataNew;
          }
        }
        result = shouldSendedCurrentReportData;
      } else {
        let res = await global.getSavedReport(token, reportID, section.id, null, null);
        result = res.data.data;
      }
      result.map(item => {
        switch (item.type) {
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
      setLoaderVisible(false);
      console.log('completeness fetch error:', err);
    }
  }

  function validate(doubleReq = false) {
    let fieldsValues = {};
    let allFieldsFlagSetters = {};
    Object.keys(fieldsArray).forEach(field_name => {
      fieldsValues[field_name] = fieldsArray[field_name].value;
      allFieldsFlagSetters[field_name] = fieldsArray[field_name].changeValidateFlag;
    });

    let validationResults = validateFields(fieldsValues, fields, goToUnfilled, {});
    //console.log('#M1', goToUnfilled, doubleReq, validationResults);
    if (!doubleReq) {
      Object.keys(validationResults).forEach(key => {
        allFieldsFlagSetters[key](validationResults[key]);
      });
    }
    let allValid = Object.values(validationResults).every(item => item);

    let validationResultsForMenu = validateFields(fieldsValues, fields, true, {});
    let allValidForMenu = Object.values(validationResultsForMenu).every(item => item);

    if (allValidForMenu) {
      dispatсh(setOpenScreen('CompletenessScreen', 2));
    } else {
      dispatсh(setOpenScreen('CompletenessScreen', 1));
    }
    return allValid;
  }

  function next() {
    if (validate()) {
      globalFunctions.globalSendDataAndGoNext(
        token,
        reportID,
        setLoaderVisible,
        saveData,
        'CompletenessScreen',
        navigation,
        dispatсh,
        sectionList,
        constants,
        'completeness',
        goToUnfilled
      );
    }
  }

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'CompletenessScreen') {
      if (openScreen.CompletenessScreen === 0) {
        dispatсh(setOpenScreen('CompletenessScreen', 1));
      }
      getData()
        .then(() => {
          fetchData().catch(err => {
            console.log('fetch data error, completeness', err);
          });
        })
        .catch(err => {
          console.log('get data error, completeness', err);
        });
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
            validateFunc={
              fields
                ? () => validate(false)
                : () => {
                    true;
                  }
            }
            currentScreen={'CompletenessScreen'}
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
        {loaderVisible && (
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={!fields ? COLORS.none : COLORS.whiteTransparent}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
        )}

        {!fields ? (
          <></>
        ) : (
          <>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.scroll}>
                {Object.keys(fieldsArray).map((item, i) => {
                  if (fields[item]) {
                    if (
                      fields[item].type === 'select-radiobutton' ||
                      fields[item].type === 'select-checkbox'
                    ) {
                      return (
                        <FieldModal
                          key={i}
                          field={fields[item]}
                          setFieldId={setIndexParantCheckRadio}
                          value={fieldsArray[item].value}
                          showModal={changeModalChoosFlag}
                          validateFlag={fieldsArray[item].validateFlag}
                          setValidate={fieldsArray[item].changeValidateFlag}
                        />
                      );
                    } else if (fields[item].type === 'checkbox') {
                      return (
                        <FieldCheckSwitch
                          key={i}
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
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </>
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
            modalChooseData[indexParantCheckRadio]
              ? modalChooseData[indexParantCheckRadio].setValue
              : () => {}
          }
          data={
            modalChooseData[indexParantCheckRadio] ? modalChooseData[indexParantCheckRadio].data : []
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

export default CompletenessScreen;
