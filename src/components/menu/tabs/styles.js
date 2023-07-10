import { StyleSheet } from 'react-native';
import { SIZES } from '../../../сonstants';

export default styles = StyleSheet.create({
  headerTabs: {
    width: '100%',
    paddingTop: 6,
    paddingBottom: SIZES.padding,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    flexDirection: 'row',
  },
  tabsItemWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginRight: 20,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  tabsItemText: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  backWrapper: {
    width: 25,
    //height: 50,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    flexDirection: 'row',
    zIndex: 3,
  },
  backImage: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  nextkWrapper: {
    width: 25,
    //height: 50,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    flexDirection: 'row',
    zIndex: 3,
    //backgroundColor: 'red',
    transform: [{ rotateY: '180deg' }],
  },
});
