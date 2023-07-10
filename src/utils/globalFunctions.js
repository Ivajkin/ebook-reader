import { Alert } from 'react-native';
import { AllReports, auth, global } from '../requests';
import {
  setOpenScreen,
  setMenuFlag,
  setReportEndModalFlag,
  setUnfilledFields,
  setReportId,
} from '../redux/App/actions/mainActions';
import { setLoginToken } from '../redux/App/actions/authActions';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';
import axios from 'axios';
import { constants } from '../сonstants';
import { Image } from 'react-native';

//const newOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 11];

function navigateToAvailabaleSection(
  navigation,
  dispatch,
  sectionList,
  sectionOrderList,
  currentSection,
  token,
  id,
  setLoaderVisible,
  goToUnfilled = false,
  netInfo = null
) {
  if (goToUnfilled) {
    navigation.navigate('UnfilledFieldsScreen');
    setLoaderVisible(false);
  } else {
    try {
      let screenArr = Object.keys(sectionOrderList);
      let nextIndex = screenArr.indexOf(currentSection) + 1;
      let flag = false;

      Object.keys(sectionList).map(() => {
        let nextScreenByOrder = sectionOrderList[screenArr[nextIndex]];
        if (!nextScreenByOrder) {
          navigation.navigate('UnfilledFieldsScreen');
        }
        if (Object.keys(sectionList).includes(screenArr[nextIndex])) {
          flag = true;
          navigation.navigate(nextScreenByOrder);
        } else {
          nextIndex = nextIndex + 1;
        }
      });

      // if (!flag) {
      //   getUnfilledReportFields(navigation, dispatch, token, id, setLoaderVisible, true, netInfo);
      // }
      setLoaderVisible(false);
    } catch (err) {
      //console.log('navigate error', err);
    }
  }
}

function navigateToSection(sectionList, sectionOrderList, currentSection, course) {
  let screenArr = Object.keys(sectionOrderList);
  let indexSection = 0;
  let check = false;
  let toScetion = '';
  if (course === 'next') {
    indexSection = screenArr.indexOf(currentSection) + 1;
  } else if (course === 'back') {
    indexSection = screenArr.indexOf(currentSection) - 1;
  }

  Object.keys(sectionList).map(() => {
    let nextScreenByOrder = sectionOrderList[screenArr[indexSection]];
    if (Object.keys(sectionList).includes(screenArr[indexSection])) {
      check = true;
      toScetion = nextScreenByOrder;
    } else if (course === 'next') {
      indexSection = indexSection + 1;
    } else if (course === 'back') {
      indexSection = indexSection - 1;
    }
  });

  return { check: check, toScetion: toScetion };
}

function sendSection(setLoaderVisible, sendData, screen, navigation, dispatch) {
  if (sendData) {
    let resultSend = sendData();
    resultSend
      .then(data => {
        setLoaderVisible(false);
        if (data) {
          if (screen === 'AllReportsScreen') {
            dispatch(setReportId(null));
            dispatch(
              setOpenScreen({
                TechnicalCharacteristics: 0,
                EquipmentScreen: 0,

                Equipment_overview: 0,
                Equipment_exterior: 0,
                Equipment_anti_theft_protection: 0,
                Equipment_multimedia: 0,
                Equipment_salon: 0,
                Equipment_comfort: 0,
                Equipment_safety: 0,
                Equipment_other: 0,

                DocumentsScreen: 0,
                MarkingsScreen: 0,
                CompletenessScreen: 0,
                TiresScreen: 0,
                FotoExteriorScreen: 0,
                FotoInteriorScreen: 0,
                CheckingLKPScreen: 0,
                DamageScreen: 0,

                Damage_right_side: 0,
                Damage_front_side: 0,
                Damage_left_side: 0,
                Damage_rear_side: 0,
                Damage_roof_side: 0,
                Damage_window_side: 0,
                Damage_rims_side: 0,
                Damage_interior_side: 0,

                TechCheckScreen: 0,

                TechCheck_engine_off: 0,
                TechCheck_engine_on: 0,
                TechCheck_test_drive: 0,
                TechCheck_elevator: 0,

                LocationScreen: 0,
                SignatureScreen: 0,
              })
            );
            navigation.navigate(screen);
          } else {
            navigation.navigate(screen);
          }
        } else {
          console.log('globalSendDataAndGoNext_res', data);
          Alert.alert('Ошибка', 'Ошибка отправки данных, пожалуйста, попробуйте еще раз', [
            { text: 'Ок' },
          ]);
        }
      })
      .catch(error => {
        setLoaderVisible(false);
        console.log('globalSendDataAndGoNext_err', error?.response, error);
        Alert.alert('Ошибка', 'Ошибка отправки данных, пожалуйста, попробуйте еще раз', [
          { text: 'Ок' },
        ]);
      });
  } else {
  }
}

