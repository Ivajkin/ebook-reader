import { StyleSheet } from 'react-native';
import { COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  allWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    zIndex: 0,
  },
  container: {
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  ico: {
    width: 46,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.black,
  },
});

export { styles };
