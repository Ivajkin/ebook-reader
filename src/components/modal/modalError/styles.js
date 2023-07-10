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
    paddingBottom: 20,
  },
  modalTouchableInner: {
    paddingTop: 10,
    paddingBottom: 10,
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
});
