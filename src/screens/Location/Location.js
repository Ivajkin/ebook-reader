//#region import libres

//#region react components
import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  PermissionsAndroid,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
//#endregion

//#region actions
import { setOpenScreen } from '../../redux/App/actions/mainActions';
//#endregion

//#region images

//#endregion

//#region plagins
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import DatePicker from 'react-native-date-picker';
const moment = require('moment-timezone');
moment().tz('Europe/Moscow').format();
import LottieView from 'lottie-react-native';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { COLORS, theme, constants, loader, images, icons } from '../../сonstants';
import { global } from '../../requests';
import { globalFunctions } from '../../utils';
import { useNetInfo } from '@react-native-community/netinfo';

//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const LocationScreen = ({ route, navigation }) => {
  const netInfo = useNetInfo();
  const geoKey = constants.googleApiKey;
  Geocoder.init(geoKey);
  //#region valuebles
  const sectionList = useSelector(state => state.appGlobal.sectionList);
  const section = sectionList.location;
  const reportId = useSelector(state => state.appGlobal.reportId);
  const reportTypeId = useSelector(state => state.appGlobal.reportType);
  const token = useSelector(state => state.appGlobal.loginToken);
  const [locationFields, setLocationFields] = useState(null);
  const [geoDate, setGeoDate] = useState({ latitude: 55.75419548611994, longitude: 37.619542886800474 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalDate, setModaleDate] = useState(false);
  const addressRef = useRef();
  const dispatch = useDispatch();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [marginBottom, setMarginBottom] = useState(0);
  const [mapType, setMapType] = useState('standard');

  if (addressRef?.current) {
    // console.log(addressRef?.current);
  }

  const openScreen = useSelector(state => state.appGlobal.openScreen);

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'location',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'location',
    'back'
  );
  //#endregion valuebles

  //#region functions

  const hasPermissionIOS = async () => {
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'disabled') {
      Alert.alert('Разрешите доступ к местоположению для определения Вашего текущего положения.', '', [
        { text: 'Ок' },
      ]);
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    }

    return false;
  };

  function next() {
    let textFromAddress = addressRef.current?.getAddressText();
    if (currentDate && textFromAddress) {
      console.log('jrnrf');
      globalFunctions.globalSendDataAndGoNext(
        token,
        reportId,
        setLoaderVisible,
        () =>
          sendData(
            textFromAddress,
            moment(currentDate).format('MM/DD/YYYY').toString(),
            locationFields,
            reportId,
            section
          ),
        'LocationScreen',
        navigation,
        dispatch,
        sectionList,
        constants,
        'location'
      );
    } else {
      console.log('njn');
      globalFunctions.navigateToAvailabaleSection(
        navigation,
        dispatch,
        sectionList,
        constants.sectionOrderList,
        'location',
        token,
        reportId,
        setLoaderVisible
      );
    }
  }

  async function sendData(address, date, fields, reportId, section) {
    if (!netInfo?.isConnected) {
      const result = new Promise(function (resolve, reject) {
        resolve(true);
      });
      return result;
    } else {
      address
        ? dispatch(setOpenScreen('LocationScreen', 2))
        : dispatch(setOpenScreen('LocationScreen', 1));

      let localData = {
        report_id: reportId,
        fields: [],
      };

      fields.map((item, index) => {
        if (item.column_name === 'location_address') {
          localData.fields.push({
            id: item.id,

            val: JSON.stringify([geoDate.longitude, geoDate.latitude, address]),
          });
        }
        if (item.column_name === 'location_date') {
          localData.fields.push({
            id: item.id,
            val: date.toString(),
          });
        }
      });
      console.log(localData);
      let result = await global.sendReportData(localData, token);
      return result;
    }
  }

  function getFields() {
    setLoaderVisible(true);
    global
      .getFields(reportTypeId, section.id, token)
      .then(res => {
        if (res) {
          if (res.data.data.length > 0) {
            let temporary = [];
            res.data.data.map((item, index) => {
              temporary.push({
                id: item.id,
                name: item.name,
                column_name: item.column_name,
                required: item.required,
              });
            });
            setLoaderVisible(false);
            setLocationFields(temporary);
          }
          setLoaderVisible(false);
        }
      })
      .catch(err => {
        console.log('get fields error in location', err);
        // globalFunctions.catchGetFieldsErrorNavMain(setLoaderVisible, navigation);
        setLoaderVisible(false);
      });
  }

  const onMapReady = () => setMarginBottom(0);

  const switchMapType = () => {
    mapType === 'satellite' ? setMapType('standard') : setMapType('satellite');
  };

  async function getMyCurrentAdress() {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      try {
        Geolocation.getCurrentPosition(
          position => {
            //console.log('#V1', position);
            global
              .getAddreess(position.coords.latitude, position.coords.longitude)
              .then(res => {
                console.log('#V2', res);
                // addressRef.current?.setAddressText(res.data.results[0].formatted_address);
                // setGeoDate({ latitude: position.coords.latitude, longitude: position.coords.longitude });
              })
              .catch(err => {
                console.log('getAddress err, Location', err);
                Alert.alert('Ошибка', 'Не удалось определить текущее местоположение', [{ text: 'Ок' }]);
              });
          },
          err => {
            console.log('getCurrentPosition err, Location', err);
            Alert.alert('Ошибка', 'Не удалось определить текущее местоположение', [{ text: 'Ок' }]);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
            showLocationDialog: true,
            forceRequestLocation: true,
          }
        );
      } catch (err) {
        console.log('errr', err);
        Alert.alert('Ошибка', 'Не удалось определить текущее местоположение', [{ text: 'Ок' }]);
      }
    }
  }

  function formSavedData(data) {
    try {
      let temporary = [];
      data.map((item, index) => {
        if (item.column_name === 'location_address') {
          if (item.saved_fields.length > 0) {
            let tempGeoData = JSON.parse(item.saved_fields[0].val);
            setGeoDate({ latitude: tempGeoData[1], longitude: tempGeoData[0] });
            addressRef.current?.setAddressText(tempGeoData[2]);
          }
        } else if (item.column_name === 'location_date') {
          if (item.saved_fields.length > 0) {
            setCurrentDate(new Date(item.saved_fields[0].val));
          }
        }
        temporary.push({
          id: item.id,
          name: item.name,
          type: item.type,
          column_name: item.column_name,
          required: item.required,
        });
      });
      setLoaderVisible(false);
      setLocationFields(temporary);
    } catch (err) {
      setLoaderVisible(false);
      console.log('format err', err);
    }
  }

  //#endregion functions

  useEffect(() => {
    if (netInfo?.isConnected !== null && netInfo?.isConnected && route.name === 'LocationScreen') {
      if (openScreen.LocationScreen === 0) {
        Geocoder.init(geoKey, {
          language: 'RU',
        });
        getMyCurrentAdress();
        getFields();
        dispatch(setOpenScreen('LocationScreen', 1));
      } else {
        setLoaderVisible(true);
        globalFunctions.globalGetSavedData(
          token,
          reportId,
          section.id,
          null,
          formSavedData,
          setLoaderVisible
        );
      }
    }
    setLoaderVisible(false);
  }, [netInfo]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <HeaderBar
        title={'Местоположение'}
        menu={
          <ProgressMenu
            nav={navigation}
            validateFunc={() => {
              addressRef.current?.getAddressText() !== ''
                ? dispatch(setOpenScreen('LocationScreen', 2))
                : '';
            }}
            formDataFunction={() =>
              sendData(
                addressRef.current?.getAddressText(),
                moment(currentDate).format('MM/DD/YYYY').toString(),
                locationFields,
                reportId,
                section
              )
            }
            setLoaderVisible={setLoaderVisible}
          />
        }
        goBackFlag={false}
        menuFlag={true}
        nav={navigation}
        route={route}
        screenBack={'AllReportsScreen'}
        backFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () =>
              sendData(
                addressRef.current?.getAddressText(),
                moment(currentDate).format('MM/DD/YYYY').toString(),
                locationFields,
                reportId,
                section
              ),
            backSection.toScetion,
            navigation,
            dispatch
          )
        }
        nextButton={false} //{goToUnfilled ? false : nextSection.check}
        backButton={backSection.check}
        nextFunc={() =>
          globalFunctions.sendSection(
            setLoaderVisible,
            () =>
              sendData(
                addressRef.current?.getAddressText(),
                moment(currentDate).format('MM/DD/YYYY').toString(),
                locationFields,
                reportId,
                section
              ),
            nextSection.toScetion,
            navigation,
            dispatch
          )
        }
      >
        <View style={styles.container}>
          {loaderVisible ? (
            <View
              style={[
                styles.lottieWrapper,
                { backgroundColor: !locationFields ? COLORS.none : COLORS.whiteTransparent },
              ]}
            >
              <LottieView source={loader} style={styles.lottie} autoPlay loop />
            </View>
          ) : (
            <></>
          )}
          {/* <AnimatedLoader
						visible={loaderVisible}
						overlayColor={!locationFields ? COLORS.none : COLORS.whiteTransparent}
						source={loader}
						animationStyle={styles.lottie}
						speed={1}
						loop={true}
					/> */}
          <View style={styles.fieldsWrapper}>
            <GooglePlacesAutocomplete
              ref={addressRef}
              styles={{
                textInput: {
                  height: 50,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E5E5EA',
                  color: '#858585',
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: '#858585',
                },
              }}
              placeholder="Москва"
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                Geocoder.from(data.description)
                  .then(json => {
                    var location = json.results[0].geometry.location;
                    setGeoDate({ latitude: location.lat, longitude: location.lng });
                  })
                  .catch(error => console.log('geocoder err, Location', error));
              }}
              onFail={e => {
                console.log('geocoder fail', e);
              }}
              query={{
                key: geoKey,
                language: 'ru',
              }}
            />

            <TouchableOpacity
              style={[styles.inputInner, { borderColor: COLORS.gray }]}
              onPress={() => setModaleDate(!modalDate)}
            >
              <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>Дата осмотра</Text>
              <Text style={[theme.FONTS.body_SF_R_15, styles.input, { paddingTop: 18 }]}>
                {moment(currentDate).format('DD.MM.YYYY').toString()}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              mode={'date'}
              open={modalDate}
              date={currentDate}
              onConfirm={date => {
                setModaleDate(false);
                setCurrentDate(date);
              }}
              onCancel={() => {
                setModaleDate(false);
              }}
            />
          </View>

          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            zoomEnabled={true}
            showsScale={true}
            zoomControlEnabled={true}
            mapType={mapType}
            region={{
              latitude: geoDate.latitude,
              longitude: geoDate.longitude,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            }}
            style={[styles.mapStyle, { marginBottom: marginBottom }]}
            onMapReady={onMapReady}
            mapPadding={styles.mapInside}
          >
            <Marker
              coordinate={{
                latitude: geoDate.latitude,
                longitude: geoDate.longitude,
              }}
            />
          </MapView>
          <TouchableOpacity onPress={switchMapType} style={styles.mapTypeIconWrap}>
            <Image source={images.mapType} style={styles.mapTypeIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={getMyCurrentAdress} style={styles.mapTypeCurrPos}>
            <Image source={icons.myLocation} style={styles.mapPosIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nextButtonWrapper} onPress={() => next()}>
          <Text style={styles.nextBtn}>Далее</Text>
        </TouchableOpacity>
      </HeaderBar>
    </SafeAreaView>
  );
};

export default LocationScreen;
