import { StyleSheet } from 'react-native';
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
    // paddingTop: 23,
    paddingBottom: 10,
    // paddingLeft: SIZES.padding,
    // paddingRight: SIZES.padding,
    width: '92%',
    maxHeight: SIZES.height - 150,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalTypeTitle: {
    color: COLORS.black,
    textAlign: 'left',
    paddingTop: 23,
    paddingBottom: 10,
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
  modalTypeCancel: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalEndTouchableText: {
    color: COLORS.red,
    textAlign: 'center',
    textDecorationLine: 'underline',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  modalControlViewWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingTop: 30,
  },
  scrollWrapper: {
    width: '100%',
    maxHeight: SIZES.height - 350,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    //
  },
  scroll: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    //backgroundColor: 'red',
    alignItems: 'flex-start',
  },
});

export { styles };
