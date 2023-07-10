//#region react
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
//#endregion ----------

//#region plagins

//#endregion ----------

//#region components

//#endregion ----------

//#region constants
import { icons, theme, COLORS } from '../../../сonstants';
//#endregion ----------

//#region styles
import { styles } from './styles';
//#endregion ----------

const FieldPage = props => {
  //#region valuevles
  const count = props.count;
  const field = props.field;
  const navigate = props.navigate;
  const showRequired = props.showRequired ?? true;

  //#endregion ----------



  return (
    <>
      {field && (
        <TouchableOpacity
          style={[styles.inputWrapper, { borderColor: props.validateFlag ? COLORS.gray : COLORS.red }]}
          onPress={navigate}
        >
          <Text
            style={[
              theme.FONTS.body_SF_R_15,
              styles.inputText,
              { color: count > 0 ? COLORS.black : COLORS.darkGray },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {showRequired
              ? field.name + (field.required === 2 ? ' *' : field.required === 1 ? ' **' : '')
              : field.name}
          </Text>
          <View style={styles.inputInner}>
            {count !== null && (
              <View
                style={[
                  styles.inputCountWrapper,
                  { backgroundColor: count > 0 ? COLORS.red : COLORS.gray },
                ]}
              >
                <Text style={[theme.FONTS.body_R_B_11, styles.inputCount]}>{count}</Text>
              </View>
            )}
            <Image source={icons.arrowRight} style={{ width: 7, height: 13 }} />
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default FieldPage;
