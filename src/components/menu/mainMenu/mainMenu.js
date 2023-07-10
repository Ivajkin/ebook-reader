//#region react
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
//#endregion

//#region plagins
import { MaskedText } from 'react-native-mask-text';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/core';
import { setLoginToken } from '../../../redux/App/actions/authActions';
//#endregion

//#region components
import { auth, global } from '../../../requests';
import { setReportId, setMenuFlag } from '../../../redux/App/actions/mainActions';
import { AvatarIco, CreateIco, ExitIco, ListIco, ServicesIco, SettingIco } from '../../svg';
import { theme, COLORS, constants } from '../../../сonstants';
import { reports } from '../../../utils';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

const MainMenu = props => {
  //#region values
  const navigation = props.navigation;
  const currentScreen = useRoute().name;
  const token = useSelector(state => state.appGlobal.loginToken);
  const screenList = Object.values(constants.sectionOrderList);

  const userInfo = useSelector(state => state.appGlobal.userInfo);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const dispatch = useDispatch();
  //#endregion

  const exit = async () => {
    auth.logout(token);
    await AsyncStorage.removeItem('@shouldSendFiles');
    await AsyncStorage.removeItem('@shouldSendedReportData');
    await AsyncStorage.removeItem('@reportList');
    await AsyncStorage.removeItem('@reportFieldsGrouped');
    await AsyncStorage.removeItem('@tiresModels');
    await AsyncStorage.removeItem('@tiresBrands');
    await AsyncStorage.removeItem('@cars');
    AsyncStorage.removeItem('@token')
      .then(() => {
        dispatch(setLoginToken(null));
        navigation.navigate('MainScreen');
        //RNExitApp.exitApp();
      })
      .catch(err => {
        console.log('EXIT err', err);
        //RNExitApp.exitApp();
      });
  };

  function onMenuItemPress() {
    dispatch(setMenuFlag(false));
    reports.createReport(navigation, dispatch, token, reportType);
  }

  useEffect(() => {}, []);

  return (
    <View style={styles.allWrapper}>
      <View style={styles.container}>
        <View style={styles.ico}>
          <AvatarIco />
        </View>
        <TouchableOpacity
          onPress={function navigateToEditProfile() {
            dispatch(setMenuFlag(false));
            navigation.navigate('EditProfileScreen');
          }}
        >
          <View>
            <Text style={(theme.FONTS.body_SF_R_13, styles.text)}>{userInfo.name ?? 'Имя'}</Text>
            <MaskedText style={(theme.FONTS.body_SF_R_13, styles.text)} mask="+9 (999) 999-99-99999">
              {userInfo.phone ?? '+7 (777) 777-77-77'}
            </MaskedText>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: screenList.includes(currentScreen) ? COLORS.red : COLORS.primary },
        ]}
        onPress={() => onMenuItemPress()}
      >
        <View style={styles.ico}>
          <CreateIco color={screenList.includes(currentScreen) ? COLORS.primary : COLORS.red} />
        </View>
        <Text
          style={[
            theme.FONTS.body_SF_R_13,
            styles.text,
            { color: screenList.includes(currentScreen) ? COLORS.primary : COLORS.black },
          ]}
        >
          Добавить новый отчет
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: currentScreen === 'AllReportsScreen' ? COLORS.red : COLORS.primary },
        ]}
        onPress={() => {
          dispatch(setMenuFlag(false));
          navigation.navigate('AllReportsScreen');
        }}
      >
        <View style={styles.ico}>
          <ListIco color={currentScreen === 'AllReportsScreen' ? COLORS.primary : COLORS.red} />
        </View>
        <Text
          style={[
            theme.FONTS.body_SF_R_13,
            styles.text,
            { color: currentScreen === 'AllReportsScreen' ? COLORS.primary : COLORS.black },
          ]}
        >
          Список отчетов
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: currentScreen === 'SettingsScreen' ? COLORS.red : COLORS.primary },
        ]}
        onPress={() => {
          dispatch(setMenuFlag(false));
          navigation.navigate('SettingsScreen');
        }}
      >
        <View style={styles.ico}>
          <SettingIco color={currentScreen === 'SettingsScreen' ? COLORS.primary : COLORS.red} />
        </View>
        <Text
          style={[
            theme.FONTS.body_SF_R_13,
            styles.text,
            { color: currentScreen === 'SettingsScreen' ? COLORS.primary : COLORS.black },
          ]}
        >
          Настройки
        </Text>
      </TouchableOpacity>
      {/*<TouchableOpacity*/}
      {/*  style={[*/}
      {/*    styles.container,*/}
      {/*    { backgroundColor: currentScreen === 'services' ? COLORS.red : COLORS.primary },*/}
      {/*  ]}*/}
      {/*  //onPress={() => navigation.navigate('CheckingLKPScreen')}*/}
      {/*>*/}
      {/*  <View style={styles.ico}>*/}
      {/*    <ServicesIco color={currentScreen === 'services' ? COLORS.primary : COLORS.red} />*/}
      {/*  </View>*/}
      {/*  <Text*/}
      {/*    style={[*/}
      {/*      theme.FONTS.body_SF_R_13,*/}
      {/*      styles.text,*/}
      {/*      { color: currentScreen === 'services' ? COLORS.primary : COLORS.black },*/}
      {/*    ]}*/}
      {/*  >*/}
      {/*    Наши услуги*/}
      {/*  </Text>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity style={styles.container} onPress={exit}>
        <View style={styles.ico}>
          <ExitIco />
        </View>
        <Text style={(theme.FONTS.body_SF_R_13, styles.text)}>Выход</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainMenu;
