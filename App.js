/**
 * libararies import
 */

import React, { useEffect, useState, useRef } from 'react';
import { Platform, StatusBar, Alert, Linking } from 'react-native';

//#region plagins
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer, useNavigationState, useRoute } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setLoginToken } from './src/redux/App/actions/authActions';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalFunctions, Permission, PERMISSIONS_TYPE } from './src/utils';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';

//#endregion

//#region screens import
import MainScreen from './src/screens/Main/Main';
import SignUpScreen from './src/screens/Auth/SignUp/SignUp';
import LogInScreen from './src/screens/Auth/LogIn/LogIn';
import ResetPassScreen from './src/screens/Auth/ResetPass/ResetPass';
import ConfResetPassScreen from './src/screens/Auth/ConfResetPass/ConfResetPass';
import NewPassScreen from './src/screens/Auth/NewPass/NewPass';
import CompleteResetPassScreen from './src/screens/Auth/CompleteResetPass/CompleteResetPass';
import AllReportsScreen from './src/screens/AllReports/AllReports';
import CompleteReportScreen from './src/screens/CompleteReport/CompleteReport';
import AllImagesScreen from './src/screens/CompleteReport/AllImages';
import SettingsScreen from './src/screens/Settings/Settings';

import TechnicalCharacteristics from './src/screens/TechnicalCharacteristics/TechnicalCharacteristics';
import BrandChoose from './src/screens/TechnicalCharacteristics/BrandChoose/BrandChoose';
import EquipmentScreen from './src/screens/Equipment/Equipment';
import DocumentsScreen from './src/screens/Documents/Documents';
import PTSScreen from './src/screens/Documents/PTS/PTS';
import STSScreen from './src/screens/Documents/STS/STS';
import ExtraDocScreen from './src/screens/Documents/ExtraDoc/ExtraDoc';
import MarkingsScreen from './src/screens/Markings/Markings';
import FotoDocScreen from './src/screens/FotoDoc/FotoDoc';
import CompletenessScreen from './src/screens/Completeness/Completeness';
import TiresScreen from './src/screens/TiresNew/Tires';
import TiresChooseScreen from './src/screens/TiresNew/TiresChoose/TiresChoose';
import TiresMarkModalChooseScreen from './src/screens/TiresNew/TiresMarkModalChoose/TiresMarkModalChoose';
import FotoExteriorScreen from './src/screens/FotoCar/FotoExterior/FotoExterior';
import FotoInteriorScreen from './src/screens/FotoCar/FotoInterior/FotoInterior';
import CheckingLKPScreen from './src/screens/LKP/CheckingLKP/CheckingLKP4';
import LKPParamScreen from './src/screens/LKP/LKPParam/LKPParam';
import DamageScreen from './src/screens/Damage/Damage';
import DamageParamsScreen from './src/screens/Damage/DamageParams/DamageParams';
import TechCheckScreen from './src/screens/TechCheck/TechCheck';
import LocationScreen from './src/screens/Location/Location';
import ErrorMessageScreen from './src/screens/ErrorMesage/ErrorMessage';
import SignatureScreen from './src/screens/Signature/Signature';
import UnfilledFieldsScreen from './src/screens/UnfilledFields/UnfilledFields';
import ModerationWaitScreen from './src/screens/ModerationWait';
import BlockScreen from './src/screens/BlockScreen';
import EditProfileScreen from './src/screens/EditProfile';
import EditPasswordScreen from './src/screens/EditProfile/EditPassword';
import EditPhoneScreen from './src/screens/EditProfile/EditPhone';
import RegionAndCityFilter from './src/screens/RegionAndCityFilter';
//#endregion

//#region components
import { ModalSuccess, ModalUnfilledFields } from './src/components/modal';
import { setReportType, setUserInfo } from './src/redux/App/actions/mainActions';
import { auth, global } from './src/requests';
import AdvantagesAndDisadvantagesScreen from './src/screens/AdvantagesAndDisadvantages/AdvantagesAndDisadvantages';
import ExpandedFilter from './src/components/filter/ExpandedFilter';
import SearchResult from './src/components/filter/SearchResult';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import BackgroundService from 'react-native-background-actions';
import AnimatedLoader from 'react-native-animated-loader';
import { COLORS, loader } from './src/сonstants';
import CurrentImageScreen from './src/screens/CompleteReport/CurrentImage';
import NoSignalScreen from './src/screens/NoSignalScreen';
//#endregion

// const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).

