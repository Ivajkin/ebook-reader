import React, { useState, useEffect } from 'react';
import styles from './styles';
import { View, Text, TouchableOpacity, Image, SectionList, Platform } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { icons, loader, COLORS, SIZES } from '../../сonstants';
import SearchPanel from './SearchPanel';
import RegionAndCityItem from './RegionAndCityItem';
import {
  useLazyGetCitiesByRegionQuery,
  useLazySearchCitiesQuery,
} from '../../services/regionsAndCities';
import { connect } from 'react-redux';
import {
  addCityToRegionsShown,
  addRegionToRegionsShown,
  clearChosen,
  clearRegionsShown,
  setRegionCities,
  setRegionCollapsed,
  setRegionsShownToNoSearchMode,
} from '../../redux/App/actions/regionAndCityActions';

const RegionAndCityFilter = ({
  route,
  navigation,
  regions,
  regionsShown,
  setCities,
  setCollapsed,
  clearAll,
  addCityItemToRegionsShown,
  addRegionItemToRegionsShown,
  clearShown,
  setRegionsShownToNoSearch,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const [searchCities] = useLazySearchCitiesQuery();

  const onChangeText = async text => {
    if (text === '') {
      setRegionsShownToNoSearch();
    } else {
      let data = await searchCities(text);
      clearShown();
      addRegionItemToRegionsShown(text);
      data.data.response?.items?.forEach(el => {
        addCityItemToRegionsShown(el);
      });
    }
  };
  useEffect(() => onChangeText(''), []);
  return (
    <View styles={styles.container}>
      <View style={styles.headerBrandWrapper}>
        <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => navigation.goBack()}>
          <Image source={icons.backImg} style={styles.headerBrandBackImage} />
        </TouchableOpacity>
        <Text style={{ fontWeight: '400', fontSize: 17, lineHeight: 28, color: '#333333' }}>
          Город и регион
        </Text>
        <TouchableOpacity
          style={styles.headerImageWrapper}
          onPress={() => {
            clearAll();
            //setFormData({ ...defaultFormData });
          }}
        >
          <Text style={{ fontWeight: '400', fontSize: 14, lineHeight: 20, color: '#FF3B30' }}>
            Сбросить
          </Text>
        </TouchableOpacity>
      </View>
      <SectionList
        style={styles.sectionList}
        stickySectionHeadersEnabled={false}
        sections={regionsShown}
        ListHeaderComponent={<SearchPanel onChangeText={onChangeText} />}
        ListFooterComponent={<View style={styles.footer} />}
        keyExtractor={(item, index) => item + index}
        renderItem={props => {
          return <RegionAndCityItem item={props.item} type={'city'} />;
        }}
        renderSectionHeader={({ section }) => {
          return (
            <View>
              <RegionAndCityItem item={section.region} type={'region'} />
            </View>
          );
        }}
      />
      <View styles={{ height: 300, width: '100%', backgroundColor: 'green' }} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    regions: state.regions.regions,
    regionsShown: state.regions.regionsShown,
  };
};
const mapDispatchToProps = {
  setCities: setRegionCities,
  setCollapsed: setRegionCollapsed,
  clearAll: clearChosen,
  addCityItemToRegionsShown: addCityToRegionsShown,
  clearShown: clearRegionsShown,
  setRegionsShownToNoSearch: setRegionsShownToNoSearchMode,
  addRegionItemToRegionsShown: addRegionToRegionsShown,
};
export default connect(mapStateToProps, mapDispatchToProps)(RegionAndCityFilter);
