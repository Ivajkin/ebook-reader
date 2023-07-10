import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  wrapper: {
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
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
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
  },
});
