import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryInner: {
    maxHeight: 150,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingLeft: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  inputInner: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
    position: 'relative',
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    height: 50,
    flex: 1,
    //borderWidth: 1,
    //backgroundColor: 'lightblue',
  },
  inputTitle: {
    position: 'absolute',
    top: 3,
    left: 15,
    color: 'black',
    //paddingLeft: 5,
    paddingRight: 5,
  },
  errorMessage: {
    color: 'red',
    paddingLeft: 0,
  },
});

export { styles };
