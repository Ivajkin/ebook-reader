import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
  inputInner: {
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
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: 11,
    paddingLeft: 5,
    paddingRight: 5,
    color: COLORS.darkGray,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    paddingLeft: 0,
    paddingRight: 0,
  },
  secureInput: {
    height: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export { styles };
