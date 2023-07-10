//#region react components
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
//#endregion

//#region plagins
import DocumentPicker from 'react-native-document-picker';
import { useSelector } from 'react-redux';
//#endregion

//#region components
import { constants, theme } from '../../../сonstants';
import { FieldCheckSwitch, FieldImages, FieldInput, FieldRadio } from '../../../components/fields';
import { global } from '../../../requests';
//#endregion

//#region styles
import { styles } from '../styles';
import { globalFunctions } from '../../../utils';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';

//#endregion

const TestDrive = props => {
  //#region valuebles
  const netInfo = useNetInfo();
  const token = useSelector(state => state.appGlobal.loginToken);
  const reportId = useSelector(state => state.appGlobal.reportId);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.technical_check_of_auto;

  const changeModalFotoCancelFlag = props.system.changeModalFotoCancelFlag;
  const changeModalFotoCancelData = props.system.changeModalFotoCancelData;
  const setIndexDeleteFoto = props.system.setIndexDeleteFoto;
  const setLoaderVisible = props.system.setLoaderVisible;
  const fields = props.fields;
  const fieldsArray = props.fieldsArray;

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

  function fileDownload(fieldId) {
    setLoaderVisible(true);
    DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      copyTo: 'documentDirectory',
    })
      .then(value => {
        let result = global.sendFiles(
          'file://' + value.fileCopyUri,
          value.name,
          value.type,
          fieldId,
          reportId,
          token
        );
        globalFunctions.requestProcess(
          result,
          setLoaderVisible,
          result => {
            fieldsArray.tech_test_drive_electro_file.setValue({
              id: result.data.data.id,
              val: value.name,
            });
            setLoaderVisible(false);
            //fArray([...array, { id: result.data.data.id, photo: value.assets[0].uri }])
          },
          constants.errorMessage.fileAdd
        );
      })
      .catch(err => {
        setLoaderVisible(false);
        console.log('file download err, testDrive', err);
      });
  }

  function fileDelete(setValue, fileID) {
    setLoaderVisible(true);
    let result = global.delFiles(fileID, token);
    globalFunctions.requestProcess(
      result,
      setLoaderVisible,
      result => {
        setLoaderVisible(false);
        setValue(null);
      },
      constants.errorMessage.fileDel
    );
  }

  useEffect(() => {
    tempPhoto.map(item => {
      let mass = fieldsArray.tech_test_drive_photos.value;
      let changeMass = fieldsArray.tech_test_drive_photos.setValue;
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
      {fields.tech_test_drive_bool && (
        <FieldCheckSwitch
          field={fields.tech_test_drive_bool}
          value={fieldsArray.tech_test_drive_bool.value}
          setValue={fieldsArray.tech_test_drive_bool.setValue}
          type={'switch'}
        />
      )}
      {fieldsArray.tech_test_drive_bool.value && (
        <>
          {fields.tech_test_drive_engine && (
            <FieldRadio
              field={fields.tech_test_drive_engine}
              radioData={fieldsArray.tech_test_drive_engine.value}
              setRadioData={fieldsArray.tech_test_drive_engine.setValue}
            />
          )}
          {fields.tech_test_drive_kpp && (
            <FieldRadio
              field={fields.tech_test_drive_kpp}
              radioData={fieldsArray.tech_test_drive_kpp.value}
              setRadioData={fieldsArray.tech_test_drive_kpp.setValue}
            />
          )}
          {fields.tech_test_drive_suspension && (
            <FieldRadio
              field={fields.tech_test_drive_suspension}
              radioData={fieldsArray.tech_test_drive_suspension.value}
              setRadioData={fieldsArray.tech_test_drive_suspension.setValue}
            />
          )}
          {fields.tech_test_drive_comment && (
            <FieldInput
              field={fields.tech_test_drive_comment}
              value={fieldsArray.tech_test_drive_comment.value}
              setValue={fieldsArray.tech_test_drive_comment.setValue}
              multiline={true}
              textAlignVertical={'top'}
              height={80}
            />
          )}
        </>
      )}
      {fields.tech_test_drive_bool_electro && (
        <FieldCheckSwitch
          field={fields.tech_test_drive_bool_electro}
          value={fieldsArray.tech_test_drive_bool_electro.value}
          setValue={fieldsArray.tech_test_drive_bool_electro.setValue}
          type={'switch'}
        />
      )}
      {fieldsArray.tech_test_drive_bool_electro.value && (
        <>
          {fields.tech_test_drive_electro_file && !fieldsArray.tech_test_drive_electro_file.value ? (
            <TouchableOpacity onPress={() => fileDownload(fields.tech_test_drive_electro_file.id)}>
              <Text style={[theme.FONTS.body_SF_M_12, styles.dowloadFile]}>
                {fields.tech_test_drive_electro_file.name}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileExistInner}>
              <Text style={[theme.FONTS.body_SF_R_14, styles.fileExistName]} numberOfLines={1}>
                {fieldsArray.tech_test_drive_electro_file.value?.val}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  fileDelete(
                    fieldsArray.tech_test_drive_electro_file.setValue,
                    fieldsArray.tech_test_drive_electro_file.value.id
                  )
                }
              >
                <Text style={[theme.FONTS.body_SF_R_14, styles.deleteFile]}>Удалить</Text>
              </TouchableOpacity>
            </View>
          )}
          {fields.tech_test_drive_results && (
            <FieldInput
              field={fields.tech_test_drive_results}
              value={fieldsArray.tech_test_drive_results.value}
              setValue={fieldsArray.tech_test_drive_results.setValue}
              multiline={true}
              textAlignVertical={'top'}
              height={80}
            />
          )}
        </>
      )}
      {fields.tech_test_drive_comment_regular && (
        <FieldInput
          field={fields.tech_test_drive_comment_regular}
          value={fieldsArray.tech_test_drive_comment_regular.value}
          setValue={fieldsArray.tech_test_drive_comment_regular.setValue}
          multiline={true}
          textAlignVertical={'top'}
          height={80}
        />
      )}
      {/*{fields.tech_test_drive_photos && (*/}
      {/*  <FieldImages*/}
      {/*    value={fieldsArray.tech_test_drive_photos.value}*/}
      {/*    setValue={fieldsArray.tech_test_drive_photos.setValue}*/}
      {/*    changeModalFotoCancelFlag={changeModalFotoCancelFlag}*/}
      {/*    setIndexDeleteFoto={setIndexDeleteFoto}*/}
      {/*    changeModalFotoCancelData={changeModalFotoCancelData}*/}
      {/*    dowloadFoto={() =>*/}
      {/*      addPhoto(*/}
      {/*        'gallery',*/}
      {/*        fieldsArray.tech_test_drive_photos.value,*/}
      {/*        fieldsArray.tech_test_drive_photos.setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_test_drive_photos.id,*/}
      {/*          column_name: fields.tech_test_drive_photos.column_name,*/}
      {/*        },*/}
      {/*        true*/}
      {/*      )*/}
      {/*    }*/}
      {/*    makeFoto={() =>*/}
      {/*      addPhoto(*/}
      {/*        'camera',*/}
      {/*        fieldsArray.tech_test_drive_photos.value,*/}
      {/*        fieldsArray.tech_test_drive_photos.setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_test_drive_photos.id,*/}
      {/*          column_name: fields.tech_test_drive_photos.column_name,*/}
      {/*        },*/}
      {/*        true*/}
      {/*      )*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
    </View>
  );
};

export default TestDrive;
