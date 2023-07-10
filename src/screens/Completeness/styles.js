import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingTop: 25,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
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
