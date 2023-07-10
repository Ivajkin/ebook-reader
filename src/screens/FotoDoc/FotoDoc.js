//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region plagins
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
//#endregion

//#region components
import { HeaderBar } from '../../components/menu';
import { ModalFotoCancel, ModalDelElement } from '../../components/modal';
import { theme, COLORS, loader, constants } from '../../сonstants';
import { global } from '../../requests';
import { FieldImages, FieldCheckSwitch } from '../../components/fields';
import { globalFunctions } from '../../utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const FotoDocScreen = ({ route, navigation }) => {
  const [data, setData] = useState(route.params.data);
  const changeData = route.params.changeData;
  const routeItem = route.params.item ? route.params.item : null;

  const reportId = useSelector(state => state.appGlobal.reportId);
  const fieldId = data && routeItem ? (data[routeItem] ? data[routeItem].id : null) : null;

  const token = useSelector(state => state.appGlobal.loginToken);

  const [modalDelElementFlag, changeDelElementFlag] = useState(false);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);

  const id = route.params.id;
  const confirmDoc = route.params.confirmDoc;
  const deleteFlag = route.params.deleteFlag;

  const [elementFotos, setElementFotos] = useState(route.params.data[id].photo);
  const [checkConfirmDoc, changeCheckConfirmDoc] = useState(data[id] ? data[id].matchDoc : false);
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const [comments, setComments] = useState(data[id] ? data[id].comments : null);
  const [commentsActive, setCommentsActive] = useState(false);

  const [loaderVisible, setLoaderVisible] = useState(false);

  const [tempPhoto, setPhoto] = useState([]);

  useEffect(() => {
    tempPhoto.map(item => {
      let mass = elementFotos;
      let changeMass = setElementFotos;
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

  function dowloadFoto(array, fArray) {
    launchImageLibrary({}, value => {
      if (!value.didCancel) {
        if (value.assets[0].uri) {
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
            .then(response => {
              setElementFotos(arr => [...arr, { id: null, photo: response.name }]);

              let result = global.sendFiles(
                response.uri,
                response.name,
                'image/jpeg',
                fieldId,
                reportId,
                token,
                `${data[routeItem].columnName}_photo`
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
            })
            .catch(err => {
              console.log('create resized image error in FotoDoc, download', err);
              setLoaderVisible(false);
            });
        }
      }
    });
  }

  function makeFoto(array, fArray) {
    launchCamera({}, value => {
      if (!value.didCancel) {
        if (value.assets[0].uri) {
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
            .then(response => {
              setElementFotos(arr => [...arr, { id: null, photo: response.name }]);

              let result = global.sendFiles(
                response.uri,
                response.name,
                'image/jpeg',
                fieldId,
                reportId,
                token,
                `${data[routeItem].columnName}_photo`
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
            })
            .catch(err => {
              console.log('create resized image error in FotoDoc, make', err);
              setLoaderVisible(false);
            });
        }
      }
    });
  }

  function navigateNext() {
    let newId = id + 1;
    if (newId < Object.keys(data).length) {
      changeCheckConfirmDoc(data[newId] ? data[newId].matchDoc : false);
      setComments(data[newId] ? data[newId].comments : null);
      setElementFotos(data[newId] ? data[newId].photo : []);
      navigation.navigate('FotoDocScreen', {
        id: newId,
        confirmDoc: newId < 2 ? true : false,
        deleteFlag: newId < 4 ? false : true,
      });
    } else {
      navigation.navigate('MarkingsScreen');
    }
  }

  useEffect(() => {
    if (data[id]) {
      let tempData = { ...data };
      tempData[id].matchDoc = checkConfirmDoc;
      tempData[id].comments = comments;
      tempData[id].photo = elementFotos;
      tempData[id].count = elementFotos.length;
      changeData(tempData);
      setData(tempData);
    }
  }, [comments, checkConfirmDoc, elementFotos]);

  useEffect(() => {
    changeData(data);
  }, [data]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      {data[id] ? (
        <>
          <HeaderBar
            title={data[id].name}
            backButton={true}
            goBackFlag={true}
            menuFlag={false}
            nav={navigation}
            route={route}
            delButtonFlag={deleteFlag}
          >
            <AnimatedLoader
              visible={loaderVisible}
              overlayColor={COLORS.whiteTransparent}
              source={loader}
              animationStyle={styles.lottie}
              speed={1}
              loop={true}
            />
            {deleteFlag && (
              <TouchableOpacity style={styles.deleteElementInner} onPress={() => changeDelElementFlag()}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.deleteElement]}>Удалить</Text>
              </TouchableOpacity>
            )}
            <View style={styles.container}>
              <KeyboardAwareScrollView
                contentContainerStyle={[styles.scroll, { flexGrow: 1 }]}
                showsVerticalScrollIndicator={false}
              >
                <FieldCheckSwitch
                  field={{
                    name: confirmDoc
                      ? 'Cоответствует дате производства а/м'
                      : 'Соответствует документам',
                  }}
                  value={checkConfirmDoc}
                  setValue={changeCheckConfirmDoc}
                  type={'switch'}
                />
                <FieldImages
                  value={elementFotos}
                  setValue={setElementFotos}
                  changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                  setIndexDeleteFoto={setIndexDeleteFoto}
                  //changeModalFotoCancelData={changeModalFotoCancelData}
                  dowloadFoto={dowloadFoto}
                  makeFoto={makeFoto}
                />

                <View
                  style={[
                    styles.inputInner,
                    {
                      borderColor: COLORS.gray,
                      backgroundColor: COLORS.primary,
                      marginTop: 5,
                    },
                  ]}
                >
                  {commentsActive || comments ? (
                    <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>Комментарий</Text>
                  ) : (
                    <></>
                  )}
                  <TextInput
                    style={[
                      theme.FONTS.body_SF_R_15,
                      styles.input,
                      {
                        height: 80,
                        paddingTop:
                          commentsActive || comments
                            ? Platform.OS === 'ios'
                              ? 18
                              : 18
                            : Platform.OS === 'ios'
                            ? 0
                            : 8,
                      },
                    ]}
                    placeholderTextColor={COLORS.darkGray}
                    placeholder={!commentsActive ? 'Комментарий' : null}
                    multiline={true}
                    textAlignVertical={'top'}
                    onFocus={() => setCommentsActive(true)}
                    onBlur={() => setCommentsActive(false)}
                    onChangeText={text => setComments(text)}
                    value={comments}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={navigateNext}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </HeaderBar>
          <ModalFotoCancel
            modalVisible={modalFotoCancelFlag}
            setModalVisible={changeModalFotoCancelFlag}
            modalFotoCancelData={{ fotoArray: elementFotos, setFotoArray: setElementFotos }}
            indexDeleteFoto={indexDeleteFoto}
          />
          <ModalDelElement
            data={data}
            setDataLocal={setData}
            changeDataGlobal={changeData}
            modalVisible={modalDelElementFlag}
            setModalVisible={changeDelElementFlag}
            id={id}
            navigation={navigation}
          />
        </>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default FotoDocScreen;
