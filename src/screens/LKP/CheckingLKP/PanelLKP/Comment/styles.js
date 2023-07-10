import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES, theme } from '../../../../../сonstants';
export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
  },
  inputInner: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    height: 110,
  },
  inputTitle: {
    // position: 'absolute',
    // top: 3,
    // left: 15,
    //paddingLeft: 5,
    paddingRight: 5,
    color: COLORS.darkGray,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%'
  },
  secureInput: {
    height: 32,
    width: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTitleView: {
  }
});
