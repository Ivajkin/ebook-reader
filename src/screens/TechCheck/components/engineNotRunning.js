//#region react components
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//#endregion

//#region plagins
import { useSelector } from 'react-redux';
//#endregion

//#region components
import { FieldCheckSwitch, FieldImages, FieldRadio } from '../../../components/fields';
import { global } from '../../../requests';
import { globalFunctions } from '../../../utils';
import { constants } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from '../styles';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPhoto } from '../../../utils/photo';
import AdditionalPhotos from '../../../components/fields/AdditionalPhotos/AdditionalPhotos';
//#endregion

const EngineNotRunnig = props => {
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
  const groupTitles = props.groupTitles;

  const [tempPhoto, setPhoto] = useState([]);

  //console.log('#I2', fields["tech_oil_engine_level"]);
  //#endregion

  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    let column_name = extra_args.column_name;
    let fieldId = extra_args.fieldId;
    if (!netInfo?.isConnected) {
      console.log('no connection, engine not running');
    } else {
      global
        .sendFiles(response.uri, response.name, extra_args.imgData.type, fieldId, reportId, token)
        .then(result => {
          //console.log('#K1', result.data.data.id, result.data.data.storage_path);
          setPhoto(arr => {
            let newAr = [
              ...arr,
              {
                id: result.data.data.id,
                photo: result.data.data.storage_path,
                name: result.data.data.filename,
              },
            ];
            fieldsArray.tech_other_images.setValue(newAr);
            return newAr;
          });
        })
        .catch(err => {
          console.log('send files error in engine not running', err);
        });
    }
  }

  useEffect(() => {
    console.log('use effect', tempPhoto);
    // tempPhoto.map(item => {
    //   let mass = fieldsArray.tech_other_images.value;
    //   let changeMass = fieldsArray.tech_other_images.setValue;
    //   let temp = mass.filter(itemIn => {
    //     console.log('#T4', itemIn, item);
    //     return itemIn.photo === item.name;
    //   })[0];
    //   console.log('#T2', temp);
    //
    //   let index = mass.indexOf(temp);
    //   console.log('#T3', index);
    //
    //   if (index !== -1) {
    //     let forPush = { id: item.id, photo: item.photo };
    //     console.log('#T1', [...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //     changeMass([...mass.slice(0, index), forPush, ...mass.slice(index + 1, mass.length)]);
    //   }
    // });
  }, [tempPhoto]);

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.warning}>Последовательно выполните проверку при НЕзаведенном автомобиле</Text>
      {groupTitles.includes('Технические жидкости') && (
        <Text style={styles.title}>Технические жидкости</Text>
      )}

      {fields.tech_oil_engine_level && (
        <FieldRadio
          field={fields.tech_oil_engine_level}
          radioData={fieldsArray.tech_oil_engine_level.value}
          setRadioData={fieldsArray.tech_oil_engine_level.setValue}
          commentFlag={fieldsArray.tech_oil_engine_level.commentFlag}
          changeCommentFlag={fieldsArray.tech_oil_engine_level.changeCommentFlag}
          commentValue={fieldsArray.tech_oil_engine_level.comment}
          setCommentValue={fieldsArray.tech_oil_engine_level.setComment}
        />
      )}
      {fields.tech_oil_kpp_level && (
        <FieldRadio
          field={fields.tech_oil_kpp_level}
          radioData={fieldsArray.tech_oil_kpp_level.value}
          setRadioData={fieldsArray.tech_oil_kpp_level.setValue}
          commentFlag={fieldsArray.tech_oil_kpp_level.commentFlag}
          changeCommentFlag={fieldsArray.tech_oil_kpp_level.changeCommentFlag}
          commentValue={fieldsArray.tech_oil_kpp_level.comment}
          setCommentValue={fieldsArray.tech_oil_kpp_level.setComment}
        />
      )}
      {fields.tech_amplifier && (
        <FieldCheckSwitch
          field={fields.tech_amplifier}
          value={fieldsArray.tech_amplifier.value}
          setValue={fieldsArray.tech_amplifier.setValue}
          type={'switch'}
        />
      )}
      {!fieldsArray.tech_amplifier.value && fields.tech_liquid_gur_level && (
        <FieldRadio
          field={fields.tech_liquid_gur_level}
          radioData={fieldsArray.tech_liquid_gur_level.value}
          setRadioData={fieldsArray.tech_liquid_gur_level.setValue}
          commentFlag={fieldsArray.tech_liquid_gur_level.commentFlag}
          changeCommentFlag={fieldsArray.tech_liquid_gur_level.changeCommentFlag}
          commentValue={fieldsArray.tech_liquid_gur_level.comment}
          setCommentValue={fieldsArray.tech_liquid_gur_level.setComment}
        />
      )}
      {fields.tech_liquid_brake_level && (
        <FieldRadio
          field={fields.tech_liquid_brake_level}
          radioData={fieldsArray.tech_liquid_brake_level.value}
          setRadioData={fieldsArray.tech_liquid_brake_level.setValue}
          commentFlag={fieldsArray.tech_liquid_brake_level.commentFlag}
          changeCommentFlag={fieldsArray.tech_liquid_brake_level.changeCommentFlag}
          commentValue={fieldsArray.tech_liquid_brake_level.comment}
          setCommentValue={fieldsArray.tech_liquid_brake_level.setComment}
        />
      )}
      {fields.tech_liquid_cooling_level && (
        <FieldRadio
          field={fields.tech_liquid_cooling_level}
          radioData={fieldsArray.tech_liquid_cooling_level.value}
          setRadioData={fieldsArray.tech_liquid_cooling_level.setValue}
          commentFlag={fieldsArray.tech_liquid_cooling_level.commentFlag}
          changeCommentFlag={fieldsArray.tech_liquid_cooling_level.changeCommentFlag}
          commentValue={fieldsArray.tech_liquid_cooling_level.comment}
          setCommentValue={fieldsArray.tech_liquid_cooling_level.setComment}
        />
      )}
      {groupTitles.includes('Износ приводных ремней') && (
        <Text style={styles.title}>Износ приводных ремней</Text>
      )}
      {fields.tech_belt_replacement && (
        <FieldRadio
          field={fields.tech_belt_replacement}
          radioData={fieldsArray.tech_belt_replacement.value}
          setRadioData={fieldsArray.tech_belt_replacement.setValue}
          commentFlag={fieldsArray.tech_belt_replacement.commentFlag}
          changeCommentFlag={fieldsArray.tech_belt_replacement.changeCommentFlag}
          commentValue={fieldsArray.tech_belt_replacement.comment}
          setCommentValue={fieldsArray.tech_belt_replacement.setComment}
        />
      )}
      {groupTitles.includes('Течи и запотевания') && (
        <Text style={styles.title}>Течи и запотевания</Text>
      )}
      {fields.tech_leaks_engine && (
        <FieldRadio
          field={fields.tech_leaks_engine}
          radioData={fieldsArray.tech_leaks_engine.value}
          setRadioData={fieldsArray.tech_leaks_engine.setValue}
          commentFlag={fieldsArray.tech_leaks_engine.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_engine.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_engine.comment}
          setCommentValue={fieldsArray.tech_leaks_engine.setComment}
        />
      )}
      {fields.tech_leaks_kpp && (
        <FieldRadio
          field={fields.tech_leaks_kpp}
          radioData={fieldsArray.tech_leaks_kpp.value}
          setRadioData={fieldsArray.tech_leaks_kpp.setValue}
          commentFlag={fieldsArray.tech_leaks_kpp.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_kpp.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_kpp.comment}
          setCommentValue={fieldsArray.tech_leaks_kpp.setComment}
        />
      )}
      {fields.tech_leaks_gur && (
        <FieldRadio
          field={fields.tech_leaks_gur}
          radioData={fieldsArray.tech_leaks_gur.value}
          setRadioData={fieldsArray.tech_leaks_gur.setValue}
          commentFlag={fieldsArray.tech_leaks_gur.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_gur.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_gur.comment}
          setCommentValue={fieldsArray.tech_leaks_gur.setComment}
        />
      )}
      {fields.tech_leaks_transfer && (
        <FieldRadio
          field={fields.tech_leaks_transfer}
          radioData={fieldsArray.tech_leaks_transfer.value}
          setRadioData={fieldsArray.tech_leaks_transfer.setValue}
          commentFlag={fieldsArray.tech_leaks_transfer.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_transfer.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_transfer.comment}
          setCommentValue={fieldsArray.tech_leaks_transfer.setComment}
        />
      )}
      {fields.tech_leaks_amorts && (
        <FieldRadio
          field={fields.tech_leaks_amorts}
          radioData={fieldsArray.tech_leaks_amorts.value}
          setRadioData={fieldsArray.tech_leaks_amorts.setValue}
          commentFlag={fieldsArray.tech_leaks_amorts.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_amorts.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_amorts.comment}
          setCommentValue={fieldsArray.tech_leaks_amorts.setComment}
        />
      )}
      {fields.tech_leaks_front_bridge && (
        <FieldRadio
          field={fields.tech_leaks_front_bridge}
          radioData={fieldsArray.tech_leaks_front_bridge.value}
          setRadioData={fieldsArray.tech_leaks_front_bridge.setValue}
          commentFlag={fieldsArray.tech_leaks_front_bridge.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_front_bridge.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_front_bridge.comment}
          setCommentValue={fieldsArray.tech_leaks_front_bridge.setComment}
        />
      )}
      {fields.tech_leaks_rear_bridge && (
        <FieldRadio
          field={fields.tech_leaks_rear_bridge}
          radioData={fieldsArray.tech_leaks_rear_bridge.value}
          setRadioData={fieldsArray.tech_leaks_rear_bridge.setValue}
          commentFlag={fieldsArray.tech_leaks_rear_bridge.commentFlag}
          changeCommentFlag={fieldsArray.tech_leaks_rear_bridge.changeCommentFlag}
          commentValue={fieldsArray.tech_leaks_rear_bridge.comment}
          setCommentValue={fieldsArray.tech_leaks_rear_bridge.setComment}
        />
      )}
      {/*{fields.tech_other_images && (*/}
      {/*  <AdditionalPhotos*/}
      {/*    //column_name={'exterior_add_photos'}*/}
      {/*    //key={index}*/}
      {/*    value={fields.tech_other_images.value}*/}
      {/*    setValue={fields.tech_other_images.setValue}*/}
      {/*    //changeModalFotoCancelFlag={changeModalFotoCancelFlag}*/}
      {/*    //setIndexDeleteFoto={setIndexDeleteFoto}*/}
      {/*    //changeModalFotoCancelData={changeModalFotoCancelData}*/}
      {/*    dowloadFoto={(value, setValue) => {*/}
      {/*      addPhoto(*/}
      {/*        'gallery',*/}
      {/*        value,*/}
      {/*        setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_other_images.id,*/}
      {/*          column_name: fields.tech_other_images.column_name,*/}
      {/*        },*/}
      {/*        true*/}
      {/*      );*/}
      {/*    }}*/}
      {/*    makeFoto={(value, setValue) => {*/}
      {/*      addPhoto('camera', value, setValue, serverWorkFuncImage, setLoaderVisible, {*/}
      {/*        fieldId: fields.tech_other_images.id,*/}
      {/*        column_name: fields.tech_other_images.column_name,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{fields.tech_other_images && (*/}
      {/*  <FieldImages*/}
      {/*    value={fieldsArray.tech_other_images.value}*/}
      {/*    setValue={fieldsArray.tech_other_images.setValue}*/}
      {/*    changeModalFotoCancelFlag={changeModalFotoCancelFlag}*/}
      {/*    setIndexDeleteFoto={setIndexDeleteFoto}*/}
      {/*    changeModalFotoCancelData={changeModalFotoCancelData}*/}
      {/*    dowloadFoto={*/}
      {/*      () =>*/}
      {/*        addPhoto(*/}
      {/*          'gallery',*/}
      {/*          fieldsArray.tech_other_images.value,*/}
      {/*          fieldsArray.tech_other_images.setValue,*/}
      {/*          serverWorkFuncImage,*/}
      {/*          setLoaderVisible,*/}
      {/*          {*/}
      {/*            fieldId: fields.tech_other_images.id,*/}
      {/*            column_name: fields.tech_other_images.column_name,*/}
      {/*          },*/}
      {/*          true*/}
      {/*        )*/}
      {/*      // dowloadFoto(*/}
      {/*      //   fieldsArray.tech_other_images.value,*/}
      {/*      //   fieldsArray.tech_other_images.setValue,*/}
      {/*      //   fields.tech_other_images.id,*/}
      {/*      //   fields.tech_other_images.column_name*/}
      {/*      // )*/}
      {/*    }*/}
      {/*    makeFoto={() =>*/}
      {/*      addPhoto(*/}
      {/*        'camera',*/}
      {/*        fieldsArray.tech_other_images.value,*/}
      {/*        fieldsArray.tech_other_images.setValue,*/}
      {/*        serverWorkFuncImage,*/}
      {/*        setLoaderVisible,*/}
      {/*        {*/}
      {/*          fieldId: fields.tech_other_images.id,*/}
      {/*          column_name: '',*/}
      {/*        },*/}
      {/*        true*/}
      {/*      )*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
    </View>
  );
};

export default EngineNotRunnig;