// function navigateToSection(navigation, dispatch) {
//   let screenArr = Object.keys(sectionOrderList)
//   let indexSection = 0
//   if (course === 'next') indexSection = screenArr.indexOf(currentSection) + 1
//   else if (course === 'back') indexSection = screenArr.indexOf(currentSection) - 1

//   Object.keys(sectionList).map(() => {
//     let nextScreenByOrder = sectionOrderList[screenArr[indexSection]]
//     if (Object.keys(sectionList).includes(screenArr[indexSection])) {
//       navigation.navigate(nextScreenByOrder)
//     }
//     else if (course === 'next') {
//       indexSection = indexSection + 1
//     }
//     else if (course === 'back') {
//       indexSection = indexSection - 1
//     }
//   })
// }

// async function sendFiles(path, name, type, fieldId, reportId, token) {
//   let result = await global.sendFiles(path, name, type, fieldId, reportId, token)
//   return result
// }

// async function delFiles(fieldId, token) {
//   let result = await global.delFiles(fieldId, token)
//   return result
// }

function requestProcess(request, setLoaderVisible, processFunction, errorMessage) {
  request
    .then(result => {
      if (result) {
        if (result.status === 200) {
          processFunction(result);
        } else {
          setLoaderVisible(false);
          Alert.alert('Ошибка', errorMessage, [{ text: 'Ок' }]);
        }
      }
    })
    .catch(err => {
      setLoaderVisible(false);
      console.log('requestProcess_err', err?.response);
      Alert.alert('Ошибка', errorMessage, [{ text: 'Ок' }]);
    });
}

function catchGetFieldsErrorNavMain(setLoaderVisible, navigation) {
  setLoaderVisible(false);
  Alert.alert('Ошибка', 'Ошибка получения данных, пожалуйста, попробуйте еще раз', [
    { text: 'Ок', onPress: () => navigation.navigate('AllReportsScreen') },
  ]);
}

function globalSendDataAndGoNext(
  token,
  id,
  setLoaderVisible,
  sendData,
  screenDispatch,
  navigation,
  dispatch,
  sectionList,
  constants,
  screenNavigate,
  goToUnfilled = false
) {
  //setMenuFlag(false)
  //setLoaderVisible(true);
  let resultSend = sendData();
  setLoaderVisible(false);
  resultSend
    .then(data => {
      setLoaderVisible(false);
      if (data) {
        dispatch(setOpenScreen(screenDispatch, 2));
        if (goToUnfilled) {
          navigation.navigate('UnfilledFieldsScreen');
        } else {
          navigateToAvailabaleSection(
            navigation,
            dispatch,
            sectionList,
            constants.sectionOrderList,
            screenNavigate,
            token,
            id,
            setLoaderVisible
          );
        }
      } else {
        //('globalSendDataAndGoNext_res', data);
        Alert.alert('Ошибка', 'Ошибка отправки данных, пожалуйста, попробуйте еще раз', [
          { text: 'Ок' },
        ]);
      }
    })
    .catch(error => {
      setLoaderVisible(false);
      console.log('globalSendDataAndGoNext_err', error?.response ?? error);
      Alert.alert('Ошибка', 'Ошибка отправки данных, пожалуйста, попробуйте еще раз', [{ text: 'Ок' }]);
    });
}

