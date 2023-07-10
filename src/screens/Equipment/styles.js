import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { COLORS } from '../../сonstants';

const styles = StyleSheet.create({
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  container: {
    width: '100%',
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  nextBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
  nextButtonWrapper: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
  },
});

export { styles };
