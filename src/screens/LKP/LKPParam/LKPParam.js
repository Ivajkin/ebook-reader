//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
//#endregion

//#region plagins
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AnimatedLoader from 'react-native-animated-loader';
import ImageResizer from 'react-native-image-resizer';
//#endregion

//#region components
import { HeaderBar } from '../../../components/menu';
import { ModalFotoCancel } from '../../../components/modal';
import { FieldImages, FieldInput } from '../../../components/fields';
import { theme, COLORS, constants, loader } from '../../../сonstants';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
//#endregion

//#endregion

const LKPParamScreen = ({ route, navigation }) => {
  //#region valuebles
  const netInfo = useNetInfo();
  //#region flags
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.checking_paintwork;
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [validateFlag, setValidateFlag] = useState(true);
  //#endregion

  //#region system
  const { setParentData, fieldsArray, index, goToUnfilled, keyScreenList } = route.params;
  const [data, setData] = useState({ ...fieldsArray });
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  //#endregion

  //#region data
  const [width, setWidth] = useState(data[keyScreenList[index]].width);
  const [foto, setFoto] = useState(data[keyScreenList[index]].photo);

  const [tempPhoto, setPhoto] = useState([]);

  //#endregion
  //#endregion

  function dowloadFoto(array, fArray) {
    launchImageLibrary(
      {
        includeBase64: false,
      },
      value => {
        if (!value.didCancel) {
          let imgData = 'assets' in value ? value.assets[0] : value;
          if (imgData) {
            //setLoaderVisible(true)
            let resizeWidth = imgData.width;
            let resizeHeight = imgData.height;
            if (
              imgData.width > constants.imgCompress.maxWidth ||
              imgData.height > constants.imgCompress.maxHeight
            ) {
              resizeWidth = constants.imgCompress.maxWidth;
              resizeHeight = constants.imgCompress.maxHeight;
            }
            ImageResizer.createResizedImage(
              imgData.uri,
              resizeWidth,
              resizeHeight,
              constants.imgCompress.compressFormat,
              constants.imgCompress.quality,
              0,
              null
            )
              .then(async response => {
                fArray(arr => [...arr, { id: null, photo: response.name }]);
                if (!netInfo?.isConnected) {
                  const dataSend = [
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    fieldsArray[keyScreenList[index]].column_name,
                    section.id,
                    `${keyScreenList[index]}_photo`,
                  ];
                  const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
                  if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
                    await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
                  } else {
                    await AsyncStorage.setItem(
                      '@shouldSendFiles',
                      JSON.stringify([...shouldSendFiles, dataSend])
                    );
                  }
                  setLoaderVisible(false);
                  setPhoto(arr => [
                    ...arr,
                    {
                      id: response.path,
                      photo: response.uri,
                      name: response.name,
                    },
                  ]);
                } else {
                  let result = global.sendFiles(
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`
                  );
                  globalFunctions.requestProcess(
                    result,
                    setLoaderVisible,
                    result => {
                      setLoaderVisible(false);
                      setPhoto(arr => [
                        ...arr,
                        {
                          id: result.data.data.id,
                          photo: result.data.data.storage_path,
                          name: result.data.data.filename,
                        },
                      ]);
                    },
                    constants.errorMessage.photoAdd
                  );
                }
              })
              .catch(err => {
                setLoaderVisible(false);
                console.log('createResizedImage, dowload, LKPParam', err);
              });
          }
        }
      }
    );
  }

  function makeFoto(array, fArray) {
    launchCamera(
      {
        includeBase64: false,
      },
      value => {
        if (!value.didCancel) {
          if (value.assets[0]) {
            //setLoaderVisible(true)
            let resizeWidth = value.assets[0].width;
            let resizeHeight = value.assets[0].height;
            if (
              value.assets[0].width > constants.imgCompress.maxWidth ||
              value.assets[0].height > constants.imgCompress.maxHeight
            ) {
              resizeWidth = constants.imgCompress.maxWidth;
              resizeHeight = constants.imgCompress.maxHeight;
            }
            ImageResizer.createResizedImage(
              value.assets[0].uri,
              resizeWidth,
              resizeHeight,
              constants.imgCompress.compressFormat,
              constants.imgCompress.quality,
              0,
              null
            )
              .then(async response => {
                fArray(arr => [...arr, { id: null, photo: response.name }]);
                if (!netInfo?.isConnected) {
                  const dataSend = [
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`,
                    section.id,
                  ];
                  const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
                  if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
                    await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
                  } else {
                    await AsyncStorage.setItem(
                      '@shouldSendFiles',
                      JSON.stringify([...shouldSendFiles, dataSend])
                    );
                  }
                  setLoaderVisible(false);
                  setPhoto(arr => [
                    ...arr,
                    {
                      id: response.path,
                      photo: response.uri,
                      name: response.name,
                    },
                  ]);
                } else {
                  let result = global.sendFiles(
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`
                  );
                  globalFunctions.requestProcess(
                    result,
                    setLoaderVisible,
                    result => {
                      setLoaderVisible(false);
                      setPhoto(arr => [
                        ...arr,
                        {
                          id: result.data.data.id,
                          photo: result.data.data.storage_path,
                          name: result.data.data.filename,
                        },
                      ]);
                    },
                    constants.errorMessage.photoAdd
                  );
                }
              })
              .catch(err => {
                setLoaderVisible(false);
                console.log('createResizedImage, make, LKPParam', err);
              });
          }
        }
      }
    );
  }

  function validateFields() {
    if (width) {
      if (width > 0 && width.slice(0, 1) !== '0') {
        setValidateFlag(true);
        return true;
      } else {
        setValidateFlag(false);
        return false;
      }
    } else {
      return false;
    }
  }

  function nextPage() {
    let result = validateFields();
    if (result) {
      if (goToUnfilled) {
        navigation.goBack();
      } else {
        if (index + 1 < keyScreenList.length) {
          setWidth(fieldsArray[keyScreenList[index + 1]].width);
          setFoto(fieldsArray[keyScreenList[index + 1]].photo);
          navigation.navigate('LKPParamScreen', {
            fieldsArray: fieldsArray,
            setParentData: setParentData,
            keyScreenList: keyScreenList,
            index: index + 1,
          });
        } else {
          navigation.navigate('CheckingLKPScreen');
        }
      }
    }
  }

  useEffect(() => {
    if (data[keyScreenList[index]]) {
      let tempData = { ...data };
      tempData[keyScreenList[index]].width = width;
      tempData[keyScreenList[index]].photo = foto;
      tempData[keyScreenList[index]].count = foto.length;
      setParentData(tempData);
      setData(tempData);
    }
  }, [width, foto]);

  useEffect(() => {
    tempPhoto.map(item => {
      let mass = foto;
      let changeMass = setFoto;
      let temp = mass.filter(itemIn => {
        return itemIn.photo === item.name;
      })[0];

      let index = mass.indexOf(temp);

      if (index !== -1) {
        let forPush = { id: item.id, photo: item.photo };
        changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
      }
    });
  }, [tempPhoto]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'ЛКП / ' + fieldsArray[keyScreenList[index]].title}
        backButton={true}
        goBackFlag={true}
        menuFlag={false}
        nav={navigation}
        route={route}
        screenBack={'CheckingLKPScreen'}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={!data ? COLORS.none : COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <FieldInput
              field={{ name: 'Толщина, мкм', required: 0 }}
              value={width}
              setValue={setWidth}
              fieldType={'number-pad'}
              validateFlag={validateFlag}
              setValidate={setValidateFlag}
            />
            <FieldImages
              value={foto}
              setValue={setFoto}
              changeModalFotoCancelFlag={changeModalFotoCancelFlag}
              setIndexDeleteFoto={setIndexDeleteFoto}
              dowloadFoto={dowloadFoto}
              makeFoto={makeFoto}
            />
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.nextButtonWrapper}
          // onPress={() => goToUnfilled ? nextPage() : index + 1 < keyScreenList.length ?
          // 	nextPage() :
          // 	navigation.navigate('CheckingLKPScreen')
          // }
          onPress={nextPage}
        >
          <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
        </TouchableOpacity>
      </HeaderBar>
      <ModalFotoCancel
        modalVisible={modalFotoCancelFlag}
        setModalVisible={changeModalFotoCancelFlag}
        modalFotoCancelData={{ fotoArray: foto, setFotoArray: setFoto }}
        indexDeleteFoto={indexDeleteFoto}
      />
    </SafeAreaView>
  );
};

export default LKPParamScreen;
