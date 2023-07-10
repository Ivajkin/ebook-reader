import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  radioInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  radioText: {
    width: '50%',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Compact Display' : 'SF',
    fontWeight: '400',
  },
  radioGroupContainer: {
    flexWrap: 'wrap',
    width: '95%',
    flex: 1,
    justifyContent: 'flex-start',
  },
});
