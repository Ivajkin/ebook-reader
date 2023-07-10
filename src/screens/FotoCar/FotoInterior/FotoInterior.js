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
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
//#endregion

//#region redux
import { setOpenScreen } from '../../../redux/App/actions/mainActions';
//#endregion

//#region plagins
import { useDispatch } from 'react-redux';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../../components/menu';
import { ModalError } from '../../../components/modal';
import { ImgPhotoCarComponent } from '../../../components/fields';
import AdditionalPhotos from '../../../components/fields/AdditionalPhotos/AdditionalPhotos';
import { loader, theme, COLORS, constants } from '../../../сonstants';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
import validateFields from '../../../utils/validateRequired';
//#endregion

//#region images
//#endregion

//#region styles
import { styles } from './styles';
import AnimatedLoader from 'react-native-animated-loader';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';
//#endregion

//#endregion

const FotoInteriorScreen = ({ route, navigation }) => {
  //#region valuebles
  const netInfo = useNetInfo();
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.interior_photos;
  const reportID = useSelector(state => state.appGlobal.reportId);
  const dispatch = useDispatch();

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'interior_photos',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'interior_photos',
    'back'
  );

  //#region flags
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  //#endregion

  //#region system
  const [modalErrorMessage, setModalErrorMessage] = useState('Не все обязательные поля заполнены!');
  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);
  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  //#endregion

  //#region data
  const [foreshorteningFoto, setForeshorteningFoto] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [otherFoto, setOtherFoto] = useState([]);

  const [fields, setFields] = useState();

  const [interiorTorpeda, setInteriorTorpeda] = useState([]);
  const [interiorConsole, setInteriorConsole] = useState([]);
  const [interiorWheel, setInteriorWheel] = useState([]);
  const [interiorFront, setInteriorFront] = useState([]);
  const [interiorBack, setInteriorBack] = useState([]);
  const [interiorTrunk, setInteriorTrunk] = useState([]);

  const [interiorTorpedaFlag, changeInteriorTorpedaFlag] = useState(true);
  const [interiorConsoleFlag, changeInteriorConsoleFlag] = useState(true);
  const [interiorWheelFlag, changeInteriorWheelFlag] = useState(true);
  const [interiorFrontFlag, changeInteriorFrontFlag] = useState(true);
  const [interiorBackFlag, changeInteriorBackFlag] = useState(true);
  const [interiorTrunkFlag, changeInteriorTrunkFlag] = useState(true);

  const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const [tempPhoto, setPhoto] = useState([]);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);

  const fieldsArray = {
    interior_torpedo: {
      value: interiorTorpeda,
      setValue: setInteriorTorpeda,
      validateFlag: interiorTorpedaFlag,
      changeValidateFlag: changeInteriorTorpedaFlag,
    },
    interior_console: {
      value: interiorConsole,
      setValue: setInteriorConsole,
      validateFlag: interiorConsoleFlag,
      changeValidateFlag: changeInteriorConsoleFlag,
    },
    interior_wheel: {
      value: interiorWheel,
      setValue: setInteriorWheel,
      validateFlag: interiorWheelFlag,
      changeValidateFlag: changeInteriorWheelFlag,
    },
    interior_seats_front: {
      value: interiorFront,
      setValue: setInteriorFront,
      validateFlag: interiorFrontFlag,
      changeValidateFlag: changeInteriorFrontFlag,
    },
    interior_seats_rear: {
      value: interiorBack,
      setValue: setInteriorBack,
      validateFlag: interiorBackFlag,
      changeValidateFlag: changeInteriorBackFlag,
    },
    interior_trunk: {
      value: interiorTrunk,
      setValue: setInteriorTrunk,
      validateFlag: interiorTrunkFlag,
      changeValidateFlag: changeInteriorTrunkFlag,
    },
    interior_add_photos: {
      value: otherFoto,
      setValue: setOtherFoto,
      validateFlag: true,
      changeValidateFlag: () => {},
    },
  };
  //#endregion
  //#endregion
  async function serverWorkFuncImage(response, loadSetter, extra_data) {
    let changeValidateFlag = extra_data.changeValidateFlag;
    let fieldId = extra_data.fieldId;
    let column_name = extra_data.column_name;
    if (!netInfo?.isConnected) {
      console.log('not connected, photo interior');
    } else {
      if (column_name !== 'interior_add_photos') {
        global
          .sendFiles(response.uri, response.name, 'image/jpeg', fieldId, reportID, token, column_name)
          .then(result => {
            if (changeValidateFlag) {
              changeValidateFlag(true);
            }
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
          .catch(err => console.log('sendFiles err, serverWork, photo interior', err));
      } else {
        fieldId = fields.interior_add_photos.id;
        global
          .sendFiles(
            response.uri,
            response.name,
            'image/jpeg',
            fieldId,
            reportID,
            token,
            'interior_add_photos'
          )
          .then(result => {
            if (changeValidateFlag) {
              changeValidateFlag(true);
            }
            setAdditionalPhotos(arr => [
              ...arr,
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
                column_name: 'interior_add_photos',
                isDefault: false,
              },
            ]);
          })
          .catch(err => console.log('send files error, foto int, not additional', err));
      }
    }
  }

  async function getData(flag = false) {
    if (!netInfo?.isConnected) {
      setLoaderVisible(true);
      const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
        item => item.id === section.id
      );
      let fieldsTemp = {};
      reportFields.fields.map(item => {
        fieldsTemp[item.column_name] = item;
      });
      setFields(fieldsTemp);
      setLoaderVisible(false);
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
          console.log('get fields err in foto interior', err);
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
        console.log('no connection, photo interior fetching data');
      } else {
        let res = await global.getSavedReport(token, reportID, section.id, null, null);
        result = res.data.data;
        let savedPhotos = [];
        result.map((el, i) => {
          if (el.column_name === 'interior_add_photos') {
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
              el?.saved_fields?.length > 0 && el?.saved_fields[0]?.uploaded_files.length > 0
                ? el.saved_fields[0]?.uploaded_files[0]?.storage_path
                : el.meta_val;
            let isDefault = !(el?.saved_fields[0]?.uploaded_files.length > 0);
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
      console.log('fetch data try except error, interior photo', e);
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
      if (column_name !== 'interior_add_photos') {
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
      dispatch(setOpenScreen('FotoInteriorScreen', 2));
    } else {
      dispatch(setOpenScreen('FotoInteriorScreen', 1));
    }

    return allValid;
  }

  function goNext() {
    if (validate()) {
      globalFunctions.navigateToAvailabaleSection(
        navigation,
        dispatch,
        sectionList,
        constants.sectionOrderList,
        'interior_photos',
        token,
        reportID,
        setLoaderVisible,
        goToUnfilled,
        netInfo
      );
    }
    // } else {
    //   changeModalErrorVisibleFlag(true);
    // }
  }

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'FotoInteriorScreen') {
      if (openScreen.FotoExteriorScreen === 0) {
        dispatch(setOpenScreen('FotoInteriorScreen', 1));
      }
      getData()
        .then(
          fetchData().catch(err => {
            console.log('fetchData error in photo interior', err);
          })
        )
        .catch(err => {
          console.log('getData error in photo interior', err);
        });
    }
  }, [netInfo, route]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'FotoInteriorScreen') {
      if (navFromProgress) {
        getData()
          .then(
            fetchData().catch(err => {
              console.log('fetchData error in photo interior', err);
            })
          )
          .catch(err => {
            console.log('getData error in photo interior', err);
          });
      }
    }
  }, [navFromProgress, renderProgress, netInfo, route]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Фото интерьера'}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={() => {
              return new Promise(resolve => {
                resolve(true);
              });
            }}
            setLoaderVisible={setLoaderVisible}
            validateFunc={() =>
              fields
                ? validate(true)
                : () => {
                    true;
                  }
            }
            currentScreen={'FotoInteriorScreen'}
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
                      if (item !== 'interior_add_photos') {
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
                            //column_name={'interior_add_photos'}
                            key={index}
                            value={additionalPhotos}
                            setValue={setAdditionalPhotos}
                            changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                            setIndexDeleteFoto={setIndexDeleteFoto}
                            changeModalFotoCancelData={changeModalFotoCancelData}
                            makeFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {
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

export default FotoInteriorScreen;
