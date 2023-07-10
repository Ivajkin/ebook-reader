import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  singleItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  currentImageWrapper: {
    width: 15,
    height: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  currentText: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal',
    paddingLeft: 11,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: 25,
    paddingBottom: 20,
  },
  modalTouchableInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalText: {
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    width: '40%',
    paddingVertical: 15,
    flexDirection: 'row',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonPress: {
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  exitButtonWrapper: {
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
  },
  exitBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
  floatButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    right: 10,
    bottom: 30,
    borderWidth: 1,
    borderColor: 'red',
  },
  floatButtonImg: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  buttonsExitWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: 40,
  },
});

export { styles };
