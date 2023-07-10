import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { styles } from './styles.ts';
import { theme, COLORS, icons, constants } from '../../../../сonstants';
import { useNetInfo } from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import { global } from '../../../../requests';
import { ModalFotoCancel } from '../../../../components/modal';
import CheckListItem from './CheckListItem';
import { FieldInput } from '../../../../components/fields';
import { createThumbnail } from 'react-native-create-thumbnail';
import { addPhotoCrop } from '../../../../utils/photo';
import Video from 'react-native-video';
import Comment from './Comment';

const Panel = props => {
  const netInfo = useNetInfo();
  const [photos, setPhotos] = useState([]);
  const [indexDeleteFoto, setIndexDeleteFoto] = useState(0);
  const [tempPhoto, setPhoto] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [id, setId] = useState(null);
  const [deleteModalIsVisible, setDeleteModalVisible] = useState(false);
  const [widthLocal, setWidthLocal] = useState(null);
  const [commentLocal, setCommentLocal] = useState('');
  const [validateFlag, setValidateFlag] = useState(true);
  const [cameraTypeModalVisible, setCameraTypeModalVisible] = useState(false);
  const [videosAmount, setVideosAmount] = useState(0);
  const [checkListLocal, setCheckListLocal] = useState([
    { isChecked: false, title: 'Некачественный или сильное повреждение', id: '0' },
    { isChecked: false, title: 'Вторичный окрас', id: '1' },
    { isChecked: false, title: 'Элемент заменен', id: '2' },
    { isChecked: false, title: 'Пластиковый элемент', id: '3' },
    { isChecked: false, title: 'Требует окраса', id: '4' },
  ]);

  const getUploaded = async () => {
    let item = props.item;
    setId(item.id);
    if (item.hasOwnProperty('saved_fields') && item.saved_fields.length > 0) {
      let uploadedPhotos = await Promise.all(
        item.saved_fields[0].uploaded_files.map(async ph => {
          if (!(ph.filename.split('.')[1] === 'mp4')) {
            return {
              id: ph.id,
              uri: ph.storage_path720p,
              type: 'photo',
            };
          } else {
            setVideosAmount(n => n + 1);
            let responseThumbnail = await createThumbnail({
              url: ph.storage_path,
            });
            return {
              type: 'video',
              id: ph.id,
              uri: responseThumbnail.path,
              videoUri: ph.storage_path,
            };
          }
        })
      );
      setPhotos(uploadedPhotos);
      let saved_val =
        typeof item.saved_fields[0].val === 'string'
          ? JSON.parse(item.saved_fields[0].val)
          : item.saved_fields[0].val;
      if (saved_val.length > 0) {
        let newWidthField = saved_val.find(el => el.column_name === 'lkp_thicknesses');

        if (newWidthField) {
          console.log('##L', props.getWidth(props.item.id));
          setWidthLocal(props.getWidth(props.item.id));
          //setWidth(newWidthField.val);
        }
        let newCheckListField = saved_val.find(el => el.column_name === 'checklist');

        if (newCheckListField) {
          setCheckListLocal(props.getCheckList(props.item.id));
          //setWidth(newWidthField.val);
        }

        let newCommentField = saved_val.find(el => el.column_name === 'comment');

        if (newCommentField) {
          setCommentLocal(props.getComment(props.item.id));
          //setWidth(newWidthField.val);
        }
      }
    }
  };
  useEffect(() => {
    getUploaded();
  }, []);

  useEffect(() => {
    props.setPhotoCount(props.item.id, photos.length);
  }, [photos]);
  const openGallery = () => {
    addPhotoCrop('gallery', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible, {
      column_name: 'lkp',
      videosAmount: videosAmount,
    });
  };
  const openCamera = () => {
    let amount = photos.filter(ph => ph.type === 'video').length;
    setVideosAmount(amount);
    setCameraTypeModalVisible(true);
    // addPhotoCrop('camera', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible, {
    //   column_name: 'lkp',
    // });
  };

  const openPhotoCamera = () => {
    addPhotoCrop('cameraPhoto', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible, {
      column_name: 'lkp',
    });
    //setCameraTypeModalVisible(false);
  };
  const openVideoCamera = () => {
    addPhotoCrop('cameraVideo', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible, {
      column_name: 'lkp',
    });
    //setCameraTypeModalVisible(false);
  };

  const setWidth = val => {
    props.setWidth(props.item.id, String(val));
    setWidthLocal(String(val));
  };

  const setComment = val => {
    props.setComment(props.item.id, val);
    //setCommentLocal(val);
  };
  const setCheckList = val => {
    props.setCheckList(props.item.id, val);

    setCheckListLocal(val);
  };

  const onVideoLoaded = props => {
    const durationSec = Math.round(props.duration);
    let durationStr = String(durationSec) + 'c';
    let newPhotos = [...photos];
    newPhotos[props.index] = {
      ...newPhotos[props.index],
      duration: durationStr,
    };
    setPhotos(newPhotos);
  };
  async function serverWorkFuncImage(response, loadSetter, extra_args) {
    if (netInfo?.isConnected) {
      if (!extra_args.isVideo) {
        let name = response.name;
        if (response.duration) {
          name = name + '$' + response.duration;
        }
        let uri = response.uri;
        if (uri === undefined) {
          uri = response.path;
        }
        global
          .sendFiles(
            uri,
            name,
            'image/jpeg',
            props.item.id,
            props.reportId,
            props.token,
            `${props.item.column_name}_photo`
          )
          .then(result => {
            if (result.status === 200) {
              setPhotos(arr => [
                ...arr,
                {
                  id: result.data.data.id,
                  uri: result.data.data.storage_path,
                },
              ]);
            }
          })
          .catch(err => console.log('send files error, PanelLKP', err));
      } else {
        global
          .sendFiles(
            response.path,
            response.name,
            'video/mp4',
            props.item.id,
            props.reportId,
            props.token,
            `${props.item.column_name}_video`
          )
          .then(async result => {
            if (result.status === 200) {
              let responseThumbnail = await createThumbnail({
                url: result.data.data.storage_path,
              });

              //getUploaded()
              // let newPhotos = [
              //   ...photos,
              //   {
              //     id: result.data.data.id,
              //     uri: result.data.data.storage_path720p,
              //   },
              // ];
              setVideosAmount(n => n + 1);
              setPhotos(arr => [
                ...arr,
                {
                  id: result.data.data.id,
                  uri: responseThumbnail.path,
                  videoUri: result.data.data.storage_path,
                },
              ]);
            }
          })
          .catch(err => console.log('send files error, serverWorker, panelLKP', err));
      }
    }
    setCameraTypeModalVisible(false);
  }
  return (
    <Collapse
      style={[
        styles.container,
        {
          borderColor: props.validateFlag ? COLORS.gray : COLORS.red,
          backgroundColor: props.validateFlag ? COLORS.primary : COLORS.ping,
        },
      ]}
    >
      <CollapseHeader
        style={styles.inputWrapper}
        //onPress={navigate}
      >
        <Text
          style={[
            theme.FONTS.body_SF_R_15,
            styles.inputText,
            //{ color: count > 0 ? COLORS.black : COLORS.darkGray },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.item.name}
        </Text>
        <View style={styles.inputInner}>
          <View
            style={[
              styles.inputCountWrapper,
              { backgroundColor: photos.length > 0 ? COLORS.red : COLORS.gray },
            ]}
          >
            <Text style={[theme.FONTS.body_R_B_11, styles.inputCount]}>{photos.length}</Text>
          </View>
          <View style={styles.arrowView}>
            <Image source={icons.arrowDown} style={styles.arrow} />
          </View>
        </View>
        <ModalFotoCancel
          modalVisible={deleteModalIsVisible}
          setModalVisible={setDeleteModalVisible}
          modalFotoCancelData={{ fotoArray: photos, setFotoArray: setPhotos }}
          indexDeleteFoto={indexDeleteFoto}
        />
      </CollapseHeader>
      <CollapseBody>
        <FlatList
          data={checkListLocal}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return <CheckListItem item={item} setCheckList={setCheckList} checkList={checkListLocal} />;
          }}
        />
        {!checkListLocal[3].isChecked && (
          <FieldInput
            field={{ name: 'Толщина, мкм', required: 0 }}
            value={widthLocal?String(widthLocal):''}
            setValue={setWidth}
            fieldType={'number-pad'}
            validateFlag={validateFlag}
            setValidate={setValidateFlag}
            maxLength={10}
          />
        )}
        <FlatList
          data={photos}
          keyExtractor={phProps => {
            return phProps.id;
          }}
          horizontal={true}
          renderItem={photoProps => {
            return (
              <>
                <TouchableOpacity style={styles.photoSurface} key={String(photoProps.index) + '$'}>
                  {photoProps.item.type === 'photo' ? (
                    <ImageBackground
                      source={{
                        uri: photoProps.item.uri,
                      }}
                      style={{
                        borderRadius: 5,
                        width: '100%',
                        height: '100%',
                      }}
                      //resizeMethod="contain"
                    />
                  ) : (
                    //<Text>nkl</Text>
                    <ImageBackground
                      source={{
                        uri: photoProps.item.uri,
                      }}
                      style={{
                        borderRadius: 5,
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                      }}
                      //resizeMethod="contain"
                    >
                      {photoProps.item.hasOwnProperty('duration') && (
                        <View style={styles.durationView}>
                          <Text style={styles.durationText}>{photoProps.item.duration}</Text>
                        </View>
                      )}
                      <Video
                        source={{ uri: photoProps.item.videoUri }}
                        onLoad={props => {
                          onVideoLoaded({ ...props, index: photoProps.index });
                        }}
                      />
                    </ImageBackground>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoDelete}
                  onPress={() => {
                    setIndexDeleteFoto(photoProps.index);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Image style={{ width: 17, height: 17 }} source={icons.deleteFoto} />
                </TouchableOpacity>
              </>
            );
            //return <Image source={{ uri: props.item }} style={{width: '100%', height: 400}}/>;
            //
          }}
        />
        <View style={styles.photoPickerInner}>
          <TouchableOpacity
            style={styles.photoPickerBtn}
            onPress={openGallery}
            // onPress={() => {
            //   addPhoto('gallery', tempPhoto, setPhoto, serverWorkFuncImage, setLoaderVisible, {
            //     column_name: 'extra_doc_foto',
            //   });
            // }}
          >
            <Image style={{ width: 16, height: 13 }} source={icons.downloadFoto} />
            <Text style={styles.photoPickerText}>Загрузить фото</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoPickerBtn} onPress={openCamera}>
            <Image style={{ width: 16, height: 14 }} source={icons.makeFoto} />
            <Text style={styles.photoPickerText}>Камера</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimerView}>
          <Text style={styles.disclaimerText}>Максимум 15 фото и\или 10 видео
            (1 минуты каждое)</Text>
        </View>
        <Comment commentLocal={commentLocal} setComment={setComment} />

        <Modal visible={cameraTypeModalVisible}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.typeButton} onPress={openPhotoCamera}>
              <Text style={styles.typeButtonText}>Снять фото</Text>
            </TouchableOpacity>
            {videosAmount < 10 && (
              <TouchableOpacity style={styles.typeButton} onPress={openVideoCamera}>
                <Text style={styles.typeButtonText}>Снять видео</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setCameraTypeModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Назад</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </CollapseBody>
    </Collapse>
  );
};

const mapStateToProps = state => {
  return {
    token: state.appGlobal.loginToken,
    reportId: state.appGlobal.reportId,
    sectionList: state.appGlobal.sectionList,
  };
};
export default connect(mapStateToProps, null)(Panel);
