import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

export const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'center',
    width: '85%',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputCount: {
    color: COLORS.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '100%',
  },
  inputCountWrapper: {
    marginRight: 9,
    width: 20,
    height: 20,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
