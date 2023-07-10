import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  deleteElementInner: {
    position: 'absolute',
    top: 12,
    right: 15,
    zIndex: 5,
  },
  deleteElement: {
    color: COLORS.red,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: SIZES.radius,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingTop: 5,
    paddingBottom: 5,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
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
    left: 15,
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
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
});
