//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, SafeAreaView, SectionList } from 'react-native';
//#endregion

//#region plagins
import AnimatedLoader from 'react-native-animated-loader';
import { useDispatch, useSelector } from 'react-redux';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { FieldPage, FieldCheckSwitch, FieldInput } from '../../components/fields';
import { theme, COLORS, loader, constants } from '../../сonstants';
import { global } from '../../requests';
import { globalFunctions, reports } from '../../utils';
//#endregion

//#region redux
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import validateFields from '../../utils/validateRequired';
//#endregion

//#endregion

const DocumentsScreen = ({ route, navigation }) => {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const netInfo = useNetInfo();

  const token = useSelector(state => state.appGlobal.loginToken);
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.documents;
  const reportType = useSelector(state => state.appGlobal.reportType);
  const reportID = useSelector(state => state.appGlobal.reportId);
  const dispatсh = useDispatch();

  const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'documents',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'documents',
    'back'
  );

  const [serviceBookMissing, changeServiceBookMissing] = useState(false);
  const [ownerCount, setOwnerCount] = useState('1');
  const [validateOwnerCountFlag, setValidateOwnerCountFlag] = useState(true);

  const [ownerCountErrors, setOwnerCountErrors] = useState([]);
  const [fields, setFields] = useState(null);

  const [fieldsArray, setFieldsArray] = useState({
    pts: {
      count: 0,
      without_PTS: false,
      pts_duplicate: false,
      electro_pts: false,
      pts_seria: null,
      pts_number: null,
      electro_pts_number: null,
      PTS_images: [],
      electro_pts_foto: [],
      validateFlag: true,
      fieldID: null,
      nav: () =>
        navigation.navigate('PTSScreen', { fieldsArray: fieldsArray, setFieldsArray: setFieldsArray }),
    },
    sts: {
      count: 0,
      sts_without: false,
      sts_seria: null,
      sts_number: null,
      STS_images: [],
      validateFlag: true,
      fieldID: null,
      nav: () =>
        navigation.navigate('STSScreen', { fieldsArray: fieldsArray, setFieldsArray: setFieldsArray }),
    },
    additional_documents: {
      count: 0,
      extra_doc_comments: null,
      extra_doc_foto: [],
      validateFlag: true,
      fieldID: null,
      nav: () =>
        navigation.navigate('ExtraDocScreen', {
          fieldsArray: fieldsArray,
          setFieldsArray: setFieldsArray,
        }),
    },
    owner_count: ownerCount,
    service_book_missing: serviceBookMissing,
  });

  const allFieldsFlagSetters = {
    pts: value =>
      setFieldsArray(prev => {
        return {
          ...prev,
          pts: {
            ...prev.pts,
            validateFlag: value,
          },
        };
      }),
    sts: value =>
      setFieldsArray(prev => {
        return {
          ...prev,
          sts: {
            ...prev.sts,
            validateFlag: value,
          },
        };
      }),
    additional_documents: value =>
      setFieldsArray(prev => {
        return {
          ...prev,
          additional_documents: {
            ...prev.additional_documents,
            validateFlag: value,
          },
        };
      }),
    owner_count: setValidateOwnerCountFlag,
    service_book_missing: () => {},
  };

  async function getData(flag = false) {
    setLoaderVisible(true);
    if (!netInfo?.isConnected) {
      console.log('no connection, get data documents');
      setLoaderVisible(false);
    } else {
      global
        .getFields(reportType, section.id, token)
        .then(res => {
          let tempFields = {};
          let fieldsArrayTemp = { ...fieldsArray };
          res.data.data.map((item, i) => {
            tempFields[item.column_name] = item;
            if (item.type === 'page') {
              fieldsArrayTemp[item.column_name].fieldID = item.id;
            }
          });
          //8 fieldsArrayTemp', tempFields);
          setFieldsArray(fieldsArrayTemp);
          setFields(tempFields);
          setLoaderVisible(false);
        })
        .catch(err => {
          console.log('get fields err in documents', err);
        });
    }
    //}
    setLoaderVisible(false);
  }

  async function saveData() {
    let dataForSave = {
      report_id: reportID,
      fields: [],
    };
    let fieldsOfObjects = {};

    let pts = [];
    if (!fieldsArray.pts.without_PTS) {
      pts.push(
        {
          name: 'Серия',
          column_name: 'pts_seria',
          type: 'text',
          val: fieldsArray.pts.pts_seria,
          val_text: fieldsArray.pts.pts_seria,
        },
        {
          name: 'Номер',
          column_name: 'pts_number',
          type: 'text',
          val: fieldsArray.pts.pts_number,
          val_text: fieldsArray.pts.pts_number,
        },
        {
          name: 'Дубликат',
          column_name: 'pts_duplicate',
          type: 'checkbox',
          val: fieldsArray.pts.pts_duplicate,
          val_text: fieldsArray.pts.pts_duplicate,
        },
        {
          name: 'Фото ПТС',
          column_name: 'PTS_images',
          type: 'images',
          val: null,
        }
      );
    } else {
      pts.push({
        name: 'Отсутствует',
        column_name: 'without_PTS',
        type: 'checkbox',
        val: fieldsArray.pts.without_PTS,
        val_text: fieldsArray.pts.without_PTS,
      });
    }

    if (fieldsArray.pts.electro_pts) {
      pts.push(
        {
          name: 'Эл. ПТС',
          column_name: 'electro_pts',
          type: 'checkbox',
          val: fieldsArray.pts.electro_pts,
          val_text: fieldsArray.pts.electro_pts,
        },
        {
          name: 'Номер',
          column_name: 'electro_pts_number',
          type: 'text',
          val: fieldsArray.pts.electro_pts_number,
          val_text: fieldsArray.pts.electro_pts_number,
        },
        {
          name: 'Фото эл. ПТС',
          column_name: 'electro_pts_foto',
          type: 'images',
          val: null,
        }
      );
    } else {
      pts.push({
        name: 'Эл. ПТС',
        column_name: 'electro_pts',
        type: 'checkbox',
        val: fieldsArray.pts.electro_pts,
        val_text: fieldsArray.pts.electro_pts,
      });
    }

    let sts = [];
    if (!fieldsArray.sts.sts_without) {
      sts.push(
        {
          name: 'Серия',
          column_name: 'sts_seria',
          type: 'text',
          val: fieldsArray.sts.sts_seria,
          val_text: fieldsArray.sts.sts_seria,
        },
        {
          name: 'Номер',
          column_name: 'sts_number',
          type: 'text',
          val: fieldsArray.sts.sts_number,
          val_text: fieldsArray.sts.sts_number,
        },
        {
          name: 'Фото СТС',
          column_name: 'STS_images',
          type: 'images',
          val: null,
        }
      );
    } else {
      sts.push({
        name: 'Отсутствует',
        column_name: 'sts_without',
        type: 'checkbox',
        val: fieldsArray.sts.sts_without,
        val_text: fieldsArray.sts.sts_without,
      });
    }

    let additional_documents = [
      {
        name: 'Комментарий',
        column_name: 'extra_doc_comments',
        type: 'text',
        val: fieldsArray.additional_documents.extra_doc_comments,
        val_text: fieldsArray.additional_documents.extra_doc_comments,
      },
      {
        name: 'Фото доп. документы',
        column_name: 'extra_doc_foto',
        type: 'images',
        val: null,
      },
    ];



    Object.keys(fields).map(item => {
      if (item === 'pts' && pts?.length > 0) {
        dataForSave.fields.push({
          id: fields[item].id,
          val: JSON.stringify(pts),
          val_text: JSON.stringify(pts),
        });

        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: JSON.stringify(pts),
          val_text: JSON.stringify(pts),
          sub_field: {
            id: pts,
            value: pts,
          },
        };
      }
      if (item === 'sts' && sts?.length > 0) {
        dataForSave.fields.push({
          id: fields[item].id,
          val: JSON.stringify(sts),
          val_text: JSON.stringify(sts),
        });

        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: JSON.stringify(sts),
          val_text: JSON.stringify(sts),
          sub_field: {
            id: JSON.stringify(sts),
            value: JSON.stringify(sts),
          },
        };
      }

      if (
        item === 'additional_documents'
      ) {
        dataForSave.fields.push({
          id: fields[item].id,
          val: JSON.stringify(additional_documents),
          val_text: JSON.stringify(additional_documents),
        });

        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: JSON.stringify(additional_documents),
          val_text: JSON.stringify(additional_documents),
          sub_field: {
            id: JSON.stringify(additional_documents),
            value: JSON.stringify(additional_documents),
          },
        };
      }
      if (item === 'service_book_missing') {
        dataForSave.fields.push({
          id: fields[item].id,
          val: serviceBookMissing,
          val_text: serviceBookMissing.toString(),
        });

        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: serviceBookMissing,
          val_text: serviceBookMissing.toString(),
          sub_field: {
            id: serviceBookMissing,
            value: serviceBookMissing.toString(),
          },
        };
      }
      if (item === 'owner_count') {
        dataForSave.fields.push({
          id: fields[item].id,
          val: ownerCount,
          val_text: ownerCount,
        });
        fieldsOfObjects[fields[item].id] = {
          ...fields[item],
          val: ownerCount,
          val_text: ownerCount,
          sub_field: {
            id: ownerCount,
            value: ownerCount,
          },
        };
      }
    });
    if (!netInfo?.isConnected) {
      console.log('no connection');
    } else {
      setLoaderVisible(true);
      console.log('DATA FOR SAVE', dataForSave);
      const result = await global.sendReportData(dataForSave, token);
      setLoaderVisible(false);
      return result;
    }
  }

  async function fetchData() {
    setLoaderVisible(true);
    try {
      if (!netInfo?.isConnected) {
        console.log('no connection, fetch data, documents');
      } else {
        global.getSavedReport(token, reportID, section.id, null, null).then(res => {
          let result = res.data.data;

          console.log('FATFD', result);
          let tempFields = {};
          let tempFieldsArray = { ...fieldsArray };
          //const shouldDeleteFiles = JSON.parse(await AsyncStorage.getItem('@shouldDeleteFiles'));
          //const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
          result.map(item => {
            tempFields[item.column_name] = item;
            switch (item.type) {
              case 'checkbox':
                if (item?.saved_fields?.length > 0) {
                  changeServiceBookMissing(item?.saved_fields[0]?.val);
                }
                if (item?.val) {
                  changeServiceBookMissing(item.val);
                }
                break;
              case 'text':
                if (item?.saved_fields?.length > 0) {
                  setOwnerCount(item?.saved_fields[0]?.val);
                }
                if (item?.val) {
                  setOwnerCount(item.val);
                }
                break;
              case 'page':
                //console.log('#N14', item);
                tempFieldsArray[item.column_name].fieldID = item.id;
                if (item?.uploaded_files || item?.val || item?.saved_fields?.length > 0) {
                  if (item?.saved_fields && item?.saved_fields[0]?.val) {
                    //console.log('#k1', Array.isArray());
                    let saved = JSON.parse(item.saved_fields[0].val);
                    saved.map(item2 => {
                      tempFieldsArray[item.column_name][item2.column_name] = item2.val;
                    });
                  }
                  let val = item?.val;
                  if (typeof val === 'string') {
                    val = JSON.parse(val);
                  }
                  if (val && val.length) {
                    val.map(item2 => {
                      tempFieldsArray[item.column_name][item2.column_name] = item2?.val;
                    });
                  }
                  // if (shouldSendFiles && shouldSendFiles !== null) {
                  //   let newFiles = [];
                  //   shouldSendFiles.map(k => {
                  //     if (
                  //       k[4] === reportID &&
                  //       k[7] === section.id &&
                  //       (k[6].includes('foto') || k[6].includes('STS'))
                  //     ) {
                  //       newFiles.push({
                  //         id: k[1],
                  //         filename: k[1],
                  //         storage_path: k[0],
                  //         column_name: k[6],
                  //       });
                  //     }
                  //   });
                  //   if (newFiles?.length) {
                  //     switch (item.column_name) {
                  //       case 'additional_documents':
                  //         tempFieldsArray.additional_documents.count = newFiles?.filter(k =>
                  //           k.column_name.includes('extra')
                  //         ).length;
                  //         break;
                  //       case 'sts':
                  //         tempFieldsArray.sts.count = newFiles?.filter(
                  //           k => k.column_name.includes('sts') || k.column_name.includes('STS')
                  //         ).length;
                  //         break;
                  //       case 'pts':
                  //         tempFieldsArray.pts.count = newFiles?.filter(k =>
                  //           k.column_name.includes('pts')
                  //         ).length;
                  //         break;
                  //       default:
                  //         break;
                  //     }
                  //     let images = {};
                  //     newFiles.map(item2 => {
                  //       if (images[item2.column_name]) {
                  //         images[item2.column_name].push({ id: item2.id, photo: item2.storage_path });
                  //       } else {
                  //         images[item2.column_name] = [{ id: item2.id, photo: item2.storage_path }];
                  //       }
                  //     });
                  //     Object.keys(images).map(item2 => {
                  //       tempFieldsArray[item.column_name][item2] = images[item2];
                  //     });
                  //   }
                  // }
                  if (item?.saved_fields && item?.saved_fields[0]?.uploaded_files?.length > 0) {
                    let newFiles = [];
                    // if (shouldDeleteFiles) {
                    //   newFiles = item.saved_fields[0].uploaded_files.filter(item => {
                    //     const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
                    //     if (!shouldDelFile || shouldDelFile?.length < 1) {
                    //       return item;
                    //     }
                    //   });
                    // } else {
                    newFiles = item.saved_fields[0].uploaded_files;
                    //}
                    if (newFiles?.length) {
                      tempFieldsArray[item.column_name].count = newFiles?.length;
                      let images = {};
                      newFiles.map(item2 => {
                        if (images[item2.column_name]) {
                          images[item2.column_name].push({ id: item2.id, photo: item2.storage_path });
                        } else {
                          images[item2.column_name] = [{ id: item2.id, photo: item2.storage_path }];
                        }
                      });
                      Object.keys(images).map(item2 => {
                        tempFieldsArray[item.column_name][item2] = images[item2];
                      });
                    }
                  }
                  if (item?.uploaded_files?.length && item?.uploaded_files[0]) {
                    let newFiles = [];
                    // if (shouldDeleteFiles) {
                    //   newFiles = item?.uploaded_files.filter(item => {
                    //     const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
                    //     if (!shouldDelFile || shouldDelFile?.length < 1) {
                    //       return item;
                    //     }
                    //   });
                    //} else {
                    newFiles = item?.uploaded_files;
                    //}
                    if (newFiles?.length) {
                      tempFieldsArray[item.column_name].count = newFiles?.length;
                      let images = {};
                      newFiles.map(item2 => {
                        if (images[item2.column_name]) {
                          images[item2.column_name].push({ id: item2.id, photo: item2.storage_path });
                        } else {
                          images[item2.column_name] = [{ id: item2.id, photo: item2.storage_path }];
                        }
                      });
                      Object.keys(images).map(item2 => {
                        tempFieldsArray[item.column_name][item2] = images[item2];
                      });
                    }
                  }
                }
              default:
                break;
            }
          });
          setFieldsArray(tempFieldsArray);
          setLoaderVisible(false);
        });
      }
    } catch (err) {
      setLoaderVisible(false);
      console.log('documents fetch error:', err);
    }
  }

  const validatePTS = () => {
    let checkPTS = [];
    if (
      !fieldsArray.pts.without_PTS &&
      (fieldsArray.pts.pts_seria === null ||
        fieldsArray.pts.pts_number === null ||
        fieldsArray.pts.PTS_images?.length < 1)
    ) {
      checkPTS.push(false);
    } else {
      checkPTS.push(true);
    }
    if (
      fieldsArray.pts.electro_pts &&
      (fieldsArray.pts.electro_pts_number === null || fieldsArray.pts.electro_pts_foto?.length < 1)
    ) {
      checkPTS.push(false);
    } else {
      checkPTS.push(true);
    }
    return checkPTS.every(item => item);
    //tempData.pts.validateFlag = checkPTS.every(item => item);
    //check.push(checkPTS.every(item => item));
  };

  const validateSTS = () => {
    if (!goToUnfilled) {
      return true;
    }
    let checkSTS = [];
    if (!fieldsArray.sts.sts_without) {
      checkSTS.push(fieldsArray.sts.sts_seria != null);
      checkSTS.push(fieldsArray.sts.sts_number != null);
    } else {
      checkSTS.push(true);
    }
    return checkSTS.every(item => item);
  };
  const validateAdditional = () => {
    if (!goToUnfilled) {
      return true;
    }
    return fieldsArray.additional_documents.extra_doc_comments != null;
  };
  function validate(doubleReq = false) {
    let validationResults = validateFields(fieldsArray, fields, goToUnfilled, {
      pts: validatePTS,
      sts: validateSTS,
      additional_documents: validateAdditional,
    });
    Object.keys(validationResults).forEach(key => {
      allFieldsFlagSetters[key](validationResults[key]);
    });

    let validationResultsForMenu = validateFields(fieldsArray, fields, true, {
      pts: validatePTS,
      sts: validateSTS,
      additional_documents: validateAdditional,
    });

    let allValid = Object.values(validationResults).every(item => item);
    let allValidForMenu = Object.values(validationResultsForMenu).every(item => item);
    if (allValidForMenu) {
      dispatсh(setOpenScreen('DocumentsScreen', 2));
    } else {
      dispatсh(setOpenScreen('DocumentsScreen', 1));
    }
    return allValid;

    // if (ownerCountErrors.length > 0) {
    //   return false;
    // }
    // let tempData = { ...fieldsArray };
    // let check = [];
    //valid pts
    // let req = false;
    // if (doubleReq) {
    //   req = fields.pts?.required === 2 || fields.pts?.required === 1;
    // } else {
    //   req = fields.pts?.required === 2;
    // }
    //
    // if (req) {
    //   let checkPTS = [];
    //   if (
    //     !fieldsArray.pts.without_PTS &&
    //     (fieldsArray.pts.pts_seria === null ||
    //       fieldsArray.pts.pts_number === null ||
    //       fieldsArray.pts.PTS_images?.length < 1)
    //   ) {
    //     checkPTS.push(false);
    //   } else {
    //     checkPTS.push(true);
    //   }
    //   if (
    //     fieldsArray.pts.electro_pts &&
    //     (fieldsArray.pts.electro_pts_number === null || fieldsArray.pts.electro_pts_foto?.length < 1)
    //   ) {
    //     checkPTS.push(false);
    //   } else {
    //     checkPTS.push(true);
    //   }
    //   tempData.pts.validateFlag = checkPTS.every(item => item);
    //   check.push(checkPTS.every(item => item));
    // } else {
    //   tempData.pts.validateFlag = true;
    //   check.push(true);
    // }
    //valid sts
    // if (doubleReq) {
    //   req = fields.sts?.required === 2 || fields.sts?.required === 1;
    // } else {
    //   req = fields.sts?.required === 2;
    // }

    // if (req) {
    //   let checkSTS = [];
    //   if (!fieldsArray.sts.sts_without) {
    //     checkSTS.push(fieldsArray.sts.sts_seria != null);
    //     checkSTS.push(fieldsArray.sts.sts_number != null);
    //   } else {
    //     checkSTS.push(true);
    //   }
    //   tempData.sts.validateFlag = checkSTS.every(item => item);
    //   check.push(checkSTS.every(item => item));
    // } else {
    //   tempData.sts.validateFlag = true;
    //   check.push(true);
    // }

    // if (doubleReq) {
    //   req = fields.additional_documents?.required === 2 || fields.additional_documents?.required === 1;
    // } else {
    //   req = fields.additional_documents?.required === 2;
    // }

    //valid extra_doc
    // if (req) {
    //   let checkExtraDoc = [];
    //   checkExtraDoc.push(fieldsArray.additional_documents.extra_doc_comments != null);
    //   //tempData.additional_documents.validateFlag = checkExtraDoc.every(item => item);
    //   check.push(checkExtraDoc.every(item => item));
    // } else {
    //   tempData.additional_documents.validateFlag = true;
    //   check.push(true);
    // }
    // setFieldsArray(tempData);
    //
    // let res = check.every(item => item);
    // return res;
  }

  function next() {
    console.log('ekd');
    let valid = validate();
    if (valid) {
      globalFunctions.globalSendDataAndGoNext(
        token,
        reportID,
        setLoaderVisible,
        saveData,
        'DocumentsScreen',
        navigation,
        dispatсh,
        sectionList,
        constants,
        'documents',
        goToUnfilled
      );
    }
  }

  useEffect(() => {
    if (/^\d+$/.test(ownerCount)) {
      setOwnerCountErrors([]);
    } else {
      setOwnerCountErrors(['В поле "Количество собственников" могут содержаться только цифры']);
    }
  }, [ownerCount]);
  // const setOwnerCountErrorsWithValidations = (value) => {
  //   let newErrors = [];
  //   if (value) {
  //     if (carGeneration.forSend.length === 0) {
  //       newErrors.push('Для выбора года выпуска необходимо сначала выбрать поколение');
  //     }
  //     setOwnerCountErrors(newErrors);
  //     if (newErrors.length === 0) {
  //       setO(value);
  //     }
  //   } else {
  //     setModalProductionOpen(value);
  //   }
  // }
  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'DocumentsScreen') {
      // if (goToUnfilled) {
      //   getData(true);
      // } else {
      if (openScreen.DocumentsScreen === 0) {
        dispatсh(setOpenScreen('DocumentsScreen', 1));
        // getData();
        // fetchData();
      }
      getData()
        .then(() => {
          fetchData().catch(err => {
            console.log('fetch error in documents', err);
          });
        })
        .catch(err => {
          console.log('get data in documents', err);
        });
    }
    //}
  }, [netInfo, route]);

  useEffect(() => {
    if (navFromProgress) {
      fetchData();
    }
  }, [navFromProgress, renderProgress]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={section.title}
        menu={
          <ProgressMenu
            nav={navigation}
            formDataFunction={saveData}
            setLoaderVisible={setLoaderVisible}
            validateFunc={
              fields
                ? () => validate(true)
                : () => {
                    true;
                  }
            }
            currentScreen={'DocumentsScreen'}
          />
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={goToUnfilled ? true : backSection.check}
        endReport={goToUnfilled ? true : false}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            backSection.toScetion,
            navigation,
            dispatсh
          )
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            saveData,
            nextSection.toScetion,
            navigation,
            dispatсh
          )
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
      >
        {loaderVisible && (
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={!fields ? COLORS.none : COLORS.whiteTransparent}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
        )}
        {!fields ? (
          <></>
        ) : (
          <View style={styles.container}>
            <View style={styles.wrapper}>
              {fields && fieldsArray ? (
                <FlatList
                  data={constants.fields.documents}
                  renderItem={({ item, index }) => {
                    if (fields[item]) {
                      if (fields[item].type === 'page') {
                        //return <Text>PAGE</Text>;
                        return (
                          <FieldPage
                            key={index}
                            count={fieldsArray[item].count || 0}
                            field={fields[item]}
                            navigate={fieldsArray[item].nav}
                            validateFlag={fieldsArray[item].validateFlag}
                            showRequired={false}
                          />
                        );
                      } else if (fields[item].type === 'checkbox') {
                        return (
                          <FieldCheckSwitch
                            key={index}
                            field={fields[item]}
                            value={serviceBookMissing}
                            setValue={changeServiceBookMissing}
                            type={'switch'}
                          />
                        );
                      } else if (fields[item].type === 'text') {
                        return (
                          <>
                            <FieldInput
                              key={index}
                              field={fields[item]}
                              value={ownerCount}
                              setValue={setOwnerCount}
                              fieldType={'numeric'}
                              validateFlag={validateOwnerCountFlag}
                            />
                            {ownerCountErrors.length > 0 ? (
                              <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                                {ownerCountErrors.join('\n')}
                              </Text>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      }

                      return (
                        <View>
                          <Text>{'fields[item]'}</Text>
                        </View>
                      );
                    }
                  }}
                  keyExtractor={(item, index) => {
                    return String(index) + '$';
                  }}
                />
              ) : (
                <></>
                // constants.fields.documents.map((item, i) => {
                //   if (fields[item]) {
                //     if (fields[item].type === 'page') {
                //       return <Text>dke</Text>;
                //       // return (
                //       //   <FieldPage
                //       //     key={i}
                //       //     count={fieldsArray[item].count || 0}
                //       //     field={fields[item]}
                //       //     navigate={fieldsArray[item].nav}
                //       //     validateFlag={fieldsArray[item].validateFlag}
                //       //   />
                //       // );
                //     } else if (fields[item].type === 'checkbox') {
                //       return (
                //         <FieldCheckSwitch
                //           key={i}
                //           field={fields[item]}
                //           value={serviceBookMissing}
                //           setValue={changeRainSensor}
                //           type={'switch'}
                //         />
                //       );
                //     } else if (fields[item].type === 'text') {
                //       return (
                //         <FieldInput
                //           key={i}
                //           field={fields[item]}
                //           value={ownerCount}
                //           setValue={setOwnerCount}
                //           fieldType={'numeric'}
                //         />
                //       );
                //     }
                //   }
                // })
              )}
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </View>
        )}
      </HeaderBar>
    </SafeAreaView>
  );
};

export default DocumentsScreen;
