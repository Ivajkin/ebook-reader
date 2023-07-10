//#region react components
import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Image, BackHandler, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
//#endregion

//#region components
import { ModalClose } from '../../modal';
import { setMenuFlag } from '../../../redux/App/actions/mainActions';
import { icons, theme, COLORS, SIZES, images } from '../../../сonstants';
//#endregion

//#region plagins
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import RNExitApp from 'react-native-exit-app';
import { useSelector, useDispatch } from 'react-redux';
const mainLogo = require('../../../../assets/images/Boot_/logo.png');

//#endregion

//#region images

//#endregion

//#region styles
import styles from '../headerBar/styles';
//#endregion

const HeaderBar = props => {

  //#region values
  const goBackFlag = props.goBackFlag ? props.goBackFlag : false;
  const content = props.children ? props.children : <></>;
  const title = props.title ? props.title : '';
  const withDesc = props.withDesc ? props.withDesc : false;
  //const backComponents = props.onBackClick ? props.onBackClick : null
  const backButton = props.backButton ? props.backButton : false;
  const backFunc = props.backFunc ? props.backFunc : () => {};
  const nextButton = props.nextButton ? props.nextButton : false;
  const nextFunc = props.nextFunc ? props.nextFunc : () => {};
  const endReport = props.endReport ? props.endReport : false;
  const menuFlag = props.menuFlag ? props.menuFlag : false;
  const navigation = props.nav ? props.nav : null;
  const route = props.route ? props.route : null;
  const screenBack = props.screenBack ? props.screenBack : null;
  const tabs = props.tabs ? props.tabs : <></>;
  const delButtonFlag = props.delButtonFlag ? props.delButtonFlag : false;
  const withLogo = props.withLogo ? props.withLogo : false;
  //const hasSideMenu = props.hasSideMenu ? props.hasSideMenu : true;

  // const screenWidth = useWindowDimensions().width
  // const screenHeight = useWindowDimensions().height
  const menuContent = props.menu ? props.menu : <></>;
  const isOpen = useSelector(state => state.appGlobal.isMenuOpen);
  const modalTypeReportEnd = useSelector(state => state.appGlobal.reportEndModalFlag);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const drawerRef = useRef();

  //#endregion

  /**
   * function for change menu state
   */
  function setOpen(flag) {
    dispatch(setMenuFlag(flag));
  }
  //#endregion

  /**
   * function for handle back click
   */

  const handleBackButtonClick = () => {
    if (isOpen) {
      setOpen(false);
      return true;
    } else {
      if (goBackFlag) {
        if (navigation.canGoBack()) {
          if (route.name === 'AllReportsScreen') {
            RNExitApp.exitApp();
            return true;
          } else {
            navigation.goBack();
            return true;
          }
        }
      } else {
        if (modalTypeReportEnd === 'notAllOk') {
          return true;
        } else {
          if (!modalVisible) {
            setModalVisible(true);
            return true;
          } else {
            setModalVisible(false);
            return true;
          }
        }
      }
    }
  };

  /**
   * useeffect for change back action
   */

  useEffect(() => {
    isOpen ? drawerRef.current.openDrawer() : drawerRef.current.closeDrawer();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [isOpen, modalTypeReportEnd]);

  const sideMenu = () => {
    return (
      <View style={[styles.sideMenuWrapper, { width: '100%', height: '100%', opacity: 1, zIndex: 500 }]}>
        <View style={[styles.sideMenuMain, { width: '100%', height: '100%' }]}>{menuContent}</View>
      </View>
    );
  };

  const onSideClick = () => {
    if (isOpen) {
      drawerRef.current.closeDrawer();
      setOpen(false);
    } else {
      drawerRef.current.openDrawer();
      setOpen(true);
    }
  };

  const onBackClick = () => {
    if (endReport) {
      setModalVisible(true);
    } else {
      if (!goBackFlag) {
        backFunc();
      } else if (screenBack) {
        navigation.navigate(screenBack);
      } else {
        navigation.goBack();
      }
    }
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={props.hasSideMenu !== false ? SIZES.width - 70 : 0}
        drawerPosition={DrawerLayout.positions.Right}
        drawerType="front"
        drawerBackgroundColor={COLORS.veryLightGray}
        onDrawerClose={() => setOpen(false)}
        onDrawerOpen={() => setOpen(true)}
        renderNavigationView={sideMenu}
      >
        <View style={styles.headerBarWrapper}>
          <View style={styles.headerBarBeforeContentWrapper}>
            <View style={styles.headerBarLeftSideWrapper}>
              {backButton ? (
                <TouchableOpacity style={styles.headerBarBackWrapper} onPress={onBackClick}>
                  <Image source={icons.backImg} style={styles.headerBarBackImage}></Image>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <View style={{ flex: 1 }}>
                {withLogo && (
                  <TouchableOpacity
                    style={{ width: 80, marginTop: 10 }}
                    onPress={() => navigation.navigate('AllReportsScreen')}
                  >
                    <Image source={mainLogo} style={styles.mainLogo} imageStyle={styles.mainLogoImg} />
                  </TouchableOpacity>
                )}
                {title ? (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[theme.FONTS.h2, { width: delButtonFlag ? '65%' : '100%' }]}
                  >
                    {title}
                  </Text>
                ) : null}
              </View>
            </View>
            {withDesc ? (
              <Text style={{ width: 157, color: '#B2B2BB', fontSize: 12, textAlign: 'right' }}>
                «Сообщество честных людей»
              </Text>
            ) : null}
            {nextButton ? (
              <TouchableOpacity
                style={styles.headerBarNextkWrapper}
                onPress={() =>
                  !goBackFlag
                    ? nextFunc()
                    : screenBack
                    ? navigation.navigate(screenBack)
                    : navigation.goBack()
                }
              >
                <Image source={icons.backImg} style={styles.headerBarBackImage}></Image>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            {menuFlag && (
              <TouchableWithoutFeedback containerStyle={styles.headerMenuPoints} onPress={onSideClick}>
                <Image style={styles.headerMenuImgStyle} source={(route.name === 'AllReportsScreen' || route.name === 'SettingsScreen') ? icons.headerMenuImgHam : icons.headerMenuImg} />
              </TouchableWithoutFeedback>
            )}
          </View>

          {tabs}

          {content ? content : <></>}
        </View>

        <ModalClose
          modalVisible={modalVisible}
          dispatch={dispatch}
          setModalVisible={setModalVisible}
          nav={navigation}
          backScreen={screenBack}
          screenName={props?.route?.name}
        />
      </DrawerLayout>
    </View>
  );
};

export default HeaderBar;
