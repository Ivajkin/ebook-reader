import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Linking } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { AllReports } from '../../requests';
import { COLORS, icons, loader } from '../../сonstants';
import { ModalChoose } from '../modal';
import { styles } from './styles';
import { SafeAreaView } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { FlatList } from 'react-native';
import { RefreshControl } from 'react-native';
//import Carousel from 'react-native-reanimated-carousel';
import moment from 'moment';
import { useLazySearchCitiesQuery } from '../../services/regionsAndCities';

const userRoles = {
  individual: 'Частное лицо',
  recruitment_specialist: 'Специалист по подбору',
  dealer: 'Дилер',
  car_sale_specialist: 'Специалист по продаже авто',
  dss_group_specialist: 'Специалист DSS Group',
};

const transmissionTypes = new Map([
  ['Автоматическая', 'AT'],
  ['Механическая', 'MT'],
  ['Вариатор', 'CVT'],
  ['Робот', 'MTA'],
]);

const radioStyles = {
  borderWidth: 2,
  borderWidthActive: 7,
  borderColor: COLORS.lightGray,
  borderColorActive: COLORS.red,
  containerStyle: { width: '100%', paddingTop: 10, paddingBottom: 10 },
};

const radioSorts = [
  { id: 'upload_date', label: 'Дате размещения', value: 'upload_date', ...radioStyles },
  { id: 'price_up', label: 'Возрастанию цены', value: 'price_up', ...radioStyles },
  { id: 'price_down', label: 'Убыванию цены', value: 'price_down', ...radioStyles },
  { id: 'year_newest', label: 'Году: новое', value: 'year_newest', ...radioStyles },
  { id: 'year_oldest', label: 'Году: старое', value: 'year_oldest', ...radioStyles },
  { id: 'mileage', label: 'Пробегу', value: 'mileage', ...radioStyles },
];

