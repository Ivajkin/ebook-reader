import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { COLORS, SIZES } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingBottom: 50,
    zIndex: 0,
  },
  mainWrapper: {
    paddingBottom: 0,
    flexGrow: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  signatureWrapper: {
    height: '50%',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E5E5EA',
    //resizeMode: 'contain',
  },
  signatureText: {
    color: '#858585',
    textAlign: 'center',
    width: '60%',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  clearWrapper: {
    marginTop: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 10,
  },
  clearText: {
    textAlign: 'center',
    color: '#FF3B30',
  },
  nextBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },

  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
});

export { styles };
