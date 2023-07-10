//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

//#endregion

//#region plagins\
import { globalFunctions, Permission, PERMISSIONS_TYPE, reports } from '../../../utils';
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
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

const STSScreen = ({ route, navigation }) => {
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportID = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.documents;

  const [loaderVisible, setLoaderVisible] = useState(false);

  const { fieldsArray, setFieldsArray } = route.params;
  const [fieldsArrayLocal, setFieldsArrayLocal] = useState(fieldsArray);

  const [withoutSTS, changeWithoutSTS] = useState(fieldsArray.sts.sts_without);
  const [STSSeria, setSTSSeria] = useState(fieldsArray.sts.sts_seria);
  const [STSNumber, setSTSNumber] = useState(fieldsArray.sts.sts_number);
  const [STSFoto, setSTSFoto] = useState(fieldsArray.sts.STS_images ? fieldsArray.sts.STS_images : []);

  const [activeSTSNumberFlag, changeActiveSTSNumberFlag] = useState(false);
  const [activeSTSSeriaFlag, changeActiveSTSSeriaFlag] = useState(false);

  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);

  const [tempPhoto, setPhoto] = useState([]);

  // useEffect(() => {
  //   if (fieldsArray?.sts?.STS_images !== null && fieldsArray?.sts?.STS_images?.length) {
  //     const newFiles = reports.exceptDeletedFiles(fieldsArray.sts.STS_images);
  //     setSTSFoto(newFiles);
  //   }
  // }, []);

  useEffect(() => {
    // tempPhoto.map(item => {
    //   let mass = STSFoto;
    //   let changeMass = setSTSFoto;
    //   let temp = mass.filter(itemIn => {
    //     return itemIn.photo === item.name;
    //   })[0];
    //
    //   let index = mass.indexOf(temp);
    //
    //   if (index !== -1) {
    //     let forPush = { id: item.id, photo: item.photo };
    //     changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //   }
    // });
  }, [tempPhoto]);
  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    if (!netInfo?.isConnected) {
      console.log('no connection, sts server work func image');
    } else {
      global
        .sendFiles(
          response.uri,
          response.name,
          'image/jpeg',
          fieldsArray.sts.fieldID,
          reportID,
          token,
          column_name
        )
        .then(result => {
          //console.log('#T5', result.data.data);
          loadSetter(false);
          setSTSFoto(arr => {
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
        })
        .catch(err => {
          console.log('send files error, sts', err);
        });
    }
  }

  function next() {
    navigation.navigate('ExtraDocScreen', { fieldsArray: fieldsArray, setFieldsArray: setFieldsArray });
  }

  useEffect(() => {
    let tempData = { ...fieldsArrayLocal };
    tempData.sts.sts_without = withoutSTS;
    tempData.sts.sts_seria = STSSeria;
    tempData.sts.sts_number = STSNumber;
    tempData.sts.STS_images = STSFoto;
    tempData.sts.count = STSFoto.length;
    setFieldsArrayLocal(tempData);
  }, [withoutSTS, STSSeria, STSNumber, STSFoto]);

  useEffect(() => {
    setFieldsArray(fieldsArrayLocal);
  }, [fieldsArrayLocal]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'СТС'}
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
                <View style={styles.container}>
                  <FieldCheckSwitch
                    field={{
                      name: 'Отсутствует',
                    }}
                    value={withoutSTS}
                    setValue={changeWithoutSTS}
                    type={'switch'}
                  />
                  {!withoutSTS && (
                    <>
                      <View style={styles.STSInputInner}>
                        <View style={{ width: '37%' }}>
                          <FieldInput
                            field={{
                              name: 'Серия',
                              required: 0,
                            }}
                            reg={/[^0-9]/g}
                            fieldType={'numeric'}
                            maxLength={4}
                            value={STSSeria}
                            setValue={setSTSSeria}
                            active={activeSTSSeriaFlag}
                            setActive={changeActiveSTSSeriaFlag}
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
                            value={STSNumber}
                            setValue={setSTSNumber}
                            active={activeSTSNumberFlag}
                            setActive={changeActiveSTSNumberFlag}
                            reg={/[^0-9]/g}
                          />
                        </View>
                      </View>
                      <FieldImages
                        value={STSFoto}
                        setValue={setSTSFoto}
                        changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                        setIndexDeleteFoto={setIndexDeleteFoto}
                        changeModalFotoCancelData={changeModalFotoCancelData}
                        dowloadFoto={() => {
                          addPhoto(
                            'gallery',
                            STSFoto,
                            setSTSFoto,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            { column_name: 'STS_images' }
                          );
                          //dowloadFoto(STSFoto, setSTSFoto, 'STS_images');
                        }}
                        makeFoto={() => {
                          addPhoto(
                            'camera',
                            STSFoto,
                            setSTSFoto,
                            serverWorkFuncImage,
                            setLoaderVisible,
                            { column_name: 'STS_images' }
                          );
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

export default STSScreen;
