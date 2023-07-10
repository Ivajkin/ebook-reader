import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingBottom: 20,
  },
  STSInputInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