const options = {
  taskName: 'Example',
  taskTitle: 'Сохранение данных',
  taskDesc: 'Идет сохранение локальных данных',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

const App = () => {
  enableScreens();
  // const state = useNavigationState(state => state);
  // const routeName = (state.routeNames[state.index]);
  const netInfo = useNetInfo();
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const store = useStore();
  const navigationRef = useRef(null);
  const userInfo = useSelector(state => state.appGlobal.userInfo);
  const modalTypeReportEnd = useSelector(state => state.appGlobal.reportEndModalFlag);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleNotOk, setModalVisibleNotOk] = useState(false);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const veryIntensiveTask = async taskDataArguments => {
    //const shouldSendedReportData = JSON.parse(await AsyncStorage.getItem('@shouldSendedReportData'));
    const shouldSendFiles = JSON.parse(await AsyncStorage.getItem('@shouldSendFiles'));
    // try {
    //   // setLoaderVisible(() => true);
    //   await shouldSendedReportData.map(async item => {
    //     try {
    //       let localData = {
    //         report_id: item.report_id,
    //         fields: [],
    //       };
    //       Object.values(item.fields).map(field => {
    //         if (field?.val && field?.val !== null) {
    //           if (Array.isArray(field?.val)) {
    //             localData.fields.push({
    //               id: field.id,
    //               val: field.val,
    //               val_text: JSON.stringify(field.val),
    //             });
    //           } else {
    //             localData.fields.push({
    //               id: field.id,
    //               val: field.val,
    //               val_text: String(field.val_text || field.val),
    //             });
    //           }
    //         }
    //       });
    //       const result = await global.sendReportData(localData, token);
    //     } catch (e) {
    //       console.log('very intensive task error - should sended', e.response);
    //     }
    //   });
    //   await AsyncStorage.setItem('@shouldSendedReportData', JSON.stringify([]));
    // } catch (e) {
    //   console.log('very intensive task error', e.response);
    // }
    try {
      // setLoaderVisible(() => true);
      await shouldSendFiles.map(async item => {
        if (item[0] && item[1] && item[2] && item[3] && item[4] && item[5]) {
          let result = await global.sendFiles(
            item[0],
            item[1],
            item[2],
            item[3],
            item[4],
            item[5],
            item[6]
          );
        }
      });
      await AsyncStorage.setItem('@shouldSendFiles', JSON.stringify([]));
      // setLoaderVisible(() => false);
    } catch (e) {
      // setLoaderVisible(() => false);
      console.log('shouldSendFiles error', e);
    }
  };

  const getToken = async () => {
    try {
      const tokenFile = await AsyncStorage.getItem('@token');
      const reportType = await AsyncStorage.getItem('@reportType');
      const userInfo = await AsyncStorage.getItem('@userInfo');
      const userInfoObj = JSON.parse(userInfo);
      if (userInfo) {
        dispatch(setUserInfo(userInfoObj));
      }
      if (reportType) {
        dispatch(setReportType(parseInt(reportType)));
      }
      if (tokenFile !== null) {
        return tokenFile;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };

  const errorHandler = (e, isFatal) => {
    console.log('isFatal', e.response);
    if (isFatal) {
      Alert.alert(
        'Произошла непредвиденная ошибка',
        `
          Ошибка: ${isFatal ? 'Критично:' : ''} ${e.name} ${e.message}
  
          Попробуйте перезапустить приложение, мы уже отправили данные об ошибке нашим специалистам, приносим свои извинения.
          `,
        [
          {
            text: 'Перезапустить',
            onPress: () => {
              global.sendLog(navigationRef.current.getCurrentRoute().name, `${e.name} ${e.message}`);
              RNRestart.Restart();
            },
          },
        ]
      );
    } else {
      console.log('is not fatal error', e);
    }
  };

  const init = async () => {
    setLoaderVisible(() => true);
    getToken()
      .then(async res => {
        dispatch(setLoginToken(res));

        // const saveLocalData = async () => {
        //   await BackgroundService.start(veryIntensiveTask, options);
        // };
        if (netInfo.isConnected) {
          //await saveLocalData();
          if (res) {
            auth
              .getUserInfo(res)
              .then(response => {
                const data = response.data.data;
                globalFunctions.getAllDataFromApi(setLoaderVisible);

                setLoaderVisible(() => false);
                if (
                  data.status === 'moderating' &&
                  data.roles.length > 0 &&
                  data.roles[0].name === 'dss_group_specialist'
                ) {
                  navigationRef?.current?.navigate('ModerationWaitScreen');
                  return;
                } else if (data.status === 'blocked') {
                  navigationRef?.current?.navigate('BlockScreen');
                  return;
                } else {
                  if (!navigationRef?.current?.canGoBack()) {
                    navigationRef?.current?.navigate('AllReportsScreen', {
                      userId: data?.id || userInfo?.id || null,
                    });
                  }
                  return;
                }
                //navigationRef?.current?.navigate('ModerationWaitScreen');
              })
              .catch(error => {
                setLoaderVisible(() => false);
                console.log('error init', error);
              });
          }

          setLoaderVisible(() => false);
        } else {
          setLoaderVisible(() => false);
        }
      })
      .catch(err => {
        setLoaderVisible(() => false);
        console.log('get token error', err);
      });
  };

  useEffect(() => {
    switch (modalTypeReportEnd) {
      case 'inProgress':
        setModalVisible(false);
        setModalVisibleNotOk(false);
        break;
      case 'allOk':
        setModalVisible(true);
        break;
      case 'notAllOk':
        setModalVisibleNotOk(true);
        break;
    }
  }, [modalTypeReportEnd]);

  useEffect(() => {
    if (netInfo.isConnected !== null && !loaderVisible) {
      //.log('call!!', netInfo);
      //global.sendLog(navigationRef.current.getCurrentRoute().name, 'error')
      /**
       * catch crashes
       */
      setJSExceptionHandler(errorHandler);
      setNativeExceptionHandler(errorHandler);

      /**
       * request permissins
       */
      Permission.requestsMultiple([PERMISSIONS_TYPE.camera, PERMISSIONS_TYPE.storageWrite]);

      /**
       * hide splash screen
       */
      init().finally(async () => {
        await RNBootSplash.hide({ fade: Platform.OS !== 'ios' ? true : false });
      });
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    const checkInternet = async () => {
      const token = await AsyncStorage.getItem('@token');
      if (userInfo?.id && token && token !== null) {
        if (!navigationRef?.current?.canGoBack()) {
          navigationRef?.current?.navigate('AllReportsScreen', {
            userId: userInfo?.id || null,
          });
        }
      }
    };
    if (netInfo.isConnected !== null && !netInfo.isConnected && !loaderVisible) {
      checkInternet();
    }
  }, [netInfo.isConnected, userInfo, loaderVisible]);

  useEffect(() => {
    const navigate = url => {
      if (url) {
        const route = url.replace(/.*?:\/\//g, '');
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route.split('/')[0];
      }
    };

    const handleOpenURL = event => {
      navigate(event.url);
    };

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        navigate(url);
      });
    } else {
      Linking.addEventListener('url', handleOpenURL);
    }
  }, []);

  return (
    <>
      <AnimatedLoader
        visible={loaderVisible}
        overlayColor={COLORS.whiteTransparent}
        source={loader}
        animationStyle={{
          width: Platform.OS !== 'ios' ? 200 : 50,
          height: Platform.OS !== 'ios' ? 200 : 50,
        }}
        speed={1}
        loop={true}
      />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' },
          }}
        >
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="BlockScreen" component={BlockScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="ModerationWaitScreen"
            component={ModerationWaitScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="LogInScreen" component={LogInScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="ResetPassScreen"
            component={ResetPassScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="ConfResetPassScreen"
            component={ConfResetPassScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="NewPassScreen"
            component={NewPassScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CompleteResetPassScreen"
            component={CompleteResetPassScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="AdvantagesAndDisadvantagesScreen"
            component={AdvantagesAndDisadvantagesScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="EditPasswordScreen"
            component={EditPasswordScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="EditPhoneScreen"
            component={EditPhoneScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="AllReportsScreen"
            component={AllReportsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CompleteReportScreen"
            component={CompleteReportScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="AllImagesScreen"
            component={AllImagesScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CurrentImageScreen"
            component={CurrentImageScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="TechnicalCharacteristics"
            component={TechnicalCharacteristics}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="BrandChoose" component={BrandChoose} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="ExpandedFilter"
            component={ExpandedFilter}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="SearchResult"
            component={SearchResult}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="EquipmentScreen"
            component={EquipmentScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="DocumentsScreen"
            component={DocumentsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="PTSScreen" component={PTSScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="STSScreen" component={STSScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="ExtraDocScreen"
            component={ExtraDocScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="MarkingsScreen"
            component={MarkingsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="FotoDocScreen"
            component={FotoDocScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CompletenessScreen"
            component={CompletenessScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="TiresScreen" component={TiresScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen
            name="TiresChooseScreen"
            component={TiresChooseScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="TiresMarkModalChooseScreen"
            component={TiresMarkModalChooseScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="FotoExteriorScreen"
            component={FotoExteriorScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="FotoInteriorScreen"
            component={FotoInteriorScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="CheckingLKPScreen"
            component={CheckingLKPScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="LKPParamScreen"
            component={LKPParamScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="DamageScreen"
            component={DamageScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="DamageParamsScreen"
            component={DamageParamsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="TechCheckScreen"
            component={TechCheckScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="ErrorMessageScreen"
            component={ErrorMessageScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="LocationScreen"
            component={LocationScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="SignatureScreen"
            component={SignatureScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="UnfilledFieldsScreen"
            component={UnfilledFieldsScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="RegionAndCityFilter"
            component={RegionAndCityFilter}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="NoSignalScreen"
            component={NoSignalScreen}
            options={{ gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <ModalSuccess
        setLoaderVisible={setLoaderVisible}
        dispatch={dispatch}
        modalFlag={modalVisible}
        refNav={navigationRef}
        changeModalFlag={setModalVisible}
      />
      {/*<ModalUnfilledFields*/}
      {/*  dispatch={dispatch}*/}
      {/*  modalFlag={modalVisibleNotOk}*/}
      {/*  refNav={navigationRef}*/}
      {/*  changeModalFlag={setModalVisibleNotOk}*/}
      {/*/>*/}
    </>
  );
};

export default App;
