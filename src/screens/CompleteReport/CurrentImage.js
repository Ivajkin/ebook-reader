//#region react
import React from 'react';
import { Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
//#endregion --------

//#region components
import { icons } from '../../сonstants';
//#endregion --------

//#region styles
import { styles } from './styles';
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
import BottomDrawer from 'react-native-bottom-drawer-view';
import Svg, { Rect } from 'react-native-svg';
import { useWindowDimensions } from 'react-native';
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

const CurrentImageScreen = ({ route, navigation }) => {
  const { height, width } = useWindowDimensions();
  const image = route.params?.image ?? {};

  return (
    <>
      <SafeAreaView style={{ width: '100%', height: '100%', position: 'relative' }}>
        <View style={styles.headerBrandWrapper}>
          <TouchableOpacity style={styles.headerBrandBackWrapper} onPress={() => navigation.goBack()}>
            <Image source={icons.backImg} style={styles.headerBrandBackImage} />
          </TouchableOpacity>
          <Text style={{ fontWeight: '400', fontSize: 17, lineHeight: 28, color: '#333333' }}>Фото</Text>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '85%',
            justifyContent: 'center',
          }}
        >
          <Image
            backgroundColor={'#C4C4C4'}
            source={{ uri: image.storage_path720p }}
            style={{
              width: '100%',
              height: 350,
            }}
          />
        </View>

        <BottomDrawer
          containerHeight={height / 2}
          offset={-1 * (height / 2 / 6)}
          startUp={false}
          backgroundColor="#fff"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          // alldownDisplay={760}
          alldownDisplay={height - 65}
        >
          <View
            style={{
              padding: 19,
              position: 'relative',
            }}
          >
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: width,
                alignItems: 'center',
                position: 'absolute',
                top: 10,
              }}
            >
              <Svg
                width="29"
                height="3"
                viewBox="0 0 29 3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect width="29" height="3" rx="1.5" fill="#E5E5EA" />
              </Svg>
            </View>
            <Text style={{ fontWeight: '700', marginBottom: 20 }}>{image.fieldName}</Text>
            <Text>{image.comment}</Text>
          </View>
        </BottomDrawer>
      </SafeAreaView>
    </>
  );
};

export default CurrentImageScreen;
