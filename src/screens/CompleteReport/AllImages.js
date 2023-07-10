//#region react
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
//#endregion --------

import AnimatedLoader from 'react-native-animated-loader';

//#region components
import { HeaderBar, CompleteReportMenu } from '../../components/menu';
import { icons, theme, COLORS, loader, images, SIZES, constants } from '../../сonstants';
//#endregion --------

//#region styles
import { styles } from './styles';
//import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  AdvantagesAndDisadvantagesIcon,
  CompletenessIcon,
  CompletenessIcon1,
  DangersIcon,
  LKPIcon,
  TechCheckIcon,
  TechnicalCharacteristicsIcon,
  TiresIcon,
} from '../../components/svg';
import { ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
//#endregion --------

const userRoles = {
  individual: 'Частное лицо',
  recruitment_specialist: 'Специалист по подбору',
  dealer: 'Дилер',
  car_sale_specialist: 'Специалист по продаже авто',
  dss_group_specialist: 'Специалист DSS Group',
};

const menuItems = [
  { id: 1, title: 'Технические характеристики', icon: TechnicalCharacteristicsIcon },
  { id: 2, title: 'Преимущества и недостатки', icon: AdvantagesAndDisadvantagesIcon },
  { id: 3, title: 'Комплектация', icon: CompletenessIcon },
  { id: 4, title: 'Тех. проверка автомобиля', icon: TechCheckIcon },
  { id: 5, title: 'Комплектность', icon: CompletenessIcon1 },
  { id: 6, title: 'Проверка ЛКП', icon: LKPIcon },
  { id: 7, title: 'Шины', icon: TiresIcon },
  { id: 8, title: 'Данные ГИБДД', icon: DangersIcon },
];

const AllImagesScreen = ({ route, navigation }) => {
  const images = route.params?.images ?? {};
  const imagesTabs = route.params?.imagesTabs ?? {};

  return (
    <>
      <SafeAreaView style={{ width: '100%', height: '100%' }}>
        <View style={styles.headerBrandWrapper}>
          <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => navigation.goBack()}>
            <Image source={icons.backImg} style={styles.headerBrandBackImage} />
          </TouchableOpacity>
          <Text style={{ fontWeight: '400', fontSize: 17, lineHeight: 28, color: '#333333' }}>
            Все фото
          </Text>
        </View>

        <FlatList
          style={{ width: '100%' }}
          numColumns={1}
          data={imagesTabs}
          keyExtractor={(item, index) => index}
          renderItem={item => {
            const currentImages = images.filter(k => k.section_name === item.item);
            const amount = currentImages.length;

            return (
              <View style={{ marginBottom: 16, paddingHorizontal: 15 }}>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    lineHeight: 19,
                    color: '#333333',
                    marginBottom: 8,
                    marginTop: 16,
                  }}
                >
                  {item.item} ({amount})
                </Text>
                <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
                  <FlatList
                    style={{ width: '100%' }}
                    numColumns={4}
                    data={currentImages}
                    keyExtractor={k => k.id}
                    renderItem={k => {
                      return (
                        <TouchableOpacity
                          // key={i}
                          onPress={() => {
                            navigation.navigate('CurrentImageScreen', {
                              image: k.item,
                            });
                          }}
                          style={{
                            width: '23%',
                            height: 70,
                            marginRight: 5,
                            marginBottom: 5,
                          }}
                        >
                          <Image
                            backgroundColor={'#C4C4C4'}
                            source={{ uri: k.item.storage_path480p }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                  {/* {currentImages.map((k, i) => {})} */}
                </View>
              </View>
            );
          }}
        />
        {/* {imagesTabs.length && images.length && (
          <ScrollView style={{ marginBottom: 55, paddingHorizontal: 15 }}>
            {imagesTabs.map((item, index) => { */}
        {/* })}
          </ScrollView>
        )} */}
      </SafeAreaView>
    </>
  );
};

export default AllImagesScreen;
