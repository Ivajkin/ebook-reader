//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
//#endregion

//#region redux
import { setOpenScreen } from '../../../redux/App/actions/mainActions';
//#endregion

//#region plagins
import { useDispatch, useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../../components/menu';
import { ModalError } from '../../../components/modal';
import { ImgPhotoCarComponent } from '../../../components/fields';
import AdditionalPhotos from '../../../components/fields/AdditionalPhotos/AdditionalPhotos';
import { loader, theme, COLORS, constants } from '../../../сonstants';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';
import { FlatList } from 'react-native-gesture-handler';
import validateFields from '../../../utils/validateRequired';

//#endregion

//#endregion

const FotoExteriorScreen = ({ route, navigation }) => {
  //#region valuebles
  const netInfo = useNetInfo();
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.exterior_photos;
  const reportID = useSelector(state => state.appGlobal.reportId);
  const dispatch = useDispatch();

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'exterior_photos',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'exterior_photos',
    'back'
  );

  //#region flags
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  //#endregion

  //#region system
  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const [modalErrorMessage, setModalErrorMessage] = useState('Не все обязательные поля заполнены!');
  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);
  //#endregion

  //#region data
  const [foreshorteningFoto, setForeshorteningFoto] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
  });
  const [otherFoto, setOtherFoto] = useState([]);
  //#endregion
  const [fields, setFields] = useState(null);

  const [exteriorFront, setExteriorFront] = useState([]);
  const [exteriorFrontLeft, setExteriorFrontLeft] = useState([]);
  const [exteriorFrontRight, setExteriorFrontRight] = useState([]);
  const [exteriorRearRight, setExteriorRearRight] = useState([]);
  const [exteriorRearLeft, setExteriorRearLeft] = useState([]);
  const [exteriorRear, setExteriorRear] = useState([]);
  const [exteriorLeft, setExteriorLeft] = useState([]);
  const [exteriorRight, setExteriorRight] = useState([]);
  const [exteriorEngine, setExteriorEngine] = useState([]);

  const [exteriorFrontFlag, changeExteriorFrontFlag] = useState(true);
  const [exteriorFrontLeftFlag, changeExteriorFrontLeftFlag] = useState(true);
  const [exteriorFrontRightFlag, changeExteriorFrontRightFlag] = useState(true);
  const [exteriorRearRightFlag, changeExteriorRearRightFlag] = useState(true);
  const [exteriorRearLeftFlag, changeExteriorRearLeftFlag] = useState(true);
  const [exteriorRearFlag, changeExteriorRearFlag] = useState(true);
  const [exteriorLeftFlag, changeExteriorLeftFlag] = useState(true);
  const [exteriorRightFlag, changeExteriorRightFlag] = useState(true);
  const [exteriorEngineFlag, changeExteriorEngineFlag] = useState(true);

  //const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const [tempPhoto, setPhoto] = useState([]);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  const fieldsArray = {
    exterior_front: {
      value: exteriorFront,
      setValue: setExteriorFront,
      validateFlag: exteriorFrontFlag,
      changeValidateFlag: changeExteriorFrontFlag,
    },
    exterior_front_left: {
      value: exteriorFrontLeft,
      setValue: setExteriorFrontLeft,
      validateFlag: exteriorFrontLeftFlag,
      changeValidateFlag: changeExteriorFrontLeftFlag,
    },
    exterior_front_right: {
      value: exteriorFrontRight,
      setValue: setExteriorFrontRight,
      validateFlag: exteriorFrontRightFlag,
      changeValidateFlag: changeExteriorFrontRightFlag,
    },
    exterior_rear_right: {
      value: exteriorRearRight,
      setValue: setExteriorRearRight,
      validateFlag: exteriorRearRightFlag,
      changeValidateFlag: changeExteriorRearRightFlag,
    },
    exterior_rear_left: {
      value: exteriorRearLeft,
      setValue: setExteriorRearLeft,
      validateFlag: exteriorRearLeftFlag,
      changeValidateFlag: changeExteriorRearLeftFlag,
    },
    exterior_rear: {
      value: exteriorRear,
      setValue: setExteriorRear,
      validateFlag: exteriorRearFlag,
      changeValidateFlag: changeExteriorRearFlag,
    },
    exterior_left: {
      value: exteriorLeft,
      setValue: setExteriorLeft,
      validateFlag: exteriorLeftFlag,
      changeValidateFlag: changeExteriorLeftFlag,
    },
    exterior_right: {
      value: exteriorRight,
      setValue: setExteriorRight,
      validateFlag: exteriorRightFlag,
      changeValidateFlag: changeExteriorRightFlag,
    },
    exterior_engine: {
      value: exteriorEngine,
      setValue: setExteriorEngine,
      validateFlag: exteriorEngineFlag,
      changeValidateFlag: changeExteriorEngineFlag,
    },
    exterior_add_photos: {
      value: otherFoto,
      setValue: setOtherFoto,
      validateFlag: true,
      changeValidateFlag: () => {},
    },
  };
  //#endregion
  async function serverWorkFuncImage(response, loadSetter, extra_data) {
    let changeValidateFlag = extra_data.changeValidateFlag;
    let fieldId = extra_data.fieldId;
    let column_name = extra_data.column_name;
    if (!netInfo?.isConnected) {
      console.log('not connected, photo exterior');
    } else {
      if (column_name !== 'exterior_add_photos') {
        //console.log('has column');
        global
          .sendFiles(response.uri, response.name, 'image/jpeg', fieldId, reportID, token, column_name)
          .then(result => {
            if (changeValidateFlag) {
              changeValidateFlag(true);
            }
            //console.log('#KK3', tempPhoto);
            setPhoto(arr => [
              ...arr.filter(el => el.column_name !== result.data.data.column_name),
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
                column_name: result.data.data.column_name,
                isDefault: false,
              },
            ]);
          })
          .catch(err => console.log('send files error, foto ext, not additional', err.response));
      } else {
        //console.log('lml', additionalPhotos);
        fieldId = fields.exterior_add_photos.id;
        global
          .sendFiles(
            response.uri,
            response.name,
            'image/jpeg',
            fieldId,
            reportID,
            token,
            'exterior_add_photos'
          )
          .then(result => {
            if (changeValidateFlag) {
              changeValidateFlag(true);
            }
            //console.log('#F9', additionalPhotos);
            setAdditionalPhotos(arr => [
              ...arr,
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
                column_name: 'exterior_add_photos',
                isDefault: false,
              },
            ]);
          })
          .catch(err => console.log('send files error, foto ext, not additional', err));
      }
    }
  }

  async function getData(flag = false) {
    if (!netInfo?.isConnected) {
      console.log('no connection, get data exterior photo');
    } else {
      setLoaderVisible(true);
      global
        .getFields(reportType, section.id, token)
        .then(res => {
          let fieldsTemp = {};
          res.data.data.map(item => {
            fieldsTemp[item.column_name] = item;
          });
          setFields(fieldsTemp);
          setLoaderVisible(false);
        })

        .catch(err => {
          console.log('get fields err in foto exterior', err);
          setLoaderVisible(false);
        });
    }
  }

  async function fetchData() {
    setLoaderVisible(true);
    try {
      let result = [];
      let reportFieldsIds = [];
      if (!netInfo?.isConnected) {
        console.log('no connection, photo exterior fetching data');
      } else {
        let res = await global.getSavedReport(token, reportID, section.id, null, null);
        result = res.data.data;
        let savedPhotos = [];
        result.map((el, i) => {
          if (el.column_name === 'exterior_add_photos') {
            let newAdditionals = el.saved_fields[0]?.uploaded_files.map(additional_photo => {
              return {
                column_name: additional_photo.column_name,
                name: additional_photo.filename,
                id: additional_photo.id,
                isDefault: false,
                photo: additional_photo.storage_path,
              };
            });
            setAdditionalPhotos(newAdditionals);
          } else {
            let curPhoto =
              el?.saved_fields.length > 0 && el?.saved_fields[0]?.uploaded_files.length > 0
                ? el.saved_fields[0]?.uploaded_files[0]?.storage_path
                : el.meta_val;
            let isDefault = !(el?.saved_fields[0]?.uploaded_files?.length > 0);
            //console.log('#Q5', el.column_name, isDefault);
            savedPhotos.push({
              column_name: el.column_name,
              name: el.name,
              id: isDefault ? el.id : el?.saved_fields[0]?.uploaded_files[0].id,
              photo: curPhoto,
              isDefault: isDefault,
            });
          }
        });
        setPhoto(savedPhotos);
      }

      setLoaderVisible(false);
    } catch (e) {
      setLoaderVisible(false);
      console.log('fetch data try except error, exterior photo', e);
    }
  }

  const validateImageField = imageField => {
    return !imageField?.isDefault;
  };
  function validate(doubleReq = false) {
    let fieldsValues = {};
    let allFieldsFlagSetters = {};
    Object.keys(fieldsArray).forEach(field_name => {
      fieldsValues[field_name] = tempPhoto.find(el => el.column_name === field_name);
      allFieldsFlagSetters[field_name] = fieldsArray[field_name].changeValidateFlag;
    });

    const extras = {};
    const extrasForMenu = {};
    Object.keys(fieldsArray).forEach(column_name => {
      let needChecking =
        fields[column_name].required === 2 || (fields[column_name].required === 1 && goToUnfilled);
      let needCheckingForMenu = fields[column_name].required > 0;
      if (column_name !== 'exterior_add_photos') {
        if (needChecking) {
          extras[column_name] = validateImageField;
        }
        if (needCheckingForMenu) {
          extrasForMenu[column_name] = validateImageField;
        }
      }
    });


    //console.log('#Q1', Object.keys(extras));
    //console.log('#Q3', Object.keys(extrasForMenu));
    //console.log('#Q3', fields);

    let validationResults = validateFields(fieldsValues, fields, goToUnfilled, extras);

    Object.keys(validationResults).forEach(field_name => {
      //console.log('#Q2', field_name, validationResults[field_name]);
      allFieldsFlagSetters[field_name](validationResults[field_name]);
    });
    let allValid = Object.keys(validationResults).every(field_name => validationResults[field_name]);

    let validationResultsForMenu = validateFields(fieldsValues, fields, true, extrasForMenu);

    let allValidForMenu = Object.keys(validationResultsForMenu).every(
      field_name => validationResultsForMenu[field_name]
    );

    if (allValidForMenu) {
      dispatch(setOpenScreen('FotoExteriorScreen', 2));
    } else {
      dispatch(setOpenScreen('FotoExteriorScreen', 1));
    }

    return allValid;
  }

  function goNext() {
    //validate();
    if (validate()) {
      globalFunctions.navigateToAvailabaleSection(
        navigation,
        dispatch,
        sectionList,
        constants.sectionOrderList,
        'exterior_photos',
        token,
        reportID,
        setLoaderVisible,
        goToUnfilled,
        netInfo
      );
    }
    // else {
    //   changeModalErrorVisibleFlag(true);
    // }
  }

  // useEffect(()=>{
  //   console.log('#H2', tempPhoto);
  // }, [tempPhoto])

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'FotoExteriorScreen') {
      if (openScreen.FotoExteriorScreen === 0) {
        dispatch(setOpenScreen('FotoExteriorScreen', 1));
      }
      getData()
        .then(
          fetchData().catch(err => {
            console.log('fetchData error in photo exterior', err);
          })
        )
        .catch(err => {
          console.log('getData error in photo exterior', err);
        });
    }
  }, [netInfo, route]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'FotoExteriorScreen') {
      if (navFromProgress) {
        getData()
          .then(
            fetchData().catch(err => {
              console.log('fetchData error in photo exterior', err);
            })
          )
          .catch(err => {
            console.log('getData error in photo exterior', err);
          });
      }
    }
  }, [navFromProgress, renderProgress, netInfo, route]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={section.title}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={() => {
              return new Promise(resolve => {
                resolve(true);
              });
            }}
            setLoaderVisible={setLoaderVisible}
            validateFunc={
              () => {}
              // fields
              //   ? validate(true)
              //   : () => {
              //       true;
              //     }
            }
            currentScreen={'FotoExteriorScreen'}
          />
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={goToUnfilled ? true : backSection.check}
        endReport={goToUnfilled ? true : false}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            async () => {
              validate(true);
              return true;
            },
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            async () => {
              validate(true);
              return true;
            },
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
          <>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.line} />
                <FlatList
                  data={Object.keys(fieldsArray)}
                  renderItem={({ item, index }) => {
                    if (Object.keys(fields).includes(item)) {
                      if (item !== 'exterior_add_photos') {
                        return (
                          <ImgPhotoCarComponent
                            photos={tempPhoto}
                            setPhotos={setPhoto}
                            fieldsItem={fields[item]}
                            item={fieldsArray[item]}
                            makePhoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {
                              addPhoto(
                                'camera',
                                value,
                                setValue,
                                serverWorkFuncImage,
                                setLoaderVisible,
                                {
                                  changeValidateFlag,
                                  fieldId,
                                  column_name,
                                }
                              );
                            }}
                            dowloadFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {
                              addPhoto(
                                'gallery',
                                value,
                                setValue,
                                serverWorkFuncImage,
                                setLoaderVisible,
                                {
                                  changeValidateFlag,
                                  fieldId,
                                  column_name,
                                }
                              );
                            }}
                            changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                            setIndexDeleteFoto={setIndexDeleteFoto}
                            changeModalFotoCancelData={changeModalFotoCancelData}
                            i={index}
                            validateFlag={fields[item].validateFlag}
                          />
                        );
                      } else {
                        return (
                          <AdditionalPhotos
                            //column_name={'exterior_add_photos'}
                            key={index}
                            value={additionalPhotos}
                            setValue={setAdditionalPhotos}
                            changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                            setIndexDeleteFoto={setIndexDeleteFoto}
                            changeModalFotoCancelData={changeModalFotoCancelData}
                            makeFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {
                              //console.log('col', column_name);
                              addPhoto(
                                'camera',
                                value,
                                setValue,
                                serverWorkFuncImage,
                                setLoaderVisible,
                                {
                                  changeValidateFlag,
                                  fieldId,
                                  column_name: 'exterior_add_photos',
                                }
                              );
                            }}
                            dowloadFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {
                              console.log('col', column_name);
                              addPhoto(
                                'gallery',
                                value,
                                setValue,
                                serverWorkFuncImage,
                                setLoaderVisible,
                                {
                                  changeValidateFlag,
                                  fieldId,
                                  column_name: 'exterior_add_photos',
                                }
                              );
                            }}
                          />
                        );
                      }
                    }
                  }}
                  keyExtractor={(item, index) => {
                    return String(index) + '$';
                  }}
                />
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => goNext()}>
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

export default FotoExteriorScreen;
