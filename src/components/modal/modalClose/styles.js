import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

export default styles = StyleSheet.create({
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
  modalContinueTouchable: {
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: COLORS.red,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    width: '100%',
    paddingTop: 7,
    paddingBottom: 7,
  },
  modalContinueTouchableText: {
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalEndTouchable: {
    width: '100%',
    paddingVertical: 15,
  },
  modalEndTouchableText: {
    color: COLORS.red,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
