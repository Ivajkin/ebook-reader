import { Platform, StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingBottom: SIZES.padding,
    zIndex: 1,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
    backgroundColor: 'red'
  },
  safeArea: {
    flex: 1,
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
    borderWidth: 1
  },
  headerBrandBackWrapper: {
    width: '10%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerBrandInputWrapper: {
    width: '80%',
    //backgroundColor: 'blue',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingBottom: 15
  },
  headerBrandBackImage: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  headerImageWrapper: {
    width: '10%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerBrandSearchImage: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  headerSearchInput: {
    width: '100%',
    height: 55,
    //textAlignVertical: 'bottom',
    paddingTop: 20
  },
  singleBrandWrapper: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingLeft: 0,
    paddingRight: 11,
    paddingBottom: SIZES.padding,
    paddingTop: 15,
    marginBottom: 10,
  },
  singleBrandLogo: {
    width: '20%',
  },
  singleBrandImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  singleBrandTitle: {
    width: '60%',
    marginLeft: 5,
  },
  singleBrandCheckedWrapper: {
    width: '20%',
  },
  singleBrandCheckedImage: {
    height: 10,
    resizeMode: 'contain',
  },
  brandSearchError: {
    width: '100%',
    backgroundColor: COLORS.brightRed,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.red,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding,
    paddingLeft: 25,
    paddingRight: 25,
  },
  brandSearchErrorText: {
    textAlign: 'center',
    color: COLORS.red,
  },
  scrollView: {
    marginBottom: 20,
  },
});

export { styles };
