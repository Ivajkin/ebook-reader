import { Platform, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../сonstants';

const styles = StyleSheet.create({
  inputInnerAllPlatforms: {
    //height: 55,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    //overflow: 'hidden',
    paddingLeft: SIZES.padding,
    paddingRight: SIZES.padding,
    paddingVertical: 0,
    //position: 'relative',
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    //justifyContent: 'flex-start',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
    //height: 150,
  },
  inputInnerSingleLine: {
    height: 55,
    //alignItems: 'center'
  },
  // inputInnerAndroid: {
  //   //height: 55,
  //   borderWidth: 1,
  //   borderRadius: SIZES.radius,
  //   //overflow: 'hidden',
  //   paddingLeft: SIZES.padding,
  //   paddingRight: SIZES.padding,
  //   paddingVertical: 0,
  //   //position: 'relative',
  //   marginTop: 5,
  //   marginBottom: 5,
  //   flexDirection: 'row',
  //   //justifyContent: 'flex-start',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   //backgroundColor: 'red',
  //   //height: 150,
  // },
  inputTitle: {
    //position: 'absolute',
    //top: 3,
    //left: 15,
    //marginBottom: 50,
    //paddingBottom: 10,
    //paddingLeft: 5,
    //borderColor: 'green',
    //borderWidth: 1,
    paddingRight: 5,
    color: COLORS.darkGray,
  },
  inputTitleAndroid: {
    //backgroundColor: 'blue',
    color: COLORS.darkGray,
  },
  inputIOS: {
    //marginTop: Platform.OS === 'ios' ? 10 : 0,
    //borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //flex: 1,
    //color: COLORS.darkGray,
    //paddingBottom: 5,

    alignSelf: 'center',
    height: '100%',
    width: '100%',
    textAlignVertical: 'center',
    marginBottom: 2,
    //backgroundColor: 'green',
  },
  inputAndroid: {
    width: '100%',
    color: COLORS.black,
    height: '100%',
    //height: 30,
    //backgroundColor: 'red',
    //lineHeight: 10,
    padding: 0,
  },
  secureInput: {
    height: 32,
    width: 32,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftBlockIOS: {
    flexDirection: 'column',
    justifyContent: 'center',
    //backgroundColor: 'red',
    //paddingVertical: 5,
    //height: '100%',
    //borderWidth: 1,
    flexGrow: 1,
    //width: '100%',
    //borderColor: 'green',
    alignItems: 'center',
    //backgroundColor: 'blue',
  },
  textViewIOS: {
    //backgroundColor: 'green',
    alignSelf: 'flex-start',
  },
  leftBlockAndroid: {
    //height: '100%',
    width: '90%',
    justifyContent: 'center',
  },
  leftBlockSingleLine: {
    height: '100%',
  },
});

// const styles = StyleSheet.create({
//   mainContainer: {
//     flexDirection: 'column',
//     width: '100%',
//     borderWidth: 1,
//     marginBottom: 5,
//     borderRadius: SIZES.radius,
//     padding: 5,
//   },
//   textInput: {},
// });

export { styles };