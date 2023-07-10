//#region react
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
//#endregion -----------

//#region actions

//#endregion

//#region plagins
import AnimatedLoader from 'react-native-animated-loader';

//#endregion -----------

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { loader, theme, COLORS } from '../../сonstants';
import { globalFunctions } from '../../utils';
import FieldUnfilledPage from './FieldUnfilledPage/FieldUnfilledPage';
import { useIsFocused } from '@react-navigation/native';

//#endregion -----------

//#region styles
import { styles } from './styles';
import { useNetInfo } from '@react-native-community/netinfo';
import { setReportEndModalFlag } from '../../redux/App/actions/mainActions';
import { ModalUnfilledFields } from '../../components/modal';
//#endregion -----------

const UnfilledFieldsScreen = ({ route, navigation }) => {
  //#region valuevles
  const isFocused = useIsFocused();
  const reportId = useSelector(state => state.appGlobal.reportId);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const netInfo = useNetInfo();
  const [needToUpdate, setNeedToUpdate] = useState(true)
  const menusState = useSelector(state => state.appGlobal.openScreen);

  const unfilledSections = useSelector(state => state.appGlobal.unfilledFields);

  const [incorrectSections, setIncorrectSections] = useState([]);
  const [modalUnfilledVisible, setModalUnfilledVisible] = useState(false);
  const dispatch = useDispatch();

  //#endregion -----------

  //#region functions

  function pressFinish() {
    // setIncorrectSections(prev => {
    //   if (unfilledSections) {
    //     let newSections = Object.keys(unfilledSections)?.filter(
    //       item =>
    //         item.status !== 'completed' && item.section_name !== 'location' && item.fields.length > 0
    //     );
    //     if (newSections.length === 0) {
    //       dispatch(setReportEndModalFlag('allOk'));
    //     }
    //     console.log('#N6', newSections);
    //     return newSections;
    //     //setIncorrectSections(newSections);
    //   } else {
    //     return [];
    //   }
    // });
    if (netInfo?.isConnected !== null) {
      setModalUnfilledVisible(true);
      // globalFunctions
      //   .getUnfilledReportFields(navigation, dispatch, token, reportId, setLoaderVisible, true, netInfo)
      //   .then(() => {
      //     if (Array.isArray(unfilledSections)) {
      //       setIncorrectSections(unfilledSections);
      //     }
      //   });
    }
  }


  // useEffect(()=>{
  //   if (netInfo?.isConnected === true){
  //
  //   }
  // },[netInfo?.isConnected])
  //#endregion -----------

  /**
   * startup useeffect
   */

  useEffect(() => {
    console.log('is focused', isFocused);
    if (isFocused && needToUpdate) {
      console.log('#ll', unfilledSections);
      setLoaderVisible(true);
      globalFunctions
        .getUnfilledReportFields(navigation, dispatch, token, reportId, setLoaderVisible, true, netInfo)
        .then(res => {

          console.log('#Z4', String(res));
          setNeedToUpdate(!res)
          //setLoaderVisible(false);
          // console.log('EL', sections);
          // if (Array.isArray(unfilledSections)) {
          //   setIncorrectSections(unfilledSections);
          // }
        })
        .catch(error => {
          console.log('#Z5');
          setLoaderVisible(false);
          console.log('get unfilled error', error);
        });
      //pressFinish();
    }
  }, [isFocused, netInfo?.isConnected, needToUpdate]);

  useEffect(() => {
    if (Array.isArray(unfilledSections)) {
      setIncorrectSections(unfilledSections);
    } else {
      setIncorrectSections([]);
    }
  }, [unfilledSections]);

  return (
    <SafeAreaView>
      <HeaderBar
        backButton={true}
        title={'Недостающие вопросы'}
        menu={<ProgressMenu nav={navigation} validateFunc={() => {}} />}
        goBackFlag={false}
        endReport={true}
        menuFlag={true}
        nav={navigation}
        route={route}
      >
        <KeyboardAvoidingView
          style={{ width: '100%' }}
          keyboardVerticalOffset={0}
          enabled={Platform.OS === 'ios' ? true : false}
          behavior="padding"
        >
          <View style={styles.container}>
            {
              loaderVisible &&
                <AnimatedLoader
                visible={loaderVisible}
                overlayColor={unfilledSections.length === 0 ? COLORS.none : COLORS.whiteTransparent}
                source={loader}
                animationStyle={styles.lottie}
                speed={1}
                loop={true}
              />
            }

            <View style={styles.mainWrapper}>
              <View style={styles.title}>
                <Text style={styles.titleText}>
                  Eсли не заполнен любой из пунктов отчета, то публикация его возможна после модерации
                  администрацией
                </Text>
              </View>
              <View style={styles.sectionsWrapper}>
                <ScrollView style={styles.scroll}>
                  {incorrectSections.map((item, index) => {
                    return (
                      <FieldUnfilledPage
                        key={index}
                        navigation={navigation}
                        section={item.section_name}
                        name={item.name}
                        //fields={[...item.requiredInReport, ...item.requiredInSection]} //...item.requiredInReport, ...item.requiredInSection
                        fields={item.fields}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            {/*<ModalUnfilledFields*/}
            {/*  //dispatch={dispatch}*/}
            {/*  modalFlag={modalUnfilledVisible}*/}
            {/*  //refNav={navigationRef}*/}
            {/*  changeModalFlag={setModalUnfilledVisible()}*/}
            {/*  fromUnfilled={true}*/}
            {/*/>*/}

            <Modal
              style={{
                zIndex: 2,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                //opacity: 0.0,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
              //transparent={true}
              transparent={true}
              visible={modalUnfilledVisible}
            >
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={0}>
                <View style={styles.modalViewWrapper}>
                  <View style={styles.modalViewWrapperContent}>
                    <Text style={[theme.FONTS.body_R_R_16, styles.modalTitle]}>
                      Невозможно сформировать отчет
                    </Text>
                    <Text style={[theme.FONTS.body_R_R_14, styles.modalSubTitle]}>
                      К сожалению Вы не ответили на все необходимые вопросы для формирование отчет
                    </Text>
                    <View style={styles.modalTouchableInner}>
                      <TouchableOpacity
                        style={styles.buttonWrapperAnswer}
                        onPress={() => {
                          setModalUnfilledVisible(false);
                        }}
                      >
                        <Text style={[theme.FONTS.body_R_R_13, { color: COLORS.primary }]}>
                          Ответить на вопросы
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.buttonWrapper}
                        onPress={() => {
                          setModalUnfilledVisible(false);
                          //requestClose();
                        }}
                      >
                        <Text style={[theme.FONTS.body_R_R_14, styles.modalText, { color: COLORS.red }]}>
                          Сохранить и завершить отчет
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            <TouchableOpacity onPress={pressFinish}>
              <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Завершить отчет</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </HeaderBar>
    </SafeAreaView>
  );
};

export default UnfilledFieldsScreen;
