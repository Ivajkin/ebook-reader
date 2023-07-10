import { StyleSheet } from 'react-native';
import { COLORS } from "../../../сonstants";

const styles = StyleSheet.create({
  inputInner: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  rightView: {
    //borderWidth: 1,
  },
  leftView: {
    //borderWidth: 1,
  },
  inputTitle: {
    color: COLORS.darkGray,
  },
  inputText: {
    color: COLORS.darkGray,
    //paddingTop: 15,
    //paddingBottom: 15,
  },
});

export { styles };
