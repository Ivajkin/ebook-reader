//#region react components
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  ScrollView,
  SafeAreaView,
} from 'react-native';

//#endregion --------

//#region plagins

//#endregion --------

//#region components
import { Tabs } from '../../../components/menu';
import { icons, tempData, theme, COLORS, loader } from '../../../сonstants';
//#endregion --------

//#region styles
import { styles } from './styles';
import AnimatedLoader from 'react-native-animated-loader';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
//#endregion --------

const BrandChoose = props => {
  //#region valuebles
  const [linkID, setLinkID] = useState(0);
  //const brandArray = route.params.brandList;
  //const brandPopular = route.params.brandPopularList;

  //console.log('#GG1', props?.route);
  const navigation = useNavigation();
  const setCheckedBrands = props?.route?.params?.changeCarBrand;
  const [localBrands, setLocalBrands] = useState(props?.route?.params?.currentBrands);
  const [searchResult, setSearchResult] = useState('');

  const singleChoice = props?.route?.params?.singleChoice;

  //#endregion --------

  //#region functions
  const handleBackButtonClick = () => {
    //BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    setCheckedBrands(localBrands);
    navigation.goBack();
  };

  /**
   * function for brand click
   */
  function brandClick(item) {
    if (singleChoice) {
      setLocalBrands({ forSend: [item[0]], forInput: [item[1]] });
      setCheckedBrands({ forSend: [item[0]], forInput: [item[1]] });
      navigation.goBack();
    } else {
      if (item) {
        setLocalBrands(prev => {
          let thisIndex = prev.forInput.findIndex(el => el === item[1]);
          if (thisIndex === -1) {
            return { forSend: [...prev.forSend, item[0]], forInput: [...prev.forInput, item[1]] };
          } else {
            return {
              forSend: prev.forSend.filter(el => el !== item[0]),
              forInput: prev.forInput.filter(el => el !== item[1]),
            };
          }
        });
      }
    }
  }

  //#endregion --------

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <View style={styles.headerBrandWrapper}>
        <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => handleBackButtonClick()}>
          <Image source={icons.backImg} style={styles.headerBrandBackImage} />
        </TouchableOpacity>

        <View style={styles.headerBrandInputWrapper}>
          <TextInput
            style={[theme.FONTS.h2, styles.headerSearchInput, {paddingTop: searchResult === '' ? 25: 20}]}
            placeholder={'Введите марку транспорта'}
            onChangeText={text => {
              setSearchResult(text);
              //setCheckedBrand(null);
            }}
            value={searchResult}
            textAlignVertical={'center'}
          />
        </View>
        <TouchableOpacity
          style={styles.headerImageWrapper}
          onPress={() => {
            setSearchResult('');
          }}
        >
          {searchResult.length > 0 ? (
            <Image source={icons.clear} style={styles.headerBrandSearchImage} />
          ) : (
            <Image source={icons.search} style={styles.headerBrandSearchImage} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Tabs
          showDivider={false}
          active={linkID}
          titles={['Популярные', 'Все марки']}
          links={setLinkID}
        />
        <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollView}>
          {linkID === 0 ? (
            props?.brandsPopular.filter(word =>
              word[1].toString().toLowerCase().includes(searchResult.toLowerCase())
            ).length !== 0 ? (
              props.brandsPopular
                .filter(word => word[1].toString().toLowerCase().includes(searchResult.toLowerCase()))
                .map((item, index) => (
                  <TouchableOpacity
                    key={item[0]}
                    onPress={() => brandClick(item)}
                    style={[
                      styles.singleBrandWrapper,
                      { borderColor: item[0] === localBrands ? COLORS.red : COLORS.gray },
                    ]}
                  >
                    <View style={styles.singleBrandLogo}>
                      {item[2] ? (
                        <Image style={styles.singleBrandImage} source={{ uri: item[2] }} />
                      ) : (
                        <></>
                      )}
                    </View>
                    <Text style={[theme.FONTS.body_R_R_14, styles.singleBrandTitle]}>{item[1]}</Text>
                    {localBrands.forInput.find(el => el === item[1]) && (
                      <View style={styles.singleBrandCheckedWrapper}>
                        <Image style={styles.singleBrandCheckedImage} source={icons.checked} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
            ) : (
              <View style={styles.brandSearchError}>
                <Text style={[theme.FONTS.body_R_R_14, styles.brandSearchErrorText]}>
                  Такой марки транспорта нет в списке
                </Text>
              </View>
            )
          ) : props.brandsList.filter(word =>
              word[1].toString().toLowerCase().includes(searchResult.toLowerCase())
            ).length !== 0 ? (
            props.brandsList
              .filter(word => word[1].toString().toLowerCase().includes(searchResult.toLowerCase()))
              .map((item, index) => (
                <TouchableOpacity
                  key={item[0]}
                  onPress={() => brandClick(item)}
                  style={[
                    styles.singleBrandWrapper,
                    { borderColor: item[1] === localBrands ? COLORS.red : COLORS.gray },
                  ]}
                >
                  <View style={styles.singleBrandLogo}>
                    {item[2] ? (
                      <Image style={styles.singleBrandImage} source={{ uri: item[2] }} />
                    ) : (
                      <></>
                    )}
                  </View>
                  <Text style={[theme.FONTS.body_R_R_14, styles.singleBrandTitle]}>{item[1]}</Text>
                  {localBrands.forInput.find(el => el === item[1]) && (
                    <View style={styles.singleBrandCheckedWrapper}>
                      <Image style={styles.singleBrandCheckedImage} source={icons.checked} />
                    </View>
                  )}
                </TouchableOpacity>
              ))
          ) : (
            <View style={styles.brandSearchError}>
              <Text style={[theme.FONTS.body_R_R_14, styles.brandSearchErrorText]}>
                Такой марки транспорта нет в списке
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    brandsList: state.lists.brandsList,
    brandsPopular: state.lists.popularBrandsList,
  };
};
export default connect(mapStateToProps, null)(BrandChoose);
