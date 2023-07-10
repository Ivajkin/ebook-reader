import { setReportId, setSectionList } from '../redux/App/actions/mainActions';
import { global } from '../requests';
import { constants } from '../сonstants';
import { setLoginToken } from '../redux/App/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalFunctions from './globalFunctions';

function startSection(data, dispatch, navigation) {
  let sectionList = {};
  data.map(item => {
    sectionList[item.section_name] = {
      id: item.id,
      title: item.name,
      screenName: constants.sectionOrderList[item.section_name],
    };
  });
  dispatch(setSectionList(sectionList));

  let stop = false;
  let sectionLocal = Object.keys(constants.sectionOrderList);
  for (let i = 0; i < sectionLocal.length && !stop; i++) {
    if (Object.keys(sectionList).includes(sectionLocal[i])) {
      stop = true;
      navigation.navigate(constants.sectionOrderList[Object.keys(constants.sectionOrderList)[i]]);
    }
  }
}

function createReport(navigation, dispatch, token, reportType, setLoaderVisible = null) {
  global
    .createReportApi(token, reportType)
    .then(async res => {
      if (res) {
        if (res.data) {
          if (res.data.data) {
            console.log('SECTIONS CREATE',res.data.data.sections );
            dispatch(setReportId(res.data.data.report.id));
            startSection(res.data.data.sections, dispatch, navigation);
            if (setLoaderVisible !== null) {
              await globalFunctions.getAllDataFromApi(setLoaderVisible);
            }
          }
        }
      }
    })
    .catch(err => {
      console.log('create report API error (createReport request)', err.response.data);
      try {
        if (err.response.data.message.report_type_id) {
          navigation.navigate('SettingsScreen');
        } else {
          // dispatch(setLoginToken(null));
          //navigation.navigate('LogInScreen');
        }
      } catch (err2) {
        console.log(err);
        // dispatch(setLoginToken(null));
        //navigation.navigate('LogInScreen');
      }
    });
}

const exceptDeletedFiles = async files => {
  const shouldDeleteFiles = JSON.parse(await AsyncStorage.getItem('@shouldDeleteFiles'));

  if (shouldDeleteFiles && shouldDeleteFiles !== null) {
    const newArray = files.filter(item => {
      const shouldDelFile = shouldDeleteFiles.find(k => k[0] === item.id);
      if (!shouldDelFile || shouldDelFile?.length < 1) {
        return item;
      }
    });
    return newArray;
  }
  return files;
};

export default {
  createReport,
  startSection,
  exceptDeletedFiles,
};
