import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { SIZES, COLORS } from '../../сonstants';

const styles = StyleSheet.create({
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  mainLogo: {
    width: SIZES.width - SIZES.padding * 2,
    height: (190 * (SIZES.width - SIZES.padding * 2)) / 278,
  },
  mainLogoImg: {
    resizeMode: 'contain',
  },
  greeting: {
    paddingTop: 40,
    paddingBottom: 20,
    textAlign: 'center',
  },
  regBtn: {
    textAlign: 'center',
    color: COLORS.primary,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: COLORS.red,
  },
  loginTitle: {
    textAlign: 'center',
  },
  loginBtn: {
    textDecorationLine: 'underline',
    color: COLORS.red,
    textAlign: 'center',
  },
});

export { styles };
