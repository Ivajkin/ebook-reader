import { StyleSheet } from 'react-native';
import { COLORS, SIZES, theme } from '../../../../сonstants';
import { Platform } from 'react-native';

export default StyleSheet.create({
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
    //paddingBottom: 16,
    //paddingHorizontal: 35,
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.black,
    textAlign: 'center',
    paddingBottom: 20,
    paddingHorizontal: 35,
  },
  modalTouchableInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    marginTop: 20,
  },
  modalText: {
    textDecorationLine: 'underline',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  modalBtn: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    width: '48%',
    flex: 1,
    alignItems: 'center',
  },
  modalBtnText: {
    ...theme.FONTS.body_R_R_14,
    color: COLORS.red,
  },
  modalBtnPrimary: {
    backgroundColor: COLORS.red,
    borderRadius: SIZES.radius,
    color: 'white',
  },
});
