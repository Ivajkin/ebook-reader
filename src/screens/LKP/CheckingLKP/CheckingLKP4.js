import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';

import { globalFunctions } from '../../../utils';
import { theme, COLORS, constants, loader } from '../../../сonstants';
import { setOpenScreen } from '../../../redux/App/actions/mainActions';
import { HeaderBar, ProgressMenu } from '../../../components/menu';

import { global } from '../../../requests';
import Panel from './PanelLKP';
import { styles } from './styles';
import validateRequired from '../../../utils/validateRequired';
import { re } from '@babel/core/lib/vendor/import-meta-resolve';

const CheckingLKPScreen = ({
  route,
  navigation,
  sectionList,
  reportTypeId,
  reportID,
  token,
  openScreen,
  setOpenScreenFunc,
}) => {
  const dispatch = useDispatch();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const netInfo = useNetInfo();

  const goToUnfilled = route.params?.goToUnfilled ?? null;

  const [sectionData, setSectionData] = useState([]);
  const [loadedData, setLoadedData] = useState([]);
  const [fieldsDescriptions, setFieldsDescriptions] = useState(null);

  const emptyField = {
    count: 0,
    photo: [],
    width: null,
    checkList: new Array(5).fill(false),
    validateFlag: true,
    comment: '',
  };
  let fieldsArrayTemplate = {
    paint_hood: emptyField,
    paint_roof: emptyField,
    paint_front_left_fender: emptyField,
    paint_front_left_rack: emptyField,
    paint_front_left_door: emptyField,
    paint_rear_left_door: emptyField,
    paint_rear_left_rack: emptyField,
    paint_rear_left_fender: emptyField,
    paint_trunk: emptyField,
    paint_rear_right_fender: emptyField,
    paint_rear_right_rack: emptyField,
    paint_rear_right_door: emptyField,
    paint_front_right_door: emptyField,
    paint_front_right_rack: emptyField,
    paint_front_right_fender: emptyField,
  };
  const [fieldsArray, setFieldsArray] = useState(prev => {
    let newData = {};
    Object.keys(fieldsArrayTemplate).forEach(field_name => {
      newData[field_name] = {
        ...fieldsArrayTemplate[field_name],
        column_name: field_name,
      };
    });
    return newData;
  });

  const emptyExtra = [
    {
      name: 'Чеклист',
      column_name: 'checklist',
      type: 'text',
      val: JSON.stringify(new Array(5).fill(false)),
    },
    {
      name: 'Толщина',
      column_name: 'lkp_thicknesses',
      type: 'text',
      val: 0,
    },
  ];
  const [extraParams, setExtraParams] = useState([]);
  const section = sectionList.checking_paintwork;

  const getWidth = id => {
    let thisExtra = extraParams.find(el => el.id === id);
    if (thisExtra) {
      let widthField = thisExtra.val.find(col => col.column_name === 'lkp_thicknesses');
      if (widthField) {
        return widthField.val;
      }
      return null;
    }
    return null;
  };

  const getValidateFlag = id => {
    let field = Object.keys(fieldsArray()).find(field_name => fieldsArray[field_name].id === id);
    return field?.validateFlag;
  };

  const getCheckList = id => {
    let thisExtra = extraParams.find(el => el.id === id);
    if (thisExtra) {
      let checkListField = thisExtra.val.find(col => col.column_name === 'checklist');
      if (checkListField) {
        return checkListField.val;
      }
      return null;
    }
    return null;
  };

  const getComment = id => {
    let thisExtra = extraParams.find(el => el.id === id);
    if (thisExtra) {
      let commentField = thisExtra.val.find(col => col.column_name === 'comment');
      if (commentField) {
        return commentField.val;
      }
      return null;
    }
    return null;
  };

  const setWidth = (id, newWidth) => {
    let column_name = Object.keys(fieldsDescriptions).find(
      field_name => fieldsDescriptions[field_name].id === id
    );
    setFieldsArray(prev => {
      let newData = {
        ...prev,
        [column_name]: {
          ...prev[column_name],
          width: newWidth,
        },
      };
      return newData;
    });

    let newExtraParams = extraParams;
    let thisExtraIndex = extraParams.findIndex(el => el.id === id);
    if (thisExtraIndex !== -1) {
      let widthFieldIndex = extraParams[thisExtraIndex].val.findIndex(
        col => col.column_name === 'lkp_thicknesses'
      );
      if (widthFieldIndex !== -1) {
        newExtraParams[thisExtraIndex].val[widthFieldIndex].val = newWidth;
      } else {
        newExtraParams[thisExtraIndex].val.push({
          column_name: 'lkp_thicknesses',
          name: 'Толщина, мкм',
          type: 'text',
          uploaded_files: [
            {
              id: id,
              val: [],
            },
          ],
          val: newWidth,
        });
      }
    } else {
      newExtraParams.push({
        id: id,
        val: [
          {
            column_name: 'lkp_thicknesses',
            name: 'Толщина, мкм',
            type: 'text',
            uploaded_files: [
              {
                id: id,
                val: [],
              },
            ],
            val: newWidth,
          },
        ],
      });
    }
    setExtraParams(newExtraParams);
  };
  const setCheckList = (id, newCheckListValue) => {
    let newExtraParams = extraParams;
    let thisExtraIndex = extraParams.findIndex(el => el.id === id);
    if (thisExtraIndex !== -1) {
      let checkListFieldIndex = extraParams[thisExtraIndex].val.findIndex(
        col => col.column_name === 'checklist'
      );
      if (checkListFieldIndex !== -1) {
        newExtraParams[thisExtraIndex].val[checkListFieldIndex].val = newCheckListValue;
      } else {
        newExtraParams[thisExtraIndex].val.push({
          column_name: 'checklist',
          name: 'Чеклист',
          type: 'text',
          uploaded_files: [
            {
              id: id,
              val: [],
            },
          ],
          val: newCheckListValue,
        });
      }
    } else {
      newExtraParams.push({
        id: id,
        val: [
          {
            column_name: 'checklist',
            name: 'Чеклист',
            type: 'text',
            uploaded_files: [
              {
                id: id,
                val: [],
              },
            ],
            val: newCheckListValue,
          },
        ],
      });
    }
    setExtraParams(prevState => {
      return newExtraParams;
    });
    let column_name = Object.keys(fieldsDescriptions).find(
      field_name => fieldsDescriptions[field_name].id === id
    );
    setFieldsArray(prev => {
      let newData = {
        ...prev,
        [column_name]: {
          ...prev[column_name],
          checkList: newCheckListValue.map(el => el.isChecked),
        },
      };
      return newData;
    });
  };

  const setPhotoCount = (id, newCount) => {
    let column_name = Object.keys(fieldsDescriptions).find(
      field_name => fieldsDescriptions[field_name].id === id
    );
    setFieldsArray(prev => {
      let newData = {
        ...prev,
        [column_name]: {
          ...prev[column_name],
          count: newCount,
        },
      };
      return newData;
    });
  };
  const setComment = (id, newComment) => {
    let column_name = Object.keys(fieldsDescriptions).find(field_name => {
      return fieldsDescriptions[field_name].id === id;
    });
    setFieldsArray(prev => {
      console.log(prev[column_name]);
      let newData = {
        ...prev,
        [column_name]: {
          ...prev[column_name],
          comment: newComment,
        },
      };

      return newData;
    });
    let newExtraParams = extraParams;
    let thisExtraIndex = extraParams.findIndex(el => el.id === id);
    if (thisExtraIndex !== -1) {
      let commentFieldIndex = extraParams[thisExtraIndex].val.findIndex(
        col => col.column_name === 'comment'
      );
      if (commentFieldIndex !== -1) {
        newExtraParams[thisExtraIndex].val[commentFieldIndex].val = newComment;
      } else {
        newExtraParams[thisExtraIndex].val.push({
          column_name: 'comment',
          name: 'Комментарий',
          type: 'text',
          uploaded_files: [
            {
              id: id,
              val: [],
            },
          ],
          val: newComment,
        });
      }
    } else {
      newExtraParams.push({
        id: id,
        val: [
          {
            column_name: 'comment',
            name: 'Комментарий',
            type: 'text',
            uploaded_files: [
              {
                id: id,
                val: [],
              },
            ],
            val: newComment,
          },
        ],
      });
    }
    setExtraParams(newExtraParams);
  };
  const formSavedData = savedData => {
    let tempFields = {};
    let newExtraParams = [];
    console.log(savedData);
    let newFieldsArray = fieldsArray;
    let sectionedLoaded = savedData.map(el => {

      if (el.saved_fields?.length > 0) {
        let id = el.saved_fields[0].field.id;
        let saved = JSON.parse(el.saved_fields[0].val);
        let uploaded = el.saved_fields[0]?.uploaded_files;
        if (uploaded.length > 0){
          newFieldsArray[el.column_name].count = uploaded.length;
          newFieldsArray[el.column_name].photo = uploaded;
        }
        //console.log('N1', saved.map(), Object.keys(saved));
        let newExtra = {
          id: id,
          val: [...saved],
        };
        saved.forEach(saved_item => {
          //console.log('#N2', el?.column_name, saved_item?.column_name, saved_item?.val);
          if (saved_item?.column_name === 'lkp_thicknesses' && saved_item?.val !== null) {
            newFieldsArray[el?.column_name].width = saved_item?.val;
          }
          if (saved_item.column_name === 'comment' && saved_item?.val !== null) {
            newFieldsArray[el.column_name].comment = saved_item?.val;
          }
          if (saved_item.column_name === 'checklist' && saved_item?.val !== null) {
            newFieldsArray[el.column_name].checkList = saved_item?.val.map(check => check?.isChecked);
          }
        });
        newExtraParams.push(newExtra);
      }
      return {
        data: [],
        item: el,
      };

    });
    setExtraParams(newExtraParams);
    setLoadedData(sectionedLoaded);
    setFieldsArray(newFieldsArray);
  };

  function next() {
    if (validate()) {
      globalFunctions.globalSendDataAndGoNext(
        token,
        reportID,
        setLoaderVisible,
        () => sendData(extraParams),
        'CheckingLKPScreen',
        navigation,
        dispatch,
        sectionList,
        constants,
        'checking_paintwork',
        goToUnfilled
      );
    }
  }
  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'checking_paintwork',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'checking_paintwork',
    'back'
  );

  const sendData = async () => {
    let localData = {
      report_id: reportID,
      fields: extraParams.map(field => {
        return {
          id: field.id,
          val: JSON.stringify(field.val),
        };
      }),
    };

    return global
      .sendReportData(localData, token)
      .then(resp => resp)
      .catch(err => {
        console.log('error sending LKP data', err.response);
      });

    //return result;
  };
  useEffect(() => {
    if (netInfo.isConnected) {
      global
        .getFields(reportTypeId, section.id, token)
        .then(res => {
          setFieldsDescriptions(prev => {
            let newData = {};
            res.data.data.forEach(field => {
              newData[field.column_name] = field;
            });
            return newData;
          });
          globalFunctions.globalGetSavedData(
            token,
            reportID,
            section.id,
            null,
            formSavedData,
            setLoaderVisible
          );
        })
        .catch(err => {
          console.log('get fields error, checkingLKP', err);
        });
    }
  }, [netInfo.isConnected, route]);

  const validatePart = part => {
    console.log('#M1', part);
    console.log('#M2', extraParams);
    if (part.count > 0 && part.comment.length > 0) {
      let needWidth = !part.checkList[3];
      return !needWidth || !isNaN(parseFloat(part.width));
    } else {
      return false;
    }
  };
  function validate(doubleReq = false) {
    const extras = {};
    const extrasForMenu = {};
    Object.keys(fieldsDescriptions).forEach(field_name => {
      let needChecking =
        fieldsDescriptions[field_name].required === 2 ||
        (fieldsDescriptions[field_name].required === 1 && goToUnfilled);
      let needCheckingForMenu = fieldsDescriptions[field_name].required > 0;
      if (needChecking) {
        extras[field_name] = validatePart;
      }
      if (needCheckingForMenu) {
        extrasForMenu[field_name] = validatePart;
      }
    });

    let validationResults = validateRequired(fieldsArray, fieldsDescriptions, goToUnfilled, extras);
    let newData = {};
    Object.keys(validationResults).forEach(field_name => {
      newData[field_name] = {
        ...fieldsArray[field_name],
        validateFlag: validationResults[field_name],
      };
    });
    setFieldsArray(newData);

    let validationResultsForMenu = validateRequired(
      fieldsArray,
      fieldsDescriptions,
      true,
      extrasForMenu
    );

    let allValid = Object.values(validationResults).every(item => item);
    let allValidForMenu = Object.values(validationResultsForMenu).every(item => item);

    allValidForMenu
      ? dispatch(setOpenScreen('CheckingLKPScreen', 2))
      : dispatch(setOpenScreen('CheckingLKPScreen', 1));
    return allValid;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Проверка ЛКП'}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={
              fieldsArray
                ? () => validate(true)
                : () => {
                    true;
                  }
            }
            formDataFunction={() => sendData(fieldsArray, token)}
            setLoaderVisible={setLoaderVisible}
            currentScreen={'CheckingLKPScreen'}
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
            () => sendData(),
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
            () => sendData(extraParams),
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
      >
        <SectionList
          sections={loadedData}
          keyExtractor={item => {
            return item.title;
          }}
          renderItem={({ item, index }) => {
            return null;
          }}
          renderSectionHeader={props => {
            return (
              <Panel
                item={props.section.item}
                getWidth={getWidth}
                setWidth={setWidth}
                getCheckList={getCheckList}
                setCheckList={setCheckList}
                getComment={getComment}
                setComment={setComment}
                setPhotoCount={setPhotoCount}
                validateFlag={fieldsArray[props.section.item?.column_name]?.validateFlag}
                //getValidateFlag={getValidateFlag}
              />
            );
          }}
          ListFooterComponent={<View style={{ height: 50 }} />}
        />
      </HeaderBar>
      <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
        <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const mapStateToProps = state => {
  return {
    sectionList: state.appGlobal.sectionList,
    reportTypeId: state.appGlobal.reportType,
    reportID: state.appGlobal.reportId,
    token: state.appGlobal.loginToken,
    openScreen: state.appGlobal.openScreen,
  };
};

const mapDispatchToProps = {
  setOpenScreenFunc: setOpenScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckingLKPScreen);
