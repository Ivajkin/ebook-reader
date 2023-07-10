import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

export default StyleSheet.create({
  headerBarWrapper: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
    height: '100%',
  },
  headerBarBeforeContentWrapper: {
    width: '100%',
    height: 50,
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    borderTopWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  mainLogo: {
    width: 80,
    height: 38,
  },
  mainLogoImg: {
    resizeMode: 'contain',
  },
  headerMenuImgStyle: {
    //width: 20,
    //height: 16,
  },
  headerMenuPoints: {
    width: 50,
    marginRight: -SIZES.padding,
    paddingRight: SIZES.padding,
    height: 50,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBarBackWrapper: {
    width: 33,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 3,
  },
  headerBarBackImage: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  headerBarNextkWrapper: {
    transform: [{ rotateY: '180deg' }],
  },
  headerBarLeftSideWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  sideMenuWrapper: {
    backgroundColor: COLORS.lightBlack,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    right: 0,
    top: 0,
  },
  sideMenuMain: {
    backgroundColor: 'white',
    zIndex: 500,
  },
});
