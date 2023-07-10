import React, { useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { COLORS, icons, theme } from '../../../сonstants';
import AdditionalPhoto from './AdditionalPhoto/AdditionalPhoto';
import { styles } from './styles';
const AdditionalPhotos = props => {
  //const dowloadFoto = props.dowloadFoto;
  const buttonsBlock = (
    <View style={styles.fotoPickerInner}>
      <TouchableOpacity
        style={styles.fotoPickerBtn}
        onPress={() => {
          //console.log('#Y1', props.value);
          props.dowloadFoto(props.value, () => {});
        }}
      >
        <Image style={{ width: 16, height: 13 }} source={icons.downloadFoto} />
        <Text style={[theme.FONTS.body_SF_M_12, styles.fotoPickerText]}>Галерея</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fotoPickerBtn}
        onPress={() => {
          props.makeFoto(props.value, () => {});
        }}
      >
        <Image style={{ width: 16, height: 14 }} source={icons.makeFoto} />
        <Text style={styles.fotoPickerText}>Камера</Text>
      </TouchableOpacity>
    </View>
  );
  console.log('#I0', props.value);

  return (
    <>
      {props.value?.length > 0 ? (
        <FlatList
          contentContainerStyle={{ justifyContent: 'flex-start', flexDirection: 'column' }}
          //style={{ backgroundColor: 'green', }}
          data={props.value}
          ListFooterComponent={buttonsBlock}
          renderItem={({ item, i }) => {
            return <AdditionalPhoto item={item} i={i} value={props.value} setValue={props.setValue} />;
          }}
          keyExtractor={(item, index) => String(index) + '$'}
        />
      ) : (
        buttonsBlock
      )}
    </>
  );
};
export default AdditionalPhotos;
