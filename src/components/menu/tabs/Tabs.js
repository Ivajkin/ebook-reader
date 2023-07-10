//#region react components
import React, { useEffect, useRef } from 'react';
import { Text, View, Dimensions, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
//#endregion

//#region plagins
import { useSelector } from 'react-redux';
//#endregion

//#region components
import { theme, COLORS, SIZES, images, icons } from '../../../сonstants';
//#endregion

//#region styles
import styles from './styles';
//#endregion

const Tabs = props => {
  //#region values
  const dividerFlag = props.showDivider || false;
  const activeID = props.active != undefined && props.active != null ? props.active : 0;
  const titles = props.titles;
  const changeTab = props.links;
  const checkFunc = props.checkFunc ? props.checkFunc : null;
  const modalErrorFunc = props.modalErrorFunc ? props.modalErrorFunc : null;
  const listStep = props.listStep ? props.listStep : [];

  const openScreen = useSelector(state => state.appGlobal.openScreen);
  const scrolRef = useRef(null);
  //#endregion

  function next(index) {
    if (openScreen[listStep[index]] != 0) {
      changeTab(index);
    } else {
      if (checkFunc != null) {
        if (checkFunc()) {
          changeTab(index);
        } else {
          modalErrorFunc(true);
        }
      } else {
        changeTab(index);
      }
    }
  }

  useEffect(() => {
    if (activeID) {
      scrolRef.current?.scrollToIndex({ index: activeID, animated: true, viewPosition: 0.5 });
    }
  }, [activeID]);

  return (
    <View style={styles.headerTabs}>
      {dividerFlag && (
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 15,
            left: 0,
            backgroundColor: COLORS.gray,
            height: 2,
          }}
        ></View>
      )}
      {/* {activeID > 0 && (
        <TouchableOpacity style={styles.backWrapper} onPress={() => next(activeID - 1)}>
          <Image source={icons.backImg} style={styles.backImage}></Image>
        </TouchableOpacity>
      )} */}
      <FlatList
        data={titles}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={scrolRef}
        initialScrollIndex={activeID}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => next(index)}
            style={[
              styles.tabsItemWrapper,
              { borderColor: index == activeID ? COLORS.red : COLORS.none },
            ]}
          >
            <Text
              style={[
                theme.FONTS.body_R_R_11,
                styles.tabsItemText,
                { color: index == activeID ? COLORS.red : COLORS.darkGray },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* {titles.length - 1 > activeID && (
        <TouchableOpacity style={styles.nextkWrapper} onPress={() => next(activeID + 1)}>
          <Image source={icons.backImg} style={styles.backImage}></Image>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Tabs;
