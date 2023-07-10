import { Platform, StyleSheet } from "react-native";
import { COLORS, SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
  modalExit: {
    flex: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalViewWrapper: {
    backgroundColor: COLORS.substrate,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTypeViewWrapperContent: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    overflow: 'hidden',
    width: '92%',
    maxHeight: SIZES.height - 150,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  scrollWrapper: {
    maxHeight: SIZES.height - 270,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    width: '100%',
  },
  scroll: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  modalTypeTitle: {
    color: COLORS.black,
    textAlign: 'left',
    paddingBottom: 10,
    paddingTop: 23,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  modalTypeRadioWrapper: {
    maxHeight: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalEndTouchableText: {
    color: COLORS.red,
    textAlign: 'center',
    textDecorationLine: 'underline',
    paddingHorizontal: 20,
    paddingVertical: 15,
    //backgroundColor: 'red'
  },
  modalChooseEndTouchableText: {
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.red,
    color: 'white',
    borderRadius: 10,
  },
  CheckBoxWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  CheckBoxText: {
    width: '75%',
    justifyContent: 'center',
  },
  modalTypeBtnInner: {
    margin: 10,
    width: '100%',
    flexDirection: 'row',
  },
  crossWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
});

export { styles };
