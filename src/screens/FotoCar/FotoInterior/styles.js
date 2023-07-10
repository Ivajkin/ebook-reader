import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 5,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 70,
  },
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
    overflow: 'hidden',
    borderRadius: 100,
  },
  nextButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  nextBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
});
