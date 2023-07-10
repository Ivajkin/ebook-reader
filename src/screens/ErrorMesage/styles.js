import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  statusBarLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  title: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    textAlign: 'center',
    paddingBottom: 11,
    paddingTop: 11,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    paddingTop: 10,
    textAlign: 'center',
  },
  img: {
    marginTop: 40,
    resizeMode: 'contain',
  },
  btn: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 36,
    backgroundColor: '#FF3B30',
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    paddingTop: 7,
    paddingBottom: 7,
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SFMedium',
    marginTop: 26,
  },
});

export { styles };
