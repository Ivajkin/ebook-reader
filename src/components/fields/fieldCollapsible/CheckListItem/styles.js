import { StyleSheet } from 'react-native';
import { FONTS, SIZES } from '../../../../сonstants';

const styles = StyleSheet.create({
  container: { padding: 0, marginLeft: 0, width: 25, height: 25 },
  iconStyle: { width: 25, height: 25 },
  text: {
    ...FONTS.body_SF_R_14,
  },
  checkBoxLabelInner: {
    width: SIZES.width - SIZES.padding * 2 - 25 - 10,
    flex: 1,
    justifyContent: 'center',
  },
  nonStandartVinCheckbox: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cityWrapper: {
    paddingLeft: 32,
  },
});

export default styles;
