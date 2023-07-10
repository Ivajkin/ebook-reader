//#region import libres

//#region react components
import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TextInput, Image } from 'react-native';

//#endregion

//#region plagins
import { CheckBox } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Switch } from 'react-native-switch';
//#endregion

//#region components
import { icons, theme, COLORS } from '../../сonstants';
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const FieldFilterCheckSwitch = props => {
  //#region valuevles
  const field = props.field;
  const value = props.value;
  const setValue = props.setValue;
  const type = props.type;
  const style = props.style ? props.style : {};

  const [localValue, setLocalValue] = useState(value);

  function changeValue(value) {
    setLocalValue(value);
    setValue(value);
  }
  /**
   * modal functions
   */

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <>
      {type === 'switch' ? (
        field ? (
          <View style={[styles.CheckBoxWrapper, style]}>
            <TouchableOpacity onPress={() => changeValue(!localValue)} style={styles.switchBoxTextInner}>
              <Text style={[theme.FONTS.body_SF_R_14, styles.switchBoxText]}>{field}</Text>
            </TouchableOpacity>
            <Switch
              value={localValue}
              onValueChange={() => changeValue(!localValue)}
              disabled={false}
              activeText={''}
              inActiveText={''}
              circleSize={22}
              barHeight={12}
              circleBorderWidth={0}
              backgroundActive={COLORS.vividRed3}
              backgroundInactive={COLORS.gray}
              circleActiveColor={COLORS.red}
              circleInActiveColor={COLORS.darkGray}
              //renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
              changeValueImmediately={false} // if rendering inside circle, change state immediately or wait for animation to complete
              //innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
              outerCircleStyle={{}} // style for outer animated circle
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2} // denominaxtor for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
              switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
              switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
            />
          </View>
        ) : (
          <></>
        )
      ) : field ? (
        <View style={styles.nonStandartVinWrapper}>
          <CheckBox
            containerStyle={{ padding: 0, marginLeft: 0, width: 25, height: 25 }}
            checkedIcon={<Image style={{ width: 25, height: 25 }} source={icons.checkboxTrue} />}
            uncheckedIcon={<Image style={{ width: 25, height: 25 }} source={icons.checkboxFalse} />}
            checked={localValue}
            onPress={() => changeValue(!localValue)}
          />
          <TouchableOpacity onPress={() => changeValue(!localValue)} style={styles.checkBoxLabelInner}>
            <Text style={[theme.FONTS.body_SF_R_14, styles.checkBoxLabel]}>{field}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default FieldFilterCheckSwitch;
