import { Platform } from 'react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export const COLORS = {
  whiteTransparent: 'rgba(255, 255, 255, 0.5)',
  primary: '#fff',
  transparentPrimray: 'rgba(227, 120, 75, 0.4)',
  red: '#FF3B30',
  transparentRed: 'rgba(255, 7, 7, 0.5)',
  ping: 'rgba(255, 7, 7, 0.05)',
  black: '#000000',
  gray: '#e5e5ea',
  darkGray: '#858585',
  transparent: 'transparent',
  veryLightGray: '#ddd',
  lightBlack: 'rgba(51, 51, 51, 0.7)',
  none: 'rgba(0,0,0,0)',
  strongLimeGreen: '#2FCF2C',
  vividRed: 'rgba(255, 59, 48, .1)',
  vividRed3: 'rgba(255, 59, 48, 0.3)',
  substrate: 'rgba(0,0,0,0.6)',
  grayishBlue: '#b2b2bb',
  lightGray: '#C8C8C8',
  brightRed: 'rgba(251, 67, 67, 0.1)',
  lightGrey: '#333333',
};
export const SIZES = {
  // global sizes
  font: 14,
  radius: 10,
  padding: 15,

  // font sizes
  h1: 18,
  h2: 17,
  h3: 16,
  h4: 14,
  body: 16,
  body15: 15,
  body14: 14,
  body13: 13,
  body12: 12,
  body11: 11,
  body10: 10,
  body9: 9,

  // app dimensions
  width,
  height,
};
export const FONTS = {
  h1: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    fontSize: SIZES.h1,
    lineHeight: 28,
    fontWeight: '500',
  },
  h2: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.h2,
    lineHeight: 28,
    fontWeight: '400',
  },
  h3SF: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.h3,
    lineHeight: 28,
    fontWeight: '400',
  },
  h3Roboto: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.h3,
    lineHeight: 28,
    fontWeight: '400',
  },
  h4: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.body14,
    lineHeight: 28,
    fontWeight: '400',
  },

  //SF Regular
  body_SF_R_11: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.body11,
    lineHeight: 20,
    fontWeight: '400',
  },
  body_SF_R_12: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.body12,
    lineHeight: 20,
    fontWeight: '400',
  },
  body_SF_R_13: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.body13,
    lineHeight: 20,
    fontWeight: '400',
  },
  body_SF_R_14: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.body14,
    lineHeight: 20,
    fontWeight: '400',
  },
  body_SF_R_15: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontSize: SIZES.bod15,
    lineHeight: 20,
    fontWeight: '400',
  },

  //SF Medium
  body_SF_M_10: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    fontSize: SIZES.body10,
    lineHeight: 25,
    fontWeight: '500',
  },
  body_SF_M_12: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    fontSize: SIZES.body12,
    lineHeight: 36,
    fontWeight: '500',
  },
  body_SF_M_13: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    fontSize: SIZES.body13,
    lineHeight: 36,
    fontWeight: '500',
  },
  body_SF_M_15: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    fontSize: SIZES.body15,
    lineHeight: 36,
    fontWeight: '500',
  },

  //SF Bold
  body_SF_B_9: {
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFBold',
    fontSize: SIZES.body9,
    lineHeight: 20,
    fontWeight: '700',
  },

  //Roboto Light
  body_R_L_10: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto Light' : 'RobotoLight',
    fontSize: SIZES.body10,
    lineHeight: 16,
    fontWeight: '300',
  },
  body_R_L_13: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto Light' : 'RobotoLight',
    fontSize: SIZES.body13,
    lineHeight: 20,
    fontWeight: '300',
  },
  body_R_L_14: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto Light' : 'RobotoLight',
    fontSize: SIZES.body14,
    lineHeight: 24,
    fontWeight: '300',
  },

  //Roboto Regular
  body_R_R_11: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.body11,
    lineHeight: 20,
    fontWeight: '400',
  },
  body_R_R_13: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.body13,
    fontWeight: '400',
  },
  body_R_R_14: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.body14,
    fontWeight: '400',
  },
  body_R_R_16: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoRegular',
    fontSize: SIZES.body16,
    lineHeight: 28,
    fontWeight: '400',
  },

  //Roboto Medium
  body_R_M_10: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto Medium' : 'RobotoMedium',
    fontSize: SIZES.body10,
    lineHeight: 16,
    fontWeight: '500',
  },

  //Roboto Bold
  body_R_B_11: {
    fontFamily: Platform.OS === 'ios' ? 'Roboto' : 'RobotoBold',
    fontSize: SIZES.body11,
    lineHeight: 20,
    fontWeight: '700',
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
