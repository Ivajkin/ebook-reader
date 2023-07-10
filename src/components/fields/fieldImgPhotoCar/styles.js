import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  photoContainer: {
    borderColor: COLORS.red,
  },
  errorMessage: {
    color: COLORS.red,
    textAlign: 'right',
    paddingRight: SIZES.padding,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },
  foto: {
    width: '100%',
    height: 182,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  imageBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  imageBtn: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 100,
    marginRight: 5,
    marginLeft: 5,
  },

  fotoDelete: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    padding: 12,
    overflow: 'hidden',
    borderRadius: 100,
  },
});
