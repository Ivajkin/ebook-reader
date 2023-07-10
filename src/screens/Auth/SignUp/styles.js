import { StyleSheet, Platform } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },
  container: {
    flex: 1,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  title: {
    textAlign: 'center',
    paddingTop: 11,
    paddingBottom: 11,
  },
  scrollInner: {
    flexGrow: 1,
  },
  scrollContent: {
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    flexGrow: 1,
  },
  inputWrapper: {
    paddingBottom: 33,
  },
  text: {
    paddingTop: 10,
    paddingBottom: 6,
    textAlign: 'center',
  },
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
    //borderWidth: 1,
  },
  regBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    borderRadius: 10,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    marginTop: 5,
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
