//#region import libres

//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region plagins
import { connect } from 'react-redux';
//#endregion

//#region components
import { icons, theme, COLORS, loader } from '../../../сonstants';
import { Tires } from '../../../requests';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const TiresMarkModalChooseScreen = ({ route, navigation, tiresBrandsList }) => {
  //#region valuebles

  //#region system
  const [searchResult, setSearchResult] = useState('');
  const [elementName, setElementName] = useState('');
  const { itemChecked, setItemChecked, markModal, listModels } = route.params;
  const [loaderVisible, setLoaderVisible] = useState(
    markModal === 'mark' ? tiresBrandsList.length > 0 : listModels ? listModels.length > 0 : false
  );
  //#endregion

  //#region flags
  const [modalVisible, setModalVisible] = useState(false);
  const [activeElementNameFlag, changeActiveElementNameFlag] = useState(false);
  const [elementNameValidateFlag, changeElementNameValidateFlag] = useState(true);

  //#endregion

  //#region data
  //const { itemChecked, setItemChecked, listItem, setListItem, markModal } = route.params;

  //const [tempList, setTempList] = useState(listItem)
  const [list, setList] = useState(markModal === 'mark' ? tiresBrandsList : listModels);
  const [itemLocalChecked, setItemLocalChecked] = useState(itemChecked);

  //#endregion

  //#endregion

  function onCheck(item) {
    console.log('#lld', markModal, item);
    let newItem = {
      id: item[0],
      value: item[1]
    }
    if (markModal === 'mark'){
      newItem.logo = item[2]
    }
    setItemChecked(newItem);
    setItemLocalChecked(item);
    navigation.goBack();
  }

  function addElement() {
    if (elementName) {
      if (elementName.length >= 2) {
        changeElementNameValidateFlag(true);
        if (list) {
          let newList = [...list, { id: null, value: elementName }];
          newList.sort((a, b) => (a.value > b.value ? 1 : -1));
          setList(newList);
        } else {
          setList([{ id: null, value: elementName }]);
        }

        //setListItem([...listItem, elementName]);
        setModalVisible(false);
      } else {
        changeElementNameValidateFlag(false);
      }
    } else {
      changeElementNameValidateFlag(false);
    }
  }

  useEffect(() => {
    if (!modalVisible) {
      setElementName('');
      changeActiveElementNameFlag(false);
    }
  }, [modalVisible]);

  useEffect(() => {

    markModal === 'mark'
      ? tiresBrandsList.length > 0
        ? setLoaderVisible(false)
        : setLoaderVisible(true)
      : listModels
      ? listModels.length > 0
        ? setLoaderVisible(false)
        : setLoaderVisible(true)
      : setLoaderVisible(false);
  }, [tiresBrandsList, listModels]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <AnimatedLoader
        visible={loaderVisible}
        overlayColor={COLORS.none}
        source={loader}
        animationStyle={styles.lottie}
        speed={1}
        loop={true}
        onRequestClose={() => navigation.goBack()}
      />
      <View style={styles.headerInner}>
        <TouchableOpacity style={styles.headerBackInner} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.headerBackImage} />
        </TouchableOpacity>
        <View style={styles.headerInputInner}>
          <TextInput
            style={[theme.FONTS.h2, styles.headerSearchInput]}
            placeholder={markModal === 'mark' ? 'Введите марку шин' : 'Введите модель шин'}
            onChangeText={text => {
              setSearchResult(text);
              setItemChecked(null);
            }}
            value={searchResult}
            placeholderTextColor={'#858585'}
          />
          <TouchableOpacity
            style={styles.headerImageWrapper}
            onPress={() => {
              setSearchResult('');
            }}
          >
            {searchResult.length > 0 ? (
              <Image source={icons.clear} style={styles.headerBrandSearchImage} />
            ) : (
              <Image source={icons.search} style={styles.headerBrandSearchImage} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          {list ? (
            list.filter(item => {
              return item[1].toLowerCase().includes(searchResult.toLowerCase());
            })?.length !== 0 ? (
              list
                .filter(item => {
                  return item[1].toLowerCase().includes(searchResult.toLowerCase());
                })
                .map((item, index) => (
                  <TouchableOpacity
                    onPress={() => onCheck(item)}
                    style={[
                      styles.itemInner,
                      {
                        borderColor: itemLocalChecked
                          ? item[1] === itemLocalChecked[1]
                            ? COLORS.red
                            : COLORS.gray
                          : COLORS.gray,
                      },
                    ]}
                    key={index}
                  >
                    {markModal === 'mark' && <Image source={{ uri: item[2] }} style={styles.logo} />}
                    <Text
                      style={[theme.FONTS.body_R_R_14, styles.itemTitle]}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                    >
                      {item[1]}
                    </Text>
                    {itemLocalChecked && item[1] === itemLocalChecked[1] && (
                      <View style={styles.itemCheckedInner}>
                        <Image style={styles.itemCheckedImage} source={icons.checked} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
            ) : !loaderVisible ? (
              <View style={styles.searchErrorInner}>
                <Text style={[theme.FONTS.body_R_R_14, styles.searchErrorText]}>
                  {markModal === 'mark'
                    ? 'Такой марки шин нет в списке'
                    : 'Такой модели шин нет в списке'}
                </Text>
              </View>
            ) : (
              <></>
            )
          ) : !loaderVisible ? (
            <View style={styles.searchErrorInner}>
              <Text style={[theme.FONTS.body_R_R_14, styles.searchErrorText]}>
                {markModal === 'mark' ? 'Такой марки шин нет в списке' : 'Такой модели шин нет в списке'}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
        {!loaderVisible ? (
          <TouchableOpacity style={styles.addButtonWrapper} onPress={() => setModalVisible(true)}>
            <Text style={[theme.FONTS.body_SF_M_15, styles.addBtn]}>
              + {markModal === 'mark' ? 'Добавить другую марку' : 'Добавить другую модель'}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
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
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalViewWrapper}>
            <View style={styles.modalViewWrapperContent}>
              <Text style={[theme.FONTS.h3Roboto, styles.modalTitle]}>
                {markModal === 'mark' ? 'Введите название марки шины' : 'Введите название модели шины'}
              </Text>
              <View
                style={[
                  styles.inputInner,
                  { borderColor: elementNameValidateFlag ? COLORS.gray : COLORS.red },
                ]}
              >
                {activeElementNameFlag || elementName ? (
                  <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>
                    {markModal === 'mark' ? 'Название марки' : 'Название модели'}
                  </Text>
                ) : (
                  <></>
                )}
                <TextInput
                  style={[
                    theme.FONTS.body_SF_R_15,
                    styles.input,
                    {
                      paddingTop:
                        activeElementNameFlag || elementName
                          ? Platform.OS === 'ios'
                            ? 8
                            : 18
                          : Platform.OS === 'ios'
                          ? 0
                          : 10,
                    },
                  ]}
                  placeholderTextColor={COLORS.darkGray}
                  placeholder={
                    !activeElementNameFlag
                      ? markModal === 'mark'
                        ? 'Название марки'
                        : 'Название модели'
                      : null
                  }
                  maxLength={50}
                  onFocus={() => changeActiveElementNameFlag(true)}
                  onBlur={() => changeActiveElementNameFlag(false)}
                  onChangeText={text => setElementName(text)}
                  value={elementName}
                />
              </View>
              {!elementNameValidateFlag ? (
                <Text style={[theme.FONTS.body_SF_R_15, styles.inputError]}>От 2 до 50 символов</Text>
              ) : (
                <></>
              )}
              {!loaderVisible ? (
                <View style={styles.modalTouchableInner}>
                  <TouchableOpacity style={styles.modalBtnInner} onPress={() => addElement()}>
                    <Text style={[theme.FONTS.body_SF_M_13, styles.modalBtn]}>
                      {markModal === 'mark' ? 'Добавить новую марку шины' : 'Добавить новую модель шины'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={[theme.FONTS.body_SF_R_14, styles.modalCancel]}>Отмена</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    tiresBrandsList: state.lists.tiresBrandsList,
  };
};
export default connect(mapStateToProps, null)(TiresMarkModalChooseScreen);
