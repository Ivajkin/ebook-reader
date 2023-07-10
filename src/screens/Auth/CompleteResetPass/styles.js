import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },
  title: {
    textAlign: 'center',
    paddingBottom: 11,
    paddingTop: 11,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    paddingTop: 10,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  text: {
    textAlign: 'center',
    paddingTop: 10,
    textAlign: 'center',
  },
  lock: {
    width: SIZES.width - SIZES.padding * 2,
    height: (190 * (SIZES.width - SIZES.padding * 2)) / 278,
  },
  lockImg: {
    marginTop: 40,
    resizeMode: 'contain',
  },
  btn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    marginTop: 26,
  },
});

export { styles };
