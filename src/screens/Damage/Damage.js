//#region import libres

//#region react components
import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region plagins
//#endregion

//#region actions
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region components
import { HeaderBar, ProgressMenu, Tabs } from '../../components/menu';
import { ModalAddElement, ModalChooseClear, ModalError } from '../../components/modal';
import { tempData, theme, COLORS, loader, constants } from '../../сonstants';
import { global } from '../../requests';
import { FieldPage } from '../../components/fields';
import { globalFunctions } from '../../utils';
//#endregion

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logBoxInspectorHeader from 'react-native/Libraries/LogBox/UI/LogBoxInspectorHeader';
import validateRequired from '../../utils/validateRequired';
import validateFields from '../../utils/validateRequired';
//#endregion

//#endregion

const DamageScreen = ({ route, navigation }) => {
  //#region valuebles
  const netInfo = useNetInfo();
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.damaged_parts;
  const reportTypeId = useSelector(state => state.appGlobal.reportType);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const token = useSelector(state => state.appGlobal.loginToken);
  const dispatch = useDispatch();

  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('Завершите предыдущий шаг!');

  const refScroll = useRef();

  const [loaderVisible, setLoaderVisible] = useState(true);

  //const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const [fieldsDescriptions, setFieldsDescriptions] = useState(null);

  const [validationFlags, setValidationFlags] = useState({});

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'damaged_parts',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'damaged_parts',
    'back'
  );
  //#endregion

  //#region flag
  const [modalAddElementVisible, changeModalAddElementVisible] = useState(false);
  //#endregion

  //#region data
  const [damageFields, setDamageFields] = useState(null);

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const defaultSwitchersValues = {
    scratch: { title: 'Царапина', value: false },
    dent: { title: 'Вмятина', value: false },
    chipping: { title: 'Скол', value: false },
    numerous_chips: { title: 'Многочисленные сколы', value: false },
    crack: { title: 'Трещина', value: false },
    hole: { title: 'Дыра', value: false },
    corrosion: { title: 'Коррозия', value: false },
    attrition: { title: 'Потертость', value: false },
    element_missing: { title: 'Отсутствует элемент', value: false },
    broken: { title: 'Сломано', value: false },
    crashed: { title: 'Разбито', value: false },
    clearance_violation: { title: 'Нарушение зазора', value: false },
  };

  //#endregion

  //#region system
  const [allTabs, setAllTabs] = useState([
    { name: 'right_side', title: 'Правая сторона', newElemFlag: { id: null, flag: false } },
    { name: 'front_side', title: 'Передняя часть', newElemFlag: { id: null, flag: false } },
    { name: 'left_side', title: 'Левая сторона', newElemFlag: { id: null, flag: false } },
    { name: 'rear_side', title: 'Задняя часть', newElemFlag: { id: null, flag: false } },
    { name: 'roof_side', title: 'Крыша', newElemFlag: { id: null, flag: false } },
    { name: 'window_side', title: 'Стекла', newElemFlag: { id: null, flag: false } },
    { name: 'rims_side', title: 'Диски', newElemFlag: { id: null, flag: false } },
    { name: 'interior_side', title: 'Интерьер', newElemFlag: { id: null, flag: false } },
  ]);
  const [currentTab, setCurrentTab] = useState(0);
  const image = {
    right_side: tempData.rightSide,
    front_side: tempData.frontSide,
    left_side: tempData.leftSide,
    rear_side: tempData.backSide,
    roof_side: tempData.roof,
    window_side: tempData.glass,
    rims_side: tempData.disks,
  };
  //#endregion

  //#region functions

  /**
   * function get fields data from server
   */

  function generateFieldsData(data, needSetData = true) {
    let temporaryFields = {};
    data.map((item, index) => {
      if (item.type === 'page') {
        if (typeof temporaryFields[item.tab] === 'object') {
          temporaryFields[item.tab].push({
            id: item.id,
            column_name: item.column_name,
            columnNamePhoto: `${item.column_name}_photo`,
            required: item.required,
            tab: item.tab,
            type: item.type,
            count: 0,
            validate: true,
            name: item.name,
            values: { ...defaultSwitchersValues },
            photo: [],
            comment: '',
          });
        } else {
          temporaryFields[item.tab] = [
            {
              id: item.id,
              column_name: item.column_name,
              columnNamePhoto: `${item.column_name}_photo`,
              required: item.required,
              tab: item.tab,
              type: item.type,
              count: 0,
              validate: true,
              name: item.name,
              values: { ...defaultSwitchersValues },
              photo: [],
              comment: '',
            },
          ];
        }
      } else if (item.type === 'button') {
        let tempTabs = allTabs;
        let index = tempTabs.indexOf(tempTabs.filter(itemIn => itemIn.name === item.tab)[0]);
        if (index !== -1) {
          tempTabs[index].newElemFlag.id = item.id;
          tempTabs[index].newElemFlag.flag = true;
          setAllTabs(tempTabs);
        }
      }
    });

    if (needSetData) {
      setDamageFields(temporaryFields);
    }
    setLoaderVisible(false);

    return temporaryFields;
  }

  function getFieldsData() {
    global
      .getFields(reportTypeId, section.id, token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            setFieldsDescriptions(prev => {
              let newData = {};
              res.data.data.forEach(field => {
                newData[field.column_name] = field;
              });
              return newData;
            });
            // console.log('#S1', res.data.data);
            generateFieldsData(res.data.data);
          }
        }
      })
      .catch(err => {
        setLoaderVisible(false);
        console.log('\n\n\nError GetFields in damage', err);
      });
  }

  /**
   * function for fetch data
   */

  async function formSavedData(data) {
    setLoaderVisible(false);

    let temporaryFields = {};

    console.log('#S1', data);
    try {
      data.map((item, index) => {
        //let type = item.type;
        console.log('#S8', item?.uploaded_files);
        if (item?.val?.length > 0 || item?.saved_fields?.length > 0) {
          let uploaded_files = item?.uploaded_files || item?.saved_fields[0]?.uploaded_files || [];
          let tempData = item?.val || item?.saved_fields[0]?.val || [];
          if (typeof tempData === 'string') {
            tempData = JSON.parse(tempData);
          }

          if (item.type === 'page') {
            if (typeof temporaryFields[item.tab] === 'object') {
              temporaryFields[item.tab].push({
                id: item.id,
                column_name: item.column_name,
                columnNamePhoto: `${item.column_name}_photo`,
                required: item.required,
                tab: item.tab,
                type: item.type,
                validate: true,
                count: tempData.filter(item => {
                  return item.val === true && item.type === 'checkbox';
                }).length,
                name: item.name,
                values: (() => {
                  let tempSubFields = {};
                  tempData.map(item => {
                    if (item.type === 'checkbox') {
                      tempSubFields[item.column_name] = {
                        title: item.name,
                        value: JSON.parse(item.val),
                      };
                    }
                  });
                  if (Object.keys(tempSubFields).length > 0) {
                    return tempSubFields;
                  } else {
                    return { ...defaultSwitchersValues };
                  }
                })(0),
                photo: uploaded_files.map(item => {
                  return { id: item.id, photo: item.storage_path };
                }),
                comment: item?.comment
                  ? item?.comment
                  : tempData.filter(item => {
                      return item.column_name === 'comments' && item.type === 'text';
                    })[0]?.val ?? '',
              });
            } else {
              temporaryFields[item.tab] = [
                {
                  id: item.id,
                  column_name: item.column_name,
                  columnNamePhoto: `${item.column_name}_photo`,
                  required: item.required,
                  tab: item.tab,
                  type: item.type,
                  validate: true,
                  count: tempData.filter(item => {
                    return item.val === true && item.type === 'checkbox';
                  }).length,
                  name: item.name,
                  values: (() => {
                    let tempSubFields = {};
                    tempData.map(item => {
                      if (item.type === 'checkbox') {
                        tempSubFields[item.column_name] = {
                          title: item.name,
                          value: JSON.parse(item.val),
                        };
                      }
                    });
                    if (Object.keys(tempSubFields).length > 0) {
                      return tempSubFields;
                    } else {
                      return { ...defaultSwitchersValues };
                    }
                  })(0),
                  photo: uploaded_files.map(item => {
                    return { id: item.id, photo: item.storage_path };
                  }),
                  comment: item?.comment
                    ? item?.comment
                    : tempData.filter(item => {
                        return item.column_name === 'comments' && item.type === 'text';
                      })[0]?.val ?? '',
                },
              ];
            }
          } else if (item.type === 'button') {
            let tempTabs = allTabs;
            let index = tempTabs.indexOf(tempTabs.filter(itemIn => itemIn.name === item.tab)[0]);
            if (index !== -1) {
              tempTabs[index].newElemFlag.id = item.id;
              tempTabs[index].newElemFlag.flag = true;

              if (item?.val?.length > 0 || item?.saved_fields?.length > 0) {
                tempData.map((itemLocal, index) => {
                  temporaryFields[item.tab].push({
                    id: itemLocal.id,
                    column_name: itemLocal.column_name,
                    columnNamePhoto: itemLocal.column_name,
                    required: 0,
                    tab: tempTabs.filter(item => item.newElemFlag.id === itemLocal.id)[0].title,
                    type: 'page',
                    validate: true,
                    count: itemLocal.val.filter(item => {
                      return item.val === true && item.type === 'checkbox';
                    }).length,
                    name: itemLocal.name,
                    values: (() => {
                      let tempSubFields = {};
                      itemLocal.val.map(item => {
                        if (item.type === 'checkbox') {
                          tempSubFields[item.column_name] = { title: item.name, value: item.val };
                        }
                      });
                      if (Object.keys(tempSubFields).length > 0) {
                        return tempSubFields;
                      } else {
                        return { ...defaultSwitchersValues };
                      }
                    })(0),
                    photo: itemLocal?.uploaded_files?.map(itemIn => {
                      return { id: itemIn.id, photo: itemIn.storage_path };
                    }),
                    comment: item?.comment
                      ? item?.comment
                      : itemLocal.val.filter(item => {
                          return item.column_name === 'comments' && item.type === 'text';
                        })[0]?.val ?? '',
                  });
                });
              }

              // setAllTabs(tempTabs);
            }
          }
        } else {
          if (item.type === 'page') {
            if (typeof temporaryFields[item.tab] === 'object') {
              temporaryFields[item.tab].push({
                id: item.id,
                column_name: item.column_name,
                columnNamePhoto: `${item.column_name}_photo`,
                required: item.required,
                tab: item.tab,
                type: item.type,
                count: 0,
                validate: true,
                name: item.name,
                values: { ...defaultSwitchersValues },
                photo: [],
                comment: item?.comment ? item?.comment : '',
              });
            } else {
              temporaryFields[item.tab] = [
                {
                  id: item.id,
                  column_name: item.column_name,
                  columnNamePhoto: `${item.column_name}_photo`,
                  required: item.required,
                  tab: item.tab,
                  type: item.type,
                  count: 0,
                  validate: true,
                  name: item.name,
                  values: { ...defaultSwitchersValues },
                  photo: [],
                  comment: item?.comment ? item?.comment : '',
                },
              ];
            }
          } else if (item.type === 'button') {
            let tempTabs = allTabs;
            let index = tempTabs.indexOf(tempTabs.filter(itemIn => itemIn.name === item.tab)[0]);
            if (index !== -1) {
              tempTabs[index].newElemFlag.id = item.id;
              tempTabs[index].newElemFlag.flag = true;
              // setAllTabs(tempTabs);
            }
          }
        }
      });

      let newDamageFields = {};
      const reportFields = JSON.parse(await AsyncStorage.getItem('@reportFieldsGrouped')).find(
        item => item.id === section.id
      );
      if (reportFields.fields && reportFields.fields.length > 0) {
        newDamageFields = generateFieldsData(reportFields.fields, false);
      }
      //const shouldDeleteFiles = JSON.parse(await AsyncStorage.getItem('@shouldDeleteFiles'));
      //const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
      if (!damageFields) {
        if (newDamageFields) {
          let newImages = { ...newDamageFields };
          Object.keys(temporaryFields).map(item => {
            temporaryFields[item].map((itemIn, index) => {
              Object.keys(newImages).map(itemInNew => {
                newImages[itemInNew].map((itemInLocal, indexLocal) => {
                  if (itemIn.column_name === itemInLocal.column_name) {
                    let newFiles = [];
                    // if (shouldDeleteFiles && shouldDeleteFiles !== null) {
                    //   newFiles = temporaryFields[item][index].photo.filter(item => {
                    //     const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
                    //     if (!shouldDelFile || shouldDelFile?.length < 1) {
                    //       return item;
                    //     }
                    //   });
                    // }
                    // else {
                    newFiles = temporaryFields[item][index].photo;
                    //}
                    // if (shouldSendFiles && shouldSendFiles !== null) {
                    //   shouldSendFiles.map(k => {
                    //     if (k[4] === reportId && k[7] === section.id && k[6] === itemIn.column_name) {
                    //       newFiles.push({
                    //         id: k[1],
                    //         filename: k[1],
                    //         storage_path: k[0],
                    //         column_name: k[6],
                    //       });
                    //     }
                    //   });
                    // }

                    console.log('#S13', temporaryFields[item]);
                    newImages[itemInNew][indexLocal].comment = temporaryFields[item][index].comment;
                    newImages[itemInNew][indexLocal].count = temporaryFields[item][index].count;
                    newImages[itemInNew][indexLocal].values = temporaryFields[item][index].values;
                    newImages[itemInNew][indexLocal].photo = newFiles;
                  }
                });
              });
            });
          });
          setDamageFields(newImages);
        }
      } else {
        let newImages = { ...damageFields };
        Object.keys(temporaryFields).map(item => {
          temporaryFields[item].map((itemIn, index) => {
            Object.keys(newImages).map(itemInNew => {
              newImages[itemInNew].map((itemInLocal, indexLocal) => {
                if (itemIn.column_name === itemInLocal.column_name) {
                  let newFiles = [];
                  // if (shouldDeleteFiles && shouldDeleteFiles !== null) {
                  //   newFiles = temporaryFields[item][index].photo.filter(item => {
                  //     const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
                  //     if (!shouldDelFile || shouldDelFile?.length < 1) {
                  //       return item;
                  //     }
                  //   });
                  // } else {
                  newFiles = temporaryFields[item][index].photo;
                  //}
                  // if (shouldSendFiles && shouldSendFiles !== null) {
                  //   shouldSendFiles.map(k => {
                  //     if (k[4] === reportId && k[7] === section.id && k[6] === itemIn.column_name) {
                  //       newFiles.push({
                  //         id: k[1],
                  //         filename: k[1],
                  //         storage_path: k[0],
                  //         column_name: k[6],
                  //       });
                  //     }
                  //   });
                  // }

                  //console.log('#S14', temporaryFields[item][index]);
                  newImages[itemInNew][indexLocal].comment = temporaryFields[item][index].comment;
                  newImages[itemInNew][indexLocal].count = temporaryFields[item][index].count;
                  newImages[itemInNew][indexLocal].values = temporaryFields[item][index].values;
                  newImages[itemInNew][indexLocal].photo = newFiles;
                }
              });
            });
          });
        });
        setDamageFields(newImages);
      }
    } catch (err) {
      setLoaderVisible(false);
    }
  }

  /**
   *
   * main function for send data to server
   */

  async function sendData() {
    try {
      //validateAll(damageFields);

      //let next = true;
      if (damageFields) {
        setLoaderVisible(true);
        console.log('SEND DATA');
        let localData = {
          report_id: reportId,

          fields: [],
        };
        let fieldsOfObjects = {};

        Object.keys(damageFields)
          .sort()
          .map((itemGlobal, i) => {
            damageFields[itemGlobal]
              .filter(
                item => allTabs.filter(item => item.name === itemGlobal)[0].newElemFlag.id !== item.id
              )
              .map((item, index) => {
                if (item?.photo === null){
                  console.log('#S10', item);
                }

                if (item?.photo?.length > 0 || item.comment || item.count > 0) {
                  localData.fields.push({
                    id: item.id,
                    val: JSON.stringify(formSubData(item)),
                  });

                  fieldsOfObjects[item.id] = {
                    ...item,
                    section_id: section.id,
                    val: JSON.stringify(formSubData(item)),
                    val_text: JSON.stringify(formSubData(item)),
                    uploaded_files: [],
                    sub_field: {
                      id: formSubData(item),
                      value: JSON.stringify(formSubData(item)),
                    },
                  };
                } else {
                  localData.fields.push({
                    id: item.id,
                    val: null,
                  });

                  fieldsOfObjects[item.id] = {
                    ...item,
                    section_id: section.id,
                    val: null,
                    val_text: null,
                    uploaded_files: [],
                    sub_field: {
                      id: null,
                      value: null,
                    },
                  };
                }
              });
            let customFields = damageFields[itemGlobal].filter(
              item => allTabs.filter(item => item.name === itemGlobal)[0].newElemFlag.id === item.id
            );
            if (customFields.length > 0) {
              localData.fields.push({
                id: customFields[0].id,
                val: JSON.stringify(formCustomSubData(customFields)),
              });

              fieldsOfObjects[customFields[0].id] = {
                ...itemGlobal,
                section_id: section.id,
                val: JSON.stringify(formCustomSubData(customFields)),
                val_text: JSON.stringify(formCustomSubData(customFields)),
                uploaded_files: [],
                sub_field: {
                  id: JSON.stringify(formCustomSubData(customFields)),
                  value: JSON.stringify(formCustomSubData(customFields)),
                },
              };
            }
          });
        if (!netInfo?.isConnected) {
          console.log('no connection, damage');
        } else {
          //console.log('#S11 send data', localData);
          let result = await global.sendReportData(localData, token);
          setLoaderVisible(false);
          return result;
        }
      }
    } catch (e) {
      setLoaderVisible(false);
      console.log(e);
    }
  }

  /**
   * function for from custom pages for send
   */

  function formCustomSubData(data) {
    let subData = [];
    data.map((itemGlobal, indexGlobal) => {
      if (itemGlobal.type !== 'button') {
        let singlePage = {
          id: itemGlobal.id,
          name: itemGlobal.name,
          type: 'page',
          column_name: itemGlobal.column_name,
          val: null,
        };
        let tempVal = [];
        Object.keys(data[indexGlobal]).map((item, index) => {
          if (item === 'values') {
            Object.keys(data[indexGlobal][item]).map(itemElem => {
              tempVal.push({
                name: data[indexGlobal][item][itemElem].title,
                column_name: itemElem,
                type: 'checkbox',
                val: data[indexGlobal][item][itemElem].value,
                val_text: String(data[indexGlobal][item][itemElem].value),
              });
            });
          }
          if (item === 'comment') {
            tempVal.push({
              name: 'Комментарий',
              column_name: 'comments',
              type: 'text',
              val: data[indexGlobal].comment,
              val_text: String(data[indexGlobal].comment),
            });
          }
        });
        singlePage = { ...singlePage, val: tempVal };
        subData.push(singlePage);
      }
    });

    //console.log('#S6', subData);
    return subData;
  }

  /**
   *
   * function for form subdata for send
   */

  function formSubData(data) {
    let subData = [];
    //console.log('#S9', data['comment']);
    Object.keys(data).map((itemGlobal, index) => {
      if (itemGlobal === 'values') {
        Object.keys(data[itemGlobal]).map((item, index) => {
          subData.push({
            name: data[itemGlobal][item].title,
            column_name: item,
            type: 'checkbox',
            val: data[itemGlobal][item].value,
            val_text: String(data[itemGlobal][item]),
          });
        });
      }
      if (itemGlobal === 'comment') {
        subData.push({
          name: 'Комментарий',
          column_name: 'comments',
          type: 'text',
          val: data[itemGlobal],
          val_text: String(data[itemGlobal]),
        });
      }
    });
    subData.push({
      name: 'Повреждения фото',
      column_name: data.columnNamePhoto,
      type: 'images',
      val: null,
    });

    return subData;
  }

  /**
   * function for move between tabs and send data to server
   */

  function next() {
    //console.log('#S2', damageFields);
    setLoaderVisible(true);
    if (validate()) {
      if (currentTab < allTabs.length - 1) {
        setCurrentTab(currentTab + 1);
        // if (validate(damageFields, allTabs, currentTab, setDamageFields)) {
        //   setCurrentTab(currentTab + 1);
        // } else {
        //   changeModalErrorVisibleFlag(true);
        // }
      } else {
        globalFunctions.globalSendDataAndGoNext(
          token,
          reportId,
          setLoaderVisible,
          sendData,
          'DamageScreen',
          navigation,
          dispatch,
          sectionList,
          constants,
          'damaged_parts',
          goToUnfilled
        );
      }
    }
    setLoaderVisible(false)
    // if (currentTab < allTabs.length - 1) {
    //   setCurrentTab(currentTab + 1);
    //   // if (validate(damageFields, allTabs, currentTab, setDamageFields)) {
    //   //   setCurrentTab(currentTab + 1);
    //   // } else {
    //   //   changeModalErrorVisibleFlag(true);
    //   // }
    // } else {
    //   globalFunctions.globalSendDataAndGoNext(
    //     token,
    //     reportId,
    //     setLoaderVisible,
    //     sendData,
    //     'DamageScreen',
    //     navigation,
    //     dispatch,
    //     sectionList,
    //     constants,
    //     'damaged_parts',
    //     goToUnfilled
    //   );

    // if (validate(damageFields, allTabs, currentTab, setDamageFields)) {
    //   globalFunctions.globalSendDataAndGoNext(
    //     token,
    //     reportId,
    //     setLoaderVisible,
    //     sendData,
    //     'DamageScreen',
    //     navigation,
    //     dispatch,
    //     sectionList,
    //     constants,
    //     'damaged_parts',
    //     goToUnfilled
    //   );
    // }
    //}
  }

  /**
   * function for validate steps
   */

  const validatePart = part => {
    console.log('#VP', part?.photo?.length, part?.comment?.length);
    return part?.photo?.length > 0 && part?.comment?.length > 0;
  };

  function validate() {
    //console.log('#S1', fieldsDescriptions); //fieldsDescriptions
    //console.log('#S2', damageFields); //fields

    //console.log('#S3', currentTab);
    setLoaderVisible(true);
    let currentTabName = allTabs[currentTab].name;

    let fieldsTab = {};
    let fieldsDescriptionsTab = {};

    let fieldsForMenu = {};
    let fieldsDescriptionsForMenu = {};

    Object.keys(fieldsDescriptions).forEach(field_name => {
      if (fieldsDescriptions[field_name].tab === currentTabName) {
        fieldsDescriptionsTab[field_name] = fieldsDescriptions[field_name];
      }
      fieldsDescriptionsForMenu[field_name] = fieldsDescriptions[field_name];
    });

    damageFields[currentTabName].forEach(field => {
      fieldsTab[field.column_name] = field;
    });

    Object.keys(damageFields).forEach(section_name =>
      damageFields[section_name].forEach(field => {
        //console.log('#S8', field.column_name);
        fieldsForMenu[field.column_name] = field;
      })
    );

    let extras = {};
    let extrasForMenuSection = {};
    let extrasForMenuAll = {};
    Object.keys(fieldsDescriptionsTab).forEach(field_name => {
      //console.log('#S0', field_name);
      //console.log('#S1', fieldsDescriptionsTab[field_name]?.required);
      let needCheck =
        fieldsDescriptionsTab[field_name]?.required === 2 ||
        (fieldsDescriptionsTab[field_name]?.required > 0 && goToUnfilled);
      let needCheckForMenu = fieldsDescriptionsTab[field_name]?.required > 0;
      if (needCheck) {
        extras[field_name] = validatePart;
      }
      if (needCheckForMenu) {
        extrasForMenuSection[field_name] = validatePart;
      }
    });

    //console.log('#S5', Object.keys(fieldsDescriptionsForMenu));
    Object.keys(fieldsDescriptionsForMenu).forEach(field_name => {
      let needCheckForMenu = fieldsDescriptionsForMenu[field_name]?.required > 0;
      if (needCheckForMenu) {
        extrasForMenuAll[field_name] = validatePart;
      }
    });

    // console.log('#S1', Object.keys(extras)); //fieldsDescriptions
    // console.log('#S2', Object.keys(extrasForMenuSection));
    // console.log('#S3', Object.keys(extrasForMenuAll));
    //console.log('#S2', fieldsTab); //fields

    let validationResults = validateFields(fieldsTab, fieldsDescriptionsTab, goToUnfilled, extras);
    //console.log('#S5', fieldsDescriptionsTab);
    //console.log('#S6', fieldsDescriptionsForMenu);
    setValidationFlags(validationResults);

    let validationResultsForMenuSection = validateFields(
      fieldsTab,
      fieldsDescriptionsTab,
      true,
      extrasForMenuSection
    );

    let validationResultsForMenuAll = validateFields(
      fieldsForMenu,
      fieldsDescriptionsForMenu,
      true,
      extrasForMenuAll
    );

    let allValid = Object.values(validationResults).every(item => item);
    let allValidForMenuSection = Object.values(validationResultsForMenuSection).every(item => item);
    let allValidForMenuAll = Object.values(validationResultsForMenuAll).every(item => item);

    //console.log('#D4', Object.keys(validationResultsForMenuAll).filter(el=>!validationResultsForMenuAll[el] ));
    // if (openScreen.DamageScreen !== 2) {
    //   dispatch(setOpenScreen('DamageScreen', 1));
    // }
    // if (openScreen['Damage_' + allTabs[currentTab].name] !== 2) {
    //   dispatch(setOpenScreen('Damage_' + allTabs[currentTab].name, 1));
    // }

    if (allValidForMenuSection) {
      dispatch(setOpenScreen('Damage_' + allTabs[currentTab].name, 2));
    } else {
      dispatch(setOpenScreen('Damage_' + allTabs[currentTab].name, 1));
    }

    // console.log('#KL', allValidForMenuAll);
    if (allValidForMenuAll) {
      dispatch(setOpenScreen('DamageScreen', 2));
    } else {
      dispatch(setOpenScreen('DamageScreen', 1));
    }

    console.log('#KL', allValid, allValidForMenuSection, allValidForMenuAll);

    return allValid;

    // Object.keys(validationResults).forEach(field_name => {
    //   //console.log('#S8', field_name, damageFields[currentTabName][field_name]);
    //   let damagedTab = damageFields[currentTabName];
    //   let fieldIndex = damagedTab.findIndex(el => el.column_name === field_name);
    //   console.log(fieldIndex);
    //   if (fieldIndex !== -1){
    //     damageFields[currentTabName][fieldIndex].validateFlag = validationResults[field_name];
    //   }
    //
    // });

    //console.log('#S7', damageFields[currentTabName]);
    // let validateArray = fields[allTabs[currentTab].name].map(item => {
    //   if (item.required == 2) {
    //     if (item.photo.length > 0 && item.comment !== '' && item.comment !== null) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     return true;
    //   }
    // });
    // let tempFields = { ...fields };
    // validateArray.map((item, index) => {
    //   tempFields[allTabs[currentTab].name][index].validate = item;
    // });
    // setDamageFields(tempFields);
    // let result = validateArray.every(item => item);
    // return result;
  }

  /**
   * function for validate all fields
   */

  function validateAll(fields) {
    // let validateArray = [];
    // Object.keys(fields).map(itemOut => {
    //   fields[itemOut].map(item => {
    //     if (item.required === 2 || item.required === 1) {
    //       if (item.photo.length > 0 && item.comment !== '' && item.comment !== null) {
    //         validateArray.push({ column_name: item.column_name, validate: true });
    //       } else {
    //         validateArray.push({ column_name: item.column_name, validate: false });
    //       }
    //     } else {
    //       validateArray.push({ column_name: item.column_name, validate: true });
    //     }
    //   });
    // });
    // let result = validateArray.every(item => item.validate);
    //
    // let tempFields = { ...fields };
    // Object.keys(tempFields).map(itemOut => {
    //   tempFields[itemOut].map(item => {
    //     let tempColumnName = validateArray.filter(
    //       itemFilter => itemFilter.column_name === item.column_name
    //     )[0];
    //     if (tempColumnName) {
    //       item.validate = tempColumnName.validate;
    //     }
    //   });
    // });
    //
    // setDamageFields(tempFields);
    //
    // result ? dispatch(setOpenScreen('DamageScreen', 2)) : dispatch(setOpenScreen('DamageScreen', 1));
    // return result;
    return true;
  }

  //#endregion

  useEffect(() => {
    !modalErrorVisibleFlag && setModalErrorMessage('Завершите предыдущий шаг!');
  }, [modalErrorVisibleFlag]);

  useEffect(() => {
    sendData().catch(err => {
      console.log('send data error while switchig tab');
    });
    if (damageFields) {
      refScroll.current.scrollTo({ y: 0 });
    }
  }, [currentTab]);

  // useEffect(() => {
  //   if (navFromProgress || openScreen['Damage_' + allTabs[currentTab].name] !== 0) {
  //     if (!goToUnfilled) {
  //       if (netInfo?.isConnected !== null && route.name === 'DamageScreen') {
  //         if (!netInfo?.isConnected) {
  //           console.log('no connection, damage get saved');
  //         } else {
  //           globalFunctions.globalGetSavedData(
  //             token,
  //             reportId,
  //             section.id,
  //             null,
  //             formSavedData,
  //             setLoaderVisible
  //           );
  //         }
  //       }
  //     }
  //   }
  // }, [navFromProgress, renderProgress, currentTab, netInfo, route]);

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'DamageScreen') {
      if (!netInfo?.isConnected) {
        console.log('no connection, damage');
      }
    } else {
      if (openScreen.DamageScreen === 0) {
        dispatch(setOpenScreen('DamageScreen', 1));
        getFieldsData();
        // globalFunctions.globalGetSavedData(
        //   token,
        //   reportId,
        //   section.id,
        //   null,
        //   formSavedData,
        //   setLoaderVisible
        // );
      } else {
        setLoaderVisible(true);
        getFieldsData();
        globalFunctions.globalGetSavedData(
          token,
          reportId,
          section.id,
          null,
          formSavedData,
          setLoaderVisible
        );
        setLoaderVisible(false);
      }
    }
  }, [netInfo.isConnected, route]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Поврежденные детали'}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={() => validate()}
            formDataFunction={sendData}
            setLoaderVisible={setLoaderVisible}
            currentScreen={'DamageScreen'}
          />
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            sendData,
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={goToUnfilled ? true : backSection.check}
        endReport={goToUnfilled ? true : false}
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            sendData,
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={!damageFields ? COLORS.none : COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        {damageFields != null ? (
          <>
            <View style={styles.container}>
              <Tabs
                showDivider={false}
                active={currentTab}
                titles={
                  damageFields
                    ? allTabs.map(
                        (item, index) =>
                          Object.keys(damageFields).includes(allTabs[index].name) && allTabs[index].title
                      )
                    : []
                }
                //checkFunc={() => validate(damageFields, allTabs, currentTab, setDamageFields)}
                listStep={
                  damageFields
                    ? allTabs.map(
                        (item, index) =>
                          Object.keys(damageFields).includes(allTabs[index].name) &&
                          `Damage_${allTabs[index].name}`
                      )
                    : []
                }
                modalErrorFunc={() => {
                  console.log('modal error func');
                }} //changeModalErrorVisibleFlag}
                links={setCurrentTab}
              />
              <ScrollView contentContainerStyle={styles.scroll} ref={refScroll}>
                {allTabs[currentTab].name !== 'interior_side' && (
                  <View style={styles.imageInner}>
                    <Image style={styles.image} source={image[allTabs[currentTab].name]} />
                  </View>
                )}

                {damageFields[allTabs[currentTab].name].map((item, i) => {
                  return (
                    <FieldPage
                      key={i}
                      count={item.count}
                      field={item}
                      //validateFlag={item.validate}
                      navigate={() =>
                        navigation.navigate('DamageParamsScreen', {
                          data: damageFields,
                          tabName: allTabs[currentTab].name,
                          itemIndex: i,
                          setData: setDamageFields,
                        })
                      }
                      showRequired={false}
                      validateFlag={validationFlags[item.column_name] ?? true}
                    />
                  );
                })}
                {allTabs[currentTab].newElemFlag.flag ? (
                  <TouchableOpacity
                    style={styles.addElementBtnInner}
                    onPress={() => changeModalAddElementVisible(true)}
                  >
                    <Text style={[theme.FONTS.body_SF_M_13, styles.addElementBtn]}>
                      + Добавить новый элемент
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}
      </HeaderBar>
      <ModalAddElement
        allTabs={allTabs}
        modalVisible={modalAddElementVisible}
        data={damageFields}
        screenName={'DamageScreen'}
        tabName={allTabs[currentTab].name}
        setData={setDamageFields}
        setModalVisible={changeModalAddElementVisible}
      />

      <ModalError
        modalFlag={modalErrorVisibleFlag}
        changeModalFlag={changeModalErrorVisibleFlag}
        message={modalErrorMessage}
      />
    </SafeAreaView>
  );
};

export default DamageScreen;
