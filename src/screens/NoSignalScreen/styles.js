import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  toMainBtn: {
    backgroundColor: COLORS.red,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  toMainBtnText: {
    ...FONTS.body_SF_M_15,
    color: COLORS.primary,
  },
  noConnectionView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  noConnectionText: {
    ...FONTS.body_SF_R_16,
    color: COLORS.lightGrey,
  },
  noConnectionCentralView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
