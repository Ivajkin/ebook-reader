//#region react components
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
//#endregion

//#region plagins
import { useSelector } from 'react-redux';
//#endregion

//#region components
import { FieldCheckSwitch, FieldImages, FieldInput, FieldRadio } from '../../../components/fields';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
import { constants } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from '../styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';
//#endregion

const LiftCheck = props => {
  //#region valuebles
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.technical_check_of_auto;

  const changeModalFotoCancelFlag = props.system.changeModalFotoCancelFlag;
  const changeModalFotoCancelData = props.system.changeModalFotoCancelData;
  const setIndexDeleteFoto = props.system.setIndexDeleteFoto;
  const fields = props.fields;
  const fieldsArray = props.fieldsArray;
  const setLoaderVisible = props.system.setLoaderVisible;

  const [tempPhoto, setPhoto] = useState([]);
  //#endregion

  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    let fieldId = extra_args.fieldId;
    if (!netInfo?.isConnected) {
      const dataSend = [
        response.uri,
        response.name,
        extra_args.imgData.type,
        fieldId,
        reportId,
        token,
        column_name,
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
        extra_args.imgData.type,
        fieldId,
        reportId,
        token
      );
      globalFunctions.requestProcess(
        result,
        setLoaderVisible,
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

  useEffect(() => {
    tempPhoto.map(item => {
      let mass = fieldsArray.tech_elevator_photos.value;
      let changeMass = fieldsArray.tech_elevator_photos.setValue;
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
    <View style={styles.tabContainer}>
      {fields.tech_elevator_checked && (
        <FieldRadio
          field={fields.tech_elevator_checked}
          radioData={fieldsArray.tech_elevator_checked.value}
          setRadioData={fieldsArray.tech_elevator_checked.setValue}
        />
      )}
      {fields.tech_elevator_comment && (
        <FieldInput
          field={fields.tech_elevator_comment}
          value={fieldsArray.tech_elevator_comment.value}
          setValue={fieldsArray.tech_elevator_comment.setValue}
          multiline={true}
          textAlignVertical={'top'}
          height={80}
        />
      )}
      {/*{fields.tech_elevator_photos && (*/}
      {/*  <FieldImages*/}
      {/*    value={fieldsArray.tech_elevator_photos.value}*/}
      {/*    setValue={fieldsArray.tech_elevator_photos.setValue}*/}
      {/*    changeModalFotoCancelFlag={changeModalFotoCancelFlag}*/}
      {/*    setIndexDeleteFoto={setIndexDeleteFoto}*/}
      {/*    changeModalFotoCancelData={changeModalFotoCancelData}*/}
      {/*    dowloadFoto={() =>*/}
      {/*      addPhoto(*/}
      {/*        'gallery',*/}
      {/*        fieldsArray.tech_elevator_photos.value,*/}
      {/*        fieldsArray.tech_elevator_photos.setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_elevator_photos.id,*/}
      {/*          column_name: fields.tech_elevator_photos.column_name,*/}
      {/*        },*/}
      {/*        true*/}
      {/*      )*/}
      {/*    }*/}
      {/*    makeFoto={() =>*/}
      {/*      addPhoto(*/}
      {/*        'camera',*/}
      {/*        fieldsArray.tech_elevator_photos.value,*/}
      {/*        fieldsArray.tech_elevator_photos.setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_elevator_photos.id,*/}
      {/*          column_name: fields.tech_elevator_photos.column_name,*/}
      {/*        },*/}
      {/*        true*/}
      {/*      )*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
    </View>
  );
};

export default LiftCheck;
