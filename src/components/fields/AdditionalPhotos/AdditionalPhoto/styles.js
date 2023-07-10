import { StyleSheet } from 'react-native';
import { SIZES, COLORS } from '../../../../сonstants';

export const styles = StyleSheet.create({
  fotoInner: {
    width: '100%',
    paddingBottom: 5,
    paddingTop: 5,
    position: 'relative',
  },
  fotoDelete: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    padding: 12,
    overflow: 'hidden',
    borderRadius: 100,
  },
});
