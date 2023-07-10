//#region react components
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';

import RadioGroup from 'react-native-radio-buttons-group';
//#endregion ----------

//#region plagins
//#endregion ----------

//#region components
import { theme } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const ModalChooseClear = props => {
  //#region valuevles
  //#endregion

  const title = props.title;
  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const setValue = props.setValue;
  const setValueId = props.setValueId;
  let current = [];
  // if (props.current?.forInput.length > 0) {
  //   current = props.current?.forInput;
  // }
  const [data, setData] = useState(
    props.data.map((item, i) => {
      //let checked = false;
      if (current?.length > 0) {
        let found = current.find(el => String(el) === String(item.title));
        return {
          ...item,
          checked: found !== undefined,
        };
      }
      return item;
    })
  );
  /**
   * modal functions
   */
  const [radioButtons, setRadioButtons] = useState(data);

  const [StartData, setStartData] = useState([]);
  function onPressRadioButton(radioButtonsArray) {
    closeModal(false);
    radioButtonsArray.map((elem, index) => {
      if (elem.checked) {
        setValue(elem.label);
        setValueId(elem.id);
      }
    });
    setRadioButtons(radioButtonsArray);

    //setTimeout(() => closeModal(false), 300);
  }

  const clearSelect = () => {
    let temp = radioButtons;
    temp.map((item, index) => {
      item.checked ? (item.checked = false) : '';
    });
    setRadioButtons(temp);
  };

  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(radioButtons)) {
      setRadioButtons(data);
    }
  }, [data, radioButtons]);

  useEffect(() => {
    if (isOpen === true) {
      setStartData(JSON.parse(JSON.stringify(props.data)));
      setData(
        props.data.map((item, i) => {
          //let checked = false;
          if (current?.length > 0) {
            let found = current.find(el => String(el) === String(item.title));
            return {
              ...item,
              checked: found !== undefined,
            };
          }
          return item;
        })
      );
    }
  }, [isOpen]);

  return (
    <Modal
      statusBarTranslucent={true}
      style={styles.modalExit}
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        closeModal(!isOpen);
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => {
          //setModalOpenCarModel(false);
        }}
      >
        <View style={styles.modalViewWrapper}>
          <View style={styles.modalTypeViewWrapperContent}>
            <Text style={[theme.FONTS.body_R_R_16, styles.modalTypeTitle]}>{title}</Text>
            <View style={styles.modalTypeRadioWrapper}>
              <ScrollView
                style={styles.scrollWrapper}
                contentContainerStyle={styles.scroll}
                directionalLockEnabled={true}
                horizontal={false}
              >
                <RadioGroup
                  pressableSingleStyle={{ width: '100%' }}
                  radioButtons={data.map(button => {
                    button.containerStyle = { marginTop: 5 };
                    if (current.length > 0) {
                      button.checked = String(button.value) === String(current[0]);
                    }
                    button.label = button.value;
                    return button;
                  })}
                  onPress={onPressRadioButton}
                />
              </ScrollView>
            </View>
            <View style={styles.modalControlViewWrapper}>
              <TouchableOpacity
                style={styles.modalControlViewClear}
                onPress={() => {
                  closeModal(false);
                  setValue(null);
                  setValueId(null);
                  clearSelect();
                }}
              >
                <Text style={[theme.FONTS.body_SF_R_14, styles.modalEndTouchableText]}>Сбросить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalControlViewCancel} onPress={() => closeModal(false)}>
                <Text style={[theme.FONTS.body_SF_R_14, styles.modalEndTouchableText]}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default ModalChooseClear;
