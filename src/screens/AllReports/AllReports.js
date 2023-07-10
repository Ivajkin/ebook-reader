//#region react
import React, { useEffect, useState, useCallback } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
//#endregion --------

//#region plagins
import * as Progress from 'react-native-progress';
import { useSelector, useDispatch, connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import AnimatedLoader from 'react-native-animated-loader';
import { useIsFocused } from '@react-navigation/core';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
//#endregion --------

//#region components
import { HeaderBar, Tabs, MainMenu } from '../../components/menu';
import { icons, theme, COLORS, loader, constants } from '../../сonstants';
import { globalFunctions, reports } from '../../utils';
import { setOpenScreen, setReportId, setReportType } from '../../redux/App/actions/mainActions';
//#endregion --------

//#region styles
import { styles } from './styles';
import { ModalError } from '../../components/modal';

import { AllReports } from '../../requests';
import Filter from '../../components/filter/Filter';
import { useNetInfo } from '@react-native-community/netinfo';

import { clearTires } from '../../redux/App/actions/tiresActions';
import { setReports } from '../../redux/App/actions/reportsActions';
import ReportCard from './ReportCard/ReportCard';

//#endregion --------

const transmissionTypes = new Map([
  ['Автоматическая', 'AT'],
  ['Механическая', 'MT'],
  ['Вариатор', 'CVT'],
  ['Робот', 'MTA'],
]);

const userRoles = {
  individual: 'Частное лицо',
  recruitment_specialist: 'Специалист по подбору',
  dealer: 'Дилер',
  car_sale_specialist: 'Специалист по продаже авто',
  dss_group_specialist: 'Специалист DSS Group',
};

const AllReportsScreen = ({ route, navigation, clearTiresFunc, setReportList, reportsList }) => {
  //#region valuevles
  const userId = route.params?.userId ?? null;
  const netInfo = useNetInfo();

  const [linkID, setLinkID] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const isFocused = useIsFocused();

  const token = useSelector(state => state.appGlobal.loginToken);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const dispatch = useDispatch();

  const [sectionsInfo, setSectionsInfo] = useState({});
  const [modalExistFileVisible, changeModalExistFileVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [modalErrorFlag, changeModalErrorFlag] = useState(false);
  const [modalErrorMesage, changeModalErrorMesage] = useState('');

  const [needToUpdate, setNeedToUpdate] = useState(false);

  //#endregion --------

  const parseReportData = result => {
    let reportsData = result.map(report => {
      //parsing car data
      let reportData = {
        carData: {
          brand: report?.saved_fields?.find(item => item.field_id === 6)?.car_brand?.value ?? '',
          model: report?.saved_fields?.find(item => item.field_id === 7)?.car_model?.value ?? '',
        },
        userData: {
          role: userRoles[report.user.roles[0]?.name],
        },
        generalReportData: {
          report_type_name: report?.report_type?.name ?? '',
        },
        photos: [],
      };
      let carFieldsNames = [
        'location_address',
        'generation',
        'model_year',
        'engine_type',
        'drive_unit',
        'gearbox_type',
        'engine_volume',
        'power',
        'color',
        'mileage',
        'vin',
      ];
      carFieldsNames.forEach(field_name => {
        let field = report?.saved_fields.find(item => item?.field?.column_name === field_name);

        reportData.carData[field_name] = field?.val ?? field?.sub_field?.value ?? '';
        if (field_name === 'gearbox_type') {
          //console.log('#rf', field.sub_field?.value);
          reportData.carData[field_name] = transmissionTypes.get(field?.sub_field?.value) ?? '';
        }
      });
      if (reportData.carData.engine_volume !== '') {
        let volume = parseFloat(reportData.carData.engine_volume);
        if (!isNaN(volume)) {
          reportData.carData.engine_volume = volume.toFixed(1);
        }
      }

      if (reportData.carData.location_address !== '') {
        let locArray = JSON.parse(reportData.carData.location_address);
        //console.log('#ll1', locArray);
        if (locArray.length === 3) {
          reportData.carData.location_address = locArray[2];
        }
      }

      //parsing user data
      let userFieldsNames = ['name', 'second_name', 'profile_image', 'rating', 'comments_count'];
      userFieldsNames.forEach(field_name => {
        reportData.userData[field_name] = report.user[field_name] ?? '';
      });

      //console.log('#JJD', report?.exterior_photos_data[0] );
      reportData.photos = report?.exterior_photos_data?.map(el => {
        if (el?.uploaded_files?.length > 0) {
          return el?.uploaded_files[0]?.storage_path;
        } else {
          return el?.meta_val;
        }
      });
      //console.log('#JJD', reportData.photos );
      let generalReportDataFieldsNames = [
        'id',
        'report_type_id',
        'created_at',
        'sections',
        'status',
        'is_favorite',
      ];
      generalReportDataFieldsNames.forEach(field_name => {
        reportData.generalReportData[field_name] = report[field_name] ?? '';
      });
      return reportData;
    });

    return reportsData;
  };

  useEffect(() => {
    if (netInfo?.isConnected === true && needToUpdate) {
      getReportList().catch(err => {
        'failed to uodate, netinfo change';
      });
    }
  }, [netInfo?.isConnected]);
  async function getReportList(startFlag = true) {
    console.log('mlw', netInfo);
    setLoaderVisible(true);
    setIsRefreshing(true);
    let filterStatus = null;
    let offset = 0;
    if (!startFlag) {
      offset = reportsList.length;
    }
    if (!netInfo?.isConnected) {
      console.log('no connection getReportsList');
      setNeedToUpdate(true);
      setLoaderVisible(false);
    } else {
      globalFunctions.getReportListData(
        token,
        filterStatus,
        offset,
        navigation,
        setLoaderVisible,
        dispatch,
        userId,
        result => {
          console.log('O3');
          setLoaderVisible(false);
          if (result) {
            let reportsData = parseReportData(result);
            setReportList(reportsData);
          }
        }
      );
    }
    //console.log('O2');
    //setLoaderVisible(false);
    setIsRefreshing(false);
  }

  useEffect(() => {
    console.log('IS FOCUSED', isFocused);
  }, [isFocused]);

  async function listDownloadedReports() {
    // let path = `${
    //   Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir
    // }/DSSCommunity/`;
    // let corrcetPath = await RNFetchBlob.fs.exists(path);
    // let res = [];
    // if (corrcetPath) {
    //   res = await RNFetchBlob.fs.ls(path);
    // }
    // let resArr = [];
    // res.map(item => {
    //   let id = parseInt(item.replace(/^\D+/g, ''));
    //   if (typeof id === 'number') {
    //     resArr.push(id);
    //   }
    // });
    // return resArr;
  }

  function fileDownloadNotification(infoTitel = '', infoMessage = '') {
    PushNotification.localNotification({
      channelId: 'dsscommunity-1', // (required) channelId, if the channel doesn't exist, notification will not trigger.
      title: infoTitel, // (optional)
      message: infoMessage, // (required)
    });
  }
  useEffect(() => {
    console.log('here');
    if (isFocused && userId !== null && userId) {
      getReportList().catch(error => {
        console.log('failed to get report list', error);
      });
    }
  }, [userId]); //[isFocused, userId]);

  useEffect(() => {
    PushNotification.createChannel({
      channelId: 'dsscommunity-1', // (required)
      channelName: 'DssCommunityChannel', // (required)
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {},

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }, []);

  return (
    <>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title={'Отчеты'}
          menu={<MainMenu navigation={navigation} />}
          tabs={
            <Tabs
              showDivider={false}
              active={linkID}
              titles={
                !netInfo?.isConnected || netInfo?.isConnected === null
                  ? ['Мои отчеты', 'Не завершенные', 'Избранные']
                  : ['Все', 'Мои отчеты', 'Не завершенные', 'Избранные']
              }
              links={setLinkID}
            />
          }
          goBackFlag={true}
          menuFlag={true}
          nav={navigation}
          route={route}
        >
          {loaderVisible && linkID !== 0 && (
            <AnimatedLoader
              visible={true}
              //overlayColor={!reportsList ? COLORS.none : COLORS.whiteTransparent}
              overlayColor={COLORS.whiteTransparent}
              source={loader}
              animationStyle={styles.lottie}
              speed={1}
              loop={true}
            />
          )}
          <View style={styles.cardAdd}>
            {netInfo?.isConnected ? (
              <TouchableOpacity
                onPress={async () => {
                  clearTiresFunc();
                  await reports.createReport(navigation, dispatch, token, reportType, setLoaderVisible);
                }}
              >
                <Image style={{ width: 50, height: 50 }} source={icons.add} />
              </TouchableOpacity>
            ) : null}
          </View>
          {!reportsList ? (
            <></>
          ) : (
            <View style={styles.container}>
              {linkID === 0 && netInfo?.isConnected ? (
                <Filter route={route} navigation={navigation} />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  data={reportsList.filter(report => {
                    if (
                      linkID === 1 ||
                      (linkID === 2 && report.generalReportData.status === 'not_completed') ||
                      (linkID === 3 && report.generalReportData.is_favorite)
                    ) {
                      return true;
                    }
                    return false;
                  })}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={() => getReportList()}
                      tintColor={COLORS.red}
                      colors={[COLORS.red]}
                    />
                  }
                  keyExtractor={item => {
                    return String(item.generalReportData.id);
                  }}
                  //onEndReached={() => getReportList(false)}
                  onEndReachedThreshold={0.3}
                  renderItem={({ item, index }) => {
                    return <ReportCard data={item} />;
                  }}
                  //ListHeaderComponent={
                  // <View style={styles.cardAdd}>
                  //   {netInfo?.isConnected ? (
                  //     <TouchableOpacity
                  //       onPress={async () => {
                  //         clearTiresFunc();
                  //         await reports.createReport(
                  //           navigation,
                  //           dispatch,
                  //           token,
                  //           reportType,
                  //           setLoaderVisible
                  //         );
                  //       }}
                  //     >
                  //       <Image style={{ width: 50, height: 50 }} source={icons.add} />
                  //     </TouchableOpacity>
                  //   ) : null}
                  // </View>
                  //>}
                />
              )}
            </View>
          )}
        </HeaderBar>
      </SafeAreaView>

      <Modal
        statusBarTranslucent={true}
        transparent={true}
        visible={modalExistFileVisible}
        onRequestClose={() => {
          changeModalExistFileVisible(false);
        }}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{'Отчет уже был скачан на ваше устройство'}</Text>
            <View style={styles.modalExistFileBtnInner}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  changeModalExistFileVisible(false);
                }}
              >
                <Text style={styles.modalBtnText}>Ясно</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalError
        modalFlag={modalErrorFlag}
        changeModalFlag={changeModalErrorFlag}
        message={modalErrorMesage}
      />
    </>
  );
};

const mapDispatchToProps = {
  clearTiresFunc: clearTires,
  setReportList: setReports,
};

const mapStateToProps = state => {
  return {
    reportsList: state.reports.reports,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllReportsScreen);
