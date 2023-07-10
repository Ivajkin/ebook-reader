//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region components
import { HeaderBar } from '../../../components/menu';
import { ModalFotoCancel } from '../../../components/modal';
import { FieldImages, FieldCheckSwitch, FieldInput } from '../../../components/fields';
import { global } from '../../../requests';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//#endregion

//#region styles
import { styles } from './styles';
import { theme, loader, COLORS, constants } from '../../../сonstants';
import { globalFunctions } from '../../../utils';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';
import AdditionalPhotos from '../../../components/fields/AdditionalPhotos/AdditionalPhotos';
//#endregion

//#endregion

const DamageParamsScreen = ({ route, navigation }) => {
  const { data, tabName, itemIndex, setData } = route.params;
  //#region valuebles
  //#region flag
  const netInfo = useNetInfo();
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const token = useSelector(state => state.appGlobal.loginToken);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.damaged_parts;
  //#endregion

  //#region data
  const [checkList, changeCheckList] = useState(data[tabName][itemIndex].values);
  const [foto, setFoto] = useState(
    data[tabName][itemIndex]?.photo?.length > 0 ? data[tabName][itemIndex].photo: []
  );
  const [comment, setComment] = useState(data[tabName][itemIndex].comment);
  //#endregion

  //#region system
  //const { title } = route.params;
  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  //#endregion

  const [tempPhoto, setPhoto] = useState([]);

  //#endregion
  async function serverWorkFuncImage(response, loadSetter) {
    if (!netInfo?.isConnected) {
      const dataSend = [
        response.uri,
        response.name,
        'image/jpeg',
        data[tabName][itemIndex].id,
        reportId,
        token,
        data[tabName][itemIndex].column_name,
        section.id,
        data[tabName][itemIndex].columnNamePhoto,
      ];
      const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
      // if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
      //   await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
      // } else {
      //   await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([...shouldSendFiles, dataSend]));
      // }
      loadSetter(false);
      setPhoto(arr => [
        ...arr,
        {
          id: response.path,
          photo: response.uri,
          name: response.name,
        },
      ]);
    } else {
      global
        .sendFiles(
          response.uri,
          response.name,
          'image/jpeg',
          data[tabName][itemIndex].id,
          reportId,
          token,
          data[tabName][itemIndex].columnNamePhoto
        )
        .then(result => {
          setFoto(arr => [
            ...arr,
            {
              id: result.data.data.id,
              photo: result.data.data.storage_path,
              name: result.data.data.filename,
            },
          ]);
        })
        .catch(err => console.log('send files error, damage params', err));
      // globalFunctions.requestProcess(
      //   result,
      //   loadSetter,
      //   result => {
      //     loadSetter(false);
      //     setPhoto(arr => [
      //       ...arr,
      //       {
      //         id: result.data.data.id,
      //         photo: result.data.data.storage_path,
      //         name: result.data.data.filename,
      //       },
      //     ]);
      //   },
      //   constants.errorMessage.photoAdd
      // );
    }
  }


  useEffect(() => {
    console.log('#Z1', data[tabName][itemIndex]);
    /**
     * count objects
     */
    let localCounter = 0;
    Object.keys(checkList).map((item, index) => {
      if (checkList[item].value) {
        localCounter = localCounter + 1;
      }
    });

    /**
     * write to parent state
     */
    let tempItem = [...data[tabName]];
    tempItem[itemIndex] = {
      ...data[tabName][itemIndex],
      photo: foto,
      ['comment']: comment,
      values: checkList,
      count: localCounter,
    };
    setData({ ...data, [tabName]: tempItem });
  }, [foto, comment, checkList]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <HeaderBar
        title={data[tabName][itemIndex].name}
        backButton={true}
        goBackFlag={true}
        menuFlag={false}
        nav={navigation}
        route={route}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={[styles.scroll, { flexGrow: 1 }]}
            showsVerticalScrollIndicator={false}
          >
            {Object.keys(checkList).map(item => (
              <FieldCheckSwitch
                key={checkList[item].id}
                field={{ name: checkList[item].title }}
                value={checkList[item].value}
                setValue={() =>
                  changeCheckList({
                    ...checkList,
                    [item]: { ...checkList[item], value: !checkList[item].value },
                  })
                }
                type={'switch'}
              />
            ))}
            {/*<FieldImages*/}
            {/*  value={foto}*/}
            {/*  setValue={setFoto}*/}
            {/*  changeModalFotoCancelFlag={changeModalFotoCancelFlag}*/}
            {/*  setIndexDeleteFoto={setIndexDeleteFoto}*/}
            {/*  changeModalFotoCancelData={changeModalFotoCancelData}*/}
            {/*  dowloadFoto={(value, setValue) => {*/}
            {/*    addPhoto('gallery', value, setValue, serverWorkFuncImage, setLoaderVisible);*/}
            {/*  }}*/}
            {/*  makeFoto={(value, setValue) => {*/}
            {/*    addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible);*/}
            {/*  }}*/}
            {/*/>*/}
            <AdditionalPhotos
              //column_name={'exterior_add_photos'}
              //key={index}
              value={foto}
              setValue={setFoto}
              changeModalFotoCancelFlag={changeModalFotoCancelFlag}
              setIndexDeleteFoto={setIndexDeleteFoto}
              changeModalFotoCancelData={changeModalFotoCancelData}
              dowloadFoto={(value, setValue) => {
                addPhoto('gallery', value, setValue, serverWorkFuncImage, setLoaderVisible);
              }}
              makeFoto={(value, setValue) => {
                addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible);
              }}
            />
            {/*makeFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {*/}
            {/*  //console.log('col', column_name);*/}
            {/*  addPhoto(*/}
            {/*    'camera',*/}
            {/*    value,*/}
            {/*    setValue,*/}
            {/*    serverWorkFuncImage,*/}
            {/*    setLoaderVisible,*/}
            {/*    {*/}
            {/*      changeValidateFlag,*/}
            {/*      fieldId,*/}
            {/*      column_name: 'exterior_add_photos',*/}
            {/*    }*/}
            {/*  );*/}
            {/*}}*/}
            {/*dowloadFoto={(value, setValue, changeValidateFlag, fieldId, column_name) => {*/}
            {/*  console.log('col', column_name);*/}
            {/*  addPhoto(*/}
            {/*    'gallery',*/}
            {/*    value,*/}
            {/*    setValue,*/}
            {/*    serverWorkFuncImage,*/}
            {/*    setLoaderVisible,*/}
            {/*    {*/}
            {/*      changeValidateFlag,*/}
            {/*      fieldId,*/}
            {/*      column_name: 'exterior_add_photos',*/}
            {/*    }*/}
            {/*  );*/}
            {/*}}*/}
            {/*/>*/}
            <FieldInput
              field={{ name: 'Комментарий' }}
              value={comment}
              setValue={setComment}
              multiline={true}
              // validateFlag={fieldsArray[item].validateFlag}
              // setValidate={fieldsArray[item].changeValidateFlag}
            />
          </KeyboardAwareScrollView>
        </View>
        <TouchableOpacity
          style={styles.nextButtonWrapper}
          onPress={() => navigation.navigate('DamageScreen')}
        >
          <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
        </TouchableOpacity>
      </HeaderBar>
      {/*<ModalFotoCancel*/}
      {/*  modalVisible={modalFotoCancelFlag}*/}
      {/*  setModalVisible={changeModalFotoCancelFlag}*/}
      {/*  modalFotoCancelData={modalFotoCancelData}*/}
      {/*  indexDeleteFoto={indexDeleteFoto}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};

export default DamageParamsScreen;
