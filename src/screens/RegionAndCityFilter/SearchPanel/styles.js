import { StyleSheet, Platform } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    borderRadius: SIZES.radius,
    borderColor: COLORS.gray,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SIZES.padding,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
});

export default styles;
