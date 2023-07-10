import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
  },
  singleDocView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  docNameText: {
    fontSize: 13,
    color: '#979797',
    marginRight: 12,
    width: 90,
  },
  singleDocDataView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
