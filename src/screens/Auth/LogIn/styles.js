import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },
  title: {
    textAlign: 'center',
    paddingTop: 11,
    paddingBottom: 11,
  },
  container: {
    paddingRight: SIZES.padding,
    paddingLeft: SIZES.padding,
    paddingBottom: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  text: {
    paddingTop: 10,
    paddingBottom: 6,
    textAlign: 'center',
  },
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
  },
  logBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: 'white',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    marginTop: 5,
  },
  linksInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    textDecorationLine: 'underline',
    color: COLORS.red,
    textAlign: 'center',
  },
  bottomPart: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: 'red',
    flexGrow: 2,
  },
  // keyboardDismissArea: {
  //   backgroundColor: '#88eded',
  //   flexGrow: 1,
  //   width: '100%',
  // },
  emptySpace: {
    flex: 1,
  },
});

export { styles };
