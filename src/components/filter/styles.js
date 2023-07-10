import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { COLORS, SIZES } from '../../сonstants';

const styles = StyleSheet.create({
  headerBrandBackWrapper: {
    //borderWidth: 1,
    height: 32,
    width: 32,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingBottom: 50,
    zIndex: 0,
  },

  headerBrandWrapper: {
    borderTopWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    height: 50,
  },
  headerBrandBackImage: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  inputVinInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
  },
  inputVin: {
    width: '90%',
    height: 50,
  },
  inputVinText: {
    height: 50,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: SIZES.padding,
    paddingLeft: 5,
    paddingRight: 5,
  },
  nextBtn: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 7,
    paddingBottom: 7,
  },
  fieldIconRight: {
    width: 8,
    height: 15,
    //rotation: 90,
    transform: [{ rotateY: '90deg' }],
  },
  fieldIconDown: {
    width: 8,
    height: 15,
    //rotation: 90,
    transform: [{ rotateY: '90deg' }],
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  scrollContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputInner: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  inputText: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  nonStandartVinCheckbox: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  CheckBoxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
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
  findBtnText: {
    backgroundColor: COLORS.red,
    textAlign: 'center',
    color: COLORS.primary,
    paddingTop: 15,
    paddingBottom: 15,
  },
  findBtnWrapper: {
    backgroundColor: COLORS.red,
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.body14,
    color: '#333333',
  },
  errorMessage: {
    color: COLORS.red,
    paddingLeft: 0,
  },
  callView: {
    height: '100%',
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1);',
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 5,
  },

  callIcon: { width: 13, height: 13, },
  callText: { fontSize: 10, color: '#FF3B30' },
});

export { styles };
