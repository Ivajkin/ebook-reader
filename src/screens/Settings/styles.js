import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES, theme } from '../../сonstants';

const styles = StyleSheet.create({
  scrollInner: {
    width: '100%',
  },
  scroll: {
    flex: 1,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
  },
  radioContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: SIZES.padding,
  },
  headerText: {
    ...theme.FONTS.body_R_R_16,
    fontSize: SIZES.h1,
    fontWeight: '500',
  },
});

export { styles };
