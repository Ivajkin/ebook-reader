import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 25,
  },
  nextButtonWrapper: {
    width: '100%',
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
