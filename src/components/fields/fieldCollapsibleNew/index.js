import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBar } from '../../../components/menu';
import { ModalFotoCancel } from '../../../components/modal';
import { FieldImages, FieldInput } from '../../../components/fields';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
import ImageResizer from 'react-native-image-resizer';
import { icons, theme, COLORS, constants, loader } from '../../../сonstants';
import { styles } from './styles';
import { addPhoto } from '../../../utils/photo';

const FieldCollapsible = ({
  field,
  count,
  setParentData,
  fieldsArray,
  index,
  goToUnfilled,
  keyScreenList,
}) => {

  const [data, setData] = useState(fieldsArray);
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(null);
  //#endregion
  const netInfo = useNetInfo();
  //#region flags
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.checking_paintwork;
  const [modalFotoCancelFlag, changeModalFotoCancelFlag] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [validateFlag, setValidateFlag] = useState(true);
  //#endregion
  //#region data
  const [width, setWidth] = useState(data[keyScreenList[index]].width);
  const [foto, setFoto] = useState(data[keyScreenList[index]].photo);

  const [tempPhoto, setPhoto] = useState([]);
  async function serverWorkFuncImage(response, column_name, loadSetter) {
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
        await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([...shouldSendFiles, dataSend]));
      }
      loadSetter(false);
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
        loadSetter,
        result => {
          loadSetter(false);
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
  }

  function validateFields() {
    if (width) {
      if (width > 0 && width.slice(0, 1) !== '0') {
        setValidateFlag(true);
        return true;
      } else {
        setValidateFlag(false);
        return false;
      }
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (data[keyScreenList[index]]) {
      let tempData = { ...data };
      tempData[keyScreenList[index]].width = width;
      tempData[keyScreenList[index]].photo = foto;
      tempData[keyScreenList[index]].count = foto.length;
      setParentData(tempData);
      setData(tempData);
    }
  }, [width, foto]);

  useEffect(() => {
    tempPhoto.map(item => {
      let mass = foto;
      let changeMass = setFoto;
      let temp = mass.filter(itemIn => {
        return itemIn.photo === item.name;
      })[0];

      let index = mass.indexOf(temp);

      if (index !== -1) {
        let forPush = { id: item.id, photo: item.photo };
        changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
      }
    });
  }, [tempPhoto]);
  return (
    <View>
      <Collapse style={styles.container}>
        <CollapseHeader
          style={styles.inputWrapper}
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
            {field.title}
          </Text>
          <View style={styles.inputInner}>
            <View
              style={[
                styles.inputCountWrapper,
                { backgroundColor: count > 0 ? COLORS.red : COLORS.gray },
              ]}
            >
              <Text style={[theme.FONTS.body_R_B_11, styles.inputCount]}>{count}</Text>
            </View>
            <Image source={icons.arrowDown} style={{ width: 13, height: 7 }} />
          </View>
        </CollapseHeader>
        <CollapseBody>
          <FieldImages
            value={foto}
            setValue={setFoto}
            changeModalFotoCancelFlag={changeModalFotoCancelFlag}
            setIndexDeleteFoto={setIndexDeleteFoto}
            dowloadFoto={(value, setValue) =>
              addPhoto('gallery', value, setValue, serverWorkFuncImage, setLoaderVisible)
            }
            makeFoto={(value, setValue) =>
              addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible)
            }
          />
        </CollapseBody>
      </Collapse>
      <ModalFotoCancel
        modalVisible={modalFotoCancelFlag}
        setModalVisible={value => {
          changeModalFotoCancelFlag(value);
        }}
        modalFotoCancelData={{ fotoArray: foto, setFotoArray: setFoto }}
        indexDeleteFoto={indexDeleteFoto}
      />
    </View>
  );
};

export default FieldCollapsible;
