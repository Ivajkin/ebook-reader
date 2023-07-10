//#region import libres

//#region react components
import React, { useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
//#endregion

//#region plagins

//#endregion

//#region components
import { theme } from '../../сonstants';
//#endregion

//#region images
//#endregion

//#region styles
import { styles } from './styles';
//#endregion

//#endregion

const TireAdd = props => {
  const height = Dimensions.get('screen').height;

  const tires = props.tires;
  //const setTires = props.setTires;
  const side = props.side;
  const navigation = props.navigation;
  const same = props.same;
  const firstTires = props.firstTires;
  const imgWidth = props.imgWidth;
  const imgHeight = props.imgHeight;
  const setFirstTires = props.setFirstTires;
  const shouldRunUseeffect = props.shouldRunUseeffect;

  const tiresShow = (
    <TouchableOpacity
      style={
        ['rightTop', 'leftTop'].includes(side)
          ? { marginTop: imgHeight / 2 - 80 }
          : { marginBottom: imgHeight / 2 - 110 }
      }
      onPress={() =>
        navigation.navigate('TiresChooseScreen', {
          //tires: tires,
          tire: side, //setTires: setTires,
          shouldRunUseeffect,
          setFirstTires: setFirstTires,
        })
      }
    >
      <Text style={[theme.FONTS.body_SF_M_10, styles.addBtn]}> Добавить</Text>
    </TouchableOpacity>
  );

  useEffect(() => {}, [tires]);
  if (tires) {
    const displayedTire = {
      mark: {
        id: tires[side]?.mark?.id,
        value:
          String(tires[side]?.mark?.value) === 'null' || tires[side]?.mark?.value === 'undefined'
            ? 'Марка не выбрана'
            : tires[side]?.mark?.value,
      },
      model: {
        id: tires[side]?.model?.id,
        value:
          String(tires[side]?.model?.value) === 'null' || tires[side]?.model?.value === 'undefined'
            ? 'Модель не выбрана'
            : tires[side]?.model?.value,
      },
      profile:
        tires[side]?.profile === null || tires[side]?.profile === 'undefined'
          ? '?'
          : tires[side]?.profile,
      radius:
        tires[side]?.radius === null || tires[side]?.radius === 'undefined' ? '?' : tires[side]?.radius,
      remainder:
        tires[side]?.remainder === null || tires[side]?.remainder === 'undefined'
          ? '?'
          : tires[side]?.remainder,
      width:
        tires[side]?.width === null || tires[side]?.width === 'undefined' ? '?' : tires[side]?.width,
    };

    if (
      tires[side] &&
      (tires[side]?.mark?.value ||
        tires[side]?.model?.value ||
        tires[side]?.photos.length > 0 ||
        tires[side]?.profile ||
        tires[side]?.radius ||
        tires[side]?.remainder ||
        tires[side]?.width)
    ) {
      return (
        <View
          style={
            ['rightTop', 'leftTop'].includes(side)
              ? { marginTop: imgHeight / 2 - 150 }
              : { marginBottom: imgHeight / 2 - 110 }
          }
        >
          <Text style={[theme.FONTS.body_R_L_10]}>
            {displayedTire.mark.value +
              '\n' +
              displayedTire.model.value +
              '\n' +
              displayedTire.width +
              '/' +
              displayedTire.profile +
              '/' +
              displayedTire.radius +
              '\n' +
              'Остаток: ' +
              displayedTire.remainder +
              ' мм'}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TiresChooseScreen', {
                //tires: tires,
                tire: side, //setTires: setTires,
                shouldRunUseeffect,
                setFirstTires: setFirstTires,
                sendReport: props.sendReport,
              })
            }
          >
            <Text style={[theme.FONTS.body_R_M_10, styles.interactiveChangeBtn]}>Изменить</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return tiresShow;
    }
  } else {
    return tiresShow;
  }
};
const mapStateToProps = state => {
  return {
    tires: state.tires.tiresProcessed,
  };
};
export default connect(mapStateToProps, null)(TireAdd);
