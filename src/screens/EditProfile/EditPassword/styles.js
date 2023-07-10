import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SIZES, COLORS } from '../../../сonstants';

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
  inputInner: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
    borderColor: COLORS.gray,
  },
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: SIZES.padding,
    paddingLeft: 5,
    paddingRight: 5,
  },
  input: {
    height: 50,
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
  errorMessage: {
    color: COLORS.red,
  },
});
