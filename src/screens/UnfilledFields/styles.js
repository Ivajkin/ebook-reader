import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingBottom: 50,
    zIndex: 0,
  },
  mainWrapper: {
    paddingBottom: 0,
    flexGrow: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  signatureWrapper: {
    height: '50%',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E5E5EA',
  },
  signatureText: {
    color: '#858585',
    textAlign: 'center',
    width: '60%',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  clearWrapper: {
    marginTop: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 10,
  },
  clearText: {
    textAlign: 'center',
    color: '#FF3B30',
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
  title: {
    marginTop: 17,
  },
  titleText: {
    ...FONTS.body_R_R_14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionsWrapper: {
    marginTop: 15,
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  modalViewWrapper: {
    backgroundColor: COLORS.substrate,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalViewWrapperContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    overflow: 'hidden',
    paddingTop: 23,
    paddingBottom: 16,
    paddingLeft: 35,
    paddingRight: 35,
    width: '92%',
  },
  modalTitle: {
    color: COLORS.black,
    textAlign: 'center',
  },
  modalSubTitle: {
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 5,
  },
  modalTouchableInner: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalText: {
    textDecorationLine: 'underline',
  },
  modalMessage: {
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapperAnswer: {
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    borderRadius: 2,
    overflow: 'hidden',
  },
  modalExit: {
    zIndex: 2,
    flex: 1,
    //backgroundColor: 'red'
  },
});

export { styles };
