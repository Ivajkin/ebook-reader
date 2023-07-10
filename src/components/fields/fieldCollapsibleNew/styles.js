import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

export const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius, 
  },
  inputWrapper: {
    overflow: 'hidden',
    position: 'relative',
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
