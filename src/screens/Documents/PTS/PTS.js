//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
//#endregion

//#region plagins
import { globalFunctions, Permission, PERMISSIONS_TYPE, reports } from '../../../utils';
import AnimatedLoader from 'react-native-animated-loader';
import { useSelector } from 'react-redux';
import axios from 'axios';
//#endregion

//#region components
import { HeaderBar } from '../../../components/menu';
import { ModalFotoCancel } from '../../../components/modal';
import { FieldInput, FieldImages, FieldCheckSwitch } from '../../../components/fields';
import { loader, theme, COLORS, constants } from '../../../сonstants';
import { global } from '../../../requests';
//#endregion

//#region images
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';

//#endregion

//#endregion

const PTSScreen = ({ route, navigation }) => {
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportID = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.documents;

  const [loaderVisible, setLoaderVisible] = useState(false);

  const { fieldsArray, setFieldsArray } = route.params;
  const [fieldsArrayLocal, setFieldsArrayLocal] = useState(fieldsArray);

  const [withoutPTS, changeWithoutPTS] = useState(fieldsArray.pts.without_PTS);
  const [PTSSeria, setPTSSeria] = useState(fieldsArray.pts.pts_seria);
  const [PTSNumber, setPTSNumber] = useState(fieldsArray.pts.pts_number);
  const [duplicate, changeDuplicate] = useState(fieldsArray.pts.pts_duplicate);
  const [PTSFoto, setPTSFoto] = useState(fieldsArray.pts.PTS_images ? fieldsArray.pts.PTS_images : []);
  const [ePTS, changeEPTS] = useState(fieldsArray.pts.electro_pts);
  const [ePTSNumber, setEPTSNumber] = useState(fieldsArray.pts.electro_pts_number);
  const [ePTSFoto, setEPTSFoto] = useState(
    fieldsArray.pts.electro_pts_foto ? fieldsArray.pts.electro_pts_foto : []
  );

  const [activePTSSeriaFlag, changeActivePTSSeriaFlag] = useState(false);
  const [activePTSNumberFlag, changeActivePTSNumberFlag] = useState(false);
  const [activeEPTSNumberFlag, changeActiveEPTSNumberFlag] = useState(false);

  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);

  const [tempPhoto, setPhoto] = useState([]);
  const [tempEPTSPhoto, setTempEPTSPhoto] = useState([]);

  // useEffect(() => {
  //   if (fieldsArray?.pts?.PTS_images !== null && fieldsArray?.pts?.PTS_images?.length) {
  //     const newFiles = reports.exceptDeletedFiles(fieldsArray.pts.PTS_images);
  //     setPTSFoto(newFiles);
  //   }

  //   if (fieldsArray?.pts?.electro_pts !== null && fieldsArray?.pts?.electro_pts?.length) {
  //     const newFiles = reports.exceptDeletedFiles(fieldsArray.pts.electro_pts);
  //     changeEPTS(newFiles);
  //   }
  // }, []);

  useEffect(() => {
    console.log('#T1', tempPhoto, PTSFoto);
    // tempPhoto.map(item => {
    //   let mass = PTSFoto;
    //   let changeMass = setPTSFoto;
    //   let temp = mass.filter(itemIn => {
    //     return itemIn.photo === item.name;
    //   })[0];
    //
    //   console.log('#T2', temp);
    //   // if (temp === undefined) {
    //   //   mass = ePTSFoto;
    //   //   changeMass = setEPTSFoto;
    //   //   temp = mass.filter(itemIn => {
    //   //     return itemIn.photo === item.name;
    //   //   })[0];
    //   // }
    //
    //   let index = mass.indexOf(temp);
    //
    //   console.log('#T3', index);
    //   if (index !== -1) {
    //     let forPush = { id: item.id, photo: item.photo };
    //     console.log('#T4', [...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //     changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //   }
    //   });
  }, [tempPhoto]);

  useEffect(() => {
    // tempPhoto.map(item => {
    //   let mass = ePTSFoto;
    //   let changeMass = setEPTSFoto;
    //   let temp = mass.filter(itemIn => {
    //     return itemIn.photo === item.name;
    //   })[0];
    //
    //   // if (temp === undefined) {
    //   //   mass = ePTSFoto;
    //   //   changeMass = setEPTSFoto;
    //   //   temp = mass.filter(itemIn => {
    //   //     return itemIn.photo === item.name;
    //   //   })[0];
    //   // }
    //
    //   let index = mass.indexOf(temp);
    //
    //   if (index !== -1) {
    //     let forPush = { id: item.id, photo: item.photo };
    //     changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //   }
    // });
  }, [tempEPTSPhoto]);

  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    if (!netInfo?.isConnected) {
      console.log('no connection, pts server work func image');
    } else {
      global
        .sendFiles(
          response.uri,
          response.name,
          'image/jpeg',
          fieldsArray.pts.fieldID,
          reportID,
          token,
          column_name
        )
        .then(result => {
          console.log('#T5', result.data.data);
          loadSetter(false);
          if (column_name === 'PTS_images') {
            setPTSFoto(arr => {
              let newAr = [
                ...arr.filter(el => el.photo !== result.data.data.filename && el.id !== null),
                {
                  id: result.data.data.id,
                  photo: result.data.data.storage_path,
                  name: result.data.data.filename,
                },
              ];
              //console.log('#T2', arr);
              //console.log('#T3', newAr);
              //setPTSFoto(newAr);
              return newAr;
              //return newAr;
            });
          } else {
            setEPTSFoto(arr => {
              let newAr = [
                ...arr.filter(el => el.photo !== result.data.data.filename && el.id !== null),
                {
                  id: result.data.data.id,
                  photo: result.data.data.storage_path,
                  name: result.data.data.filename,
                },
              ];
              //setEPTSFoto(newAr);

              return newAr;
            });
          }
        })
        .catch(err => {
          console.log('send files error, pts', err);
        });
      // globalFunctions.requestProcess(
      //   result,
      //   setLoaderVisible,
      //   result => {
      //     loadSetter(false);
      //     if (column_name === 'PTS_images'){
      //       setPTSFoto(arr => {
      //         let newAr = [
      //           ...arr.filter(el => el.photo !== result.data.data.filename && el.id !== null),
      //           {
      //             id: result.data.data.id,
      //             photo: result.data.data.storage_path,
      //             name: result.data.data.filename,
      //           },
      //         ];
      //         console.log('#T2', arr);
      //         console.log('#T3', newAr);
      //         //setPTSFoto(newAr);
      //         return arr;
      //         //return newAr;
      //       });
      //     } else {
      //       setEPTSFoto(arr => {
      //         let newAr = [
      //           ...arr.filter(el => el.photo !== result.data.data.filename && el.id !== null),
      //           {
      //             id: result.data.data.id,
      //             photo: result.data.data.storage_path,
      //             name: result.data.data.filename,
      //           },
      //         ];
      //         setEPTSFoto(newAr);
      //
      //         return newAr;
      //       });
      //     }
      //
      //   },
      //   constants.errorMessage.photoAdd
      // );
    }
  }

  function next() {
    console.log('#EPTS', ePTSFoto);
    console.log('#PTS', PTSFoto);
    console.log('#tempPhoto', tempPhoto);
    navigation.navigate('STSScreen', { fieldsArray: fieldsArray, setFieldsArray: setFieldsArray });
  }

  useEffect(() => {
    let tempData = { ...fieldsArrayLocal };
    tempData.pts.without_PTS = withoutPTS;
    tempData.pts.pts_seria = PTSSeria;
    tempData.pts.pts_number = PTSNumber;
    tempData.pts.pts_duplicate = duplicate;
    tempData.pts.PTS_images = PTSFoto;
    tempData.pts.electro_pts = ePTS;
    tempData.pts.electro_pts_number = ePTSNumber;
    tempData.pts.electro_pts_foto = ePTSFoto;
    if (PTSFoto != null) {
      tempData.pts.count = PTSFoto.length;
    }
    if (ePTSFoto != null) {
      tempData.pts.count += ePTSFoto.length;
    }
    setFieldsArrayLocal(tempData);
  }, [ePTSFoto, PTSFoto, withoutPTS, PTSSeria, PTSNumber, duplicate, ePTS, ePTSNumber]);

  useEffect(() => {
    setFieldsArray(fieldsArrayLocal);
  }, [fieldsArrayLocal]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />

      <HeaderBar
        title={'ПТС'}
        backButton={true}
        goBackFlag={true}
        menuFlag={false}
        nav={navigation}
        route={route}
        screenBack={'DocumentsScreen'}
        hasSideMenu={false}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={!fieldsArray ? COLORS.none : COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        {!fieldsArray ? (
          <></>
        ) : (
          <>
            <View style={styles.wrapper}>
              <ScrollView contentContainerStyle={styles.scroll}>
                {!ePTS && (
                  <View
                    style={[
                      styles.container,
                      { borderBottomWidth: 1, borderColor: COLORS.gray, paddingTop: 11 },
                    ]}
                  >
                    <FieldCheckSwitch
                      field={{
                        name: 'Отсутствует',
                      }}
                      value={withoutPTS}
                      setValue={changeWithoutPTS}
                      type={'switch'}
                    />
                    {!withoutPTS && (
                      <>
                        <View style={styles.PTSInputInner}>
                          <View style={{ width: '37%' }}>
                            <FieldInput
                              field={{
                                name: 'Серия',
                                required: 0,
                              }}
                              reg={/[^а-яА-Я0-9]/g}
                              maxLength={4}
                              value={PTSSeria}
                              setValue={setPTSSeria}
                              active={activePTSSeriaFlag}
                              setActive={changeActivePTSSeriaFlag}
                            />
                          </View>
                          <View style={{ width: '60%' }}>
                            <FieldInput
                              field={{
                                name: 'Номер',
                                required: 0,
                              }}
                              fieldType={'numeric'}
                              maxLength={6}
                              value={PTSNumber}
                              setValue={setPTSNumber}
                              active={activePTSNumberFlag}
                              setActive={changeActivePTSNumberFlag}
                              reg={/[^0-9]/g}
                            />
                          </View>
                        </View>
                        <FieldCheckSwitch
                          field={{
                            name: 'Дубликат',
                          }}
                          value={duplicate}
                          setValue={changeDuplicate}
                          type={'switch'}
                        />
                        <FieldImages
                          value={PTSFoto}
                          setValue={setPTSFoto}
                          changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                          setIndexDeleteFoto={setIndexDeleteFoto}
                          changeModalFotoCancelData={changeModalFotoCancelData}
                          columnName={'PTS_images'}
                          dowloadFoto={() => {
                            addPhoto(
                              'gallery',
                              PTSFoto,
                              setPTSFoto,
                              serverWorkFuncImage,
                              setLoaderVisible,
                              { column_name: 'PTS_images' }
                            );
                          }}
                          makeFoto={() => {
                            //makeFoto(PTSFoto, setPTSFoto, 'PTS_images');
                            addPhoto(
                              'camera',
                              PTSFoto,
                              setPTSFoto,
                              serverWorkFuncImage,
                              setLoaderVisible,
                              { column_name: 'PTS_images' }
                            );
                          }}
                        />
                      </>
                    )}
                  </View>
                )}
                <View style={[styles.container, { paddingTop: ePTS ? 0 : 10 }]}>
                  <FieldCheckSwitch
                    field={{
                      name: 'Эл. ПТС',
                    }}
                    value={ePTS}
                    setValue={changeEPTS}
                    type={'switch'}
                  />
                  {ePTS && (
                    <>
                      <FieldInput
                        field={{
                          name: 'Номер',
                          required: 0,
                        }}
                        maxLength={15}
                        value={ePTSNumber}
                        setValue={setEPTSNumber}
                        active={activeEPTSNumberFlag}
                        setActive={changeActiveEPTSNumberFlag}
                        reg={/[^а-яА-Я0-9a-zA-Z]/g}
                      />
                      <FieldImages
                        value={ePTSFoto}
                        setValue={setEPTSFoto}
                        changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                        setIndexDeleteFoto={setIndexDeleteFoto}
                        changeModalFotoCancelData={changeModalFotoCancelData}
                        dowloadFoto={() => {
                          addPhoto(
                            'gallery',
                            ePTSFoto,
                            setEPTSFoto,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            { column_name: 'electro_pts_foto' }
                          );
                          //dowloadFoto(ePTSFoto, setEPTSFoto, 'electro_pts_foto');
                        }}
                        makeFoto={() => {
                          addPhoto(
                            'camera',
                            ePTSFoto,
                            setEPTSFoto,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            { column_name: 'electro_pts_foto' }
                          );
                          //makeFoto(ePTSFoto, setEPTSFoto, 'electro_pts_foto');
                        }}
                      />
                    </>
                  )}
                </View>
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </>
        )}
      </HeaderBar>
      <ModalFotoCancel
        modalVisible={modalFotoCancelFlag}
        setModalVisible={changeModalFotoCancelFlag}
        modalFotoCancelData={modalFotoCancelData}
        indexDeleteFoto={indexDeleteFoto}
      />
    </SafeAreaView>
  );
};

export default PTSScreen;
