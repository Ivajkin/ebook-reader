//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  FlatList,
  Modal,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
//#endregion

//#region plagins
import { connect, useDispatch, useSelector } from 'react-redux';
//#endregion

//#region components
import { HeaderBar } from '../../../components/menu';
import { FieldInput } from '../../../components/fields';
import { icons, theme, COLORS, loader } from '../../../сonstants';
import { Tires } from '../../../requests';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLoader from 'react-native-animated-loader';
import { addTire } from '../../../redux/App/actions/tiresActions';
import { produceWithPatches } from 'immer';
import { patchWebProps } from 'react-native-elements/dist/helpers';
import { ModalFotoCancel } from '../../../components/modal';
import { global } from '../../../requests';

import { addPhoto } from '../../../utils/photo';
import { propTypes } from 'react-native-cached-image/CachedImage';
import { setTiresBrandsList } from '../../../redux/App/actions/listsActions';
//#endregion

const TiresChooseScreen = ({
  route,
  navigation,
  addTireFunc,
  tires,
  token,
  reportId,
  setNewTiresBrandsList,
  tiresBrandsList,
}) => {
  //#region valuebles

  //#region system
  const netInfo = useNetInfo();
  const { tire, setFirstTires, shouldRunUseeffect, sendReport } = route.params;
  const dispatch = useDispatch();

  const [markChecked, setMarkChecked] = useState(tires[tire] ? tires[tire].mark : null);
  const [modelChecked, setModelChecked] = useState(tires[tire] ? tires[tire].model : null);

  const [width, setWidth] = useState(tires[tire] ? tires[tire].width : null);
  const [profile, setProfile] = useState(tires[tire] ? tires[tire].profile : null);
  const [radius, setRadius] = useState(tires[tire] ? tires[tire].radius : null);
  const [remainder, setRemainder] = useState(tires[tire] ? tires[tire].remainder : null);

  const [widthValidateFlag, changeWidthValidateFlag] = useState(true);
  const [profileValidateFlag, changeProfileValidateFlag] = useState(true);
  const [radiusValidateFlag, changeRadiusValidateFlag] = useState(true);
  const [remainderValidateFlag, changeRemainderValidateFlag] = useState(true);
  const [markCheckedValidateFlag, changeMarkCheckedValidateFlag] = useState(true);
  const [modelCheckedValidateFlag, changeModelCheckedValidateFlag] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);

  //const [brandList, setBrandList] = useState([]);
  const [modelList, setModelList] = useState([]);

  const [photos, setPhotos] = useState(tires[tire] ? tires[tire].photos : []); //
  const [tempPhoto, setPhoto] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(0);

  const deleteFoto = () => {
    let ph2 = [...photos];
    ph2.splice(indexDeleteFoto, 1);
    setPhotos(ph2);

    setModalVisible(false);
  };
  // const IDs = {
  //   'leftDown': 119,
  //   'leftTop':117,
  //   'right'
  // }
  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    global
      .sendFiles(
        response.uri,
        response.name,
        'image/jpeg',
        tires[tire].id,
        reportId,
        token,
        'tires_photo'
      )
      .then(result => {
        if (result.status === 200) {
          let newPhotos = [
            ...photos,
            {
              id: result.data.data.id,
              uri: result.data.data.storage_path720p,
            },
          ];
          setPhotos(newPhotos);
        }
      })
      .catch(err => console.log('server work error, tiresChoose', err));
  }

  //#endregion

  //#endregion

  function validate() {
    let check = [];

    if (markChecked) {
      check.push(true);
      changeMarkCheckedValidateFlag(true);
    } else {
      check.push(false);
      changeMarkCheckedValidateFlag(false);
    }

    if (modelChecked) {
      check.push(true);
      changeModelCheckedValidateFlag(true);
    } else {
      check.push(false);
      changeModelCheckedValidateFlag(false);
    }

    if (width) {
      if (parseInt(width) <= 500 && parseInt(width) >= 1 && width.slice(0, 1) != 0) {
        check.push(true);
        changeWidthValidateFlag(true);
      } else {
        check.push(false);
        changeWidthValidateFlag(false);
      }
    } else {
      check.push(false);
      changeWidthValidateFlag(false);
    }

    if (profile) {
      if (profile.slice(0, 1) != 0) {
        check.push(true);
        changeProfileValidateFlag(true);
      } else {
        check.push(false);
        changeProfileValidateFlag(false);
      }
    } else {
      check.push(false);
      changeProfileValidateFlag(false);
    }

    if (radius) {
      if (radius.slice(0, 1) != 0) {
        check.push(true);
        changeRadiusValidateFlag(true);
      } else {
        check.push(false);
        changeRadiusValidateFlag(false);
      }
    } else {
      check.push(false);
      changeRadiusValidateFlag(false);
    }

    if (remainder) {
      if (parseInt(remainder) <= 40 && parseInt(remainder) >= 0) {
        check.push(true);
        changeRemainderValidateFlag(true);
      } else {
        check.push(false);
        changeRemainderValidateFlag(false);
      }
    } else {
      check.push(false);
      changeRemainderValidateFlag(false);
    }

    return check.every(item => item);
  }

  function sendWithNoScreenChange() {
    setFirstTires(tire);
    shouldRunUseeffect(true);
    let tiresTemp = { ...tires };
    let newTireItem = {
      mark: markChecked,
      model: modelChecked,
      width: width,
      profile: profile,
      radius: radius,
      remainder: remainder,
      photos: photos,
    };
    tiresTemp[tire] = newTireItem;
    addTireFunc({
      place: tire,
      tire: newTireItem,
    });
  }
  function send() {
    if (validate()) {
      setFirstTires(tire);
      shouldRunUseeffect(true);
      let tiresTemp = { ...tires };
      let newTireItem = {
        mark: markChecked,
        model: modelChecked,
        width: width,
        profile: profile,
        radius: radius,
        remainder: remainder,
        photos: photos,
      };
      tiresTemp[tire] = newTireItem;
      addTireFunc({
        place: tire,
        tire: newTireItem,
      });
      navigation.navigate('TiresScreen');
    }
    // if (tire && markChecked && modelChecked && width && profile && radius && remainder) {
    // 	dispatch(addTiresToList(tire, markChecked, modelChecked, width, profile, radius, remainder));
    // 	navigation.navigate('TiresScreen');
    // 	changeUpdate(!update)
    // }
  }

  async function getBrands() {
    if (tiresBrandsList.length === 0) {
      setLoaderVisible(true);
      if (!netInfo?.isConnected) {
        console.log('no connection, trying to load tire brands');
      } else {
        setLoaderVisible(true)
        Tires.getBrands(token)
          .then(res => {
            setLoaderVisible(false)
            if (res) {
              console.log('#E1', res.data.data.length);
              if (res.data.data.length > 0) {
                let temporary = [];

                // let temporaryId = [];
                res.data.data.map((item, index) => {
                  temporary.push([item.id, item.value, item.logo]);
                  // temporaryId.push(item.id);
                });
                //setCarBrandPopularList(temporary);
                if (temporary && temporary.length > 0) {
                  setNewTiresBrandsList(temporary);
                }
                //  setCarBrandPopularListId(temporaryId);
              }
            }
          })
          .catch(err => {
            console.log('Tires getBrands error', err);
          });
        //setBrandList(tiresBrands.data.data);
      }
      setLoaderVisible(false);
    }
  }

  async function getModels(id) {
    setLoaderVisible(true);
    console.log('get models');
    if (!netInfo?.isConnected) {
      console.log('no connection, get tire models');
    } else {
      const tiresModels = (await Tires.getModels(id, token)).data.data.find(item => item.id === id);

      if (tiresModels.tyre_models !== undefined) {
        //console.log('#ll', tiresModels.tyre_models.map(el => Object.keys(el)));
        setModelList(tiresModels.tyre_models.map(el => [el.id, el.value]));
      }
    }
    setLoaderVisible(false);
  }

  useEffect(() => {

    if (netInfo && netInfo.isConnected !== null) {
      console.log('mark checked change', markChecked);
      if (markChecked?.id && markChecked?.id !== 'null') {
        getModels(markChecked?.id).catch(err => {
          console.log('get tires models error', err);
        });
      }
    }
  }, [markChecked, netInfo]);

  useEffect(() => {
    if (netInfo && netInfo.isConnected !== null) {
      getBrands().catch(err => {
        console.log('get tires brands error', err);
      });
    }
  }, [netInfo, route]);

  return (
    <SafeAreaView>
      <AnimatedLoader
        visible={loaderVisible}
        overlayColor={COLORS.whiteTransparent}
        source={loader}
        animationStyle={{
          width: Platform.OS !== 'ios' ? 200 : 50,
          height: Platform.OS !== 'ios' ? 200 : 50,
        }}
        speed={1}
        loop={true}
      />
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Шины'}
        backButton={true}
        goBackFlag={false}
        backFunc={() => send()}
        menuFlag={false}
        nav={navigation}
        route={route}
        hasSideMenu={false}
      >
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <TouchableOpacity
              style={[
                styles.inputInner,
                {
                  borderColor: markCheckedValidateFlag ? COLORS.gray : COLORS.red,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                if (tiresBrandsList.length) {
                  setModelChecked(null);
                  navigation.navigate('TiresMarkModalChooseScreen', {
                    itemChecked: markChecked,
                    setItemChecked: setMarkChecked,
                    //listBrand: brandList,
                    listModels: modelList,
                    markModal: 'mark',
                  });
                }
              }}
            >
              <Text style={[theme.FONTS.body_SF_R_15, styles.inputText]}>
                {markChecked?.value && markChecked?.value !== 'null' ? markChecked?.value : 'Марка'}
              </Text>
              <Image source={icons.arrowRight} style={styles.fieldIconRight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.inputInner,
                {
                  borderColor: modelCheckedValidateFlag ? COLORS.gray : COLORS.red,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}
              onPress={() =>
                markChecked && modelList.length
                  ? navigation.navigate('TiresMarkModalChooseScreen', {
                      itemChecked: modelChecked,
                      setItemChecked: setModelChecked,
                      //listBrand: brandList,
                      listModels: modelList,
                      markModal: 'model',
                    })
                  : ''
              }
            >
              <Text style={styles.inputText}>
                {modelChecked &&
                String(modelChecked?.value) !== 'undefined' &&
                String(modelChecked?.value) !== 'null'
                  ? String(modelChecked?.value)
                  : 'Модель'}
              </Text>
              <Image source={icons.arrowRight} style={styles.fieldIconRight} />
            </TouchableOpacity>
            <View style={styles.wprInner}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  field={{ name: 'Ширина' }}
                  fieldType={'numeric'}
                  value={width}
                  setValue={setWidth}
                  maxLength={3}
                  reg={/[^0-9]/g}
                  validateFlag={widthValidateFlag}
                  setValidate={changeWidthValidateFlag}
                />
                {!widthValidateFlag && (
                  <Text style={[theme.FONTS.body_SF_R_15, styles.errorMessage]}>От 1 до 500</Text>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                <FieldInput
                  field={{ name: 'Профиль' }}
                  fieldType={'numeric'}
                  maxLength={2}
                  value={profile}
                  reg={/[^0-9]/g}
                  setValue={setProfile}
                  validateFlag={profileValidateFlag}
                  setValidate={changeProfileValidateFlag}
                />
                {!profileValidateFlag && (
                  <Text style={[theme.FONTS.body_SF_R_15, styles.errorMessage]}>От 1 до 99</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  field={{ name: 'Радиус' }}
                  fieldType={'numeric'}
                  maxLength={2}
                  reg={/[^0-9]/g}
                  value={radius}
                  setValue={setRadius}
                  validateFlag={radiusValidateFlag}
                  setValidate={changeRadiusValidateFlag}
                />
                {!radiusValidateFlag && (
                  <Text style={[theme.FONTS.body_SF_R_15, styles.errorMessage]}>От 1 до 99</Text>
                )}
              </View>
            </View>
            <FieldInput
              field={{ name: 'Остаток, мм (0-40)' }}
              fieldType={'numeric'}
              maxLength={2}
              value={remainder}
              setValue={setRemainder}
              validateFlag={remainderValidateFlag}
              setValidate={changeRemainderValidateFlag}
            />
            <View>
              <FlatList
                data={photos}
                keyExtractor={phProps => {
                  return phProps.id;
                }}
                horizontal={true}
                renderItem={photoProps => {
                  return (
                    <>
                      <TouchableOpacity style={styles.photoSurface} key={String(photoProps.index) + '$'}>
                        <ImageBackground
                          source={{
                            uri: photoProps.item.uri,
                          }}
                          imageStyle={{ borderRadius: 15 }}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          //resizeMethod="contain"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.photoDelete}
                        onPress={() => {
                          setIndexDeleteFoto(photoProps.index);
                          setModalVisible(true);
                        }}
                      >
                        <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
                      </TouchableOpacity>
                    </>
                  );
                  //return <Image source={{ uri: props.item }} style={{width: '100%', height: 400}}/>;
                  //
                }}
              />
            </View>

            <View style={styles.photoPickerInner}>
              <TouchableOpacity
                style={styles.photoPickerBtn}
                onPress={() => {
                  addPhoto('gallery', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible);
                }}
              >
                <Image style={{ width: 16, height: 13 }} source={icons.downloadFoto} />
                <Text style={[theme.FONTS.body_SF_M_12, styles.photoPickerText]}>Галерея</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoPickerBtn}
                onPress={() => {
                  addPhoto('camera', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible);
                }}
              >
                <Image style={{ width: 16, height: 14 }} source={icons.makeFoto} />
                <Text style={styles.photoPickerText}>Камера</Text>
              </TouchableOpacity>
            </View>
            <Modal
              statusBarTranslucent={true}
              style={styles.modalExit}
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={() => {
                  setModalVisible(false);
                }}
              >
                <AnimatedLoader
                  visible={loaderVisible}
                  overlayColor={COLORS.whiteTransparent}
                  source={loader}
                  animationStyle={styles.lottie}
                  speed={1}
                  loop={true}
                />
                <View style={styles.modalViewWrapper}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalViewWrapperContent}>
                      <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
                        Вы уверены что хотите удалить данное фото?
                      </Text>
                      <View style={styles.modalTouchableInner}>
                        <TouchableOpacity
                          style={styles.modalBtn}
                          onPress={() => {
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.modalBtnText}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.modalBtn, styles.modalBtnPrimary]}
                          onPress={() => deleteFoto()}
                        >
                          <Text style={[styles.modalBtnText, { color: 'white' }]}>Удалить</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => send()}>
          <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
        </TouchableOpacity>
      </HeaderBar>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    tires: state.tires.tiresProcessed,
    token: state.appGlobal.loginToken,
    reportId: state.appGlobal.reportId,
    tiresBrandsList: state.lists.tiresBrandsList,
  };
};
const mapDispatchToProps = {
  addTireFunc: addTire,
  setNewTiresBrandsList: setTiresBrandsList,
};
export default connect(mapStateToProps, mapDispatchToProps)(TiresChooseScreen);