const SearchResult = ({ route, navigation, citiesChosen, regionsChosen }) => {
  const token = useSelector(state => state.appGlobal.loginToken);
  const filter = route.params?.filter ?? {};
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('');
  const [images, setImages] = useState([]);

  const [favourites, setFavourites] = useState([]);

  const [searchCities] = useLazySearchCitiesQuery();
  async function addToFavoritesAsync(id) {
    try {
      const res = await AllReports.addToFavorites(token, id);
      let newFavourites = [...favourites];
      if (favourites.includes(id)) {
        const index = newFavourites.findIndex(e => e === id);
        newFavourites.splice(index, 1);
      } else {
        newFavourites.push(id);
      }
      setFavourites(newFavourites);
    } catch (e) {
      console.log(e);
    }
  }

  const getLocation = locRawData => {
    let location = '';
    if (locRawData !== undefined) {
      let locArray = JSON.parse(locRawData);
      if (locArray.length > 2) {
        location = locArray[2];
      }
    }
    return location;
  };
  const getData = async (startFlag = true) => {
    // console.log('GET DATA');
    const parse = str => {
      try {
        let city = JSON.parse(str)[2];
        return city;
      } catch {
        return null;
      }
    };
    const asyncFilter = async (arr, predicate) => {
      const results = await Promise.all(arr.map(predicate));

      return arr.filter((_v, index) => results[index]);
    };
    const filterCities = async res => {
      if (citiesChosen.length + regionsChosen.length !== 0) {
        const asyncRes = await asyncFilter(res, async report => {
          let cityStr = report.saved_fields?.find(item => item.field_id === 253)?.val;
          if (cityStr !== undefined) {
            let city = parse(cityStr);

            let searchResult = await searchCities(city);
            let foundCities = searchResult.data.response.items;
            let foundCityChosen = foundCities.find(foundCity => {
              let isRegionLike = !foundCity.hasOwnProperty('region');
              if (isRegionLike) {
                let foundRegionChosen = regionsChosen.find(regionChosen => {
                  return regionChosen.title === foundCity.title;
                });
                if (foundRegionChosen !== undefined) {
                  return true;
                }
              } else {
                //for normal regions
                let foundRegionChosen = regionsChosen.find(regionChosen => {
                  return regionChosen.title === foundCity.region;
                });
                return foundRegionChosen !== undefined;
              }
            });
            return foundCityChosen !== undefined;
          } else {
            return false;
          }
        });

        return asyncRes;
      } else {
        return res;
      }
    };
    setLoaderVisible(true);
    setIsRefreshing(true);
    try {
      let offset = 0;
      if (!startFlag) {
        offset = data.length;
      }
      // token, completed
      let cleanerFilterKeys = Object.keys(filter).filter(key => {
        if (key === 'engine_volume__high') {
          return !filter[key] === 9474;
        }
        if (key === 'engine_volume__low') {
          return !filter[key] === 1;
        }
        if (key === 'mileage__high') {
          return !filter[key] === 2000000;
        }
        if (key === 'mileage__low') {
          return !filter[key] === 1;
        }
        if (key === 'power__high') {
          return !filter[key] === 8943;
        }
        if (key === 'power__low') {
          return !filter[key] === 1;
        }
        //"engine_volume__low": 1, "mileage__high": 2000000, "mileage__low": 1, "power__high": 8943, "power__low": 1
        return !(filter[key] === '' || filter[key] === false);
      });

      let cleanerFilter = {};
      cleanerFilterKeys.forEach(key => {
        cleanerFilter[key] = filter[key];
      });
      console.log('Clean filter', cleanerFilter);

      const res = await AllReports.getReportList(token, null, offset, 0, cleanerFilter, sort);

      let newRes = [];

      newRes = res.data.data;
      // if (!startFlag) {
      //   newRes = [...data, ...res.data.data];
      // } else {
      //   newRes = res.data.data;
      // }
      //newRes = filterCities(newRes);
      //setData(filterCities(newRes));

      setData(newRes);

      //CITY FILTER
      // let filteredByCity = await filterCities(newRes);
      // setData(filteredByCity);
      // let newImages = newRes.map(el => {
      //   console.log(el.fields[14].meta_val);
      //   return [
      //     el?.saved_fields?.find(item => item.field_id === 121)?.uploaded_files[0]?.storage_path720p ||
      //       el?.fields[10].meta_val,
      //     el?.saved_fields?.find(item => item.field_id === 122)?.uploaded_files[0]?.storage_path720p ||
      //       el?.fields[11].meta_val,
      //     el?.saved_fields?.find(item => item.field_id === 123)?.uploaded_files[0]?.storage_path720p ||
      //       el?.fields[12].meta_val,
      //     el?.saved_fields?.find(item => item.field_id === 124)?.uploaded_files[0]?.storage_path720p ||
      //       el.fields[13].meta_val,
      //     el?.saved_fields?.find(item => item.field_id === 125)?.uploaded_files[0]?.storage_path720p ||
      //       el.fields[14].meta_val,
      //   ];
      // });
      // setImages(newImages);

      console.log('#K', newRes)
    } catch (e) {
      console.log(e);
    }
    setIsRefreshing(false);
    setLoaderVisible(false);
  };
  const getVolume = item => {
    // item?.saved_fields?.find(item => item.field_id === 14)?.val &&
    //                       `, ${item?.saved_fields?.find(item => item.field_id === 14)?.val} см³`

    let field = item?.saved_fields?.find(el => el.field_id === 14);
    if (field !== undefined) {
      return (parseFloat(field.val) / 1000).toFixed(1);
    }
    return '';
  };

  const getTransmissionType = item => {
    let field = item?.saved_fields?.find(el => {
      return el.field.column_name === 'gearbox_type';
    });
    if (field !== undefined) {
      return transmissionTypes.get(field.sub_field?.value);
    }
    return '';
  };

  const getPower = item => {
    let field = item?.saved_fields?.find(el => {
      return el.field.column_name === 'power';
    });
    if (field !== undefined) {
      return ', ' + field.val + 'л.с.';
    } else {
      return '';
    }
  };
  useEffect(() => {
    getData();
  }, [sort]);

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      <View style={styles.headerBrandWrapper}>
        <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.headerBrandBackImage} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: '400',
            fontSize: 17,
            lineHeight: 28,
            color: '#333333',
            paddingLeft: 20,
            paddingRight: 30,
          }}
          numberOfLines={1}
        >
          {filter?.car_brand_id?.forInput?.length
            ? filter?.car_brand_id?.forInput?.map((item, index) => {
                if (index >= filter.car_brand_id.forInput.length - 1) {
                  return item;
                } else {
                  return `${item}, `;
                }
              })
            : 'Поиск'}
        </Text>
        <View></View>
      </View>
      {data.length && !loaderVisible ? (
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{
              fontWeight: '300',
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            Найдено {data.length} отчетов
          </Text>
          <TouchableOpacity onPress={() => setSortOpen(true)}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <Text style={{ color: '#FF3B30' }}>
                {sort?.forInput?.length ? `По ${sort?.forInput[0]?.toLowerCase()}` : `Сортировать`}
              </Text>
              <Image
                source={icons.arrowDownOrange}
                style={{
                  marginTop: 1,
                  marginLeft: 5,
                  width: 10,
                  height: 4.5,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {!loaderVisible ? (
            <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18, color: '#333333' }}>
              Ничего не найдено
            </Text>
          ) : null}
        </>
      )}
      {/* <AnimatedLoader
        visible={loaderVisible}
        overlayColor={COLORS.whiteTransparent}
        source={loader}
        animationStyle={styles.lottie}
        speed={1}
        loop={true}
      /> */}
      {loaderVisible && !data.length ? (
        <View style={styles.loadingContainer}>
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={COLORS.whiteTransparent}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
          <Text style={styles.loadingText}>Загрузка результатов поиска</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => getData()}
              tintColor={COLORS.red}
              colors={[COLORS.red]}
            />
          }
          onEndReached={() => getData(false)}
          onEndReachedThreshold={0.3}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1, marginVertical: 10 }} key={item.id}>
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    await Linking.openURL(item.view_link);
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ width: '100%' }}>
                      <FlatList
                        //width={300 / 2}
                        //height={100}
                        style={{
                          width: '100%',
                          borderRadius: 5,
                          //paddingHorizontal: 10,
                        }}
                        horizontal={true}
                        data={images[index]}
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
                            </TouchableOpacity>
                          );
                        }}
                        ListFooterComponent={
                          <View style={{ flex: 1 }}>
                            <TouchableOpacity
                              style={styles.callView}
                              key={index}
                              onPress={() => {
                                Linking.openURL(`tel:${item.user?.phone}`);
                              }}
                            >
                              <Image source={icons.phone} style={styles.callIcon} />
                              <Text style={styles.callText}>Позвонить</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        keyExtractor={(el, index) => index}
                        scrollEnabled={true}
                      />
                    </View>
                  </View>
                  <View style={{ width: '99%', marginTop: 6 }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          backgroundColor={'#C4C4C4'}
                          source={{ uri: item.user.profile_image }}
                          style={{ width: 20, height: 20, marginRight: 6, borderRadius: 50 }}
                        />
                        <View>
                          <Text style={{ fontSize: 12, color: '#000000' }}>
                            {item.user.name} {item.user.second_name}
                          </Text>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Image
                              source={icons.star}
                              style={{ width: 10, height: 10, marginRight: 2 }}
                            />
                            <Text style={{ fontSize: 10, color: '#858585' }}>
                              {item.user.rating}/5 ({item.user.comments_count} отзывов)
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: '#858585' }}>
                          {userRoles[item.user.roles[0]?.name]}
                        </Text>
                      </View>
                    </View>
                    {item?.saved_fields?.find(item => item.field_id === 256)?.val &&
                    item?.saved_fields?.find(item => item.field_id === 258)?.val ? (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            backgroundColor: '#2FCF2C',
                            paddingTop: 4,
                            paddingBottom: 4,
                            paddingLeft: 10,
                            paddingRight: 10,
                            borderRadius: 100,
                            marginBottom: 8,
                            fontSize: 12,
                            lineHeight: 20,
                            fontWeight: '700',
                          }}
                        >
                          В ПРОДАЖЕ
                        </Text>

                        <Text style={{ fontWeight: '700', fontSize: 13 }}>
                          {item?.saved_fields?.find(item => item.field_id === 258).val}
                        </Text>
                      </View>
                    ) : null}
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
                      <Text style={{ fontSize: 14, color: '#333333', width: '90%' }}>
                        {item?.saved_fields?.find(item => item.field_id === 6)?.car_brand?.value}{' '}
                        {item?.saved_fields?.find(item => item.field_id === 7)?.car_model?.value}
                        {getVolume(item) + getTransmissionType(item)}
                        {getPower(item)}
                        {/* {item?.saved_fields?.find(item => item.field_id === 14)?.val &&
                          `, ${item?.saved_fields?.find(item => item.field_id === 14)?.val} см³`}{' '} */}
                        {item?.saved_fields?.find(item => item.field_id === 8)?.val &&
                          `, ${item?.saved_fields?.find(item => item.field_id === 8)?.val} г.`}{' '}
                        {item?.saved_fields?.find(item => item.field_id === 11)?.sub_field?.value &&
                          `, ${
                            item?.saved_fields?.find(item => item.field_id === 11)?.sub_field?.value
                          }`}{' '}
                        {item?.saved_fields?.find(item => item.field_id === 16)?.sub_field?.value &&
                          `, ${
                            item?.saved_fields?.find(item => item.field_id === 16)?.sub_field?.value
                          }`}{' '}
                        {item?.saved_fields?.find(item => item.field_id === 17)?.val &&
                          `, ${item?.saved_fields?.find(item => item.field_id === 17)?.val} км`}{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          addToFavoritesAsync(item.id);
                        }}
                      >
                        <Image
                          source={
                            item.is_favorite || favourites.includes(item.id)
                              ? icons.filledHeart
                              : icons.unfilledHeart
                          }
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
                        <Text style={{ fontSize: 10, color: '#858585' }}>
                          VIN: {item?.saved_fields?.find(item => item.field_id === 1)?.val}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#858585' }}>
                          {item?.saved_fields?.find(item => item.field_id === 254)?.val &&
                            moment(item?.saved_fields?.find(item => item.field_id === 254)?.val).format(
                              'DD/MM/YYYY HH:MM'
                            )}{' '}
                          ({item.report_type.name})
                        </Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#858585' }}>
                        {getLocation(item?.saved_fields?.find(item => item.field_id === 253)?.val)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={el => el.id}
        />
      )}


      <ModalChoose
        title={'Сортировать по'}
        isOpen={sortOpen}
        closeModal={setSortOpen}
        setValue={setSort}
        data={radioSorts}
        type={'radiobuttonOneButton'}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    citiesChosen: state.regions.citiesChosen,
    regionsChosen: state.regions.regionsChosen,
  };
};

export default connect(mapStateToProps, null)(SearchResult);
