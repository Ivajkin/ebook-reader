//#region react components
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
//#endregion ----------

//#region plagins
import { CheckBox } from 'react-native-elements';
import RadioGroup from 'react-native-radio-buttons-group';
import Svg, { Path } from 'react-native-svg';
//#endregion ----------

//#region components
import { COLORS, icons, loader, theme } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion ----------

const ModalChoose = props => {
  //#region valuevles

  const title = props.title;

  const isOpen = props.isOpen;
  const closeModal = props.closeModal;
  const setValue = props.setValue;
  let current = [];
  if (props.current?.forInput.length > 0) {
    current = props.current?.forSend;
  }
  const [data, setData] = useState(
    props.data.map((item, i) => {
      if (current?.length > 0) {
        let found = current.find(el => String(el) === String(item.id));
        return {
          ...item,
          checked: found !== undefined,
        };
      }
      return item;
    })
  );

  const [open, setOpen] = useState(false);

  const type = props.type ? props.type : 'radiobutton';

  /**
   * modal functions
   */

  const [StartData, setStartData] = useState([]);

  function onPressRadioButton(radioProps) {
    closeModal(false);
    let curChecked = radioProps.find(but => but.checked);
    if (curChecked !== undefined) {
      setData(prev => {
        let newData = prev.map(button => {
          return {
            ...button,
            checked: button.value === curChecked.value,
          };
        });

        let valueDate = { forSend: [], forInput: [] };
        newData.map((item, i) => {
          if (item.checked === true) {
            valueDate.forSend.push(item.id);
            valueDate.forInput.push(item.label);
          }
        });
        setValue(valueDate);

        return newData;
      });
    }
  }

  function onPressCheckBoxButton(item, i) {
    setData(prev => {
      let newChoices = prev.map((button, buttonIndex) => {
        if (buttonIndex === i) {
          return {
            ...button,
            checked: !button.checked,
          };
        }
        return button;
      });
      return newChoices;
    });
    //data[i].checked = !data[i].checked;
    //item.checked = !item.checked;
    //changeUpdate(!update);
  }

  function reset() {
    //closeModal(false);
    setData(props.data);

    setValue({ forSend: [], forInput: [] });
  }

  function cancel() {
    if (type === 'select-checkbox') {
      closeModal(false);
      setData(StartData);
    } else {
      closeModal(false);
    }
  }

  function applyForCheckBox() {
    let valueDate = { forSend: [], forInput: [] };
    data.map((item, i) => {
      if (item.checked === true && item?.id && (item?.title || item?.label)) {
        valueDate.forSend.push(item.id);
        valueDate.forInput.push(item.title || item.label);
      }
    });
    setValue(valueDate);
    closeModal(false);
  }

  useEffect(() => {
    if (isOpen === true) {
      setStartData(JSON.parse(JSON.stringify(props.data)));
      setData(
        props.data.map((item, i) => {
          //let checked = false;
          if (current?.length > 0) {
            let found = current.find(el => String(el) === String(item.id));
            if (found) {
            }
            return {
              ...item,
              checked: found !== undefined,
            };
          }
          return item;
        })
      );
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isOpen]);

  // useEffect(()=>{
  //   setLoa
  //   console.log('#R1', props.data.length);
  // }, [props.data])
  return (
    <Modal
      statusBarTranslucent={true}
      style={styles.modalExit}
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        closeModal(!isOpen);
        //accept();
      }}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPressOut={() => {
          closeModal(!isOpen);
          //accept();
        }}
      >
        <View style={styles.modalViewWrapper}>
          <TouchableWithoutFeedback>
            <View style={styles.modalTypeViewWrapperContent}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingRight: theme.SIZES.padding,
                }}
              >
                <Text style={[theme.FONTS.body_R_R_16, styles.modalTypeTitle]}>{title}</Text>
                <View style={styles.crossWrapper}>
                  <TouchableOpacity style={styles.crossWrapper} onPress={() => cancel()}>
                    <Svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Path
                        d="M0.656883 0.656837C1.06439 0.249334 1.72508 0.249334 2.13258 0.656837L11.9706 10.4948C12.3781 10.9023 12.3781 11.563 11.9706 11.9705C11.5631 12.378 10.9024 12.378 10.4949 11.9705L0.656883 2.13254C0.24938 1.72503 0.24938 1.06434 0.656883 0.656837Z"
                        fill="#B6B6B6"
                      />
                      <Path
                        d="M11.9706 0.656855C12.3781 1.06436 12.3781 1.72505 11.9706 2.13256L2.13257 11.9706C1.72506 12.3781 1.06437 12.3781 0.656867 11.9706C0.249363 11.5631 0.249363 10.9024 0.656867 10.4949L10.4949 0.656854C10.9024 0.249351 11.5631 0.249351 11.9706 0.656855Z"
                        fill="#B6B6B6"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.modalTypeRadioWrapper}>
                {(props.data.length === 0) ? (
                  <Text style={styles.loadingText}>Загрузка результатов поиска...</Text>
                ) : (

                  <ScrollView
                    style={styles.scrollWrapper}
                    contentContainerStyle={styles.scroll}
                    directionalLockEnabled={true}
                    horizontal={false}
                  >
                    {type === 'select-checkbox' ? (
                      <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
                        {data ? (
                          data.map((item, i) => {
                            // let checked = false;
                            // if (current?.length > 0) {
                            //   let found = current.find(el => el === item.title);
                            //   checked = found !== undefined;
                            // }

                            return (
                              <View style={styles.CheckBoxWrapper} key={i}>
                                <TouchableOpacity
                                  onPress={() => onPressCheckBoxButton(item, i)}
                                  style={styles.CheckBoxText}
                                >
                                  <Text style={[theme.FONTS.body_SF_R_14]}>
                                    {item.title || item.label}
                                  </Text>
                                </TouchableOpacity>
                                <CheckBox
                                  containerStyle={{
                                    padding: 0,
                                    marginLeft: 0,
                                    width: '25%',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                  }}
                                  checkedIcon={
                                    <Image
                                      style={{ width: 25, height: 25 }}
                                      source={icons.checkboxTrue}
                                    />
                                  }
                                  uncheckedIcon={
                                    <Image
                                      style={{ width: 25, height: 25 }}
                                      source={icons.checkboxFalse}
                                    />
                                  }
                                  checked={data[i].checked}
                                  //checked={checked}
                                  onPress={() => onPressCheckBoxButton(item, i)}
                                />
                              </View>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </View>
                    ) : data ? (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          width: '100%',
                          alignItems: 'flex-start',
                        }}
                      >
                        <RadioGroup
                          containerStyle={{
                            flex: 1,
                            width: '100%',
                            alignItems: 'flex-start',
                          }}
                          pressableSingleStyle={{ width: '100%' }}
                          radioButtons={data.map(button => {
                            if (button.label === undefined) {
                              button.label = button.value;
                            }
                            button.containerStyle = { marginTop: 5 };

                            if (current.length > 0) {
                              button.checked = String(button.id) === String(current[0]);
                            }

                            return button;
                          })}
                          onPress={onPressRadioButton}
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                  </ScrollView>
                )}
                <View
                  style={[
                    styles.modalTypeBtnInner,
                    { justifyContent: type == 'select-checkbox' ? 'space-between' : 'flex-end' },
                  ]}
                >
                  {type == 'select-checkbox' && (
                    <TouchableOpacity onPress={() => reset()}>
                      <Text
                        style={[
                          theme.FONTS.body_SF_R_14,
                          styles.modalEndTouchableText,
                          { marginLeft: 10 },
                        ]}
                      >
                        Сбросить
                      </Text>
                    </TouchableOpacity>
                  )}
                  {type === 'select-checkbox' && (
                    <TouchableOpacity onPress={() => applyForCheckBox()}>
                      <Text
                        style={[
                          theme.FONTS.body_SF_R_14,
                          styles.modalChooseEndTouchableText,
                          { marginRight: 10 },
                        ]}
                      >
                        Применить
                      </Text>
                    </TouchableOpacity>
                  )}
                  {/* <TouchableOpacity onPress={() => cancel()}>
                  <Text style={[theme.FONTS.body_SF_R_14, styles.modalEndTouchableText]}>Отмена</Text>
                </TouchableOpacity> */}
                  {type !== 'select-checkbox' && <View style={{ height: 20 }} />}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalChoose;
