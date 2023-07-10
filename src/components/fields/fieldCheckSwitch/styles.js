import { StyleSheet } from 'react-native';
import { SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
  nonStandartVinCheckbox: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  CheckBoxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginTop: 8,
    //marginBottom: 8,
    //borderWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  switchBoxTextInner: {
    width: SIZES.width - SIZES.padding * 2 - 50,
  },
  switchBoxText: {},
  nonStandartVinWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkBoxLabelInner: {
    width: SIZES.width - SIZES.padding * 2 - 25 - 10,
    flex: 1,
    justifyContent: 'center',
  },
});

export { styles };
