import React, { useState } from 'react';
import { TextInput, View, Text, Platform } from 'react-native';
import { styles } from './styles';
import { theme, COLORS } from '../../../../../сonstants';
const Comment = props => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState(props.commentLocal);
  //const height = 50;
  return (
    <View style={styles.mainContainer}>
      {(
        <View style={[styles.inputInner, { borderColor: COLORS.gray }]}>
          {text.length > 0 ? (
            <View style={styles.inputTitleView}>
              <Text style={[theme.FONTS.body_SF_R_11, styles.inputTitle]}>{'Комментарий'}</Text>
            </View>
          ) : (
            <></>
          )}
          <TextInput
            //placeholder="ed"
            //autoCapitalize={upperCased ? 'characters' : 'none'}
            style={[
              theme.FONTS.body_SF_R_15,
              styles.input,
              {
                //paddingTop: 15,
                //paddingBottom: 15,
              },
            ]}
            placeholderTextColor={COLORS.darkGray}
            //keyboardType={fieldType}
            //!active ? 'Введите комментарий' : 'ekmd'
            placeholder={'Введите комментарий'}
            //maxLength={maxLength}
            onFocus={() => {
              setActive(true);
            }}
            onBlur={() => {
              setActive(false);
            }}
            onChangeText={text => {
              setText(text);
              props.setComment(text);
            }}
            value={text}
            multiline
            //height={100}
          />
        </View>
      )}
    </View>
  );
};

export default Comment;
