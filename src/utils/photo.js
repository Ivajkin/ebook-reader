import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import { constants } from '../сonstants';
export function addPhoto(
  type,
  array,
  fArray,
  serverWorkFunc,
  setLoaderVisible,
  extra_args = null,
  needImageData = false
) {
  let launchFunc = null;
  if (type === 'camera') {
    launchFunc = launchCamera;
  } else {
    launchFunc = launchImageLibrary;
  }

  launchFunc(
    {
      includeBase64: false,
    },
    value => {
      if (!value.didCancel) {
        let imgData = 'assets' in value ? value.assets[0] : value;
        console.log('still ok', value);
        if (needImageData) {
          extra_args = { ...extra_args, imgData: imgData };
        }
        if (imgData) {
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
              console.log('resp', response);
              fArray(arr => [...arr, { id: null, photo: response.name }]);
              serverWorkFunc(response, setLoaderVisible, extra_args);
            })
            .catch(err => {
              setLoaderVisible(false);
              console.log('add photo, photo utils, createResized err', err);
            });
        }
      }
    }
  );
}

export function addPhotoCrop(
  type,
  array,
  fArray,
  serverWorkFunc,
  setLoaderVisible,
  extra_args = null,
  needImageData = false
) {
  let launchFunc = null;
  let options = { includeBase64: false };
  const afterFunc = images_ => {
    let images = images_;
    if (type === 'cameraPhoto' || type === 'cameraVideo') {
      images = [images_];
    }
    images.map(async imgData => {
      if (type === 'cameraVideo') {
        let nameAr = imgData.path.split('/');
        let name = nameAr[nameAr.length - 1];
        await fArray(arr => [...arr, { id: null, photo: name }]);
        await serverWorkFunc({ ...imgData, name: name }, setLoaderVisible, {
          ...extra_args,
          isVideo: true,
          duration: null,
        });
      } else {
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
          imgData.path,
          resizeWidth,
          resizeHeight,
          constants.imgCompress.compressFormat,
          constants.imgCompress.quality,
          0,
          null
        )
          .then(async response => {
            await fArray(arr => [...arr, { id: null, photo: response.name }]);
            await serverWorkFunc(response, setLoaderVisible, {
              ...extra_args,
              isVideo: false,
              duration: null,
            });
            //console.log('arr', response.name);
          })
          .catch(err => {
            setLoaderVisible(false);
            console.log('add photo crop, photo utils, createResized err', err);
          });
      }
    });
  };
  if (type === 'cameraVideo') {
    //launchFunc = ImagePicker.openCamera;
    options = { ...options, mediaType: 'video', durationLimit: 60 };

    launchCamera(options, res => {
      let images_ = { ...res, path: res.uri };
      afterFunc(images_);
    });
  } else if (type === 'cameraPhoto') {
    options = { includeBase64: false };
    launchCamera(options, res => {
      if (!res.didCancel) {
        let images_ = { ...res, path: res.uri };
        afterFunc(images_);
      }
    });
  } else {
    launchFunc = ImagePicker.openPicker;
    options = {
      ...options,
      multiple: true,
      mediaType: extra_args.videosAmount < 10 ? 'any' : 'photo',
      durationLimit: 2,
    };
    launchFunc(options)
      .then(images_ => {
        afterFunc(images_);
      })

      .catch(e => console.log('image picker error, photo utils', e));
  }
}
