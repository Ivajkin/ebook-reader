import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
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
    paddingBottom: 10,
    paddingLeft: 35,
    paddingRight: 35,
    width: '92%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.black,
    textAlign: 'center',
    paddingBottom: 10,
  },
  modalTouchableInner: {
    paddingTop: 10,
    width: '100%',
    flexDirection: 'column',
  },
  modalBtnInner: {},
  modalBtn: {
    textAlign: 'center',
    color: COLORS.red,
    paddingTop: 7,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: SIZES.radius,
  },
  modalCancel: {
    textDecorationLine: 'underline',
    color: COLORS.grayishBlue,
    textAlign: 'center',
  },
  inputInner: {
    width: '100%',
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
  buttonWrapper: {
    paddingVertical: 15,
  },
  cancelView: {
    //backgroundColor: COLORS.red,
    padding: SIZES.padding,
    //marginVertical: 5,
    borderRadius: SIZES.radius,
    width: '49%',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.red,
    textDecorationLine: 'underline',
  },
  applyView: {
    //borderWidth: 1,
    //borderColor: COLORS.red,
    backgroundColor: COLORS.red,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    //marginVertical: 5,
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
  },
  buttonsView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
