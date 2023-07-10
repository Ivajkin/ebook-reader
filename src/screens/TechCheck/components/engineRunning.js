//#region react components
import React from 'react';
import { Text, View } from 'react-native';
//#endregion

//#region components
import { FieldCheckSwitch, FieldInput, FieldRadio } from '../../../components/fields';
//#endregion

//#region styles
import { styles } from '../styles';
//#endregion

const EngineRunnig = props => {
  //#region valuebles
  const fields = props.fields;
  const fieldsArray = props.fieldsArray;
  const groupTitles = props.groupTitles;

  //#endregion

  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.warning, { marginBottom: 25 }]}>
        Заведите автомобиль и последовательно выполните проверку
      </Text>
      {fields.tech_engine_on && (
        <FieldCheckSwitch
          field={fields.tech_engine_on}
          value={fieldsArray.tech_engine_on.value}
          setValue={fieldsArray.tech_engine_on.setValue}
          type={'switch'}
        />
      )}
      {fields.tech_comment_regular && (
        <FieldInput
          field={fields.tech_comment_regular}
          value={fieldsArray.tech_comment_regular.value}
          setValue={fieldsArray.tech_comment_regular.setValue}
          multiline={true}
          textAlignVertical={'top'}
          height={80}
        />
      )}
      {groupTitles.includes('Контрольные лампы') && <Text style={styles.title}>Контрольные лампы</Text>}
      {fields.tech_lamps_airbags && (
        <FieldRadio
          field={fields.tech_lamps_airbags}
          radioData={fieldsArray.tech_lamps_airbags.value}
          setRadioData={fieldsArray.tech_lamps_airbags.setValue}
          commentFlag={fieldsArray.tech_lamps_airbags.commentFlag}
          changeCommentFlag={fieldsArray.tech_lamps_airbags.changeCommentFlag}
          commentValue={fieldsArray.tech_lamps_airbags.comment}
          setCommentValue={fieldsArray.tech_lamps_airbags.setComment}
        />
      )}
      {fields.tech_lamps_check_engine && (
        <FieldRadio
          field={fields.tech_lamps_check_engine}
          radioData={fieldsArray.tech_lamps_check_engine.value}
          setRadioData={fieldsArray.tech_lamps_check_engine.setValue}
          commentFlag={fieldsArray.tech_lamps_check_engine.commentFlag}
          changeCommentFlag={fieldsArray.tech_lamps_check_engine.changeCommentFlag}
          commentValue={fieldsArray.tech_lamps_check_engine.comment}
          setCommentValue={fieldsArray.tech_lamps_check_engine.setComment}
        />
      )}
      {fields.tech_lamps_oil_pressure && (
        <FieldRadio
          field={fields.tech_lamps_oil_pressure}
          radioData={fieldsArray.tech_lamps_oil_pressure.value}
          setRadioData={fieldsArray.tech_lamps_oil_pressure.setValue}
          commentFlag={fieldsArray.tech_lamps_oil_pressure.commentFlag}
          changeCommentFlag={fieldsArray.tech_lamps_oil_pressure.changeCommentFlag}
          commentValue={fieldsArray.tech_lamps_oil_pressure.comment}
          setCommentValue={fieldsArray.tech_lamps_oil_pressure.setComment}
        />
      )}
      {groupTitles.includes('Электрика') && <Text style={styles.title}>Электрика лампы</Text>}
      {fields.tech_electricity_battery && (
        <FieldRadio
          field={fields.tech_electricity_battery}
          radioData={fieldsArray.tech_electricity_battery.value}
          setRadioData={fieldsArray.tech_electricity_battery.setValue}
          commentFlag={fieldsArray.tech_electricity_battery.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_battery.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_battery.comment}
          setCommentValue={fieldsArray.tech_electricity_battery.setComment}
        />
      )}
      {fields.tech_electricity_seat_heating && (
        <FieldRadio
          field={fields.tech_electricity_seat_heating}
          radioData={fieldsArray.tech_electricity_seat_heating.value}
          setRadioData={fieldsArray.tech_electricity_seat_heating.setValue}
          commentFlag={fieldsArray.tech_electricity_seat_heating.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_seat_heating.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_seat_heating.comment}
          setCommentValue={fieldsArray.tech_electricity_seat_heating.setComment}
        />
      )}
      {fields.tech_electricity_audio && (
        <FieldRadio
          field={fields.tech_electricity_audio}
          radioData={fieldsArray.tech_electricity_audio.value}
          setRadioData={fieldsArray.tech_electricity_audio.setValue}
          commentFlag={fieldsArray.tech_electricity_audio.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_audio.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_audio.comment}
          setCommentValue={fieldsArray.tech_electricity_audio.setComment}
        />
      )}
      {fields.tech_electricity_front_headlights && (
        <FieldRadio
          field={fields.tech_electricity_front_headlights}
          radioData={fieldsArray.tech_electricity_front_headlights.value}
          setRadioData={fieldsArray.tech_electricity_front_headlights.setValue}
          commentFlag={fieldsArray.tech_electricity_front_headlights.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_front_headlights.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_front_headlights.comment}
          setCommentValue={fieldsArray.tech_electricity_front_headlights.setComment}
        />
      )}
      {fields.tech_electricity_rear_headlights && (
        <FieldRadio
          field={fields.tech_electricity_rear_headlights}
          radioData={fieldsArray.tech_electricity_rear_headlights.value}
          setRadioData={fieldsArray.tech_electricity_rear_headlights.setValue}
          commentFlag={fieldsArray.tech_electricity_rear_headlights.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_rear_headlights.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_rear_headlights.comment}
          setCommentValue={fieldsArray.tech_electricity_rear_headlights.setComment}
        />
      )}
      {fields.tech_electricity_turn_signals && (
        <FieldRadio
          field={fields.tech_electricity_turn_signals}
          radioData={fieldsArray.tech_electricity_turn_signals.value}
          setRadioData={fieldsArray.tech_electricity_turn_signals.setValue}
          commentFlag={fieldsArray.tech_electricity_turn_signals.commentFlag}
          changeCommentFlag={fieldsArray.tech_electricity_turn_signals.changeCommentFlag}
          commentValue={fieldsArray.tech_electricity_turn_signals.comment}
          setCommentValue={fieldsArray.tech_electricity_turn_signals.setComment}
        />
      )}
      {groupTitles.includes('Механика') && <Text style={styles.title}>Механика</Text>}
      {fields.tech_mechanics_power_steering && (
        <FieldRadio
          field={fields.tech_mechanics_power_steering}
          radioData={fieldsArray.tech_mechanics_power_steering.value}
          setRadioData={fieldsArray.tech_mechanics_power_steering.setValue}
          commentFlag={fieldsArray.tech_mechanics_power_steering.commentFlag}
          changeCommentFlag={fieldsArray.tech_mechanics_power_steering.changeCommentFlag}
          commentValue={fieldsArray.tech_mechanics_power_steering.comment}
          setCommentValue={fieldsArray.tech_mechanics_power_steering.setComment}
        />
      )}
      {fields.tech_mechanics_conditioner && (
        <FieldRadio
          field={fields.tech_mechanics_conditioner}
          radioData={fieldsArray.tech_mechanics_conditioner.value}
          setRadioData={fieldsArray.tech_mechanics_conditioner.setValue}
          commentFlag={fieldsArray.tech_mechanics_conditioner.commentFlag}
          changeCommentFlag={fieldsArray.tech_mechanics_conditioner.changeCommentFlag}
          commentValue={fieldsArray.tech_mechanics_conditioner.comment}
          setCommentValue={fieldsArray.tech_mechanics_conditioner.setComment}
        />
      )}
      {fields.tech_mechanics_engine && (
        <FieldRadio
          field={fields.tech_mechanics_engine}
          radioData={fieldsArray.tech_mechanics_engine.value}
          setRadioData={fieldsArray.tech_mechanics_engine.setValue}
          commentFlag={fieldsArray.tech_mechanics_engine.commentFlag}
          changeCommentFlag={fieldsArray.tech_mechanics_engine.changeCommentFlag}
          commentValue={fieldsArray.tech_mechanics_engine.comment}
          setCommentValue={fieldsArray.tech_mechanics_engine.setComment}
        />
      )}
      {fields.tech_mechanics_handling && (
        <FieldRadio
          field={fields.tech_mechanics_handling}
          radioData={fieldsArray.tech_mechanics_handling.value}
          setRadioData={fieldsArray.tech_mechanics_handling.setValue}
          commentFlag={fieldsArray.tech_mechanics_handling.commentFlag}
          changeCommentFlag={fieldsArray.tech_mechanics_handling.changeCommentFlag}
          commentValue={fieldsArray.tech_mechanics_handling.comment}
          setCommentValue={fieldsArray.tech_mechanics_handling.setComment}
        />
      )}
      {fields.tech_mechanics_kpp && (
        <FieldRadio
          field={fields.tech_mechanics_kpp}
          radioData={fieldsArray.tech_mechanics_kpp.value}
          setRadioData={fieldsArray.tech_mechanics_kpp.setValue}
          commentFlag={fieldsArray.tech_mechanics_kpp.commentFlag}
          changeCommentFlag={fieldsArray.tech_mechanics_kpp.changeCommentFlag}
          commentValue={fieldsArray.tech_mechanics_kpp.comment}
          setCommentValue={fieldsArray.tech_mechanics_kpp.setComment}
        />
      )}
    </View>
  );
};

export default EngineRunnig;
