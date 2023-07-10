import React from 'react';
import { TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles';

const SearchPanel = props => {
  return (
    <View style={styles.mainContainer}>
      <Icon name="search" size={25} type="ionicons" style={styles.icon} />
      <TextInput
        placeholder="Поиск"

        onChangeText={text => {
          props.onChangeText(text);
          //onChangeTextCallback(text);
        }}
      />
    </View>
  );
};

export default SearchPanel;
