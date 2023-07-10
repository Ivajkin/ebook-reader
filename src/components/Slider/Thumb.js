import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const Thumb = ({ name }) => {
  return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
  rootLow: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#FF4A22',
  },
  rootHigh: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#FF4A22',
  },
});

export default memo(Thumb);
