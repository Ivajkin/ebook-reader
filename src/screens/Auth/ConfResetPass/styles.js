import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowLeftInner: {
    height: 50,
    width: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    width: 14,
    height: 14,
  },
  title: {
    paddingLeft: 19,
  },
  wrapper: {
    height: '100%',
  },
  container: {
    paddingTop: 10,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingBottom: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    //flex: 1,
  },
  text: {
    textAlign: 'center',
    paddingBottom: 18,
  },
  btn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    marginTop: 5,
  },
  link: {
    textDecorationLine: 'underline',
    color: COLORS.red,
    textAlign: 'center',
  },
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
  },

  emptyFiller: {
    width: '100%',
    height: '100%',
  },
});

export { styles };
