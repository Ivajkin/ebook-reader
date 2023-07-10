import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { useDispatch, useSelector } from 'react-redux';
import { FieldCheckSwitch, FieldInput, FieldModal } from '../../components/fields';
import FieldAvatar from '../../components/fields/fieldAvatar';
import { HeaderBar } from '../../components/menu';
import { ModalChoose } from '../../components/modal';
import { setUserInfo } from '../../redux/App/actions/mainActions';
import { auth } from '../../requests';
import { postUpdateProfile } from '../../requests/Profile';
import { globalFunctions } from '../../utils';

import { COLORS, constants, theme } from '../../сonstants';
import { styles } from './styles';

const EditProfileScreen = ({ route, navigation }) => {
  const [userName, setUserName] = useState('');
  const [isOpenChooseUserRole, setIsOpenChooseUserRole] = useState(false);
  const [occupation, setOccupation] = useState({ forSend: [], forInput: [] });
  const [isValidateUserRole, setIsValidateUserRole] = useState(true);
  const [isValidateUserName, setIsValidateUserName] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [dealerName, setDealerName] = useState(null);
  const [isSoloWork, setIsSoloWork] = useState(false);
  const [companyName, setCompanyName] = useState(null);
  const [companyError, setCompanyError] = useState({ hasError: false, text: '' });
  const [userNameErrors, setUserNameErrors] = useState([]);
  const token = useSelector(state => state.appGlobal.loginToken);
  const userInfo = useSelector(state => state.appGlobal.userInfo);
  const dispatch = useDispatch();

  let roles = [
    {
      id: 'individual',
      label: 'Частное лицо',
      value: 'individual',
      borderColor: '#C8C8C8',
      borderColorActive: '#FF3B30',
      borderWidth: 2,
      borderWidthActive: 7,
    },
    {
      id: 'recruitment_specialist',
      label: 'Специалист по подбору',
      value: 'recruitment_specialist',
      borderColor: '#C8C8C8',
      borderColorActive: '#FF3B30',
      borderWidth: 2,
      borderWidthActive: 7,
    },
    {
      id: 'dealer',
      label: 'Дилер',
      value: 'dealer',
      borderColor: '#C8C8C8',
      borderColorActive: '#FF3B30',
      borderWidth: 2,
      borderWidthActive: 7,
    },
    {
      id: 'car_sale_specialist',
      label: 'Специалист по продаже авто',
      value: 'car_sale_specialist',
      borderColor: '#C8C8C8',
      borderColorActive: '#FF3B30',
      borderWidth: 2,
      borderWidthActive: 7,
    },
    {
      id: 'dss_group_specialist',
      label: 'Специалист DSS Group',
      value: 'dss_group_specialist',
      borderColor: '#C8C8C8',
      borderColorActive: '#FF3B30',
      borderWidth: 2,
      borderWidthActive: 7,
    },
  ];

  function onSubmit() {
    try {
      if (userName.length >= 3) {
        setUserNameErrors([]);
        //console.log(occupation);
        postUpdateProfile(token, userName, occupation.forSend[0], dealerName, companyName, isSoloWork)
          .then(res => {
            setCompanyError({
              hasError: false,
              text: '',
            });
            //console.log('RES1', res);
          })
          .catch(err => {
            if (err?.response?.data?.errors?.company_name) {
              setCompanyError({
                hasError: true,
                text: 'Некорректное/отсутствующее название компании'//err?.response?.data?.errors?.company_name.join(),
              });
            } else {
              setCompanyError({
                hasError: false,
                text: '',
              });
            }
            console.log('Edit Profile error onSubmit, error on postUpdateProfile', err.response);
          });
        let json = JSON.stringify({ name: userName, phone: userInfo.phone });
        AsyncStorage.setItem('@userInfo', json);
        dispatch(setUserInfo(JSON.parse(json)));
        setIsValidateUserName(true);
      } else {
        setUserNameErrors(['Имя должно быть не короче трех символов']);
        setIsValidateUserName(false);
      }
    } catch (error) {
      console.error('Edit Profile error onSubmit', error.response);
    }
  }

  function dowloadFoto(array, fArray) {
    launchImageLibrary({}, value => {
      if (!value.didCancel) {
        let imgData = 'assets' in value ? value.assets[0] : value;
        if (imgData.uri) {
          //setLoaderVisible(true)
          let resizeWidth = imgData.width;
          let resizeHeight = imgData.height;
          if (
            imgData.width > constants.imgCompress.maxWidth ||
            imgData.height > constants.imgCompress.maxHeight
          ) {
            resizeWidth = constants.imgCompress.maxWidth;
            resizeHeight = constants.imgCompress.maxHeight;
          }
          ImageResizer.createResizedImage(
            imgData.uri,
            resizeWidth,
            resizeHeight,
            constants.imgCompress.compressFormat,
            constants.imgCompress.quality,
            0,
            null
          )
            .then(async response => {
              var bodyFormData = new FormData();
              bodyFormData.append('image', {
                uri: response.uri,
                type: 'image/jpeg',
                name: response.name,
              });
              console.log(
                `methd: POST, url: ${constants.env.profilePhoto}, data: ${JSON.stringify(bodyFormData)}`
              );
              axios
                .request({
                  method: 'POST',
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                  },
                  url: constants.env.profilePhoto,
                  data: bodyFormData,
                })
                .then(response => {
                  setTempPhoto(response.data.data.path);
                })
                .catch(err => {
                  console.log('error while uploading new profile photo', err.response);
                });
            })
            .catch(err => {
              console.log('create resized image error, dowload, editProfile');
              setLoaderVisible(false);
            });
        }
      }
    });
  }

  function removePhoto() {
    axios
      .request({
        method: 'DELETE',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        url: constants.env.profilePhoto,
      })
      .then(res => {
        setTempPhoto(null);
      })
      .catch(err => {
        console.log('delete profile photo error', err);
      });
  }

  useEffect(function setUserInfo() {
    (async function asyncSetUserInfo() {
      var userInfoResponse;
      var role;

      {
        let { data } = await auth.getUserInfo(token);

        setUserName(data.data.name);

        if (data?.data?.profile_image?.length > 0) {
          setTempPhoto(data.data.profile_image);
        } else {
          setTempPhoto(null);
        }

        userInfoResponse = data.data;
        role = roles.find(function getUserRole(_role) {
          return _role.value === userInfoResponse.roles[0].name;
        });
      }

      setDealerName(userInfoResponse.dealer_name);
      setCompanyName(userInfoResponse.company_name);
      setIsSoloWork(userInfoResponse.works_alone);
      //setUserName(userInfo.name);
      setOccupation({
        forSend: [role.value],
        forInput: [role.label],
      });
      //setTempPhoto(userInfoResponse.profile_image);
    })();
  }, []);

  return (
    <Fragment>
      <SafeAreaView>
        <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        <HeaderBar
          title={'Редактирование профиля'}
          backButton={true}
          goBackFlag={true}
          menuFlag={false}
          nav={navigation}
          route={route}
          screenBack={'AllReportsScreen'}
        >
          <Fragment>
            <View style={styles.wrapper}>
              <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                  <FieldAvatar
                    removePhoto={removePhoto}
                    dowloadFoto={dowloadFoto}
                    value={tempPhoto}
                    setValue={setTempPhoto}
                  />
                  <FieldInput
                    field={{ name: 'Имя', required: 0 }}
                    value={userName}
                    required={true}
                    validateFlag={isValidateUserName}
                    validateFunc={name => setIsValidateUserName(name.length > 2)}
                    validateOnType={true}
                    setValidate={setIsValidateUserName}
                    setValue={setUserName}
                    multiline={true}
                    height={55}
                    maxHeight={55}
                  />
                  {userNameErrors.length > 0 ? (
                    <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                      {userNameErrors.join('\n')}
                    </Text>
                  ) : (
                    <></>
                  )}
                  <FieldModal
                    field={{ name: 'Род деятельности' }}
                    value={occupation}
                    showModal={setIsOpenChooseUserRole}
                    validateFlag={isValidateUserRole}
                    setValidate={setIsValidateUserRole}
                  />
                  {occupation.forSend[0] === 'dealer' && (
                    <View>
                      <FieldInput
                        field={{ name: 'Название диллера', required: 0 }}
                        value={dealerName}
                        setValue={setDealerName}
                      />
                    </View>
                  )}
                  {occupation.forSend[0] === 'recruitment_specialist' && (
                    <View>
                      <View style={{ paddingTop: 4, paddingBottom: 2 }}>
                        <FieldCheckSwitch
                          field={{ name: 'Работаю один', required: 0 }}
                          value={isSoloWork}
                          setValue={setIsSoloWork}
                          type={'switch'}
                        />
                      </View>
                      {!isSoloWork && (
                        <FieldInput
                          field={{ name: 'Название компании', required: 0 }}
                          value={companyName}
                          setValue={setCompanyName}
                        />
                      )}
                      {!isSoloWork && companyError.hasError ? (
                        <Text style={[theme.FONTS.body_SF_R_14, styles.errorMessage]}>
                          {companyError.text}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
                  )}
                  <View style={styles.requisiteLabel}>
                    <Text>{userInfo.phone}</Text>
                    <TouchableOpacity
                      onPress={function navigateToEditPhone() {
                        navigation.navigate('EditPhoneScreen');
                      }}
                    >
                      <Text style={styles.requisiteTextButton}>Изменить номер</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.requisiteLabel}>
                    <Text>{'**********************'}</Text>
                    <TouchableOpacity
                      onPress={function navigateToEditPassword() {
                        navigation.navigate('EditPasswordScreen');
                      }}
                    >
                      <Text style={styles.requisiteTextButton}>Изменить пароль</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Fragment>
          <TouchableOpacity
            style={styles.nextButtonWrapper}
            onPress={function () {
              onSubmit();
            }}
          >
            <Text style={[theme.FONTS.body_SF_M_15, styles.nextBtn]}>Сохранить изменения</Text>
          </TouchableOpacity>
        </HeaderBar>
      </SafeAreaView>

      <ModalChoose
        title={'Выберите свой род деятельности'}
        isOpen={isOpenChooseUserRole}
        closeModal={setIsOpenChooseUserRole}
        setValue={setOccupation}
        data={roles}
        type={'radiobuttonOneButton'}
        current={occupation}
      />
    </Fragment>
  );
};

export default EditProfileScreen;
