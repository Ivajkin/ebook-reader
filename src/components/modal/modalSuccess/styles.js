import { StyleSheet } from 'react-native';
import { COLORS } from '../../../сonstants';

export const styles = StyleSheet.create({
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
  modalTouchableInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalText: {
    textDecorationLine: 'underline',
  },
  modalMessage: {
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalExit: {
    zIndex: 2,
    flex: 1,
    //backgroundColor: 'red'
  },
});
