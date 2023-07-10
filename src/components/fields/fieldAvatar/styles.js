import { StyleSheet } from 'react-native';
import { COLORS } from '../../../сonstants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 65,
    height: 65,
    backgroundColor: '#C4C4C4',
    borderRadius: 65,
    overflow: 'hidden',
  },
  textButton: {
    color: COLORS.red,
    marginTop: 6,
  },
});

export { styles };
