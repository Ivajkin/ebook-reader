//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
//#endregion

//#region plagins
import { useDispatch, useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { ModalAddElement } from '../../components/modal';
import { theme, COLORS, constants } from '../../сonstants';
import { setOpenScreen } from '../../redux/App/actions/mainActions';
import { FieldPage } from '../../components/fields';
import { global } from '../../requests';
import { loader } from '../../сonstants';
import { globalFunctions } from '../../utils';
import { ModalError } from '../../components/modal';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const MarkingsScreen = ({ route, navigation }) => {
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.markings;
  const reportTypeId = useSelector(state => state.appGlobal.reportType);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [modalAddElementVisible, changeModalAddElementVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const dispatch = useDispatch();
  const [addElem, setAddElem] = useState(false);
  const [fieldsArray, setFieldsArray] = useState({});

  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const reportID = useSelector(state => state.appGlobal.reportId);

  const [modalErrorMessage, setModalErrorMessage] = useState('Завершите предыдущий шаг!');
  const [modalErrorVisibleFlag, changeModalErrorVisibleFlag] = useState(false);

  const unfilledFields = route.params?.unfilledFields ?? [];
  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const navFromProgress = route.params?.navFromProgress ?? null;
  const renderProgress = route.params?.updateTs ?? null;

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'markings',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'markings',
    'back'
  );

  //#region functions

  function goNext() {
    //let check = checkValidate(fieldsArray);
    globalFunctions.globalSendDataAndGoNext(
      token,
      reportID,
      setLoaderVisible,
      () => sendData(fieldsArray, reportId, token, true),
      'MarkingsScreen',
      navigation,
      dispatch,
      sectionList,
      constants,
      'markings',
      goToUnfilled
    );
    // if (check) {
    //   globalFunctions.globalSendDataAndGoNext(
    //     token,
    //     reportID,
    //     setLoaderVisible,
    //     () => sendData(fieldsArray, reportId, token, true),
    //     'MarkingsScreen',
    //     navigation,
    //     dispatch,
    //     sectionList,
    //     constants,
    //     'markings',
    //     goToUnfilled
    //   );
    // } else {
    //   setModalErrorMessage('Не все обязательные поля заполнены');
    //   changeModalErrorVisibleFlag(true);
    // }
  }

  function checkValidate(fieldsArray, doubleReq = false) {
    let tempFields = { ...fieldsArray };
    let validateArray = [...Array(Object.keys(fieldsArray).length)];
    Object.keys(tempFields).map((item, index) => {
      if (
        doubleReq
          ? tempFields[item].required === 2 || tempFields[item].required === 1
          : tempFields[item].required === 2
      ) {
        if (tempFields[item].count > 0 && tempFields[item].comments) {
          validateArray[index] = true;
          tempFields[item].validate = true;
        } else {
          validateArray[index] = false;
          tempFields[item].validate = false;
        }
      } else if (tempFields[item].count > 0 || tempFields[item].comments) {
        if (tempFields[item].count > 0 && tempFields[item].comments) {
          validateArray[index] = true;
          tempFields[item].validate = true;
        } else {
          validateArray[index] = false;
          tempFields[item].validate = false;
        }
      } else {
        validateArray[index] = true;
        tempFields[item].validate = true;
      }
    });
    setFieldsArray(tempFields);
    let result = validateArray.every(item => item);
    if (result) {
      dispatch(setOpenScreen('MarkingsScreen', 2));
    } else {
      dispatch(setOpenScreen('MarkingsScreen', 1));
    }
    return result;
  }

  async function sendData(fieldsArray, reportId, token, doubleReq = false) {
    //let next = checkValidate(fieldsArray, doubleReq);
    //if (next || doubleReq) {
    if (doubleReq) {
      let localData = {
        report_id: reportId,
        fields: [],
      };
      Object.keys(fieldsArray)
        .filter(item => fieldsArray[item].id !== fieldsArray['marks_add_new']?.id)
        .sort()
        .map((item, i) => {
          if (
            fieldsArray[item].id !== fieldsArray['marks_add_new']?.id &&
            fieldsArray[item].count > 0 &&
            fieldsArray[item].comments
          ) {
            localData.fields.push({
              id: fieldsArray[item].id,
              val: JSON.stringify(formSubData(fieldsArray[item], item)),
            });
          }
        });
      let customPages = Object.keys(fieldsArray)
        .filter(item => fieldsArray[item].id === fieldsArray['marks_add_new']?.id)
        .sort();

      if (customPages.length > 0) {
        localData.fields.push({
          id: fieldsArray['marks_add_new'].id,
          val: JSON.stringify(formCustomSubData(fieldsArray, customPages)),
        });
      }

      let result = await global
        .sendReportData(localData, token)
        .then(data => {
          return true;
        })
        .catch(error => {
          console.log('error save, Markings', error);
          return false;
        });

      return result;
    } else {
      return new Promise(reject => reject(false));
    }
  }

  function formCustomSubData(fieldsArray, data) {
    let subData = [];
    data.map((itemGlobal, indexGlobal) => {
      if (itemGlobal.type !== 'button') {
        let singlePage = {
          id: fieldsArray[itemGlobal].id,
          name: fieldsArray[itemGlobal].name,
          type: 'page',
          column_name: fieldsArray[itemGlobal].columnName,
          val: null,
        };
        let tempVal = [];
        if (fieldsArray[itemGlobal].comments) {
          Object.keys(fieldsArray[itemGlobal]).map((item, index) => {
            if (item === 'matchDoc') {
              tempVal.push({
                val: fieldsArray[itemGlobal][item],
                name: 'Соответствует документам',
                column_name: 'match_doc',
                type: 'checkbox',
                val_text: String(fieldsArray[itemGlobal][item]),
              });
            }
            if (item === 'comments') {
              tempVal.push({
                name: 'Комментарий',
                column_name: 'comments',
                type: 'text',
                val: fieldsArray[itemGlobal][item],
                val_text: String(fieldsArray[itemGlobal][item]),
              });
            }
            if (item === 'photo') {
              tempVal.push({
                name: 'Фото',
                column_name: `${itemGlobal}_photo`,
                type: 'images',
              });
            }
          });
          singlePage = { ...singlePage, val: tempVal };
          subData.push(singlePage);
        }
      }
    });
    return subData;
  }

  function formSubData(data, column_name) {
    let subData = [];
    Object.keys(data).map((item, i) => {
      if (item === 'matchDoc') {
        subData.push({
          name:
            data.columnName === 'marks_elements_dates'
              ? 'Cоответствует дате производства а/м'
              : 'Соответствует документам',
          column_name: 'match_doc',
          type: 'checkbox',
          val: data[item],
          val_text: String(data[item]),
        });
      }
      if (item === 'comments') {
        subData.push({
          name: 'Комментарий',
          column_name: 'comments',
          type: 'text',
          val: data[item],
          val_text: String(data[item]),
        });
      }
      if (item === 'photo') {
        subData.push({
          name: 'Фото',
          column_name: `${column_name}_photo`,
          type: 'images',
        });
      }
    });
    return subData;
  }

  function formatFieldArray(data) {
    let temporaryFields = {};
    data.map((item, index) => {
      temporaryFields[item.column_name] = {
        id: item.id,
        columnName: item.column_name,
        columnNamePhoto: `${item.column_name}_photo`,
        name: item.name,
        type: item.type,
        count: 0,
        photo: [],
        validate: true,
        required: item.required,
        matchDoc: false,
        comments: null,
      };

      if (item.type === 'button') {
        setAddElem(true);
      }
    });
    setFieldsArray(temporaryFields);
  }

  function getFieldsData(flag = false) {
    if (flag) {
      formatFieldArray(unfilledFields);
      setLoaderVisible(false);
    } else {
      global
        .getFields(reportTypeId, section.id, token)
        .then(res => {
          if (res) {
            if (res.data.data.length > 0) {
              formatFieldArray(res.data.data);
            }
            setLoaderVisible(false);
          }
        })
        .catch(err => {
          // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
          setLoaderVisible(false);
          console.log('\n\n\nError GetFields, Markings', err);
        });
    }
  }

  function formSavedFields(data) {
    try {
      let tempFields = {};
      data.map(item => {
        if (item.saved_fields.length > 0) {
          if (item.type === 'button') {
            setAddElem(true);
            if (item.saved_fields.length > 0) {
              tempFields[item.column_name] = {
                id: item.id,
                columnName: item.column_name,
                name: item.name,
                type: item.type,
                count: 0,
                photo: [],
                validate: true,
                required: item.required,
                matchDoc: false,
                comments: null,
              };
              item.saved_fields[0].val &&
                item.saved_fields[0].val.map(itemLocal => {
                  tempFields[itemLocal.column_name] = {
                    id: itemLocal.id,
                    columnName: itemLocal.column_name,
                    name: itemLocal.name,
                    type: itemLocal.type,
                    required: 0,
                    count: itemLocal.val.filter(item => item.type === 'images')[0].uploaded_files.length,
                    photo: itemLocal.val
                      .filter(item => item.type === 'images')[0]
                      .uploaded_files.map(item => {
                        return { id: item.id, photo: item.storage_path };
                      }),
                    validate: true,
                    matchDoc: itemLocal.val.filter(item => item.type === 'checkbox')[0].val,
                    comments: itemLocal.val.filter(item => item.type === 'text')[0].val_text,
                  };
                });
            } else {
              tempFields[item.column_name] = {
                id: item.id,
                columnName: item.column_name,
                name: item.name,
                type: item.type,
                count: 0,
                photo: [],
                validate: true,
                required: item.required,
                matchDoc: false,
                comments: null,
              };
            }
          } else if (item.type === 'page') {
            if (item.saved_fields[0].val) {
              let field = item.saved_fields[0].val;
              tempFields[item.column_name] = {
                id: item.id,
                columnName: item.column_name,
                name: item.name,
                type: item.type,
                validate: true,
                required: item.required,
                count: item.saved_fields[0].uploaded_files.length,
                photo: item.saved_fields[0].uploaded_files.map(item => {
                  return { id: item.id, photo: item.storage_path };
                }),
                matchDoc: field.filter(item => item.type === 'checkbox')[0].val,
                comments: field.filter(item => item.type === 'text')[0].val,
              };
            }
          }
        } else {
          if (item.type === 'button') {
            setAddElem(true);
            tempFields[item.column_name] = {
              id: item.id,
              columnName: item.column_name,
              name: item.name,
              type: item.type,
              validate: true,
              required: item.required,
              count: 0,
              photo: [],
              validate: true,
              matchDoc: false,
              comments: null,
            };
          } else if (item.type === 'page') {
            tempFields[item.column_name] = {
              id: item.id,
              columnName: item.column_name,
              name: item.name,
              type: item.type,
              validate: true,
              required: item.required,
              count: 0,
              photo: [],
              validate: true,
              matchDoc: false,
              comments: null,
            };
          }
        }
      });

      setFieldsArray(tempFields);
      setLoaderVisible(false);
    } catch (err) {
      console.log('formatted error', err);
    }
  }

  //#endregion

  useEffect(() => {
    if (goToUnfilled) {
      setAddElem(false);
      getFieldsData(true);
    } else {
      if (openScreen.MarkingsScreen === 0) {
        getFieldsData();
        dispatch(setOpenScreen('MarkingsScreen', 1));
      } else {
        globalFunctions.globalGetSavedData(
          token,
          reportId,
          section.id,
          null,
          formSavedFields,
          setLoaderVisible
        );
      }
    }
  }, []);

  useEffect(() => {
    if (navFromProgress) {
      globalFunctions.globalGetSavedData(
        token,
        reportId,
        section.id,
        null,
        formSavedFields,
        setLoaderVisible
      );
    }
  }, [navFromProgress, renderProgress]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Маркировочные обозначения'}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={() => checkValidate(fieldsArray, true)}
            formDataFunction={() => sendData(fieldsArray, reportId, token, true)}
            setLoaderVisible={setLoaderVisible}
          />
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={goToUnfilled ? true : backSection.check}
        endReport={goToUnfilled ? true : false}
        //setLoaderVisible, sendData, screen, navigation, dispatch
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () => sendData(fieldsArray, reportId, token, true),
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () => sendData(fieldsArray, reportId, token, true),
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={!fieldsArray ? COLORS.none : COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        {fieldsArray != null ? (
          <>
            <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.scroll}>
                {Object.keys(fieldsArray).length > 0 &&
                  Object.keys(fieldsArray).map((item, i) => {
                    if (fieldsArray[item].type === 'page') {
                      return (
                        <FieldPage
                          key={i}
                          count={fieldsArray[item].count}
                          field={fieldsArray[item]}
                          validateFlag={fieldsArray[item].validate}
                          navigate={() =>
                            navigation.navigate('FotoDocScreen', {
                              id: item,
                              item: item,
                              data: fieldsArray,

                              changeData: setFieldsArray,
                              confirmDoc:
                                fieldsArray[item].columnName === 'marks_elements_dates' ? true : false,
                              deleteFlag: i < 4 ? false : true,
                            })
                          }
                        />
                      );
                    }
                  })}

                {addElem ? (
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
            <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => goNext()}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}
      </HeaderBar>
      <ModalError
        modalFlag={modalErrorVisibleFlag}
        changeModalFlag={changeModalErrorVisibleFlag}
        message={modalErrorMessage}
      />
      <ModalAddElement
        modalVisible={modalAddElementVisible}
        data={fieldsArray}
        setData={setFieldsArray}
        screenName={'MarkingsScreen'}
        setModalVisible={changeModalAddElementVisible}
      />
    </SafeAreaView>
  );
};

export default MarkingsScreen;
