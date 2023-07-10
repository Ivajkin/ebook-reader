//#region react
import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
//#endregion -----------

//#region actions
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region plagins
import AnimatedLoader from 'react-native-animated-loader';
import SignatureCapture from 'react-native-signature-capture';

//#endregion -----------

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { loader, theme, COLORS, constants } from '../../сonstants';
import { global } from '../../requests';
import { globalFunctions } from '../../utils';

//#endregion -----------

//#region styles
import { styles } from './styles';
import { resolvePlugin } from '@babel/core';
//#endregion -----------
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalUnfilledFields } from "../../components/modal";

const SignatureScreen = ({ route, navigation }) => {
  //#region valuevles
  const netInfo = useNetInfo();
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.signature;
  const reportId = useSelector(state => state.appGlobal.reportId);
  const reportTypeId = useSelector(state => state.appGlobal.reportType);
  const token = useSelector(state => state.appGlobal.loginToken);
  const emptySignature =
    'iVBORw0KGgoAAAANSUhEUgAAAeYAAAH0CAYAAADojY5fAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAfuSURBVHic7dUxAQAgDMAwwL/ncSKBHomCft0zMwsASDi/AwCAx5gBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEgxJgBIMSYASDEmAEg5AKCXwfkxV9AlgAAAABJRU5ErkJggg==';
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [signatureStart, setSignatureStart] = useState(false);
  const [signatureFields, setSignatureFields] = useState([]);
  let signatureFieldId = signatureFields[0] ? signatureFields[0].id : null;
  const [shouldShowOld, setShoulShowOld] = useState(false);
  const [signatureFlag, changeSignatureFlag] = useState(true);
  const [signatureDelFlag, changeSignatureDelFlag] = useState(false);

  const signatureRef = useRef();
  const dispatch = useDispatch();

  const openScreen = useSelector(state => state.appGlobal.openScreen);

  const [modalUnfilledVisible, setModalUnfilledVisible] = useState(false)

  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'signature',
    'back'
  );

  //#endregion -----------

  //#region functions
  function clearSignature() {
    // if (signatureFields[0]?.photoId) {
    changeSignatureFlag(true);
    if (!signatureDelFlag && signatureFields[0]?.photoId) {
      global.delFiles(signatureFields[0].photoId, token);
      changeSignatureDelFlag(true);
    }
    setShoulShowOld(false);
    setSignatureStart(false);
    signatureRef.current.resetImage();
    // }
  }

  function pressFinish() {
    if (signatureFlag) {
      signatureRef.current.saveImage();
    }
    setModalUnfilledVisible(true);
    // globalFunctions.getUnfilledReportFields(
    //   navigation,
    //   dispatch,
    //   token,
    //   reportId,
    //   setLoaderVisible,
    //   true,
    //   netInfo
    // );
    //}
    // globalFunctions.navigateToAvailabaleSection(
    //   navigation,
    //   dispatch,
    //   sectionList,
    //   constants.sectionOrderList,
    //   'signature',
    //   token,
    //   reportId,
    //   setLoaderVisible,
    //   false,
    //   netInfo
    // );
  }

  function dragStart() {
    if (!signatureDelFlag && signatureFields[0]?.photoId) {
      global.delFiles(signatureFields[0].photoId, token);
      changeSignatureDelFlag(true);
    }
    changeSignatureFlag(true);
    setSignatureStart(true);
  }

  async function formSavedData(data) {
    setLoaderVisible(false);
    try {
      const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'))?.find(
        item => item[6] === 'sign_image'
      );
      let temporary = [];
      data.map(item => {
        if (item.type === 'images') {
          if (
            (item?.saved_fields?.length && item?.saved_fields[0]?.uploaded_files) ||
            (item?.uploaded_files && item?.uploaded_files?.length)
          ) {
            temporary.push({
              id: item?.id,
              photoId:
                (item?.saved_fields && item?.saved_fields[0]) || item?.uploaded_files[0]
                  ? (item?.saved_fields &&
                      item?.saved_fields[0]?.uploaded_files[
                        item?.saved_fields[0]?.uploaded_files?.length - 1
                      ]?.id) ||
                    (item?.uploaded_files && item?.uploaded_files[item?.uploaded_files?.length - 1]?.id)
                  : null,
              photo:
                (item?.saved_fields && item?.saved_fields[0]) || item?.uploaded_files[0]
                  ? (item?.saved_fields &&
                      item?.saved_fields[0]?.uploaded_files[
                        item?.saved_fields[0]?.uploaded_files?.length - 1
                      ]?.storage_path) ||
                    (item?.uploaded_files &&
                      item?.uploaded_files[item?.uploaded_files?.length - 1]?.storage_path)
                  : null,
            });
          }
          if (!netInfo?.isConnected) {
            if (shouldSendFiles && shouldSendFiles?.length) {
              temporary.push({
                id: item.id,
                photoId: shouldSendFiles[1],
                photo: shouldSendFiles[0],
              });
            }
          }
        }
      });
      if (temporary?.length) {
        signatureFieldId = temporary[0].id;
      }
      if (temporary?.length && temporary[0]?.photo) {
        setSignatureFields(temporary);
      } else {
        getFields();
      }
      setShoulShowOld(true);
    } catch (err) {
      getFields();
      setLoaderVisible(false);
      console.log('format err', err);
    }
  }

  function getFields() {
    global
      .getFields(reportTypeId, section.id, token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = [];
            res.data.data.map((item, index) => {
              temporary.push({
                id: item.id,
                name: item.name,
                type: item.type,
                column_name: item.column_name,
                required: item.required,
                photo: null,
              });
            });
            signatureFieldId = temporary[0].id;
            setSignatureFields(temporary);
          }
          setLoaderVisible(false);
        }
      })
      .catch(err => {
        console.log('get fields error, Signature', err);
        // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
        setLoaderVisible(false);
      });
  }

  async function next(result, id) {
    if (result.encoded) {
      if (result.encoded !== emptySignature) {
        setLoaderVisible(true);
        if (!netInfo?.isConnected) {
          console.log('no connection, signature');
        } else {
          let resultSend = global.sendFiles(
            `file://${result.pathName}`,
            'signature.png',
            'image/png',
            id,
            reportId,
            token
          );
          globalFunctions.requestProcess(
            resultSend,
            setLoaderVisible,
            () => {
              setLoaderVisible(false);
              dispatch(setOpenScreen('SignatureScreen', 2));
              globalFunctions.navigateToAvailabaleSection(
                navigation,
                dispatch,
                sectionList,
                constants.sectionOrderList,
                'signature',
                token,
                reportId,
                setLoaderVisible,
                false,
                netInfo
              );
            },
            constants.errorMessage.photoAdd
          );
        }
      }
    } else {
      console.log('canceled');
    }
  }

  function validate() {
    if (signatureFields.length > 0 && signatureFields[0]?.photo && shouldShowOld) {
      dispatch(setOpenScreen('SignatureScreen', 2));
    } else {
      dispatch(setOpenScreen('SignatureScreen', 1));
    }
  }

  //#endregion -----------

  /**
   * startup useeffect
   */

  const getSavedFieldsDataFromStorage = async (flag = false) => {
    const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped'))?.find(
      item => item?.id === section?.id
    );
    const reportFieldsIds = reportFields?.fields?.map(function (obj) {
      return obj?.id;
    });
    const savedReport = JSON.parse(await AsyncStorage.getItem('@reportList'))
      ?.find(item => item?.id === reportId)
      ?.saved_fields?.filter(item => reportFieldsIds?.includes(item?.field_id))
      ?.map(item => {
        return { ...item, ...item?.field };
      });

    let shouldSendedReportData = [];
    if (
      JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'))?.find(
        item => item?.report_id === reportId
      )?.fields
    ) {
      shouldSendedReportData =
        Object.values(
          JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'))?.find(
            item => item?.report_id === reportId
          )?.fields
        )?.filter(item => item?.section_id === section?.id) || null;
    }

    let shouldSendedCurrentReportData = [...savedReport];
    if (shouldSendedReportData && shouldSendedReportData?.length) {
      shouldSendedCurrentReportData = [...shouldSendedReportData];
    }

    if (reportFields?.fields && reportFields?.fields?.length > 0) {
      let temporary = {};
      reportFields?.fields?.map((item, index) => {
        temporary[item.column_name] = item;
      });
      formSavedData(shouldSendedCurrentReportData, setLoaderVisible, flag, temporary);
    }
  };

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'SignatureScreen') {
      if (!netInfo?.isConnected) {
        if (openScreen.CheckingLKPScreen === 0) {
          dispatch(setOpenScreen('SignatureScreen', 1));
          // getFieldsDataFromStorage();
          getSavedFieldsDataFromStorage();
        } else {
          changeSignatureFlag(false);
          setLoaderVisible(true);
          // getFieldsDataFromStorage();
          getSavedFieldsDataFromStorage();
        }
      } else {
        if (openScreen.SignatureScreen === 0) {
          dispatch(setOpenScreen('SignatureScreen', 1));
          getFields();
        } else {
          changeSignatureFlag(false);
          setLoaderVisible(true);
          // getFields();
          globalFunctions.globalGetSavedData(
            token,
            reportId,
            section.id,
            null,
            formSavedData,
            setLoaderVisible
          );
        }
      }
    }
  }, [netInfo, route]);

  return (
    <SafeAreaView>
      <HeaderBar
        title={'Подпись'}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={validate}
            formDataFunction={() => {
              return new Promise(resolve => {
                validate();
                resolve(true);
              });
            }}
            setLoaderVisible={setLoaderVisible}
            currentScreen={'SignatureScreen'}
          />
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        backButton={backSection.check}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () => {
              return new Promise(resolve => {
                resolve(true);
              });
            },
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
      >
        <KeyboardAvoidingView
          style={{ width: '100%' }}
          keyboardVerticalOffset={0}
          enabled={Platform.OS === 'ios' ? true : false}
          behavior="padding"
        >
          <View style={styles.container}>
            <AnimatedLoader
              visible={loaderVisible}
              overlayColor={!signatureFields ? COLORS.none : COLORS.whiteTransparent}
              source={loader}
              animationStyle={styles.lottie}
              speed={1}
              loop={true}
            />

            <View style={styles.mainWrapper}>
              <View style={styles.signatureWrapper} onTouchStart={() => setShoulShowOld(false)}>
                <>
                  {signatureFields.length > 0 ? (
                    signatureFields[0]?.photo && shouldShowOld ? (
                      <Image
                        source={{ uri: signatureFields[0].photo }}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain',}}
                      />
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  <SignatureCapture
                    style={{ flex: 1 }}
                    showBorder={false}
                    ref={signatureRef}
                    onDragEvent={() => dragStart()}
                    onSaveEvent={result => next(result, signatureFieldId)}
                    saveImageFileInExtStorage={true}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    backgroundColor="#ffffff"
                    strokeColor="#000000"
                    minStrokeWidth={6}
                    maxStrokeWidth={6}
                    viewMode={'portrait'}
                  />
                  {!signatureStart && !shouldShowOld ? (
                    <Text style={[theme.FONTS.body_R_L_13, styles.signatureText]}>
                      Используйте палец, чтобы оставить подпись
                    </Text>
                  ) : (
                    <></>
                  )}
                </>
              </View>
              <TouchableOpacity style={styles.clearWrapper} onPress={clearSignature}>
                <Text style={[theme.FONTS.body_SF_M_13, styles.clearText]}>Очистить</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={pressFinish}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Завершить отчет</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </HeaderBar>
      <ModalUnfilledFields
        //dispatch={dispatch}
        modalFlag={modalUnfilledVisible}
        //refNav={navigationRef}
        fromUnfilled={false}
        changeModalFlag={setModalUnfilledVisible}
      />
    </SafeAreaView>
  );
};

export default SignatureScreen;
