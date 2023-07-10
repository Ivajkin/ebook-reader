//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
//#endregion

//#region plagins
import { globalFunctions, Permission, PERMISSIONS_TYPE, reports } from '../../../utils';
import { useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region components
import { HeaderBar } from '../../../components/menu';
import { ModalFotoCancel } from '../../../components/modal';
import { FieldImages } from '../../../components/fields';
import { loader, theme, COLORS, constants } from '../../../сonstants';
import { global } from '../../../requests';
//#endregion

//#region images
//#endregion

//#region styles
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { addPhoto } from '../../../utils/photo';
//#endregion

//#endregion

const ExtraDocScreen = ({ route, navigation }) => {
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportID = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.documents;

  const [loaderVisible, setLoaderVisible] = useState(false);

  const { fieldsArray, setFieldsArray } = route.params;
  const [fieldsArrayLocal, setFieldsArrayLocal] = useState(fieldsArray);

  const [comments, setComments] = useState(fieldsArray.additional_documents.extra_doc_comments);
  const [extraDocFoto, setExtraDocFoto] = useState(
    fieldsArray.additional_documents.extra_doc_foto
      ? fieldsArray.additional_documents.extra_doc_foto
      : []
  );

  const [commentsActive, setCommentsActive] = useState(false);

  const [modalFotoCancelData, changeModalFotoCancelData] = useState({});
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);

  const [tempPhoto, setPhoto] = useState([]);

  // useEffect(() => {
  //   if (
  //     fieldsArray?.additional_documents?.extra_doc_foto !== null &&
  //     fieldsArray?.additional_documents?.extra_doc_foto?.length
  //   ) {
  //     const newFiles = reports.exceptDeletedFiles(fieldsArray.additional_documents.extra_doc_foto);
  //     setExtraDocFoto(newFiles);
  //   }
  // }, []);

  useEffect(() => {
    // tempPhoto.map(item => {
    //   let mass = extraDocFoto;
    //   let changeMass = setExtraDocFoto;
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

  // async function serverWorkFuncImage(response, loadSetter, extra_args) {
  //   let column_name = extra_args.column_name;
  //   if (!netInfo?.isConnected) {
  //     const dataSend = [
  //       response.uri,
  //       response.name,
  //       'image/jpeg',
  //       fieldsArray.additional_documents.fieldID,
  //       reportID,
  //       token,
  //       column_name,
  //       section.id,
  //     ];
  //     const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
  //     if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
  //       await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
  //     } else {
  //       await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([...shouldSendFiles, dataSend]));
  //     }
  //     loadSetter(false);
  //     setPhoto(arr => [
  //       ...arr,
  //       {
  //         id: response.path,
  //         photo: response.uri,
  //         name: response.name,
  //       },
  //     ]);
  //   } else {
  //     let result = global.sendFiles(
  //       response.uri,
  //       response.name,
  //       'image/jpeg',
  //       fieldsArray.additional_documents.fieldID,
  //       reportID,
  //       token,
  //       column_name
  //     );
  //     globalFunctions.requestProcess(
  //       result,
  //       loadSetter,
  //       result => {
  //         loadSetter(false);
  //         setPhoto(arr => [
  //           ...arr,
  //           {
  //             id: result.data.data.id,
  //             photo: result.data.data.storage_path,
  //             name: result.data.data.filename,
  //           },
  //         ]);
  //       },
  //       constants.errorMessage.photoAdd
  //     );
  //   }
  // }

  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    if (!netInfo?.isConnected) {
      console.log('no connection, extra docs server work func image');
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
          //console.log('#T5', result.data.data);
          loadSetter(false);
          setExtraDocFoto(arr => {
            let newAr = [
              ...arr.filter(el => el.photo !== result.data.data.filename && el.id !== null),
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
              },
            ];
            return newAr;
          });
        })
        .catch(err => {
          console.log('send files error, extra', err);
        });
    }
  }
  useEffect(() => {
    let tempData = { ...fieldsArrayLocal };
    tempData.additional_documents.extra_doc_comments = comments;
    tempData.additional_documents.extra_doc_foto = extraDocFoto;
    tempData.additional_documents.count = extraDocFoto.length;
    setFieldsArrayLocal(tempData);
  }, [comments, extraDocFoto]);

  useEffect(() => {
    setFieldsArray(fieldsArrayLocal);
  }, [fieldsArrayLocal]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Доп. документы'}
        backButton={true}
        goBackFlag={true}
        menuFlag={false}
        nav={navigation}
        route={route}
        screenBack={'DocumentsScreen'}
        hasSideMenu={false}
      >
        {loaderVisible ? (
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={!fieldsArray ? COLORS.none : COLORS.whiteTransparent}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
        ) : (
          <>
            <View style={styles.wrapper}>
              <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
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
                  <FieldImages
                    value={extraDocFoto}
                    setValue={setExtraDocFoto}
                    changeModalFotoCancelFlag={changeModalFotoCancelFlag}
                    setIndexDeleteFoto={setIndexDeleteFoto}
                    changeModalFotoCancelData={changeModalFotoCancelData}
                    dowloadFoto={() => {
                      addPhoto(
                        'gallery',
                        extraDocFoto,
                        setExtraDocFoto,
                        serverWorkFuncImage,
                        setLoaderVisible,
                        { column_name: 'extra_doc_foto' }
                      );
                    }}
                    makeFoto={() => {
                      addPhoto(
                        'camera',
                        extraDocFoto,
                        setExtraDocFoto,
                        serverWorkFuncImage,
                        setLoaderVisible,
                        { column_name: 'extra_doc_foto' }
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.nextButtonWrapper}
              onPress={() => navigation.navigate('DocumentsScreen')}
            >
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

export default ExtraDocScreen;
