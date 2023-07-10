//#region react
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
//#endregion

//#region plagins
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
//#endregion

//#region components
import { global, ModalChooseDataFunc } from '../../requests';
//#endregion

//#region styles
import { styles } from './styles';
import { HeaderBar, MainMenu } from '../../components/menu';
import { COLORS, loader } from '../../сonstants';
import AnimatedLoader from 'react-native-animated-loader';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { ScrollView } from 'react-native-gesture-handler';
import { setReportType } from '../../redux/App/actions/mainActions';
import { err } from 'react-native-svg/lib/typescript/xml';
//#endregion

const SettingsScreen = ({ navigation, route }) => {
  const token = useSelector(state => state.appGlobal.loginToken);

  const dispatch = useDispatch();

  const [loaderVisible, setLoaderVisible] = useState(true);
  const [reportTypeList, setReportTypeList] = useState(null);
  const [chosenReportType, setChosenReportType] = useState(1);

  const radioStyles = {
    borderWidth: 2,
    borderWidthActive: 7,
    borderColor: '#C8C8C8',
    borderColorActive: '#FF3B30',
    marginVertical: 5,
    // labelStyle: {
    //   //paddingRight: 5,
    //   marginLeft: 5,
    //   marginRight: 5,
    // }
  };

  const setReportTypeStorage = async id => {
    try {
      await AsyncStorage.setItem('@reportType', id);
    } catch (e) {
      console.log(e);
    }
  };

  const getReportTypeStorage = async () => {
    try {
      let type = await AsyncStorage.getItem('@reportType');
      if (!type) {
        type = '1';
      }
      return parseInt(type);
    } catch (e) {
      console.log(e);
    }
  };

  function onPressRadioButton(value) {
    // console.log('click');
    value.map(item => {
      if (item.checked) {
        dispatch(setReportType(item.id));
        setReportTypeStorage(item.id.toString()).catch(err => {
          console.log('failed to save report type', err);
        });
      }
    });
    setReportTypeList(value);
  }

  async function createRadio() {
    setLoaderVisible(true);
    //let reportTypeExist = await getReportTypeStorage();

    getReportTypeStorage()
      .then(type => {
        global
          .getReportType(token)
          .then(res => {
            let reportListTemp = [];
            res.data.data.map(item => {
              console.log(item.id, type, item.id === type);
              if (item.id === type) {
                reportListTemp.push(
                  Object.assign(
                    { id: item.id, label: item.name, value: item.name, selected: true, checked: true },
                    radioStyles
                  )
                );
              } else {
                reportListTemp.push(
                  Object.assign({ id: item.id, label: item.name, value: item.name }, radioStyles)
                );
              }
            });
            setReportTypeList(reportListTemp);
            setLoaderVisible(false);
          })
          .catch(err => {
            setLoaderVisible(false);
            console.log('getReportType error', err?.response);
          });
      })
      .catch(err => {
        console.log('get report type error');
      });
  }

  useEffect(() => {
    createRadio();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <HeaderBar
        title={'Настройки'}
        menu={<MainMenu navigation={navigation} />}
        backButton={true}
        goBackFlag={true}
        menuFlag={true}
        nav={navigation}
        route={route}
      >
        <AnimatedLoader
          visible={loaderVisible}
          overlayColor={COLORS.whiteTransparent}
          source={loader}
          animationStyle={styles.lottie}
          speed={1}
          loop={true}
        />
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Варианты отчета</Text>
        </View>
        {reportTypeList ? (
          <ScrollView style={styles.scrollInner} contentContainerStyle={styles.scroll}>
            <RadioGroup
              containerStyle={styles.radioContainer}
              radioButtons={reportTypeList}
              onPress={onPressRadioButton}
            />
          </ScrollView>
        ) : (
          <></>
        )}
      </HeaderBar>
    </SafeAreaView>
  );
};

export default SettingsScreen;