function globalGetSavedData(
  token,
  reportId,
  sectionId,
  tab,
  funcFormData,
  setLoaderVisible,
  unfilledFlag
) {
  global
    .getSavedReport(token, reportId, sectionId, tab)
    .then(res => {
      console.log('#N1', reportId);
      if (res.data) {
        funcFormData(res.data.data, setLoaderVisible, unfilledFlag);
      }
      setLoaderVisible(false);
    })
    .catch(err => {
      setLoaderVisible(false);
      console.log('error in global get saved', err?.response);
      Alert.alert('Ошибка', 'Ошибка получения данных, пожалуйста, попробуйте еще раз', [{ text: 'Ок' }]);
    });
}

function getReportListData(
  token,
  filterStatus,
  offset,
  navigation,
  setLoaderVisible,
  dispatch,
  userId,
  funcFormData
) {
  AllReports.getReportList(token, filterStatus, offset, userId)
    .then(res => {
      //console.log('RES', Object.keys(res.data.data[0]));
      if (res.data) {
        console.log(
          '#P3',
          res.data.data
        );

        funcFormData(res.data.data);
      }
    })
    .catch(err => {
      //setLoaderVisible(false);
      console.log('getReportListData error', err, err?.response);
      Alert.alert('Ошибка', 'Ошибка получения данных!', [
        {
          text: 'Ок',
          onPress: () => {
            // auth.logout(token).catch();
            // AsyncStorage.removeItem('@token')
            //   .then(() => {
            //     // dispatch(setLoginToken(null));
            //   })
            //   .catch(() => {
            //     // dispatch(setLoginToken(null));
            //   });
          },
        },
      ]);
    });
}

function deleteReport(token, id, reportList, setReportList, setLoaderVisible) {
  setLoaderVisible(true);
  AllReports.deleteReport(token, id)
    .then(() => {
      setReportList(reportList.filter(item => item.id !== id));
      setLoaderVisible(false);
    })
    .catch(err => {
      setLoaderVisible(false);
      console.log('deleteReport', err);
      Alert.alert('Ошибка', 'Ошибка удаления отчета!', [
        {
          text: 'Ок',
        },
      ]);
    });
}

async function getUnfilledReportFields(
  navigation,
  dispatch,
  token,
  id,
  setLoaderVisible,
  showModal = true,
  netInfo = null
) {
  console.log('loading unfilled', netInfo?.isConnected, netInfo !== null);
  let allOk = true;
  if (netInfo?.isConnected !== null && netInfo !== null) {
    setLoaderVisible(true);
    console.log('loading unfilled 2');
    if (!netInfo?.isConnected) {
      console.log('not connected, get unfilled');
      console.log('#Z3');
      setLoaderVisible(false);
      allOk = false;
    } else {
      let sectionsToReturn = [];
      console.log('connected, unfiller');
      let res = await global.getUnfilledSections(token, id).catch(err => {
        console.log('getUnfilledSections err', err);
        console.log('#Z2');
        //setLoaderVisible(false);
        allOk = false;
        //return false;
      });


      console.log('#Z1');
      if (allOk){
        setLoaderVisible(false);
        let unfilledSections = res.data.data.sections;
        console.log('#C1', unfilledSections);
        if (unfilledSections) {
          let newSections = unfilledSections?.filter(
            item =>
              item.status !== 'completed' && item.section_name !== 'location' && item.fields.length > 0
          );
          //console.log('#C2', newSections);
          if (newSections.length === 0) {
            dispatch(setReportEndModalFlag('allOk'));
          }
          if (newSections.length > 0) {
            showModal ? dispatch(setReportEndModalFlag('notAllOk')) : '';
            dispatch(setUnfilledFields(newSections));
          } else {
            dispatch(setReportEndModalFlag('allOk'));
          }
          sectionsToReturn = newSections;
        }
        console.log('#I2', sectionsToReturn);
        //return sectionsToReturn;
        allOk = true;
        //return true
      }

    }
  } else {
    allOk = false;
  }
  return allOk;
}

