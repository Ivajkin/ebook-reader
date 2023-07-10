import React, { Fragment, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const FieldAvatar = ({
  preview = '',
  value = '',
  setValue = () => {},
  makePhoto = () => {},
  dowloadFoto = () => {},
  removePhoto = () => {},
}) => {
  return (
    <Fragment>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => dowloadFoto(value, setValue)}>
          <View style={styles.avatarCircle}>
            {value ? (
              <Image style={{ width: '100%', height: '100%' }} source={{ uri: value }} />
            ) : (
              <></>
              // <Image style={{ width: 24, height: 24 }} />
            )}
          </View>
        </TouchableOpacity>
        {value ? (
          <TouchableOpacity onPress={() => removePhoto()}>
            <Text style={styles.textButton}>Удалить фото</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => dowloadFoto(value, setValue)}>
            <Text style={styles.textButton}>Галерея</Text>
          </TouchableOpacity>
        )}
      </View>
    </Fragment>
  );
};

export default FieldAvatar;
