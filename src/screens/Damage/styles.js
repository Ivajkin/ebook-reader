import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../сonstants';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  imageInner: {
    width: '100%',
    height: 175,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  addElementBtnInner: {
    marginTop: 15,
  },
  addElementBtn: {
    textAlign: 'center',
    color: COLORS.red,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: SIZES.radius,
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

export { styles };
