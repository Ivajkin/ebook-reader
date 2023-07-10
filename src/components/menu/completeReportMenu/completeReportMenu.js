//#region react
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
//#endregion

//#region plagins
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/core';
//#endregion

//#region components
import {
  AvatarIco,
  TechnicalCharacteristicsIcon,
  AdvantagesAndDisadvantagesIcon,
  CompletenessIcon,
  TechCheckIcon,
  CompletenessIcon1,
  LKPIcon,
  TiresIcon,
  DangersIcon,
} from '../../svg';
import { theme, COLORS, constants } from '../../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

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

const CompleteReportMenu = props => {
  //#region values
  const navigation = props.navigation;
  const onClick = props.onClick;
  const currentScreen = useRoute().name;
  const token = useSelector(state => state.appGlobal.loginToken);
  const screenList = Object.values(constants.sectionOrderList);
  const userInfo = useSelector(state => state.appGlobal.userInfo);
  const reportType = useSelector(state => state.appGlobal.reportType);
  const dispatch = useDispatch();

  return (
    <View style={styles.allWrapper}>
      {menuItems.map(item => {
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.container,
              { backgroundColor: screenList.includes(currentScreen) ? COLORS.red : COLORS.primary },
            ]}
            onPress={() => {
              onClick(item.id);
            }}
          >
            <View style={styles.ico}>{<item.icon />}</View>
            <Text
              style={[
                theme.FONTS.body_SF_R_13,
                styles.text,
                { color: screenList.includes(currentScreen) ? COLORS.primary : COLORS.black },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CompleteReportMenu;
