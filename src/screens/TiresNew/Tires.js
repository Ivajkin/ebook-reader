//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
//#endregion
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { FieldCheckSwitch } from '../../components/fields';
import { ModalError } from '../../components/modal';
import { loader, theme, COLORS, images, constants } from '../../сonstants';
import { globalFunctions } from '../../utils';
import { global } from '../../requests';
import TireAdd from './TireAdd';

import AnimatedLoader from 'react-native-animated-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';

import { styles } from './styles';

import { useNavigation } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import { setOpenScreen } from '../../redux/App/actions/mainActions';
import {
  clearTires,
  initTires,
  turnOnModeAll,
  turnOnModeHalf,
  turnOnModeNone,
} from '../../redux/App/actions/tiresActions';
import validateFields from '../../utils/validateRequired';

const TiresScreen = props => {
  const navigation = useNavigation();
  const nextSection = globalFunctions.navigateToSection(
    props.sectionList,
    constants.sectionOrderList,
    'tires',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    props.sectionList,
    constants.sectionOrderList,
    'tires',
    'back'
  );

  const [modalErrorMessage, setModalErrorMessage] = useState('Не все обязательные поля заполнены!');
  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);

  const height = Dimensions.get('screen').height;
  const [imgWidth, setImgWidth] = useState(null);
  const [imgHeight, setImgHeight] = useState(null);

  const [fields, setFields] = useState({});
  const [same, changeSame] = useState(false);
  const [winter, changeWinter] = useState(false);
  const [diff, changeDiff] = useState(false);
  // const [tires, setTires] = useState({
  //   leftTop: emptyTire,
  //   leftDown: emptyTire,
  //   rightTop: emptyTire,
  //   rightDown: emptyTire,
  // });
  const [firstTires, setFirstTires] = useState(null);
  const [shouldRunUseeefect, setShouldRunUseeffect] = useState(false);
  const section = props.sectionList.tires;

  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  const unfilledFields = props.route.params?.unfilledFields ?? [];
  const goToUnfilled = props.route.params?.goToUnfilled ?? null;

  async function getData(flag = false) {
    try {
      if (flag) {
        setLoaderVisible(true);
        let tempFields = {};
        unfilledFields.map((item, i) => {
          tempFields[item.column_name] = item;
        });
        setFields(tempFields);
        setLoaderVisible(false);
      } else {
        let result = [];
        if (!netInfo?.isConnected) {
          let reportFieldsGroupedLoaded = await AsyncStorage.getItem('@reportFieldsGrouped');
          if (reportFieldsGroupedLoaded !== null) {
            const reportFields = JSON.parse(reportFieldsGroupedLoaded).find(
              item => item.id === section.id
            );
            result = reportFields.fields;
          }
        } else {
          let res = await global.getFields(props.reportType, section.id, props.token);
          //console.log('#R1', res.data.data);
          result = res.data.data;
        }

        let tempFields = {};
        result.map((item, i) => {
          tempFields[item.column_name] = item;
        });
        setFields(tempFields);
        setLoaderVisible(false);
      }
    } catch (err) {
      console.log('err', err);
    }
    setLoaderVisible(false);
  }

  async function saveDataWithNoScreenChange() {
    let fieldsOfObjects = {};

    let dataForSend = {
      report_id: props.reportId,
      fields: [],
    };
    if (fields?.tyres_same_size_brand) {
      dataForSend.fields.push({
        id: fields.tyres_same_size_brand.id,
        val: same,
        val_text: same.toString(),
      });

      fieldsOfObjects[fields.tyres_same_size_brand.id] = {
        ...fields.tyres_same_size_brand,
        val: same,
        val_text: same.toString(),
        sub_field: {
          id: same,
          value: same.toString(),
        },
      };
    }
    if (fields?.tyres_winter_type) {
      dataForSend.fields.push({
        id: fields.tyres_winter_type.id,
        val: winter,
        val_text: winter.toString(),
      });

      fieldsOfObjects[fields.tyres_winter_type.id] = {
        ...fields.tyres_winter_type,
        val: winter,
        val_text: winter.toString(),
        sub_field: {
          id: winter,
          value: winter.toString(),
        },
      };
    }

    if (fields?.diff_width_wheel) {
      dataForSend.fields.push({
        id: fields.diff_width_wheel.id,
        val: diff,
        val_text: diff?.toString(),
      });

      fieldsOfObjects[fields.diff_width_wheel.id] = {
        ...fields.diff_width_wheel,
        val: diff,
        val_text: diff?.toString(),
        sub_field: {
          id: diff,
          value: diff?.toString(),
        },
      };
    }
    let tiresJSON = {};
    let tiresNoJSON = {};
    Object.keys(props.tiresProcessed).map(item => {
      const data = [
        {
          name: 'Марка',
          column_name: 'tyre_brand_id',
          type: 'select-radiobutton',
          val: props.tiresProcessed[item]?.mark?.id ? props.tiresProcessed[item]?.mark?.id : null,
          val_text: String(props.tiresProcessed[item]?.mark?.value),
        },
        {
          name: 'Модель',
          column_name: 'tyre_model_id',
          type: 'select-radiobutton',
          val: props.tiresProcessed[item]?.model?.id ? props.tiresProcessed[item]?.model?.id : null,
          val_text: String(props.tiresProcessed[item]?.model?.value),
        },
        {
          name: 'Ширина',
          column_name: 'width',
          type: 'text',
          val: props.tiresProcessed[item]?.width ? props.tiresProcessed[item]?.width : null,
        },
        {
          name: 'Профиль',
          column_name: 'profile',
          type: 'text',
          val: props.tiresProcessed[item]?.profile ? props.tiresProcessed[item]?.profile : null,
        },
        {
          name: 'Радиус',
          column_name: 'radius',
          type: 'text',
          val: props.tiresProcessed[item]?.radius ? props.tiresProcessed[item]?.radius : null,
        },
        {
          name: 'Остаток, мм (0-40)',
          column_name: 'remainder',
          type: 'text',
          val: props.tiresProcessed[item]?.remainder ? props.tiresProcessed[item]?.remainder : null,
        },
        {
          name: 'Фото',
          column_name: 'photos',
          type: 'text',
          val: props.tiresProcessed[item]?.photos ? props.tiresProcessed[item]?.photos : null,
        },
      ];
      tiresNoJSON[item] = data;
      tiresJSON[item] = JSON.stringify(data);
    });

    let listTires = {
      leftTop: 'front_left',
      leftDown: 'rear_left',
      rightTop: 'front_right',
      rightDown: 'rear_right',
    };

    Object.keys(tiresJSON).map(item => {
      if (fields[listTires[item]]) {
        dataForSend.fields.push({
          id: fields[listTires[item]].id,
          val: tiresJSON[item],
          val_text: tiresJSON[item],
        });
      }
    });

    Object.keys(tiresJSON).map(item => {
      fieldsOfObjects[fields[listTires[item]].id] = {
        ...fields[listTires[item]],
        val: tiresJSON[item],
        val_text: tiresJSON[item],
        sub_field: {
          id: tiresJSON[item],
          value: tiresJSON[item],
        },
      };
    });

    const result = await global.sendReportData(dataForSend, props.token);
    return result;
  }
  async function saveData() {
    let fieldsOfObjects = {};

    let dataForSend = {
      report_id: props.reportId,
      fields: [],
    };
    if (fields?.tyres_same_size_brand) {
      dataForSend.fields.push({
        id: fields.tyres_same_size_brand.id,
        val: same,
        val_text: same.toString(),
      });

      fieldsOfObjects[fields.tyres_same_size_brand.id] = {
        ...fields.tyres_same_size_brand,
        val: same,
        val_text: same.toString(),
        sub_field: {
          id: same,
          value: same.toString(),
        },
      };
    }
    if (fields?.tyres_winter_type) {
      dataForSend.fields.push({
        id: fields.tyres_winter_type.id,
        val: winter,
        val_text: winter.toString(),
      });

      fieldsOfObjects[fields.tyres_winter_type.id] = {
        ...fields.tyres_winter_type,
        val: winter,
        val_text: winter.toString(),
        sub_field: {
          id: winter,
          value: winter.toString(),
        },
      };
    }

    if (fields?.diff_width_wheel) {
      dataForSend.fields.push({
        id: fields.diff_width_wheel.id,
        val: diff,
        val_text: diff?.toString(),
      });

      fieldsOfObjects[fields.diff_width_wheel.id] = {
        ...fields.diff_width_wheel,
        val: diff,
        val_text: diff?.toString(),
        sub_field: {
          id: diff,
          value: diff?.toString(),
        },
      };
    }
    let tiresJSON = {};
    let tiresNoJSON = {};
    Object.keys(props.tiresProcessed).map(item => {
      const data = [
        {
          name: 'Марка',
          column_name: 'tyre_brand_id',
          type: 'select-radiobutton',
          val: props.tiresProcessed[item]?.mark?.id ? props.tiresProcessed[item]?.mark?.id : null,
          val_text: String(props.tiresProcessed[item]?.mark?.value),
        },
        {
          name: 'Модель',
          column_name: 'tyre_model_id',
          type: 'select-radiobutton',
          val: props.tiresProcessed[item]?.model?.id ? props.tiresProcessed[item]?.model?.id : null,
          val_text: String(props.tiresProcessed[item]?.model?.value),
        },
        {
          name: 'Ширина',
          column_name: 'width',
          type: 'text',
          val: props.tiresProcessed[item]?.width ? props.tiresProcessed[item]?.width : null,
        },
        {
          name: 'Профиль',
          column_name: 'profile',
          type: 'text',
          val: props.tiresProcessed[item]?.profile ? props.tiresProcessed[item]?.profile : null,
        },
        {
          name: 'Радиус',
          column_name: 'radius',
          type: 'text',
          val: props.tiresProcessed[item]?.radius ? props.tiresProcessed[item]?.radius : null,
        },
        {
          name: 'Остаток, мм (0-40)',
          column_name: 'remainder',
          type: 'text',
          val: props.tiresProcessed[item]?.remainder ? props.tiresProcessed[item]?.remainder : null,
        },
        {
          name: 'Фото',
          column_name: 'photos',
          type: 'text',
          val: props.tiresProcessed[item]?.photos ? props.tiresProcessed[item]?.photos : null,
        },
      ];
      tiresNoJSON[item] = data;
      tiresJSON[item] = JSON.stringify(data);
    });

    let listTires = {
      leftTop: 'front_left',
      leftDown: 'rear_left',
      rightTop: 'front_right',
      rightDown: 'rear_right',
    };

    Object.keys(tiresJSON).map(item => {
      if (fields[listTires[item]]) {
        dataForSend.fields.push({
          id: fields[listTires[item]].id,
          val: tiresJSON[item],
          val_text: tiresJSON[item],
        });
      }
    });

    Object.keys(tiresJSON).map(item => {
      fieldsOfObjects[fields[listTires[item]].id] = {
        ...fields[listTires[item]],
        val: tiresJSON[item],
        val_text: tiresJSON[item],
        sub_field: {
          id: tiresJSON[item],
          value: tiresJSON[item],
        },
      };
    });

    const result = await global.sendReportData(dataForSend, props.token);
    return result;
  }

  async function fetchData() {
    try {
      setLoaderVisible(true);
      let result = [];
      if (!netInfo?.isConnected) {
        console.log('no connection tires');
      } else {
        let res = await global.getSavedReport(props.token, props.reportId, section.id, null, null);
        result = res.data.data;

        // console.log('#mk', res.data.data);
        let tiresTemp = {}; //{ ...props.tiresProcessed };
        props.clearTires();
        if (result?.length > 0) {
          result?.map((item, index) => {
            switch (item.type) {
              case 'checkbox':
                if (item?.saved_fields?.length > 0) {
                  if (item.column_name === 'tyres_winter_type') {
                    let newValue = item?.saved_fields[0]?.val;

                    changeWinter(newValue);
                  }
                  if (item.column_name === 'diff_width_wheel') {
                    if (item?.saved_fields[0]?.val) {
                      onDiffSwitchChanged(true);
                      //props.turnOnModeHalf();
                    }
                  }
                  if (item.column_name === 'tyres_same_size_brand') {
                    if (item?.saved_fields[0]?.val) {
                      onAllSameSwitchChanged(true);
                    }
                    //changeSame(item?.saved_fields[0]?.val);
                  }
                }
                if (item?.val) {
                  if (item.column_name === 'tyres_winter_type') {
                    changeWinter(item?.val);
                  }
                  if (item.column_name === 'diff_width_wheel') {
                    if (item?.saved_fields[0]?.val) {
                      onDiffSwitchChanged(true);
                      //props.turnOnModeHalf();
                    }
                  }
                  if (item.column_name === 'tyres_same_size_brand') {
                    if (item?.saved_fields[0]?.val) {
                      onAllSameSwitchChanged(true);
                    }
                  }
                }
                break;
              case 'page':
                let listTires = {
                  front_left: 'leftTop',
                  rear_left: 'leftDown',
                  front_right: 'rightTop',
                  rear_right: 'rightDown',
                };
                let tiresInfoTemp = { id: item?.id, column_name: item?.column_name };

                if (item?.saved_fields?.length > 0) {
                  let savedTireInfo = item?.saved_fields[0]?.val
                  if (item?.saved_fields[0]?.val) {
                    JSON.parse(savedTireInfo).map(tireInfoItem => {
                      let column_name_temp = '';
                      if (tireInfoItem.column_name == 'tyre_brand_id') {
                        column_name_temp = 'mark';
                      } else if (tireInfoItem.column_name == 'tyre_model_id') {
                        column_name_temp = 'model';
                      } else {
                        column_name_temp = tireInfoItem?.column_name;
                      }
                      if (tireInfoItem?.type === 'text') {
                        tiresInfoTemp[column_name_temp] = tireInfoItem?.val;
                      } else {
                        tiresInfoTemp[column_name_temp] = {
                          id: tireInfoItem?.val,
                          value: tireInfoItem?.val_text,
                        };
                      }
                    });
                  }
                }

                if (item?.val?.length > 0) {
                  if (item?.val) {
                    item?.val?.map(tireInfoItem => {
                      console.log('#L1', tireInfoItem);
                      let column_name_temp = '';
                      if (tireInfoItem.column_name === 'tyre_brand_id') {
                        column_name_temp = 'mark';
                      } else if (tireInfoItem.column_name === 'tyre_model_id') {
                        column_name_temp = 'model';
                      } else {
                        column_name_temp = tireInfoItem?.column_name;
                      }
                      if (tireInfoItem?.type === 'text') {
                        tiresInfoTemp[column_name_temp] = tireInfoItem?.val;
                      } else {
                        tiresInfoTemp[column_name_temp] = {
                          id: tireInfoItem?.val,
                          value: tireInfoItem?.val_text,
                        };
                      }
                    });
                  }
                }

                tiresTemp[listTires[item.column_name]] = tiresInfoTemp;

              default:
                break;
            }
          });
          if (!same && !diff) {
            props.turnOnModeNone();
          }

          props.initTires(tiresTemp);

          setLoaderVisible(false);
        }
      }

      setLoaderVisible(false);
    } catch (err) {
      console.log('fetch data error in tires', err);
      setLoaderVisible(false);
    }
  }

  const checkTire = tire => {


    let check = [];

    check.push(tire.mark?.id !== undefined && tire.mark?.id !== null);
    check.push(tire.model?.id !== undefined && tire.model?.id !== null);



    let width = tire.width;
    if (width) {
      if (parseInt(width) <= 500 && parseInt(width) > 0 && width.slice(0, 1) != 0) {
        check.push(true);
      } else {
        check.push(false);
      }
    } else {
      check.push(false);
    }

    let profile = tire.profile;
    if (profile) {
      if (profile.slice(0, 1) != 0) {
        check.push(true);
      } else {
        check.push(false);
      }
    } else {
      check.push(false);
    }

    let radius = tire.radius;
    if (radius) {
      if (radius.slice(0, 1) != 0) {
        check.push(true);
      } else {
        check.push(false);
      }
    } else {
      check.push(false);
    }

    let remainder = tire.remainder;
    if (remainder) {
      if (parseInt(remainder) <= 40 && parseInt(remainder) > 0) {
        check.push(true);
      } else {
        check.push(false);
      }
    } else {
      check.push(false);
    }
    //console.log('#M6', tire.id, check.every(item => item));
    return check.every(item => item);
  };
  function validate(doubleReq = false) {
    let fieldsValues = {
      tyres_same_size_brand: same,
      tyres_winter_type: winter,
      diff_width_wheel: diff,
      rear_left: props.tiresProcessed.leftDown,
      front_left: props.tiresProcessed.leftTop,
      front_right: props.tiresProcessed.rightTop,
      rear_right: props.tiresProcessed.rightDown,
    };
    const extraValidations = {};
    ['rear_left', 'front_left', 'front_right', 'rear_right'].forEach(field_name => {
      extraValidations[field_name] = () => {
        return checkTire(fieldsValues[field_name]);
      };
    });

    let validationResults = validateFields(
      fieldsValues,
      fields,
      goToUnfilled,
      goToUnfilled ? extraValidations : {}
    );

    let allValid = Object.keys(validationResults).every(field_name => validationResults[field_name]);

    let validationResultsForMenu = validateFields(fieldsValues, fields, true, extraValidations);

    let allValidForMenu = Object.keys(validationResultsForMenu).every(
      field_name => validationResultsForMenu[field_name]
    );

    //console.log('#T4', validationResultsForMenu);
    if (allValidForMenu) {
      dispatch(setOpenScreen('TiresScreen', 2));
    } else {
      dispatch(setOpenScreen('TiresScreen', 1));
    }

    return allValid;

    // let verified = [];
    // Object.keys(fields).map(item => {
    //   let req = false;
    //   if (doubleReq) req = fields[item].required === 2 || fields[item].required === 1;
    //   else req = fields[item].required === 2;
    //   fields[item]?.type === 'page' ? (req ? verified.push(false) : verified.push(true)) : '';
    // });
    //
    // //todo: FIX
    // if (Object.keys(props.tiresProcessed).length === 4) {
    //   return true;
    // } else if (verified.every(item => item)) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  function next() {
    if (validate()) {
      globalFunctions.globalSendDataAndGoNext(
        props.token,
        props.reportId,
        setLoaderVisible,
        saveData,
        'TiresScreen',
        navigation,
        dispatch,
        props.sectionList,
        constants,
        'tires',
        goToUnfilled
      );
    } else {
      changeModalErrorVisibleFlag(true);
    }
  }

  useEffect(() => {
    if (netInfo?.isConnected !== null && props.route.name === 'TiresScreen') {
      if (props.openScreen.TiresScreen === 0) {
        dispatch(setOpenScreen('TiresScreen', 1));
      }
      getData()
        .then(() => {
          fetchData().catch(err => {
            console.log('fetch data error, tires', err);
          });
        })
        .catch(err => {
          console.log('fetch data error, tires', err);
        });
    }
  }, [netInfo, props.route]);

  const onAllSameSwitchChanged = value => {
    changeSame(value);
    if (value) {
      props.turnOnModeAll();
      //setShouldRunUseeffect(true);
      changeDiff(false);
    } else {
      props.turnOnModeNone();
    }
  };
  const onDiffSwitchChanged = value => {
    changeDiff(value);
    if (value) {
      props.turnOnModeHalf();
      //setShouldRunUseeffect(true);
      changeSame(false);
    } else {
      props.turnOnModeNone();
    }
  };
  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Шины'}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={saveData}
            setLoaderVisible={setLoaderVisible}
            validateFunc={() =>
              fields
                ? validate(true)
                : () => {
                    true;
                  }
            }
            currentScreen={'TiresScreen'}
          />
        }
        backButton={backSection.check}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
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
        route={props.route}
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
                {fields?.tyres_same_size_brand && (
                  <FieldCheckSwitch
                    field={{ name: fields?.tyres_same_size_brand.name }}
                    value={same}
                    setValue={onAllSameSwitchChanged}
                    type={'switch'}
                  />
                )}
                {fields?.tyres_winter_type && (
                  <FieldCheckSwitch
                    field={{ name: fields?.tyres_winter_type.name }}
                    value={winter}
                    setValue={changeWinter}
                    type={'switch'}
                  />
                )}
                {fields?.diff_width_wheel && (
                  <FieldCheckSwitch
                    field={{ name: fields?.diff_width_wheel.name }}
                    value={diff}
                    setValue={onDiffSwitchChanged}
                    type={'switch'}
                  />
                )}
                <View style={styles.interactiveInner}>
                  <View style={styles.interactiveLeft}>
                    <TireAdd
                      //tires={tires}
                      //setTires={setTires}
                      side={'leftTop'}
                      navigation={navigation}
                      firstTire={firstTires}
                      setFirstTires={setFirstTires}
                      shouldRunUseeffect={setShouldRunUseeffect}
                      same={same}
                      imgWidth={imgWidth}
                      imgHeight={imgHeight}
                      sendReport={saveDataWithNoScreenChange}
                    />

                    <TireAdd
                      //tires={tires}
                      //setTires={setTires}
                      side={'leftDown'}
                      navigation={navigation}
                      firstTire={firstTires}
                      setFirstTires={setFirstTires}
                      shouldRunUseeffect={setShouldRunUseeffect}
                      same={same}
                      imgWidth={imgWidth}
                      imgHeight={imgHeight}
                      sendReport={saveDataWithNoScreenChange}
                    />
                  </View>
                  <ImageBackground
                    source={images.carTires}
                    style={[styles.interactiveCenter, { height: height / 2 }]}
                    imageStyle={{ width: '100%', resizeMode: 'contain' }}
                    onLayout={evt => {
                      setImgWidth(evt.nativeEvent.layout.width);
                      setImgHeight(evt.nativeEvent.layout.height);
                    }}
                  />
                  <View style={styles.interactiveRight}>
                    <TireAdd
                      //tires={tires}
                      //setTires={setTires}
                      side={'rightTop'}
                      navigation={navigation}
                      firstTire={firstTires}
                      setFirstTires={setFirstTires}
                      shouldRunUseeffect={setShouldRunUseeffect}
                      same={same}
                      imgWidth={imgWidth}
                      imgHeight={imgHeight}
                      sendReport={saveDataWithNoScreenChange}
                    />

                    <TireAdd
                      //tires={tires}
                      //setTires={setTires}
                      side={'rightDown'}
                      navigation={navigation}
                      firstTire={firstTires}
                      setFirstTires={setFirstTires}
                      shouldRunUseeffect={setShouldRunUseeffect}
                      same={same}
                      imgWidth={imgWidth}
                      imgHeight={imgHeight}
                      sendReport={saveDataWithNoScreenChange}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </>
        )}
      </HeaderBar>
      <ModalError
        modalFlag={modalErrorVisibleFlag}
        changeModalFlag={changeModalErrorVisibleFlag}
        message={modalErrorMessage}
      />
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    sectionList: state.appGlobal.sectionList,
    token: state.appGlobal.loginToken,
    reportId: state.appGlobal.reportId,
    reportType: state.appGlobal.reportType,
    openScreen: state.appGlobal.openScreen,
    tiresProcessed: state.tires.tiresProcessed,
  };
};
const mapDispatchToProps = {
  setOpenScreen: setOpenScreen,
  initTires: initTires,
  turnOnModeAll: turnOnModeAll,
  turnOnModeHalf: turnOnModeHalf,
  turnOnModeNone: turnOnModeNone,
  clearTires: clearTires,
};

export default connect(mapStateToProps, mapDispatchToProps)(TiresScreen);
