import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';

import { FieldInput } from '../../fields';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
//#region constants
import { icons, theme, COLORS, constants } from '../../../сonstants';

//#endregion ----------

//#region styles
import { styles } from './styles';
import CheckListItem from './CheckListItem';
//#endregion ----------

const FieldCollapsible = ({
  sectionData,
  setParentData,
  fieldsArray,
  index,
  goToUnfilled,
  keyScreenList,
}) => {
  let count = sectionData.count;
  let title = sectionData.title;
  const [data, setData] = useState({ ...fieldsArray });
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.checking_paintwork;
  const [width, setWidth] = useState(data[keyScreenList[index]].width);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [tempPhoto, setPhoto] = useState([]);
  const [foto, setFoto] = useState(data[keyScreenList[index]].photo);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  const [validateFlag, setValidateFlag] = useState(true);
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  const netInfo = useNetInfo();
  //const {  } = route.params;
  function dowloadFoto(array, fArray) {
    launchImageLibrary(
      {
        includeBase64: false,
      },
      value => {
        if (!value.didCancel) {
          let imgData = 'assets' in value ? value.assets[0] : value;
          if (imgData) {
            //setLoaderVisible(true)
            let resizeWidth = imgData.width;
            let resizeHeight = imgData.height;
            if (
              imgData.width > constants.imgCompress.maxWidth ||
              imgData.height > constants.imgCompress.maxHeight
            ) {
              resizeWidth = constants.imgCompress.maxWidth;
              resizeHeight = constants.imgCompress.maxHeight;
            }
            ImageResizer.createResizedImage(
              imgData.uri,
              resizeWidth,
              resizeHeight,
              constants.imgCompress.compressFormat,
              constants.imgCompress.quality,
              0,
              null
            )
              .then(async response => {
                fArray(arr => [...arr, { id: null, photo: response.name }]);
                if (!netInfo?.isConnected) {
                  const dataSend = [
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    fieldsArray[keyScreenList[index]].column_name,
                    section.id,
                    `${keyScreenList[index]}_photo`,
                  ];
                  const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
                  if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
                    await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
                  } else {
                    await AsyncStorage.setItem(
                      '@shouldSendFiles',
                      JSON.stringify([...shouldSendFiles, dataSend])
                    );
                  }
                  setLoaderVisible(false);
                  setPhoto(arr => [
                    ...arr,
                    {
                      id: response.path,
                      photo: response.uri,
                      name: response.name,
                    },
                  ]);
                } else {
                  let result = global.sendFiles(
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`
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
                }
              })
              .catch(err => {
                setLoaderVisible(false);
                console.log('error  in downloadPhoto, fieldCollapsible', err);
              });
          }
        }
      }
    );
  }

  function makeFoto(array, fArray) {
    launchCamera(
      {
        includeBase64: false,
      },
      value => {
        if (!value.didCancel) {
          let imgData = 'assets' in value ? value.assets[0] : value;
          if (imgData) {
            //setLoaderVisible(true)
            let resizeWidth = imgData.width;
            let resizeHeight = imgData.height;
            if (
              imgData.width > constants.imgCompress.maxWidth ||
              imgData.height > constants.imgCompress.maxHeight
            ) {
              resizeWidth = constants.imgCompress.maxWidth;
              resizeHeight = constants.imgCompress.maxHeight;
            }
            ImageResizer.createResizedImage(
              imgData.uri,
              resizeWidth,
              resizeHeight,
              constants.imgCompress.compressFormat,
              constants.imgCompress.quality,
              0,
              null
            )
              .then(async response => {
                fArray(arr => [...arr, { id: null, photo: response.name }]);
                if (!netInfo?.isConnected) {
                  const dataSend = [
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`,
                    section.id,
                  ];
                  const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
                  if (!shouldSendFiles || shouldSendFiles === null || shouldSendFiles.length < 1) {
                    await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([dataSend]));
                  } else {
                    await AsyncStorage.setItem(
                      '@shouldSendFiles',
                      JSON.stringify([...shouldSendFiles, dataSend])
                    );
                  }
                  setLoaderVisible(false);
                  setPhoto(arr => [
                    ...arr,
                    {
                      id: response.path,
                      photo: response.uri,
                      name: response.name,
                    },
                  ]);
                } else {
                  let result = global.sendFiles(
                    response.uri,
                    response.name,
                    'image/jpeg',
                    fieldsArray[keyScreenList[index]].id,
                    reportId,
                    token,
                    `${keyScreenList[index]}_photo`
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
                }
              })
              .catch(err => {
                setLoaderVisible(false);
                console.log('error  in makePhoto, fieldCollapsible', err);
              });
          }
        }
      }
    );
  }
  return (
    <Collapse style={styles.container}>
      <CollapseHeader
        style={[styles.inputWrapper]}
        //onPress={navigate}
      >
        <Text
          style={[
            theme.FONTS.body_SF_R_15,
            styles.inputText,
            //{ color: count > 0 ? COLORS.black : COLORS.darkGray },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View style={styles.inputInner}>
          <View
            style={[styles.inputCountWrapper, { backgroundColor: count > 0 ? COLORS.red : COLORS.gray }]}
          >
            <Text style={[theme.FONTS.body_R_B_11, styles.inputCount]}>{count}</Text>
          </View>
          <Image source={icons.arrowDown} style={{ width: 13, height: 7 }} />
        </View>
      </CollapseHeader>
      <CollapseBody>
        <CheckListItem item={sectionData.data[0]} />
        <CheckListItem item={sectionData.data[1]} />
        <CheckListItem item={sectionData.data[2]} />
        <CheckListItem item={sectionData.data[3]} />
        <FieldInput
          field={{ name: 'Толщина, мкм', required: 0 }}
          value={width}
          setValue={setWidth}
          fieldType={'number-pad'}
          validateFlag={validateFlag}
          setValidate={setValidateFlag}
        />
        {/* <FieldImages
          value={foto}
          setValue={setFoto}
          changeModalFotoCancelFlag={changeModalFotoCancelFlag}
          setIndexDeleteFoto={setIndexDeleteFoto}
          dowloadFoto={dowloadFoto}
          makeFoto={makeFoto}
        /> */}
      </CollapseBody>
    </Collapse>
  );
};

export default FieldCollapsible;
