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
  Share,
  Linking,
  Clipboard,
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
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { findNodeHandle } from 'react-native';
import { UIManager } from 'react-native';
import { setMenuFlag } from '../../redux/App/actions/mainActions';
import { DocumentsBlock } from './Blocks/DocumentsBlock/DocumentsBlock';
import { CompletenessBlock } from './Blocks/CompletenessBlock/CompletenessBlock';
import { TiresBlock } from './Blocks/TiresBlock/TiresBlock';
import { AdvantagesAndDisadvantagesBlock } from './Blocks/AdvantagesAndDisadvantagesBlock/AdvantagesAndDisadvantagesBlock';
import { TechCheckBlock } from "./Blocks/TechCheckBlock/TechCheckBlock";
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

const CompleteReportScreen = ({ route, navigation }) => {
  const reportId = route.params?.itemId ?? {};
  const reportTemp = route.params?.item ?? {};
  const [report, setReport] = useState(null);
  const [savedFields, setSavedFields] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [uploadsTabs, setUploadsTabs] = useState([]);
  const [activeUploadsTab, setActiveUploadsTab] = useState('');
  const [activeDocumentsTab, setActiveDocumentsTab] = useState('');
  const height = Dimensions.get('screen').height;
  const [imgWidth, setImgWidth] = useState(null);
  const [imgHeight, setImgHeight] = useState(null);
  const token = useSelector(state => state.appGlobal.loginToken);
  const refScroll = useRef();
  const parent = useRef();
  const [technicalCharacSectionY, setTechnicalCharacSectionY] = useState(0);
  const technicalCharac = useRef();
  const [AdvantagesAndDisadvantagesY, setAdvantagesAndDisadvantagesY] = useState(0);
  const AdvantagesAndDisadvantages = useRef();
  const [CompletenessY, setCompletenessY] = useState(0);
  const Completeness = useRef();
  const [TechCheckY, setTechCheckY] = useState(0);
  const TechCheck = useRef();
  const [Completeness1Y, setCompleteness1Y] = useState(0);
  const Completeness1 = useRef();
  const [LKPY, setLKPY] = useState(0);
  const LKP = useRef();
  const [TiresY, setTiresY] = useState(0);
  const Tires = useRef();
  const [DangersY, setDangersY] = useState(0);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const res = JSON.parse(JSON.stringify(reportTemp));
      setReport(res);
      const sections = res.sections;
      let newFields = {};
      let uploadedFiles = [];
      let newUploadsTabs = [];
      res.saved_fields.map(item => {
        if (!newFields[item.field.section_id]) {
          newFields[item.field.section_id] = {};
        }
        newFields[item.field.section_id][item.field_id] = item;
        if (item.uploaded_files && item.uploaded_files?.length) {
          const newUploads = item.uploaded_files.map(k => {
            const sectionName = sections.find(l => l.id === item?.field?.section_id).name || null;
            if (
              sectionName &&
              sectionName !== null &&
              !newUploadsTabs.includes(sectionName) &&
              sectionName !== 'Подпись'
            ) {
              newUploadsTabs.push(sectionName);
            }
            let comment = '';
            let fieldName = item.field.name;
            if (item.val !== null) {
              if (Array.isArray(item.val)) {
                if (item?.val[12] && item.val[12].val !== null && typeof item?.val[12] !== 'boolean') {
                  comment = item.val[12].val;
                } else if (
                  item?.val[2] &&
                  item.val[2].val !== null &&
                  typeof item?.val[2] !== 'boolean'
                ) {
                  comment = item.val[2].val;
                }
              }
            }
            return {
              ...k,
              section_id: item?.field?.section_id || null,
              section_name: sectionName,
              comment: comment,
              fieldName: fieldName,
            };
          });
          uploadedFiles = [...uploadedFiles, ...newUploads];
        }
      });
      setUploadsTabs(newUploadsTabs);
      setUploads(uploadedFiles);
      setSavedFields(newFields);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (reportId && reportTemp) {
      getData()
        .then(() => {
          //console.log('#SA', Object.keys(savedFields));
          console.log('#SA', Object.keys(savedFields), savedFields['13']);
        })
        .catch(err => {
          console.log('error occurred in getData CompleteReport', err);
        });
    }
  }, [reportId, reportTemp]);

  const measureNode = node => {
    return new Promise((resolve, reject) => {
      UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY });
      });
    });
  };

  const getRelativeToParentPosition = async (childNode, parentNode) => {
    const { pageX: childX, pageY: childY } = await measureNode(childNode);

    const { pageX: parentX, pageY: parentY, height: parentHeight } = await measureNode(parentNode);

    return {
      x: childX - parentX,
      y: childY - parentY,
    };
  };
  if (savedFields && savedFields['1'] && savedFields['1']['15']) {
  }

  const parseEquipment = item => {
    let isValue = '';
    if (item?.val_text !== null && item?.val_text && item?.val) {
      isValue = item?.val_text;
    }
    if (item?.sub_field && item?.sub_field?.value) {
      isValue = item?.sub_field?.value;
    }
    if (!isValue) {
      return;
    }

    if (isValue === 'true') {
      isValue = true;
    }
    if (isValue === 'false') {
      isValue = false;
    }
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <Svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle cx="2" cy="2" r="2" fill="#B6B6B6" />
        </Svg>

        <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>
          {item?.field?.name} {typeof isValue !== 'boolean' ? `- ${isValue}` : ''}
        </Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title=""
          withLogo={true}
          menu={
            <CompleteReportMenu
              navigation={navigation}
              onClick={async id => {
                if (refScroll && refScroll?.current !== null && refScroll?.current) {
                  dispatch(setMenuFlag(false));
                  switch (id) {
                    case 1:
                      refScroll.current.scrollTo({ y: technicalCharacSectionY });
                      break;
                    case 2:
                      refScroll.current.scrollTo({ y: AdvantagesAndDisadvantagesY });
                      break;
                    case 3:
                      refScroll.current.scrollTo({ y: CompletenessY });
                      break;
                    case 4:
                      refScroll.current.scrollTo({ y: TechCheckY });
                      break;
                    case 5:
                      refScroll.current.scrollTo({ y: Completeness1Y });
                      break;
                    case 6:
                      refScroll.current.scrollTo({ y: LKPY });
                      break;
                    case 7:
                      refScroll.current.scrollTo({ y: TiresY });
                      break;
                    case 8:
                      refScroll.current.scrollTo({ y: TiresY });
                      break;
                    default:
                      break;
                  }
                }
              }}
            />
          }
          goBackFlag={true}
          withDesc={true}
          menuFlag={true}
          nav={navigation}
          route={route}
        >
          <AnimatedLoader
            visible={loaderVisible}
            overlayColor={COLORS.whiteTransparent}
            source={loader}
            animationStyle={{
              width: Platform.OS !== 'ios' ? 200 : 50,
              height: Platform.OS !== 'ios' ? 200 : 50,
            }}
            speed={1}
            loop={true}
          />
          <View
            style={{
              marginTop: 10,
            }}
          />
          {report !== null && savedFields !== null && (
            <View style={styles.container}>
              <ScrollView ref={refScroll}>
                <View
                  style={{
                    backgroundColor: '#fff',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                      borderTopWidth: 2,
                      borderTopColor: '#F5F5F9',
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        backgroundColor={'#C4C4C4'}
                        source={{ uri: report?.user?.profile_image }}
                        style={{ width: 24, height: 24, marginRight: 6, borderRadius: 50 }}
                      />
                      <View>
                        <Text style={{ fontSize: 13, color: '#000000' }}>
                          {report?.user?.name} {report?.user?.second_name}
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            source={icons?.star}
                            style={{ width: 13, height: 13, marginRight: 2 }}
                          />
                          <Text style={{ fontSize: 11, color: 'rgba(54, 52, 52, 1)' }}>
                            {report?.user?.rating} (
                            <Text style={{ color: 'rgba(2, 84, 207, 1)' }}>
                              {report?.user?.comments_count} отзывов
                            </Text>
                            ){' '}
                            <Text style={{ color: 'rgba(2, 84, 207, 1)', marginLeft: 15 }}>
                              255 отчетов
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{ borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, padding: 10 }}
                        onPress={async () => {
                          await Share.share({
                            title: 'DssCommunity',
                            message: `Готовый отчет: ${report.view_link}`,
                            url: report.view_link,
                          });
                        }}
                      >
                        <Svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M11.2663 0.599976C10.7005 0.599976 10.1579 0.824737 9.75778 1.22481C9.3577 1.62489 9.13294 2.16751 9.13294 2.73331C9.13389 2.88326 9.15065 3.0327 9.18294 3.17914L4.33919 5.60102C4.13942 5.37102 3.8927 5.18647 3.61563 5.0598C3.33857 4.93313 3.03759 4.86726 2.73294 4.86664C2.16715 4.86664 1.62453 5.0914 1.22445 5.49148C0.824371 5.89156 0.599609 6.43418 0.599609 6.99998C0.599609 7.56577 0.824371 8.10839 1.22445 8.50847C1.62453 8.90855 2.16715 9.13331 2.73294 9.13331C3.03769 9.13297 3.33882 9.06734 3.61607 8.94084C3.89332 8.81434 4.14025 8.62992 4.34023 8.39998L9.18086 10.8208C9.14927 10.9673 9.13321 11.1168 9.13294 11.2666C9.13294 11.8324 9.3577 12.3751 9.75778 12.7751C10.1579 13.1752 10.7005 13.4 11.2663 13.4C11.8321 13.4 12.3747 13.1752 12.7748 12.7751C13.1748 12.3751 13.3996 11.8324 13.3996 11.2666C13.3996 10.7008 13.1748 10.1582 12.7748 9.75815C12.3747 9.35807 11.8321 9.13331 11.2663 9.13331C10.9615 9.13365 10.6604 9.19928 10.3832 9.32578C10.1059 9.45227 9.85897 9.6367 9.65898 9.86664L4.81836 7.44581C4.84995 7.29929 4.86601 7.14986 4.86628 6.99998C4.86525 6.85037 4.84849 6.70128 4.81628 6.55518L9.66003 4.13331C9.8599 4.36312 10.1067 4.54747 10.3837 4.67396C10.6608 4.80045 10.9617 4.86615 11.2663 4.86664C11.8321 4.86664 12.3747 4.64188 12.7748 4.2418C13.1748 3.84173 13.3996 3.2991 13.3996 2.73331C13.3996 2.16751 13.1748 1.62489 12.7748 1.22481C12.3747 0.824737 11.8321 0.599976 11.2663 0.599976Z"
                            fill="#FF3B30"
                          />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: '#F5F5F9',
                      paddingBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: 10,
                        marginRight: 10,
                        maxWidth: 320,
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Svg
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M5.46712 0.0666504C5.17272 0.0666504 4.93379 0.305584 4.93379 0.599984V1.2354C2.20795 1.7394 0.133789 4.13096 0.133789 6.99998C0.133789 10.2337 2.7667 12.8667 6.00046 12.8667C9.23421 12.8667 11.8671 10.2337 11.8671 6.99998C11.8671 4.13096 9.79297 1.7394 7.06712 1.2354V0.599984C7.06712 0.305584 6.82819 0.0666504 6.53379 0.0666504H5.46712ZM10.2619 1.12811C10.1558 1.12814 10.0521 1.15981 9.96413 1.21907C9.87613 1.27833 9.8078 1.36249 9.76787 1.46079C9.72795 1.55909 9.71825 1.66706 9.74001 1.7709C9.76177 1.87474 9.81401 1.96974 9.89004 2.04373L10.4234 2.57707C10.4725 2.62825 10.5314 2.66912 10.5965 2.69727C10.6617 2.72542 10.7317 2.74029 10.8027 2.74102C10.8737 2.74174 10.944 2.7283 11.0097 2.70147C11.0754 2.67465 11.1351 2.63499 11.1853 2.58482C11.2355 2.53464 11.2751 2.47496 11.3019 2.40927C11.3288 2.34357 11.3422 2.27319 11.3415 2.20223C11.3408 2.13128 11.3259 2.06118 11.2977 1.99604C11.2696 1.93091 11.2287 1.87204 11.1775 1.8229L10.6442 1.28957C10.5945 1.23848 10.5351 1.19787 10.4694 1.17013C10.4037 1.1424 10.3332 1.12811 10.2619 1.12811ZM6.00046 2.19998C8.65774 2.19998 10.8005 4.3427 10.8005 6.99998C10.8005 9.65727 8.65774 11.8 6.00046 11.8C3.34317 11.8 1.20046 9.65727 1.20046 6.99998C1.20046 4.3427 3.34317 2.19998 6.00046 2.19998ZM5.99212 3.25936C5.85086 3.26157 5.71624 3.31973 5.61781 3.42109C5.51938 3.52245 5.46519 3.65871 5.46712 3.79998V6.07811C5.30525 6.17157 5.17077 6.30592 5.07717 6.46772C4.98356 6.62951 4.93412 6.81306 4.93379 6.99998C4.93394 7.18708 4.98329 7.37085 5.07691 7.53284C5.17052 7.69483 5.30509 7.82935 5.46712 7.9229V8.59998C5.46612 8.67066 5.47918 8.74082 5.50553 8.80641C5.53189 8.87199 5.57101 8.93168 5.62064 8.98201C5.67026 9.03234 5.72939 9.07231 5.7946 9.09959C5.8598 9.12687 5.92978 9.14091 6.00046 9.14091C6.07114 9.14091 6.14111 9.12687 6.20632 9.09959C6.27152 9.07231 6.33065 9.03234 6.38027 8.98201C6.4299 8.93168 6.46902 8.87199 6.49538 8.80641C6.52173 8.74082 6.53479 8.67066 6.53379 8.59998V7.92186C6.69567 7.8284 6.83014 7.69404 6.92375 7.53225C7.01735 7.37045 7.06679 7.1869 7.06712 6.99998C7.06697 6.81289 7.01762 6.62912 6.92401 6.46713C6.83039 6.30514 6.69582 6.17062 6.53379 6.07707V3.79998C6.53477 3.72863 6.52142 3.6578 6.49453 3.5917C6.46764 3.5256 6.42776 3.46557 6.37725 3.41516C6.32674 3.36474 6.26663 3.32498 6.20048 3.29822C6.13433 3.27146 6.06348 3.25824 5.99212 3.25936Z"
                            fill="#333333"
                          />
                        </Svg>
                        <Text style={{ marginLeft: 6, fontSize: 11 }}>06.02.2022</Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 40,
                        }}
                      >
                        <Svg
                          width="12"
                          height="15"
                          viewBox="0 0 12 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M6.00046 0.0666504C2.76046 0.0666504 0.133789 2.69332 0.133789 5.93332C0.133789 9.79145 3.94819 11.6384 4.42606 12.0683C4.91406 12.5072 5.31726 13.4912 5.47992 14.0491C5.55886 14.32 5.78072 14.4571 6.00046 14.4629C6.22072 14.4565 6.44206 14.3195 6.52099 14.0491C6.68366 13.4912 7.08686 12.5077 7.57486 12.0683C8.05272 11.6384 11.8671 9.79145 11.8671 5.93332C11.8671 2.69332 9.24046 0.0666504 6.00046 0.0666504ZM6.00046 7.53332C5.11672 7.53332 4.40046 6.81705 4.40046 5.93332C4.40046 5.04958 5.11672 4.33332 6.00046 4.33332C6.88419 4.33332 7.60046 5.04958 7.60046 5.93332C7.60046 6.81705 6.88419 7.53332 6.00046 7.53332Z"
                            fill="#333333"
                          />
                        </Svg>

                        <Text style={{ marginLeft: 6, fontSize: 11 }}>
                          г. Длинноеназваниеград, ул.Констан-тинопольская, д. 1057 проезд 8
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    marginBottom: 10,
                    paddingBottom: 10,
                  }}
                >
                  <View
                    style={{
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        maxWidth: 320,
                      }}
                    >
                      <View style={{ minWidth: 46, width: 46, height: 46 }}>
                        <Image
                          source={savedFields['1']['6']?.car_brand?.logo}
                          style={{ width: 46, marginRight: 2 }}
                        />
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 8 }}>
                        {savedFields['1']['6']?.car_brand?.value}{' '}
                        {savedFields['1']['7']?.car_model?.value} {savedFields['1']['8']?.val}
                      </Text>
                    </View>

                    <View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#979797',
                            marginRight: 12,
                            width: 90,
                          }}
                        >
                          В продаже от:
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            backgroundColor={'#C4C4C4'}
                            source={{ uri: report?.user?.profile_image }}
                            style={{ width: 24, height: 24, marginRight: 6, borderRadius: 50 }}
                          />
                          <View>
                            <Text style={{ fontSize: 13, color: '#000000' }}>
                              {report?.user?.name} {report?.user?.second_name}
                            </Text>
                            <View
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Image
                                source={icons?.star}
                                style={{ width: 13, height: 13, marginRight: 2 }}
                              />
                              <Text style={{ fontSize: 11, color: 'rgba(54, 52, 52, 1)' }}>
                                {report?.user?.rating} (
                                <Text style={{ color: 'rgba(2, 84, 207, 1)' }}>
                                  {report?.user?.comments_count} отзывов
                                </Text>
                                ){' '}
                                <Text style={{ color: 'rgba(2, 84, 207, 1)', marginLeft: 15 }}>
                                  255 отчетов
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#979797',
                            marginRight: 12,
                            width: 90,
                          }}
                        >
                          Цена:
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontWeight: '700', fontSize: 13 }}>
                            {savedFields['1']['256']?.val
                              ? `${savedFields['1']['258']?.val} ₽`
                              : 'Не продается'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#979797',
                            marginRight: 12,
                            width: 90,
                          }}
                        >
                          Телефон:
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(`tel:${report?.user?.phone}`);
                          }}
                        >
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ marginRight: 6 }}>{report?.user?.phone}</Text>
                            <Svg
                              width="13"
                              height="13"
                              viewBox="0 0 13 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <Path
                                d="M9.32046 8.54082C9.10393 8.41388 8.83779 8.41655 8.62233 8.54455L7.53113 9.19468C7.28686 9.34028 6.98179 9.32322 6.75779 9.14828C6.37059 8.84588 5.74713 8.33708 5.20473 7.79468C4.66233 7.25228 4.15353 6.62882 3.85113 6.24162C3.67619 6.01762 3.65913 5.71255 3.80473 5.46828L4.45486 4.37708C4.58339 4.16162 4.58446 3.89335 4.45753 3.67682L2.85646 0.941883C2.70126 0.67735 2.39299 0.547216 2.09486 0.620283C1.80526 0.690683 1.42926 0.862416 1.03513 1.25708C-0.199007 2.49122 -0.854473 4.57282 3.78659 9.21388C8.42766 13.8549 10.5087 13.2 11.7434 11.9653C12.1386 11.5701 12.3098 11.1936 12.3807 10.9035C12.4527 10.6059 12.3247 10.2997 12.0607 10.1451C11.4015 9.75948 9.97966 8.92695 9.32046 8.54082Z"
                                fill="#FF3B30"
                              />
                            </Svg>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#fff',
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16,
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      <TouchableOpacity
                        onPress={() => {
                          setActiveUploadsTab('');
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '500',
                            borderRadius: 5,
                            backgroundColor: activeUploadsTab === '' ? '#ff3b301a' : '#F5F5F9',
                            color: activeUploadsTab === '' ? '#FF3B30' : '#B6B6B6',
                            padding: 8,
                            marginRight: 4,
                            marginTop: 4,
                          }}
                        >
                          Все ({uploads.length})
                        </Text>
                      </TouchableOpacity>
                      {uploadsTabs.map(item => {
                        const amount = uploads.filter(k => k.section_name === item).length;
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setActiveUploadsTab(item);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '500',
                                borderRadius: 5,
                                backgroundColor: activeUploadsTab === item ? '#ff3b301a' : '#F5F5F9',
                                color: activeUploadsTab === item ? '#FF3B30' : '#B6B6B6',
                                padding: 8,
                                marginRight: 4,
                                marginTop: 4,
                              }}
                            >
                              {item} ({amount})
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {uploads.filter(item => {
                      if (item.section_name === activeUploadsTab) {
                        return item;
                      }
                      if (activeUploadsTab === '') {
                        return item;
                      }
                    }).length > 0 && (
                      <View style={{ width: 480, marginTop: 10 }}>
                        {/*<Text>USED TO BE Carousel</Text>*/}
                        <FlatList
                          width={240}
                          height={160}
                          style={{
                            width: '100%',
                            borderRadius: 5,
                          }}
                          horizontal={true}
                          data={uploads.filter(item => {
                            if (item.section_name === activeUploadsTab) {
                              return item;
                            }
                            if (activeUploadsTab === '') {
                              return item;
                            }
                          })}
                          renderItem={({ item, index }) => {
                            return (
                              <View
                                style={{
                                  marginRight: 8,
                                  justifyContent: 'center',
                                  borderRadius: 5,
                                  backgroundColor: '#cccccc33',
                                  position: 'relative',
                                }}
                                key={index}
                              >
                                <Image
                                  source={{ uri: item.storage_path720p }}
                                  style={{
                                    borderRadius: 5,
                                    width: '100%',
                                    height: '100%',
                                  }}
                                />
                                <Text
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    padding: 8,
                                    color: '#fff',
                                    backgroundColor: '#00000080',
                                    borderRadius: 5,
                                  }}
                                >
                                  {item.fieldName}
                                  {item.comment ? ` - ${item.comment}` : ''}
                                </Text>
                              </View>
                            );
                          }}
                        />
                        {/* <Carousel
                        width={240}
                        height={160}
                        style={{
                          width: '100%',
                          borderRadius: 5,
                        }}
                        data={uploads.filter(item => {
                          if (item.section_name === activeUploadsTab) {
                            return item;
                          }
                          if (activeUploadsTab === '') {
                            return item;
                          }
                        })}
                        scrollAnimationDuration={1000}
                        renderItem={({ item, index }) => {
                          return (
                            <View
                              style={{
                                marginRight: 8,
                                justifyContent: 'center',
                                borderRadius: 5,
                                backgroundColor: '#cccccc33',
                                position: 'relative',
                              }}
                              key={index}
                            >
                              <Image
                                source={{ uri: item.storage_path720p }}
                                style={{
                                  borderRadius: 5,
                                  width: '100%',
                                  height: '100%',
                                }}
                              />
                              <Text
                                style={{
                                  position: 'absolute',
                                  bottom: 8,
                                  left: 8,
                                  padding: 8,
                                  color: '#fff',
                                  backgroundColor: '#00000080',
                                  borderRadius: 5,
                                }}
                              >
                                {item.fieldName}
                                {item.comment ? ` - ${item.comment}` : ''}
                              </Text>
                            </View>
                          );
                        }}
                      // />*/}
                      </View>
                    )}

                    <TouchableOpacity onPress={() => {}}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 14,
                        }}
                      >
                        <Svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M1.20046 0.133362C0.611122 0.133362 0.133789 0.610695 0.133789 1.20003V2.2667H2.26712V0.133362H1.20046ZM3.33379 0.133362V2.2667H5.46712V0.133362H3.33379ZM6.53379 0.133362V2.2667H8.66712V0.133362H6.53379ZM9.73379 0.133362V2.2667H11.8671V1.20003C11.8671 0.610695 11.3898 0.133362 10.8005 0.133362H9.73379ZM0.133789 3.33336V5.4667H2.26712V3.33336H0.133789ZM3.33379 3.33336V5.4667H5.46712V3.33336H3.33379ZM6.53379 3.33336V5.4667H8.66712V3.33336H6.53379ZM9.73379 3.33336V5.4667H11.8671V3.33336H9.73379ZM0.133789 6.53336V8.6667H2.26712V6.53336H0.133789ZM3.33379 6.53336V8.6667H5.46712V6.53336H3.33379ZM6.53379 6.53336V8.6667H8.66712V6.53336H6.53379ZM9.73379 6.53336V8.6667H11.8671V6.53336H9.73379ZM0.133789 9.73336V10.8C0.133789 11.3894 0.611122 11.8667 1.20046 11.8667H2.26712V9.73336H0.133789ZM3.33379 9.73336V11.8667H5.46712V9.73336H3.33379ZM6.53379 9.73336V11.8667H8.66712V9.73336H6.53379ZM9.73379 9.73336V11.8667H10.8005C11.3898 11.8667 11.8671 11.3894 11.8671 10.8V9.73336H9.73379Z"
                            fill="#FF3B30"
                          />
                        </Svg>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('AllImagesScreen', {
                              images: uploads,
                              imagesTabs: uploadsTabs,
                            });
                          }}
                        >
                          <Text style={{ color: '#FF3B30', marginLeft: 6 }}>Все фото</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setTechnicalCharacSectionY(layout.y);
                  }}
                >
                  <View
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#fff',
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 6,
                          backgroundColor: '#fff',
                          marginBottom: 10,
                        }}
                      >
                        {<TechnicalCharacteristicsIcon />}
                        <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>
                          Тех. характеристики
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        VIN-номер:
                      </Text>
                      <TouchableOpacity onPress={() => Clipboard.setString(savedFields['1']['1']?.val)}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 13, marginRight: 6 }}>
                            {savedFields['1']['1']?.val}
                          </Text>
                          <Svg
                            width="12"
                            height="14"
                            viewBox="0 0 12 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <Path
                              d="M3.86712 0.0666504C3.27779 0.0666504 2.80046 0.543984 2.80046 1.13332V9.66665C2.80046 10.256 3.27779 10.7333 3.86712 10.7333H10.8005C11.3898 10.7333 11.8671 10.256 11.8671 9.66665V3.53332C11.8671 3.39198 11.8111 3.2565 11.7109 3.15623L8.77754 0.2229C8.67727 0.122634 8.54179 0.0666504 8.40045 0.0666504H3.86712ZM8.13379 1.08228L10.8515 3.79998H8.66712C8.37272 3.79998 8.13379 3.56105 8.13379 3.26665V1.08228ZM1.20046 2.73332C0.611122 2.73332 0.133789 3.21065 0.133789 3.79998V12.3333C0.133789 12.9226 0.611122 13.4 1.20046 13.4H8.13379C8.72312 13.4 9.20045 12.9226 9.20045 12.3333V11.8H3.86712C2.69059 11.8 1.73379 10.8432 1.73379 9.66665V2.73332H1.20046Z"
                              fill="#B6B6B6"
                            />
                          </Svg>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Цвет:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['16']?.sub_field?.value}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Пробег:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>Одометр {savedFields['1']['17']?.val} км.</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Владельцев:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['3']['255']?.val}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Втор. окрас:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['13']?.sub_field?.value}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Тип КПП:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['13']?.sub_field?.value}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        ГРЗ:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['3']?.val}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Тип кузова:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['9']?.sub_field?.value}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Объем двиг:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['14']?.val} см3</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Мощность:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['15']?.val} л.с.</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Тип топлива:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['11']?.sub_field?.value}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        Привод:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['12']?.sub_field?.value}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setAdvantagesAndDisadvantagesY(layout.y);
                  }}
                >
                  <AdvantagesAndDisadvantagesBlock data={savedFields['13']} />
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setCompletenessY(layout.y);
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {<CompletenessIcon />}
                      <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>
                        Комплектация
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 12,
                      }}
                    >
                      <Svg
                        width="4"
                        height="4"
                        viewBox="0 0 4 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <Circle cx="2" cy="2" r="2" fill="#B6B6B6" />
                      </Svg>

                      <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>
                        Комплектация - {savedFields['2']['40']?.val}
                      </Text>
                    </View>
                    {Object.values(savedFields['2']).map(item => parseEquipment(item))}
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      <TouchableOpacity
                        onPress={() => {
                          setActiveDocumentsTab('');
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '500',
                            borderRadius: 5,
                            backgroundColor: activeDocumentsTab === '' ? '#ff3b301a' : '#F5F5F9',
                            color: activeDocumentsTab === '' ? '#FF3B30' : '#B6B6B6',
                            padding: 8,
                            marginRight: 4,
                            marginTop: 4,
                          }}
                        >
                          Все ({uploads.length})
                        </Text>
                      </TouchableOpacity>
                      {uploadsTabs.map(item => {
                        const amount = uploads.filter(k => k.section_name === item).length;
                        if (item === 'Документы') {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setActiveDocumentsTab(item);
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  fontWeight: '500',
                                  borderRadius: 5,
                                  backgroundColor: activeDocumentsTab === item ? '#ff3b301a' : '#F5F5F9',
                                  color: activeDocumentsTab === item ? '#FF3B30' : '#B6B6B6',
                                  padding: 8,
                                  marginRight: 4,
                                  marginTop: 4,
                                }}
                              >
                                {item} ({amount})
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      })}
                    </View>
                    <View style={{ width: 480, marginTop: 10 }}>
                      {/*//TODO*/}
                      {/*<Carousel*/}
                      {/*  width={240}*/}
                      {/*  height={160}*/}
                      {/*  style={{*/}
                      {/*    width: '100%',*/}
                      {/*    borderRadius: 5,*/}
                      {/*  }}*/}
                      {/*  data={uploads.filter(item => {*/}
                      {/*    if (item.section_name === activeDocumentsTab) {*/}
                      {/*      return item;*/}
                      {/*    }*/}
                      {/*    if (activeDocumentsTab === '') {*/}
                      {/*      return item;*/}
                      {/*    }*/}
                      {/*  })}*/}
                      {/*  scrollAnimationDuration={1000}*/}
                      {/*  renderItem={({ item, index }) => {*/}
                      {/*    return (*/}
                      {/*      <View*/}
                      {/*        style={{*/}
                      {/*          marginRight: 8,*/}
                      {/*          justifyContent: 'center',*/}
                      {/*          borderRadius: 5,*/}
                      {/*          backgroundColor: '#cccccc33',*/}
                      {/*          position: 'relative',*/}
                      {/*        }}*/}
                      {/*        key={index}*/}
                      {/*      >*/}
                      {/*        <Image*/}
                      {/*          source={{ uri: item.storage_path720p }}*/}
                      {/*          style={{*/}
                      {/*            borderRadius: 5,*/}
                      {/*            width: '100%',*/}
                      {/*            height: '100%',*/}
                      {/*          }}*/}
                      {/*        />*/}
                      {/*        <Text*/}
                      {/*          style={{*/}
                      {/*            position: 'absolute',*/}
                      {/*            bottom: 8,*/}
                      {/*            left: 8,*/}
                      {/*            padding: 8,*/}
                      {/*            color: '#fff',*/}
                      {/*            backgroundColor: '#00000080',*/}
                      {/*            borderRadius: 5,*/}
                      {/*          }}*/}
                      {/*        >*/}
                      {/*          {item.text}*/}
                      {/*        </Text>*/}
                      {/*      </View>*/}
                      {/*    );*/}
                      {/*  }}*/}
                      {/*/>*/}
                    </View>

                    {/* <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: '#979797',
                          marginRight: 12,
                          width: 90,
                        }}
                      >
                        ДВС:
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>{savedFields['1']['12']?.sub_field?.value}</Text>
                      </View>
                    </View> */}
                    <DocumentsBlock data={savedFields['3']} />
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setTechCheckY(layout.y);
                  }}
                >
                  <TechCheckBlock data={savedFields["10"]}/>
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setCompleteness1Y(layout.y);
                  }}
                >
                  <CompletenessBlock data={savedFields['4']} />
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    paddingLeft: SIZES.padding,
                    paddingRight: SIZES.padding,
                    paddingTop: SIZES.padding,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setTiresY(layout.y);
                  }}
                >
                  <TiresBlock data={savedFields['5']} />
                </View>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setLKPY(layout.y);
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {<LKPIcon />}
                      <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500' }}>
                        Проверка ЛКП
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </HeaderBar>
      </SafeAreaView>
    </>
  );
};

export default CompleteReportScreen;
