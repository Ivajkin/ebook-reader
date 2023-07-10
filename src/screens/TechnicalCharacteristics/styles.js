import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { COLORS, SIZES } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingBottom: 50,
    zIndex: 0,
  },
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
  },

  inputVinInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
  },
  inputVin: {
    width: '90%',
    height: 50,
  },
  inputVinText: {
    height: 50,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: SIZES.padding,
    color: COLORS.darkGray,
    //paddingLeft: 5,
    paddingRight: 5,
  },
  nextBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
  fieldIconRight: {
    width: 7,
    height: 13,
  },
  fieldIconDown: {
    width: 13,
    height: 7,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
});

export { styles };
