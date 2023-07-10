import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingBottom: 50,
    zIndex: 0,
    backgroundColor: 'red',
    //paddingTop: 200, //Platform.OS === 'ios' ? 100 : 0,
  },
  sectionList: {
    paddingHorizontal: SIZES.padding,
    //borderWidth: 1,
    //paddingBottom: 40,
  },
  headerBrandWrapper: {
    marginTop: Platform.OS === 'ios' ? 50 : 0,
    //borderTopWidth: 1,
    //backgroundColor: 'red',
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
  footer: {
    width: '100%',
    height: 100,
    borderRadius: SIZES.radius,
    borderColor: COLORS.gray,
    //borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SIZES.padding,
  },
});

export default styles;
