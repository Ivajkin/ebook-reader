import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

export const styles = StyleSheet.create({
  fotoPickerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  fotoPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.red,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radius,
    width: '49%',
  },
  fotoPickerText: {
    color: COLORS.red,
    paddingLeft: 12,
  },
  fotoInner: {
    width: '100%',
    paddingBottom: 5,
    paddingTop: 5,
    position: 'relative',
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
