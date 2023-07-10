import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from '../styles';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { icons } from '../../../сonstants';
import moment from 'moment/moment';
import { setOpenScreen, setReportId, setReportType } from '../../../redux/App/actions/mainActions';
import { globalFunctions, reports } from '../../../utils';
import { connect, useDispatch, useSelector } from 'react-redux';
import { clearTires } from '../../../redux/App/actions/tiresActions';
import {
  addToFavorites,
  deleteReport,
  removeFromFavorites,
  setReports,
} from '../../../redux/App/actions/reportsActions';
import { constants } from '../../../сonstants';
import { useNavigation } from '@react-navigation/core';
import RNFetchBlob from 'rn-fetch-blob';
import { AllReports } from '../../../requests';
const ReportCard = props => {
  let data = props.data;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [sectionsInfo, setSectionsInfo] = useState({});
  const [modalDelReportData, setModalDelReportData] = useState({});
  const [modalDelReportVisible, changeModalDelVisible] = useState(false);
  const token = useSelector(state => state.appGlobal.loginToken);

  function delReport(id) {
    AllReports.deleteReport(token, id)
      .then(() => {
        let reportName = `Отчёт №${id}`;
        let path = `${
          Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir
        }/DSSCommunity/${reportName}`;
        RNFetchBlob.fs
          .exists(path)
          .then(exists => {
            if (exists) {
              // exists call delete
              RNFetchBlob.fs.unlink(path).catch(err => {
                console.log('delete report unlink error', err);
              });
            }
          })
          .catch(err => {
            console.log('delete report exists error', err);
          });
        props.deleteReport(id);
      })
      .catch(err => {
        console.log('could not delete report ', err);
      });
  }
  const reportTap = item => {
    processSections(item);
    let newReduxScreenState = {
      TechnicalCharacteristics: 0,
      EquipmentScreen: 0,

      Equipment_overview: 0,
      Equipment_exterior: 0,
      Equipment_anti_theft_protection: 0,
      Equipment_multimedia: 0,
      Equipment_salon: 0,
      Equipment_comfort: 0,
      Equipment_safety: 0,
      Equipment_other: 0,

      DocumentsScreen: 0,
      MarkingsScreen: 0,
      CompletenessScreen: 0,
      TiresScreen: 0,
      FotoExteriorScreen: 0,
      FotoInteriorScreen: 0,
      CheckingLKPScreen: 0,
      DamageScreen: 0,

      Damage_right_side: 0,
      Damage_front_side: 0,
      Damage_left_side: 0,
      Damage_rear_side: 0,
      Damage_roof_side: 0,
      Damage_window_side: 0,
      Damage_rims_side: 0,
      Damage_interior_side: 0,

      TechCheckScreen: 0,

      TechCheck_engine_off: 0,
      TechCheck_engine_on: 0,
      TechCheck_test_drive: 0,
      TechCheck_elevator: 0,

      LocationScreen: 0,
      SignatureScreen: 0,
    };
    if (sectionsInfo[item.generalReportData.id]) {
      sectionsInfo[item.generalReportData.id].map(item => {
        let key = Object.keys(item)[0];
        newReduxScreenState[key] = item[key];
        if (key === 'EquipmentScreen' && item[key] !== 0) {
          [
            'Equipment_overview',
            'Equipment_exterior',
            'Equipment_anti_theft_protection',
            'Equipment_multimedia',
            'Equipment_salon',
            'Equipment_comfort',
            'Equipment_safety',
            'Equipment_other',
          ].map(item => {
            newReduxScreenState[item] = 1;
          });
        }
        if (key === 'DamageScreen' && item[key] !== 0) {
          [
            'Damage_right_side',
            'Damage_front_side',
            'Damage_left_side',
            'Damage_rear_side',
            'Damage_roof_side',
            'Damage_window_side',
            'Damage_rims_side',
            'Damage_interior_side',
          ].map(item => {
            newReduxScreenState[item] = 1;
          });
        }
        if (key === 'TechCheckScreen' && item[key] !== 0) {
          [
            'TechCheck_engine_off',
            'TechCheck_engine_on',
            'TechCheck_test_drive',
            'TechCheck_elevator',
          ].map(item => {
            newReduxScreenState[item] = 1;
          });
        }
      });
      dispatch(setReportType(item?.generalReportData.report_type_id));
      dispatch(setReportId(item.generalReportData.id));
      //console.log('#G5', newReduxScreenState);
      dispatch(setOpenScreen(newReduxScreenState));
      reports.startSection(sectionsInfo[item.generalReportData.id], dispatch, navigation);
    }
  };

  const processSections = item => {
    let sections = {};
    if (item.generalReportData.sections) {
      item.generalReportData.sections.map(itemSections => {
        if (typeof sections[item.generalReportData.id] === 'object') {
          sections[item.generalReportData.id].push({
            [constants.sectionOrderList[itemSections.section_name]]:
              itemSections.status === 'completed' ? 2 : itemSections.status === 'not_opened' ? 0 : 1,
            id: itemSections.id,
            name: itemSections.name,
            section_name: itemSections.section_name,
          });
        } else {
          sections[item.generalReportData.id] = [
            {
              [constants.sectionOrderList[itemSections.section_name]]:
                itemSections.status === 'completed' ? 2 : itemSections.status === 'not_opened' ? 0 : 1,
              id: itemSections.id,
              name: itemSections.name,
              section_name: itemSections.section_name,
            },
          ];
        }
      });
    }

    setSectionsInfo(sections);
  };

  const toggleFavorites = item => {
    console.log('toggle', item.generalReportData.is_favorite);
    if (item.generalReportData.is_favorite) {
      props.removeFromFavorites(item.generalReportData.id);
      AllReports.deleteFromFavorites(token, item.generalReportData.id).catch(err => {
        props.addToFavorites(item.generalReportData.id);
        console.log('error removeFromFavorites, report card', err);
      });
    } else {
      props.addToFavorites(item.generalReportData.id);
      AllReports.addToFavorites(token, item.generalReportData.id).catch(err => {
        props.removeFromFavorites(item.generalReportData.id);
        console.log('error addToFavorites, report card', err);
      });
    }

    // try {
    //   let newFavourites = [...favourites];
    //   if (favourites.includes(id)) {
    //     const res = await AllReports.deleteFromFavorites(token, id);
    //     const index = newFavourites.findIndex(e => e === id);
    //     newFavourites.splice(index, 1);
    //   } else {
    //     const res = await
    //     newFavourites.push(id);
    //   }
    //   setFavourites(newFavourites);
    // } catch (e) {
    //   console.log('addToFavoritesAsync err', e.response);
    // }
  };
  const carDataText = [
    [
      data.carData.brand,
      data.carData.model,
      data.carData.engine_volume !== '' ? data.carData.engine_volume + 'л.' : '',
      data.carData.gearbox_type,
    ]
      .filter(el => el !== '')
      .join(' '),
    data.carData.power !== '' ? data.carData.power + ' л.c' : '',
    data.carData.model_year !== '' ? `${data.carData.model_year} г.` : '',
    data.carData.engine_type !== '' ? data.carData.engine_type : '',
    data.carData.color !== '' ? data.carData.color : '',
    data.carData.mileage !== '' ? `${data.carData.mileage} км` : '',
  ]
    .filter(el => el !== '')
    .join(', ');

  const OpenURLButton = ({ item }) => {
    const handlePress = useCallback(async () => {
      let url = `https://autopodbor.gensol.ru/reports/actions/view/${item?.id}`;
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    }, []);
    return (
      <TouchableOpacity onPress={handlePress}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path
              d="M11.25 4.66667H8.25V0H3.75V4.66667H0.75L6 10.8889L11.25 4.66667ZM0 12.4444H12V14H0V12.4444Z"
              fill="#FF3B30"
            />
          </Svg>

          <Text style={{ marginLeft: 4, marginBottom: 2 }}>Скачать</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, marginVertical: 10 }} key={data?.id}>
      <TouchableOpacity key={data?.id} onPress={() => reportTap(data)}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={{ width: 480 }}>
            <FlatList
              //width={300 / 2}
              //height={100}
              style={{
                width: '100%',
                borderRadius: 5,
                //paddingHorizontal: 10,
              }}
              horizontal={true}
              data={data.photos}
              //scrollAnimationDuration={1000}
              renderItem={photoProps => {
                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 8,
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor: '#cccccc33',
                      width: 240,
                      height: 160,
                    }}
                    key={String(photoProps.index) + '$'}
                  >
                    {photoProps.item !== '' && (
                      <Image
                        source={{
                          uri: photoProps.item,
                        }}
                        style={{
                          borderRadius: 5,
                          width: '100%',
                          height: '100%',
                        }}
                        //resizeMethod="contain"
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListFooterComponent={<View style={styles.imageFooter} />}
              scrollEnabled={true}
              keyExtractor={(item, index) => {
                return String(index) + '$';
              }}
            />
          </View>
        </View>
        <View style={{ width: '100%', marginTop: 8 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {data.generalReportData.status === 'completed' ? (
              <OpenURLButton item={data} />
            ) : (
              <Text
                style={{
                  color: '#FF3B30',
                  backgroundColor: '#ff3b301a',
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 100,
                  marginBottom: 8,
                  fontSize: 12,
                  lineHeight: 20,
                  fontWeight: '700',
                }}
              >
                НЕЗАВЕРШЕННЫЙ
              </Text>
            )}
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                console.log('press delete');
                setModalDelReportData({
                  id: data.carData.id,
                  brand: data.carData.brand,
                  model: data.carData.model,
                  generation: data.carData.generation,
                  power: data.carData.power,
                });
                changeModalDelVisible(true);
              }}
            >
              <Svg
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: 0.5,
                }}
              >
                <Path
                  d="M6.00009 2.28108e-08C6.5313 -8.07259e-05 7.04334 0.214225 7.43569 0.600838C7.82804 0.987451 8.07234 1.51844 8.12064 2.08955H11.4195C11.5666 2.0896 11.7083 2.14994 11.8158 2.25837C11.9233 2.36679 11.9886 2.51523 11.9986 2.67369C12.0087 2.83215 11.9626 2.98881 11.8698 3.11201C11.7769 3.23522 11.6442 3.31578 11.4985 3.33743L11.4195 3.34328H10.9682L9.98724 12.5206C9.94356 12.928 9.76269 13.3038 9.47904 13.5766C9.1954 13.8494 8.82876 14.0001 8.4489 14H3.55128C3.17141 14.0001 2.80478 13.8494 2.52113 13.5766C2.23749 13.3038 2.05662 12.928 2.01293 12.5206L1.03124 3.34328H0.580654C0.440339 3.34328 0.304772 3.28842 0.199024 3.18885C0.0932768 3.08928 0.0245023 2.95175 0.00541941 2.80167L0 2.71642C5.91717e-06 2.56494 0.0508209 2.41858 0.143048 2.30442C0.235274 2.19025 0.362674 2.116 0.501685 2.0954L0.580654 2.08955H3.87954C3.92783 1.51844 4.17214 0.987451 4.56449 0.600838C4.95683 0.214225 5.46888 -8.07259e-05 6.00009 2.28108e-08ZM4.83878 5.22388C4.6491 5.22388 4.49039 5.35343 4.45787 5.52394L4.45168 5.58997V10.7094L4.45787 10.7746C4.49039 10.9451 4.6491 11.0746 4.83878 11.0746C5.02846 11.0746 5.18717 10.9451 5.21969 10.7746L5.22588 10.7085V5.59081L5.21969 5.52394C5.18717 5.35427 5.02846 5.22388 4.83878 5.22388ZM7.1614 5.22388C6.97172 5.22388 6.813 5.35343 6.78049 5.52394L6.77429 5.58997V10.7094L6.78049 10.7746C6.813 10.9451 6.97172 11.0746 7.1614 11.0746C7.35108 11.0746 7.50979 10.9451 7.5423 10.7746L7.5485 10.7085V5.59081L7.5423 5.52394C7.50979 5.35427 7.35108 5.22388 7.1614 5.22388ZM6.00009 1.25373C5.53169 1.25373 5.14072 1.61313 5.05169 2.08955H6.94849C6.85868 1.61313 6.46848 1.25373 6.00009 1.25373Z"
                  fill="url(#paint0_linear_6061_729)"
                />
                <Defs>
                  <LinearGradient
                    id="paint0_linear_6061_729"
                    x1="6"
                    y1="0"
                    x2="6"
                    y2="14"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop stop-color="#C8C8C8" />
                    <Stop offset="1" stop-color="#B6B6B6" />
                  </LinearGradient>
                </Defs>
              </Svg>

              <Text style={{ marginLeft: 4, color: '#858585' }}>Удалить</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {data?.userData?.profile_image !== '' ? (
                <Image
                  backgroundColor={'#C4C4C4'}
                  source={{ uri: data.userData.profile_image }}
                  style={{ width: 20, height: 20, marginRight: 6, borderRadius: 50 }}
                />
              ) : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 6,
                    borderRadius: 50,
                    backgroundColor: '#C4C4C4',
                  }}
                />
              )}

              <View>
                <Text style={{ fontSize: 12, color: '#000000' }}>
                  {data.userData.name} {data.userData.second_name}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image source={icons.star} style={{ width: 10, height: 10, marginRight: 2 }} />
                  <Text style={{ fontSize: 10, color: '#858585' }}>
                    {data.userData.rating}/5 ({data.userData.comments_count} отзывов)
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: '#858585' }}>{data.userData.role}</Text>
            </View>
          </View>
          <View
            style={{
              marginBottom: 4,
              marginTop: 6,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 14, color: '#333333', width: '90%' }}>{carDataText}</Text>
            <TouchableOpacity
              onPress={() => {
                //console.log('add to favs');
                toggleFavorites(data);
                //addToFavoritesAsync(item.id);
              }}
            >
              <Image
                source={data.generalReportData.is_favorite ? icons.filledHeart : icons.unfilledHeart}
                width="19"
                height="17"
              />
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 10, color: '#858585' }}>VIN: {data.carData.vin}</Text>
              <Text style={{ fontSize: 10, color: '#858585' }}>
                {/*TODO*/}
                {moment(data.generalReportData.created_at).format('DD/MM/YYYY HH:MM')}
                {'(' + data.generalReportData.report_type_name + ')'}
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: '#858585' }}>
              {/*{getLocation(item?.saved_fields?.find(item => item.field_id === 253)?.val)}*/}
              {data.carData.location_address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        statusBarTranslucent={true}
        transparent={true}
        visible={modalDelReportVisible}
        onRequestClose={() => {
          changeModalDelVisible(false);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => {
            changeModalDelVisible(false);
          }}
        >
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  {'Вы уверены, что хотите удалить отчет'}
                  {modalDelReportData.brand || modalDelReportData.power ? '\n"' : ''}
                  {modalDelReportData.brand ? `${modalDelReportData.brand}` : ''}
                  {modalDelReportData.model ? ` ${modalDelReportData.model}` : ''}
                  {modalDelReportData.generation ? ` ${modalDelReportData.generation}` : ''}
                  {modalDelReportData.power ? ` (${modalDelReportData.power} л.с.)` : ''}
                  {modalDelReportData.brand || modalDelReportData.power ? '"' : ''}
                  {'?'}
                </Text>
                <View style={styles.modalDelReportBtnInner}>
                  <TouchableOpacity style={styles.modalBtn} onPress={() => changeModalDelVisible(false)}>
                    <Text style={styles.modalBtnText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalBtnPrimary]}
                    onPress={() => {
                      changeModalDelVisible(false);
                      delReport(data.generalReportData.id);
                    }}
                  >
                    <Text style={[styles.modalBtnText, { color: 'white' }]}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const mapDispatchToProps = {
  clearTiresFunc: clearTires,
  setReportList: setReports,
  deleteReport: deleteReport,
  addToFavorites: addToFavorites,
  removeFromFavorites: removeFromFavorites,
};
export default connect(null, mapDispatchToProps)(ReportCard);
