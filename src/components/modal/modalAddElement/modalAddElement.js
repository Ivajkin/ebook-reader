//#region react components
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
//#endregion

//#region plagins
//#endregion ----------

//#region components
import { theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import styles from './styles';
//#endregion ----------

const ModalAddElement = props => {
  //#region valuebles

  const modalVisible = props.modalVisible;
  const setModalVisible = props.setModalVisible;
  const screenName = props.screenName ? props.screenName : null;
  const tabName = props.tabName ? props.tabName : null;
  const allTabs = props.allTabs ? props.allTabs : null;

  const data = props.data;
  const setData = props.setData;

  const [activeElementNameFlag, changeActiveElementNameFlag] = useState(false);
  const [elementName, setElementName] = useState(null);

  function addElement() {
    if (elementName) {
      if (screenName === 'DamageScreen') {
        if (tabName) {
          let tempData = { ...data };
          tempData[tabName].push({
            id: allTabs.filter(item => item.name == tabName)[0].newElemFlag.id,
            column_name: `${Object.keys(tempData).length}_damage_${elementName}`,
            columnNamePhoto: `${Object.keys(tempData).length}_damage_${elementName}`,
            required: 1,
            count: 0,
            type: 'page',
            name: elementName,
            values: {
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
            },
            photo: [],
            comment: null,
          });
          setData(tempData);
        }
      } else if (screenName === 'MarkingsScreen') {
        let tempData = { ...data };
        tempData[`${Object.keys(tempData).length}_markings_${elementName}`] = {
          id: tempData['marks_add_new'].id,
          columnName: `${Object.keys(tempData).length}_markings_${elementName}`,
          columnNamePhoto: `${Object.keys(tempData).length}_markings_${elementName}`,
          name: elementName,
          type: 'page',
          count: 0,
          photo: [],
          validate: true,
          required: 0,
          matchDoc: false,
          comments: null,
        };
        setData(tempData);
      }
    }
  }
  //#endregion ----------

  return (
    <Modal
      statusBarTranslucent={true}
      style={styles.modalExit}
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={() => {}}>
        <View style={styles.modalViewWrapper}>
          <View style={styles.modalViewWrapperContent}>
            <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
              Введите название нового элемента
            </Text>
            <View style={styles.inputInner}>
              {activeElementNameFlag || elementName ? (
                <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>Название элемента</Text>
              ) : (
                <></>
              )}
              <TextInput
                style={[theme.FONTS.body_SF_R_15, styles.input]}
                placeholderTextColor={COLORS.darkGray}
                placeholder={!activeElementNameFlag ? 'Название элемента' : null}
                maxLength={50}
                onFocus={() => changeActiveElementNameFlag(true)}
                onBlur={() => changeActiveElementNameFlag(false)}
                onChangeText={text => setElementName(text)}
                value={elementName}
              />
            </View>
            <View style={styles.modalTouchableInner}>
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  style={styles.cancelView}
                  onPress={() => {
                    setModalVisible(false);
                    setElementName(null);
                  }}
                >
                  <Text style={styles.cancelText}>Отменить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyView}
                  onPress={() =>
                    addElement() ||
                    setModalVisible(false) ||
                    setElementName(null) ||
                    changeActiveElementNameFlag(false)
                  }
                >
                  <Text style={styles.applyText}>Добавить</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity style={styles.buttonWrapper} onPress={() => setModalVisible(false)}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.modalCancel]}>Отмена</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalAddElement;
