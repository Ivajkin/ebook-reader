//#region react
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
//#endregion --------

//#region styles
import { styles } from './styles';
//#endregion

//#region components
import { HeaderBar, ProgressMenu } from '../../components/menu';
import { FieldInput } from '../../components/fields';
//#endregion

//#region constants
import { COLORS, theme, loader, constants } from '../../сonstants';
import { connect, useDispatch, useSelector } from 'react-redux';
import { global } from '../../requests';
import { globalFunctions } from '../../utils';
import AnimatedLoader from 'react-native-animated-loader';
import { useNetInfo } from '@react-native-community/netinfo';
//#endregion

const AdvantagesAndDisadvantagesScreen = ({ route, navigation, reportID, token, sectionList }) => {
  const section_id = 13;
  const netInfo = useNetInfo();
  const section = sectionList.advantages_and_disadvantages;
  const goToUnfilled = route.params?.goToUnfilled ?? null;
  const dispatсh = useDispatch();
  const [fieldArray, setFieldArray] = useState(null);

  const reportType = useSelector(state => state.appGlobal.reportType);
  //#region form data

  const [advantagesFieldID, setAdvantagesFieldID] = useState('');
  const [advantagesText, setAdvantagesText] = useState('');
  const [disadvantagesFieldID, setDisadvantagesFieldID] = useState('');
  const [disadvantagesText, setDisadvantagesText] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  //#endregion

  const nextSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'advantages_and_disadvantages',
    'next'
  );
  const backSection = globalFunctions.navigateToSection(
    sectionList,
    constants.sectionOrderList,
    'advantages_and_disadvantages',
    'back'
  );

  function formSavedData(data, setLoaderVisible, unfilledFlag = false) {
    if (data) {
      //console.log('#X3', data);
      // if (unfilledFlag) {
      data.map((item, index) => {
        if (item.saved_fields.length > 0) {
          if (item.column_name === 'advantages') {
            setAdvantagesText(JSON.parse(item.saved_fields[0].val));
          } else if (item.column_name === 'disadvantages') {
            setDisadvantagesText(JSON.parse(item.saved_fields[0].val));
          }
        }
      });
    }
    setLoaderVisible(false);
  }

  async function sendData() {
    let fieldsToSend = [
      {
        id: advantagesFieldID,
        val: advantagesText,
      },
      {
        id: disadvantagesFieldID,
        val: disadvantagesText,
      },
    ];
    let localData = {
      report_id: reportID,
      fields: fieldsToSend.map(field => {
        return {
          id: field.id,
          val: JSON.stringify(field.val),
        };
      }),
    };

    let result = await global.sendReportData(localData, token);

    return result;
  }

  function next() {
    setLoaderVisible(true)
    globalFunctions.globalSendDataAndGoNext(
      token,
      reportID,
      setLoaderVisible,
      sendData,
      'AdvantagesAndDisadvantagesScreen',
      navigation,
      dispatсh,
      sectionList,
      constants,
      'advantages_and_disadvantages',
      goToUnfilled
    );
    setLoaderVisible(false)
  }

  useEffect(() => {
    if (netInfo?.isConnected !== null && route.name === 'AdvantagesAndDisadvantagesScreen') {
      if (!netInfo?.isConnected) {
        //todo
      } else {
        //console.log('#22', section_id);
        global
          .getFields(reportType, section_id, token)
          .then(response => {
            const newFieldArray = {
              advantages: response.data.data.find(field => field.column_name === 'advantages'),
              disadvantages: response.data.data.find(field => field.column_name === 'disadvantages'),
            };
            setFieldArray(newFieldArray);
            setAdvantagesFieldID(
              response.data.data.find(field => field.column_name === 'advantages').pivot.field_id
            );
            setDisadvantagesFieldID(
              response.data.data.find(field => field.column_name === 'disadvantages').pivot.field_id
            );
          })
          .catch(err => {
            console.log('get fields error in AdvantagesAndDisadvantages', err?.response);
          });
        globalFunctions.globalGetSavedData(
          token,
          reportID,
          section_id,
          null,
          formSavedData,
          setLoaderVisible,
          true
        );
      }
    }
  }, [reportID, reportType, token, netInfo, route]);

  return (
    <>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title={section.title}
          menu={
            <ProgressMenu
              nav={navigation}
              formDataFunction={sendData}
              setLoaderVisible={setLoaderVisible}
              validateFunc={() => true}
              currentScreen={'AdvantagesAndDisadvantagesScreen'}
            />
          }
          nextButton={false} //{goToUnfilled ? false : nextSection.check}
          backButton={goToUnfilled ? true : backSection.check}
          endReport={goToUnfilled ? true : false}
          goBackFlag={false}
          menuFlag={true}
          nav={navigation}
          backFunc={() =>
            globalFunctions.sendSection(
              setLoaderVisible,
              sendData,
              backSection.toScetion,
              navigation,
              dispatсh
            )
          }
          nextFunc={() =>
            globalFunctions.sendSection(
              setLoaderVisible,
              () => sendData(),
              nextSection.toScetion,
              navigation,
              dispatсh
            )
          }
          route={route}
          screenBack={'DocumentsScreen'}
        >
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={COLORS.whiteTransparent}
            source={loader}
            animationStyle={styles.lottie}
            speed={1}
            loop={true}
          />
          {!loaderVisible ? (
            <View style={styles.wrapper}>
              <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                  <View style={{ marginTop: 10 }}>
                    <Text>Преимущества (каждый на новой строке)</Text>
                    <View style={{ marginTop: 5 }}>
                      <FieldInput
                        key={advantagesFieldID}
                        value={advantagesText}
                        setValue={setAdvantagesText}
                        field={{ name: 'Напишите преимущества', required: 0 }}
                        textAlignVertical={'top'}
                        multiline={true}
                        height={200}
                        reg={false}
                        maxLength={300}
                      />
                    </View>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text>Недостатки (каждый на новой строке)</Text>
                    <View style={{ marginTop: 5 }}>
                      <FieldInput
                        key={disadvantagesFieldID}
                        value={disadvantagesText}
                        setValue={setDisadvantagesText}
                        field={{ name: 'Напишите недостатки', required: 0 }}
                        textAlignVertical={'top'}
                        multiline={true}
                        height={200}
                        reg={false}
                        maxLength={300}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : (
            <View />
          )}
          <TouchableOpacity style={styles.nextButtonWrapper} onPress={next}>
            <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Далее</Text>
          </TouchableOpacity>
        </HeaderBar>
      </SafeAreaView>
    </>
  );
};

const mapStateToProps = state => {
  return {
    reportID: state.appGlobal.reportId,
    token: state.appGlobal.loginToken,
    sectionList: state.appGlobal.sectionList,
  };
};
export default connect(mapStateToProps, null)(AdvantagesAndDisadvantagesScreen);
