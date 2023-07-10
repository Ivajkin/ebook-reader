import { StyleSheet } from 'react-native';
import { COLORS } from '../../../сonstants';

export default styles = StyleSheet.create({
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
});
