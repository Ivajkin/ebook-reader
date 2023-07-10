import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../сonstants';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  scroll: {
    flexGrow: 1,
    //paddingBottom: 100,
  },
  interactiveInner: {
    paddingTop: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactiveLeft: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  addBtn: {
    textAlign: 'center',
    color: COLORS.red,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 5,
    width: 70,
  },
  interactiveCenter: {
    width: '40%',
  },
  interactiveImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  interactiveRight: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  interactiveChangeBtn: {
    color: COLORS.red,
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
