import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    margin: 10,
  },
  headerView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: { marginLeft: 8, fontSize: 16, fontWeight: '500' },
  pointView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pointNameText: {
    fontSize: 13,
    color: '#979797',
    marginRight: 12,
    width: 95,
  }
})
