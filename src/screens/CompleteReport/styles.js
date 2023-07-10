import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES, theme } from '../../сonstants';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    zIndex: 0,
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  scrollContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  cardWrapper: {
    zIndex: 1,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 5,
    position: 'relative',
  },
  cardInner: {
    zIndex: 1,
    //paddingLeft: SIZES.padding,
    //paddingRight: SIZES.padding,
    // paddingTop: 10,
    // paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    paddingLeft: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 10,
  },
  cardSubtitle: {
    color: COLORS.darkGray,
  },
  cardStatus: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  cardButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardComplete: {
    textTransform: 'uppercase',
    color: COLORS.primary,
    backgroundColor: COLORS.strongLimeGreen,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardUnfinished: {
    textTransform: 'uppercase',
    color: COLORS.red,
    backgroundColor: COLORS.vividRed,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardError: {
    textTransform: 'uppercase',
    color: COLORS.primary,
    backgroundColor: COLORS.red,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardMessageWrapper: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    height: '100%',
    backgroundColor: COLORS.vividRed,
    zIndex: 0,
  },
  errorMessage: {
    color: COLORS.red,
  },
  cardAdd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 40,
    marginBottom: 24,
  },
  cardBtn: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  lottie: {
    width: Platform.OS !== 'ios' ? 200 : 50,
    height: Platform.OS !== 'ios' ? 200 : 50,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: COLORS.substrate,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  modalContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 25,
    borderRadius: SIZES.radius,
  },
  modalTitle: {
    ...theme.FONTS.body_R_R_16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalDelReportBtnInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    marginTop: 20,
  },
  modalExistFileBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalBtn: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    width: '48%',
    flex: 1,
    alignItems: 'center',
  },
  modalBtnText: {
    ...theme.FONTS.body_R_R_14,
    color: COLORS.red,
  },
  modalBtnPrimary: {
    backgroundColor: COLORS.red,
    borderRadius: SIZES.radius,
    color: 'white',
  },
  reportDownload: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  headerBrandWrapper: {
    borderTopWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: 'row',
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
    marginRight: 19,
  },
});

export { styles };