async function getAllDataFromApi(setLoaderVisible) {
  try {
    //setLoaderVisible(() => true);

    const token = await AsyncStorage.getItem('@token');
    const userInfo = await AsyncStorage.getItem('@userInfo');
    const userInfoObj = JSON.parse(userInfo);
    //console.log('token', token);
    let axiosOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {},
    };

    const urls = [
      // 'reportList',
      // 'carBrands',
      // 'carModels',
      // 'carGeneration',
      'tiresModels',
      'tiresBrands',
      // 'reportFieldsGrouped',
      'cars',
    ];

    // AsyncStorage.setItem('@shouldSendedReportData', JSON.stringify([]));

    const res1 = await axios.get(constants.env.reportList, {
      ...axiosOptions,
      params: { 'filter[user_id]': [userInfoObj.id] },
    });
    //await AsyncStorage.setItem('@reportList', JSON.stringify(res1.data.data));
    const imagesList = [];
    res1?.data?.data.map((item, index) => {
      if (item?.saved_fields?.length) {
        item?.saved_fields.map(field => {
          if (field?.uploaded_files?.length) {
            if (field?.field?.meta_val) {
              imagesList.push(field?.field?.meta_val);
            }
            field?.uploaded_files.map(k => {
              imagesList.push(k.storage_path);
              imagesList.push(k.storage_path480p);
              imagesList.push(k.storage_path720p);
            });
          }
        });
      }
    });

    let preFetchTasks = [];

    imagesList.forEach(p => {
      preFetchTasks.push(Image.prefetch(p));
    });

    Promise.all(preFetchTasks)
      .then(results => {
        let downloadedAll = true;
        results.forEach(result => {
          if (!result) {
            //error occurred downloading a pic
            downloadedAll = false;
          }
        });
      })
      .catch(err => {
        console.log('get all data from API, prefetched tasks err', err);
      });
    // await AsyncStorage.setItem('@imagesList', JSON.stringify(imagesList));

    const res2 = await axios.get(constants.env.reportFieldsGrouped, {
      ...axiosOptions,
      params: {
        report_type_id: 1,
      },
    });
    await AsyncStorage.setItem('@reportFieldsGrouped', JSON.stringify(res2.data.sections));

    urls.forEach(async (item, index) => {
      try {
        const res = await axios.get(constants.env[item], { ...axiosOptions });
        //(`${index}) ${item}`, res);
        await AsyncStorage.setItem(`@${item}`, JSON.stringify(res.data.data));
      } catch (e) {
        //console.log(e.response);
      }
    });
    setLoaderVisible(() => false);
  } catch (e) {
    //console.log(e.response);
    console.log('error in get all data', e?.response);
    // if (e.response.status === 401){
    //   navigation.navigate("MainScreen")
    // }
    setLoaderVisible(() => false);
    Alert.alert('Ошибка', 'Ошибка получения данных, пожалуйста, попробуйте еще раз', [{ text: 'Ок' }]);
  }
}

export default {
  navigateToAvailabaleSection,
  navigateToSection,
  // sendFiles,
  // delFiles,
  requestProcess,
  globalSendDataAndGoNext,
  catchGetFieldsErrorNavMain,
  globalGetSavedData,
  getReportListData,
  deleteReport,
  getUnfilledReportFields,
  sendSection,
  getAllDataFromApi,
};
