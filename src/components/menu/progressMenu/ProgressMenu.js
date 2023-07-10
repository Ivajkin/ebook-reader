//#region react components
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
//#endregion

//#region plagins
import { useSelector, useDispatch } from 'react-redux';
import { globalFunctions } from '../../../utils';

//#endregion

//#region components
import { setMenuFlag } from '../../../redux/App/actions/mainActions';
import { constants, theme, icons, SIZES, COLORS } from '../../../сonstants';
import { ModalClose } from '../../modal';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

const ProgressMenu = props => {
  //#region values



  const currentScreen = props.currentScreen;
  const navigation = props.nav ? props.nav : null;
  const validateFunc = props.validateFunc ? props.validateFunc : null;
  const menusState = useSelector(state => state.appGlobal.openScreen);
  const isMenuOpen = useSelector(state => state.appGlobal.isMenuOpen);
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  let correctOrder = useSelector(state => {
    let order = Object.keys(state.appGlobal.sectionList).sort(
      (a, b) => sectionList[a].id - sectionList[b].id
    );
    order = [...order.slice(0, -2), 'advantages_and_disadvantages', 'signature'];
    return order;
  });
  //console.log('progress menu', menusState);
  const [screensArray, setScreensArray] = useState({});
  const dispatch = useDispatch();

  //const [modalVisible, setModalVisible] = useState(false)
  const [modalExitVisible, setModalExitVisible] = useState(false);

  //const [itemNavigate, setItemNavigate] = useState(null)

  const scrollRef = useRef();
  const [scrollMax, setScrollMax] = useState(200);
  const [floatButtonVisibale, changeFloatButtonVisibale] = useState(false);

  const reportType = useSelector(state => state.appGlobal.reportType);

  const formDataFunction = props.formDataFunction ? props.formDataFunction : null;
  const setLoaderVisible = props.setLoaderVisible ? props.setLoaderVisible : null;

  /**
   * function for press
   */

  function onMenuItemPress(item) {
    globalFunctions.sendSection(
      setLoaderVisible,
      formDataFunction,
      sectionList[item]?.screenName,
      navigation,
      dispatch
    );
    dispatch(setMenuFlag(false));
  }

  // function onOkayPress() {
  // 	if (itemNavigate) {
  // 		setModalVisible(false)
  // 		navigation.navigate(itemNavigate, { navFromProgress: true, updateTs: new Date() })
  // 		dispatch(setMenuFlag(false))
  // 	}
  // }

  function onSaveExitPress() {
    if (formDataFunction && setLoaderVisible) {
      globalFunctions.sendSection(
        setLoaderVisible,
        formDataFunction,
        'AllReportsScreen',
        navigation,
        dispatch
      );

      dispatch(setMenuFlag(false));
    }
    if (formDataFunction === null) {
      navigation.navigate('AllReportsScreen');
      dispatch(setMenuFlag(false));
    }
  }

  useEffect(() => {
    let tempScreens = {};
    //console.log('#BB',menusState)
    // console.log('#BB', Object.values(menusState).reduce(
    //   (accumulator, currentValue) => accumulator + currentValue,
    //   0
    // ));

    let sectionKeys = Object.keys(sectionList);
    let newSectionKeys = sectionKeys;
    if (String(reportType) === '1'){
      if (sectionKeys.length > 5) {
        newSectionKeys = sectionKeys.map((el, i, array) => {
          return array[newOrder[i]];
        });
      }
      newSectionKeys.map(item => {
        tempScreens[constants.sectionOrderList[item]] = sectionList[item]?.title;
      });
      //console.log('#BB2', newSectionKeys);
    }


    setScreensArray(tempScreens);
  }, []);

  useEffect(() => {
    if (isMenuOpen && validateFunc) {
      validateFunc();
    }
  }, [isMenuOpen]);
  const newOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 11];

  //"interior_photos", "damaged_parts", "exterior_photos", "specifications", "advantages_and_disadvantages", "equipment", "documents", "technical_check_of_auto", "completeness", "tires", "checking_paintwork", "location", "signature"
  //const sortedS
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={styles.container}>
        <FlatList
          style={{ width: '100%', height: '100%' }}
          ref={scrollRef}
          onScroll={e => {
            e.nativeEvent.contentOffset.y <= scrollMax
              ? changeFloatButtonVisibale(true)
              : changeFloatButtonVisibale(false);
          }}
          onEndReached={e => {
            setScrollMax(e.distanceFromEnd);
          }}
          onEndReachedThreshold={0.25}
          scrollEventThrottle={20}
          data={[1]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => (
            <View
              //style={{ backgroundColor: 'red' }}
              onLayout={e =>
                e.nativeEvent.layout.height > SIZES.height && changeFloatButtonVisibale(true)
              }
            >
              {correctOrder.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.singleItemWrapper,
                      {
                        backgroundColor:
                          sectionList[item]?.screenName === currentScreen ? COLORS.ping : COLORS.primary,
                      },
                    ]}
                    onPress={() => onMenuItemPress(item)}
                  >
                    <View
                      style={
                        styles.currentImageWrapper

                        // {
                        //   backgroundColor:
                        //     sectionList[item].screenName === currentScreen
                        //       ? COLORS.primary
                        //       : COLORS.ping,
                        // }
                      }
                    >
                      {menusState[sectionList[item]?.screenName] !== 2 ? (
                        <Image source={icons.menuProgressFalse} style={styles.currentImage} />
                      ) : (
                        <Image source={icons.menuProgressTrue} style={styles.currentImage} />
                      )}
                    </View>

                    {/* <Text style={styles.currentText}>{screensArray[item]}</Text> */}
                    <Text style={styles.currentText}>{sectionList[item].title}</Text>
                  </TouchableOpacity>
                );
              })}
              {/* <TouchableOpacity style={styles.exitButtonWrapper} onPress={() => { setModalExitVisible(true); dispatch(setMenuFlag(false)) }}>
							<Text style={[theme.FONTS.body_SF_M_15, styles.exitBtn]}>Выход</Text>
						</TouchableOpacity> */}
              <TouchableOpacity style={styles.exitButtonWrapper} onPress={onSaveExitPress}>
                <Text style={[theme.FONTS.body_SF_M_15, styles.exitBtn]}>Выйти и сохранить</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        {/* //</ScrollView> */}
        {floatButtonVisibale && (
          <TouchableOpacity style={styles.floatButton} onPress={() => scrollRef.current.scrollToEnd()}>
            <Image source={icons.download} style={styles.floatButtonImg} />
          </TouchableOpacity>
        )}
      </View>

      {/* <Modal
				statusBarTranslucent={true}
				style={styles.modalExit}
				//animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<TouchableOpacity
					style={{ flex: 1 }}
					activeOpacity={1}
				>
					<View style={styles.modalViewWrapper}>
						<View style={styles.modalViewWrapperContent}>
							<Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
								Вы уверены что хотите покинуть секцию? Некоторые данные могут не сохраниться
							</Text>
							<View style={styles.inlineRow}>
								<TouchableOpacity
									onPress={onOkayPress}
									style={styles.buttonPress}
								>
									<Text style={[theme.FONTS.body_R_R_16, { color: COLORS.red }]}>
										Да
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.buttonPress}
									onPress={() => setModalVisible(false)}
								>
									<Text style={theme.FONTS.body_R_R_16}>
										Отмена
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			</Modal> */}
      <ModalClose
        modalVisible={modalExitVisible}
        dispatch={dispatch}
        setModalVisible={setModalExitVisible}
        nav={navigation}
        backScreen={'AllReportsScreen'}
        screenName={currentScreen}
      />
    </View>
  );
};

export default ProgressMenu;
